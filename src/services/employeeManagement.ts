// @ts-nocheck

import { apiSlice } from "../slices/apiSlice";
// const devBaseUrl = 'http://localhost:3003'
const devBaseUrl =
  "https://spacce-employee-management-726569672166.europe-west1.run.app";

export const employeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `${devBaseUrl}/employee/api/v1/user`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ["employees"],
    }),
    uploadUsers: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `${devBaseUrl}/employee/api/v1/user`,
        method: "POST",
        body,
        headers: {
          Authorization: authToken,
        },
      }),
      invalidatesTags: ["employees"],
    }),
    updateUser: builder.mutation({
      query: ({ body, userName, authToken }) => ({
        url: `${devBaseUrl}/employee/api/v1/user/${userName}`,
        method: "PUT",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: (result, error, { userName }) => [
        "employees",
        { type: "employeeById", id: userName },
      ],
    }),
    getUsers: builder.query({
      query: (authToken) => ({
        url: `${devBaseUrl}/employee/api/v1/user`,
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      }),
      providesTags: ["employees"],
    }),
    getUserById: builder.query({
      query: ({ userName, authToken }) => ({
        url: `${devBaseUrl}/employee/api/v1/user/${userName}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: (result, error, { userName }) => [
        { type: "employeeById", id: userName },
      ],
    }),
    activateUser: builder.mutation({
      query: ({ body, userName, authToken }) => ({
        url: `${devBaseUrl}/employee/api/v1/user/${userName}`,
        method: "PATCH",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: (result, error, { userName }) => [
        "employees",
        { type: "employeeById", id: userName },
      ],
    }),
  }),
});

export const {
  useAddUserMutation,
  useUploadUsersMutation,
  useUpdateUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useActivateUserMutation,
  useLazyGetUsersQuery,
} = employeeApi;
