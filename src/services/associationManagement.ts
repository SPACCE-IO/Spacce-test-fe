// @ts-nocheck
import { apiSlice } from "../slices/apiSlice";
// const devBaseUrl = 'http://localhost:3001'
const devBaseUrl =
  "https://spacce-association-management-726569672166.europe-west1.run.app";
export const associationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroupById: builder.query({
      query: ({ authToken, id }) => ({
        url: `${devBaseUrl}/association/api/v1/group/${id}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: (result, error, { id }) => [{ type: "groupById", id }],
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
      invalidatesTags: (result, error, { id }) => [
        "workspaceGroups",
        { type: "groupById", id },
      ],
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
      invalidatesTags: (result, error, { id }) => [
        "workspacePhases",
        { type: "phaseById", id },
      ],
    }),
    getPhaseById: builder.query({
      query: ({ id, authToken }) => ({
        url: `/association/api/v1/phase/${id}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: (result, error, { id }) => [{ type: "phaseById", id }],
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
      invalidatesTags: (result, error, { id }) => [
        "workspaceDepartments",
        { type: "departmentById", id },
      ],
    }),
    getDepartmentById: builder.query({
      query: ({ authToken, id }) => ({
        url: `/association/api/v1/department/${id}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: (result, error, { id }) => [{ type: "departmentById", id }],
    }),
    addMissionToPhase: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `/association/api/v1/phase/${id}/mission`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: (result, error, { id }) => [
        "workspacePhases",
        { type: "phaseById", id },
      ],
    }),
    addUserToGroup: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `/association/api/v1/group/${id}/user`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: (result, error, { id }) => [
        "workspaceGroups",
        { type: "groupById", id },
      ],
    }),
    addDepartmentToGroup: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `/association/api/v1/group/${id}/department`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: (result, error, { id }) => [
        "workspaceGroups",
        { type: "groupById", id },
      ],
    }),
    addPhaseToDepartment: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `/association/api/v1/department/${id}/phase`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: (result, error, { id }) => [
        "workspaceDepartments",
        { type: "departmentById", id },
      ],
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
