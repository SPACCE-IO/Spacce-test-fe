// @ts-nocheck
import { apiSlice } from "../slices/apiSlice";
// const devBaseUrl = 'http://localhost:3007'
const devBaseUrl = 'https://dev-spacce.spacce.io'

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userLogin: builder.mutation({
      query: (body) => ({
        url: `${devBaseUrl}/auth/api/v1/login`,
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: `${devBaseUrl}/auth/api/v1/forgotpassword`,
        method: "POST",
        body,
      }),
    }),
    validateCode: builder.mutation({
      query: ({ body }) => ({
        url: `${devBaseUrl}/auth/api/v1/verifypasscode`,
        method: "POST",
        body,
      }),
    }),
    authenticateUser: builder.query({
      query: (authToken) => ({
        url: `${devBaseUrl}/auth/api/v1/validate?token=${authToken}`,
        method: "GET",
      }),
    }),
    userLogout: builder.mutation({
      query: (body) => ({
        url: `${devBaseUrl}/auth/api/v1/logout`,
        method: "POST",
        body,
      }),
    }),
    verifyPasscode: builder.mutation({
      query: (body) => ({
        url: `${devBaseUrl}/auth/api/v1/verifypasscode`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useUserLoginMutation,
  useUserLogoutMutation,
  useAuthenticateUserQuery,
  useLazyAuthenticateUserQuery,
  useForgotPasswordMutation,
  useValidateCodeMutation,
  useVerifyPasscodeMutation
} = authApi;
