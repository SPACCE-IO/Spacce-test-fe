// @ts-nocheck
import { apiSlice } from "../slices/apiSlice";

export const workspaceManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addWorkspace: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `/workspace/api/v1/workspace`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
        formData: true,
      }),
      invalidatesTags: ["workspaces"],
    }),
    updateWorkspace: builder.mutation({
      query: ({ authToken, id, body }) => ({
        url: `/workspace/api/v1/workspace/${id}`,
        method: "PUT",
        body,
        headers: {
          Authorization: authToken,
        },
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        "workspaces",
        { type: "workspaceById", id },
      ],
    }),
    getWorkspace: builder.query({
      query: (authToken) => ({
        url: `/workspace/api/v1/workspace`,
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      }),
      providesTags: ["workspaces"],
    }),
    getWorkspaceById: builder.query({
      query: ({ authToken, id }) => ({
        url: `/workspace/api/v1/workspace/${id}`,
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "workspaceById", id }],
    }),
    getWorkspaceGroups: builder.query({
      query: ({ id, authToken }) => ({
        url: `/workspace/api/v1/workspace/${id}/group`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: (result, error, { id }) => [
        { type: "workspaceGroups", id },
        { type: "workspaceById", id },
      ],
    }),
    getWorkspaceMissions: builder.query({
      query: ({ id, authToken }) => ({
        url: `/workspace/api/v1/workspace/${id}/mission`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: (result, error, { id }) => [
        { type: "workspaceMissions", id },
        { type: "workspacePhases", id },
        { type: "workspaceById", id },
      ],
    }),
    getWorkspacePhases: builder.query({
      query: ({ id, authToken }) => ({
        url: `/workspace/api/v1/workspace/${id}/phase`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: (result, error, { id }) => [
        { type: "workspacePhases", id },
        { type: "workspaceById", id },
      ],
    }),
    getWorkspaceDepartments: builder.query({
      query: ({ id, authToken }) => ({
        url: `/workspace/api/v1/workspace/${id}/department`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: (result, error, { id }) => [
        { type: "workspaceDepartments", id },
        { type: "workspaceById", id },
      ],
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
