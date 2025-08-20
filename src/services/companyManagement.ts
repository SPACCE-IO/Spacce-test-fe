// @ts-nocheck
import { apiSlice } from "../slices/apiSlice";
// const devBaseUrl = 'http://localhost:3002'
const devBaseUrl = "https://dev-spacce.spacce.io";


export const companyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCompany: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `${devBaseUrl}/company/api/v1/company`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
    }),
    updateCompany: builder.mutation({
      query: ({ body, authToken, orgCode }) => ({
        url: `${devBaseUrl}/company/api/v1/company/${orgCode}`,
        method: "PUT",
        body,
        headers: {
          Authorization: authToken,
        },
      }),
    }),
    getCompanies: builder.query({
      query: (authToken) => ({
        url: `${devBaseUrl}/company/api/v1/company`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
    }),
    getCompanyById: builder.query({
      query: ({ authToken, userId }) => ({
        url: `${devBaseUrl}/company/api/v1/company/${userId}`,
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      }),
    }),
    addIdentity: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `${devBaseUrl}/company/api/v1/company/${id}/identity`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
        formData: true,
      }),
      invalidatesTags: ["identity"],
    }),
    updateIdentity: builder.mutation({
      query: ({ body, id, authToken }) => ({
        url: `${devBaseUrl}/company/api/v1/company/${id}/identity`,
        method: "PUT",
        body,
        headers: { Authorization: authToken },
        formData: true,
      }),
      invalidatesTags: ["identity"],
    }),
    addLanguage: builder.mutation({
      query: ({ body, authToken, orgCode }) => ({
        url: `${devBaseUrl}/company/api/v1/company/${orgCode}/language`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ["identity"],
    }),
    getLanguages: builder.query({
      query: ({ authToken, orgCode }) => ({
        url: `${devBaseUrl}/company/api/v1/company/${orgCode}/language`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["identity"],
    }),
    getIdentity: builder.query({
      query: ({ id, authToken }) => ({
        url: `${devBaseUrl}/company/api/v1/company/${id}/identity`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["identity"],
    }),
    updateLanguage: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `${devBaseUrl}/company/api/v1/company/language/${id}`,
        method: "PUT",
        body,
        headers: { Authorization: authToken },
      }),
    }),
    invalidatesTags: ["identity"],
  }),
});

export const {
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useAddIdentityMutation,
  useUpdateIdentityMutation,
  useAddLanguageMutation,
  useGetIdentityQuery,
  useGetLanguagesQuery,
  useLazyGetCompanyByIdQuery,
} = companyApi;
