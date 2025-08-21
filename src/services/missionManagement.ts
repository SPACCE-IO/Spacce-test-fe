// @ts-nocheck
import { apiSlice } from "../slices/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addGlobalMission: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `/mission/api/v1/mission/global`,
        method: "POST",
        body,
        headers: {
          Authorization: authToken,
        },
        formData: true,
      }),
    }),
    getGlobalMission: builder.query({
      query: (authToken) => ({
        url: `/mission/api/v1/mission/global`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
    }),
    getGlobalMissionById: builder.query({
      query: ({ authToken, id }) => ({
        url: `/mission/api/v1/mission/global/${id}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
    }),
    addMission: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `/mission/api/v1/mission`,
        method: "POST",
        body,
        headers: {
          Authorization: authToken,
        },
        formData: true,
      }),
    }),
    updateMission: builder.mutation({
      query: ({ body, id, authToken }) => ({
        url: `/mission/api/v1/mission/${id}`,
        method: "PUT",
        body,
        headers: { Authorization: authToken },
      }),
    }),
    getMissionById: builder.query({
      query: ({ id, authToken }) => ({
        url: `/mission/api/v1/mission/${id}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
    }),
    getMissionSummary: builder.query({
      query: (authToken) => ({
        url: `/mission/api/v1/mission`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
    }),
    getTagByType: builder.query({
      query: ({ body, type, authToken }) => ({
        url: `/mission/api/v1/tags/${type}`,
        method: "GET",
        body,
        headers: { Authorization: authToken },
      }),
    }),
    cloneMission: builder.mutation({
      query: ({ body, id, authToken }) => ({
        url: `/mission/api/v1/clonemission/${id}`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
    }),
    importGlobalMission: builder.mutation({
      query: ({ authToken, body }) => ({
        url: `/mission/api/v1/mission/global/import`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
    }),
    logResponse: builder.mutation({
      query: ({ authToken, body, id }) => ({
        url: `/mission/api/v1/mission/${id}`,
        method: "PATCH",
        body,
        headers: { Authorization: authToken },
      }),
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
