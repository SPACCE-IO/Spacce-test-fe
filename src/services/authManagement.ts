// @ts-nocheck
import { apiSlice } from "../slices/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userLogin: builder.mutation({
      query: (body) => ({
        url: `/auth/api/v1/login`,
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: `/auth/api/v1/forgotpassword`,
        method: "POST",
        body,
      }),
    }),
    validateCode: builder.mutation({
      query: ({ body }) => ({
        url: `/auth/api/v1/verifypasscode`,
        method: "POST",
        body,
      }),
    }),
    authenticateUser: builder.query({
      query: (authToken) => ({
        url: `/auth/api/v1/validate?token=${authToken}`,
        method: "GET",
      }),
    }),
    userLogout: builder.mutation({
      query: (body) => ({
        url: `/auth/api/v1/logout`,
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
} = authApi;
