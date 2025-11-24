// @ts-nocheck
import { apiSlice } from "../slices/apiSlice";
// const devBaseUrl = 'http://localhost:3004'
const devBaseUrl =
  "https://spacce-mission-management-726569672166.europe-west1.run.app";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addGlobalMission: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/global`,
        method: "POST",
        body,
        headers: {
          Authorization: authToken,
        },
        formData: true,
      }),
      invalidatesTags: ["globalMissions", "dashboard"],
    }),
    getGlobalMission: builder.query({
      query: (authToken) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/global`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["globalMissions"],
    }),
    getGlobalMissionById: builder.query({
      query: ({ authToken, id }) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/global/${id}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: (result, error, { id }) => [
        { type: "globalMissionById", id },
        "globalMissions",
      ],
    }),
    addMission: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `${devBaseUrl}/mission/api/v1/mission`,
        method: "POST",
        body,
        headers: {
          Authorization: authToken,
        },
        formData: true,
      }),
      invalidatesTags: ["workspaceMissions", "missionById", "dashboard"],
    }),
    updateMission: builder.mutation({
      query: ({ body, id, authToken }) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/${id}`,
        method: "PUT",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: (result, error, { id }) => [
        "workspaceMissions",
        { type: "missionById", id },
        "dashboard",
      ],
    }),
    getMissionById: builder.query({
      query: ({ id, authToken }) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/${id}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: (result, error, { id }) => [
        { type: "missionById", id },
        "workspaceMissions",
      ],
    }),
    getMissionSummary: builder.query({
      query: (authToken) => ({
        url: `${devBaseUrl}/mission/api/v1/mission`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["workspaceMissions"],
    }),
    getTagByType: builder.query({
      query: ({ body, type, authToken }) => ({
        url: `${devBaseUrl}/mission/api/v1/tags/${type}`,
        method: "GET",
        body,
        headers: { Authorization: authToken },
      }),
      providesTags: ["dashboard"],
    }),
    cloneMission: builder.mutation({
      query: ({ body, id, authToken }) => ({
        url: `${devBaseUrl}/mission/api/v1/clonemission/${id}`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ["workspaceMissions", "dashboard"],
    }),
    importGlobalMission: builder.mutation({
      query: ({ authToken, body }) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/global/import`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ["globalMissions", "dashboard"],
    }),
    logResponse: builder.mutation({
      query: ({ authToken, body, id }) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/${id}`,
        method: "PATCH",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "missionById", id },
        "workspaceMissions",
        "dashboard",
      ],
    }),
  }),
});

export const {
  useAddGlobalMissionMutation,
  useGetGlobalMissionQuery,
  useAddMissionMutation,
  useUpdateMissionMutation,
  useGetMissionByIdQuery,
  useGetMissionSummaryQuery,
  useGetTagByTypeQuery,
  useCloneMissionMutation,
  useImportGlobalMissionMutation,
  useGetGlobalMissionByIdQuery,
  useLazyGetMissionByIdQuery,
  useLogResponseMutation,
} = authApi;
