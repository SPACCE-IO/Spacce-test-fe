// @ts-nocheck
import { apiSlice } from "../slices/apiSlice";
// const devBaseUrl = 'http://localhost:3005'
const devBaseUrl =
  "https://spacce-user-management-726569672166.europe-west1.run.app";

export const userManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    resetPassword: builder.mutation({
      query: ({ data, authToken }) => ({
        url: `${devBaseUrl}/user/api/v1/profile/password`,
        method: "PATCH",
        body: data,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ["profile"],
    }),
    setNewPassword: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `${devBaseUrl}/user/api/v1/profile/password`,
        method: "PATCH",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ["profile"],
    }),
    getProfile: builder.query({
      query: (authToken) => ({
        url: `${devBaseUrl}/user/api/v1/profile`,
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      }),
      providesTags: ["profile"],
    }),
    updateProfile: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `${devBaseUrl}/user/api/v1/profile`,
        method: "PUT",
        body,
        headers: {
          Authorization: authToken,
        },
        formData: true,
      }),
      invalidatesTags: ["profile"],
    }),
    getDashboard: builder.query({
      query: (authToken) => ({
        url: `${devBaseUrl}/user/api/v1/dashboard`,
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      }),
      providesTags: ["dashboard"],
    }),
    getPage: builder.query({
      query: ({ userName, authToken }) => ({
        url: `${devBaseUrl}/employee/user/${userName}`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
    }),
    getBackPack: builder.query({
      query: (authToken) => ({
        url: `${devBaseUrl}/user/api/v1/backpack`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
    }),
  }),
});

export const {
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetDashboardQuery,
  useGetPageQuery,
  useGetBackPackQuery,
  useSetNewPasswordMutation,
  useLazyGetProfileQuery,
} = userManagementApi;
