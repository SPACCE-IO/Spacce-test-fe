// @ts-nocheck

import { apiSlice } from "../slices/apiSlice";
// const devBaseUrl = 'http://localhost:3006'
const devBaseUrl = 'https://dev-spacce.spacce.io'

export const workspaceManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addWorkspace: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `${devBaseUrl}/workspace/api/v1/workspace`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
        formData: true,
      }),
      invalidatesTags: ["workspaces"],
    }),
    updateWorkspace: builder.mutation({
      query: ({ authToken, id, body }) => ({
        url: `${devBaseUrl}/workspace/api/v1/workspace/${id}`,
        method: "PUT",
        body,
        headers: {
          Authorization: authToken,
        },
        formData: true,
      }),
      invalidatesTags: ["workspaces", "workspaceById"],
    }),
    getWorkspace: builder.query({
      query: (authToken) => ({
        url: `${devBaseUrl}/workspace/api/v1/workspace`,
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      }),
      providesTags: ["workspaces"],
    }),
    getWorkspaceById: builder.query({
      query: ({ authToken, id }) => ({
        url: `${devBaseUrl}/workspace/api/v1/workspace/${id}`,
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      }),
      providesTags: ["workspaceById"],
    }),
    getWorkspaceGroups: builder.query({
      query: ({ id, authToken }) => ({
        url: `${devBaseUrl}/workspace/api/v1/workspace/${id}/group`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["workspaceGroups"],
    }),
    getWorkspaceMissions: builder.query({
      query: ({ id, authToken }) => ({
        url: `${devBaseUrl}/workspace/api/v1/workspace/${id}/mission`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["workspaceMissions", "workspacePhases"],
    }),
    getWorkspacePhases: builder.query({
      query: ({ id, authToken }) => ({
        url: `${devBaseUrl}/workspace/api/v1/workspace/${id}/phase`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["workspacePhases"],
    }),
    getWorkspaceDepartments: builder.query({
      query: ({ id, authToken }) => ({
        url: `${devBaseUrl}/workspace/api/v1/workspace/${id}/department`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["workspaceDepartments"],
    }),
  }),
});

export const {
  useAddWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useGetWorkspaceQuery,
  useGetWorkspaceByIdQuery,
  useGetWorkspaceGroupsQuery,
  useGetWorkspaceMissionsQuery,
  useGetWorkspacePhasesQuery,
  useGetWorkspaceDepartmentsQuery,
} = workspaceManagementApi;
