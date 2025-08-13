// @ts-nocheck

import { apiSlice } from "../slices/apiSlice";
// const devBaseUrl = 'http://localhost:3004'
const devBaseUrl = "https://dev-spacce.spacce.io"

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
    }),
    getGlobalMission: builder.query({
      query: (authToken) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/global`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: [],
    }),
    getGlobalMissionById: builder.query({
      query: ({ authToken, id }) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/global/${id}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: [],
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
      invalidatesTags: [],
    }),
    updateMission: builder.mutation({
      query: ({ body, id, authToken }) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/${id}`,
        method: "PUT",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: [],
    }),
    getMissionById: builder.query({
      query: ({ id, authToken }) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/${id}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ['missionById'],
    }),
    getMissionSummary: builder.query({
      query: (authToken) => ({
        url: `${devBaseUrl}/mission/api/v1/mission`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: [],
    }),
    getTagByType: builder.query({
      query: ({ body, type, authToken }) => ({
        url: `${devBaseUrl}/mission/api/v1/tags/${type}`,
        method: "GET",
        body,
        headers: { Authorization: authToken },
      }),
      providesTags: [],
    }),
    cloneMission: builder.mutation({
      query: ({ body, id, authToken }) => ({
        url: `${devBaseUrl}/mission/api/v1/clonemission/${id}`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: [],
    }),
    importGlobalMission: builder.mutation({
      query: ({ authToken, body }) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/global/import`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
    }),
    logResponse: builder.mutation({
      query: ({ authToken, body, id }) => ({
        url: `${devBaseUrl}/mission/api/v1/mission/${id}`,
        method: "PATCH",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ['missionById'],
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
  useLogResponseMutation
} = authApi;
