// @ts-nocheck
import { apiSlice } from "../slices/apiSlice";

export const associationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroupById: builder.query({
      query: ({ authToken, id }) => ({
        url: `/association/api/v1/group/${id}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["groupById"],
    }),
    addGroup: builder.mutation({
      query: ({ body, authToken }) => {
        return {
          url: `/association/api/v1/group`,
          method: "POST",
          body,
          headers: {
            Authorization: authToken,
          },
          formData: true,
        };
      },
      invalidatesTags: ["workspaceGroups"],
    }),
    updateGroup: builder.mutation({
      query: ({ authToken, id, body }) => ({
        url: `/association/api/v1/group/${id}`,
        method: "PUT",
        body,
        headers: { Authorization: authToken },
        formData: true,
      }),
      invalidatesTags: ["workspaceGroups", "groupById"],
    }),
    addPhase: builder.mutation({
      query: ({ authToken, body }) => ({
        url: `/association/api/v1/phase`,
        method: "POST",
        body,
        headers: {
          Authorization: authToken,
        },
        formData: true,
      }),
      invalidatesTags: ["workspacePhases"],
    }),
    updatePhase: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `/association/api/v1/phase/${id}`,
        method: "PUT",
        body,
        headers: { Authorization: authToken },
        formData: true,
      }),
      invalidatesTags: ["workspacePhases", "phaseById"],
    }),
    getPhaseById: builder.query({
      query: ({ id, authToken }) => ({
        url: `/association/api/v1/phase/${id}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["phaseById"],
    }),
    addDepartment: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `/association/api/v1/department`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
        formData: true,
      }),
      invalidatesTags: ["workspaceDepartments"],
    }),
    updateDepartment: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `/association/api/v1/department/${id}`,
        method: "PUT",
        body,
        headers: { Authorization: authToken },
        formData: true,
      }),
      invalidatesTags: ["workspaceDepartments", "departmentById"],
    }),
    getDepartmentById: builder.query({
      query: ({ authToken, id }) => ({
        url: `/association/api/v1/department/${id}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["departmentById"],
    }),
    addMissionToPhase: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `/association/api/v1/phase/${id}/mission`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ["workspacePhases", "phaseById"],
    }),
    addUserToGroup: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `/association/api/v1/group/${id}/user`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ["workspaceGroups", "groupById"],
    }),
    addDepartmentToGroup: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `/association/api/v1/group/${id}/department`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ["workspaceGroups", "groupById"],
    }),
    addPhaseToDepartment: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `/association/api/v1/department/${id}/phase`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ["workspaceDepartments", "departmentById"],
    }),
  }),
});

export const {
  useAddDepartmentMutation,
  useAddUserToGroupMutation,
  useAddDepartmentToGroupMutation,
  useAddGroupMutation,
  useAddMissionToPhaseMutation,
  useAddPhaseMutation,
  useAddPhaseToDepartmentMutation,
  useGetDepartmentByIdQuery,
  useGetGroupByIdQuery,
  useGetPhaseByIdQuery,
  useUpdateGroupMutation,
  useUpdateDepartmentMutation,
  useUpdatePhaseMutation,
} = associationApi;
