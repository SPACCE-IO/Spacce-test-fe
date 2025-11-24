// @ts-nocheck
import { apiSlice } from "../slices/apiSlice";

export const companyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCompany: builder.mutation({
      query: ({ body, authToken }) => ({
        url: `/company/api/v1/company`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ["companies"],
    }),
    updateCompany: builder.mutation({
      query: ({ body, authToken, orgCode }) => ({
        url: `/company/api/v1/company/${orgCode}`,
        method: "PUT",
        body,
        headers: {
          Authorization: authToken,
        },
      }),
      invalidatesTags: (result, error, { orgCode }) => [
        "companies",
        { type: "companyById", id: orgCode },
      ],
    }),
    getCompanies: builder.query({
      query: (authToken) => ({
        url: `/company/api/v1/company`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["companies"],
    }),
    getCompanyById: builder.query({
      query: ({ authToken, userId }) => ({
        url: `/company/api/v1/company/${userId}`,
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      }),
      providesTags: (result, error, { userId }) => [
        { type: "companyById", id: userId },
      ],
    }),
    addIdentity: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `/company/api/v1/company/${id}/identity`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        "identity",
        { type: "companyById", id },
      ],
    }),
    updateIdentity: builder.mutation({
      query: ({ body, id, authToken }) => ({
        url: `/company/api/v1/company/${id}/identity`,
        method: "PUT",
        body,
        headers: { Authorization: authToken },
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        "identity",
        { type: "companyById", id },
      ],
    }),
    addLanguage: builder.mutation({
      query: ({ body, authToken, orgCode }) => ({
        url: `/company/api/v1/company/${orgCode}/language`,
        method: "POST",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: (result, error, { orgCode }) => [
        "identity",
        { type: "companyById", id: orgCode },
      ],
    }),
    getLanguages: builder.query({
      query: ({ authToken, orgCode }) => ({
        url: `/company/api/v1/company/${orgCode}/language`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: ["identity"],
    }),
    getIdentity: builder.query({
      query: ({ id, authToken }) => ({
        url: `/company/api/v1/company/${id}/identity`,
        method: "GET",
        headers: { Authorization: authToken },
      }),
      providesTags: (result, error, { id }) => [
        "identity",
        { type: "companyById", id },
      ],
    }),
    updateLanguage: builder.mutation({
      query: ({ body, authToken, id }) => ({
        url: `/company/api/v1/company/language/${id}`,
        method: "PUT",
        body,
        headers: { Authorization: authToken },
      }),
      invalidatesTags: ["identity"],
    }),
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
