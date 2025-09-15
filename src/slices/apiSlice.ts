import {
  fetchBaseQuery,
  createApi,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { signOut } from "next-auth/react";

interface ApiResponse {
  error?: string;
  message?: string;
  statusCode?: number;
  data?: any;
}

interface StandardizedError {
  status: number;
  message: string;
}

interface QueryResult {
  data?: any;
  error?: FetchBaseQueryError & {
    data?: ApiResponse;
  };
}

// Base query setup
const baseQuery = fetchBaseQuery({
  baseUrl: '',
  prepareHeaders: (headers) => {
    return headers;
  },
});

const baseQueryWithStandardizedErrors = async (
  args: any,
  api: any,
  extraOptions: any
): Promise<{ data?: any; error?: StandardizedError }> => {
  const result = (await baseQuery(args, api, extraOptions)) as QueryResult;

  if (result.error) {
  
    if(result.error.status === 401){
      signOut({ redirect: true, redirectTo: "/login" });
    }
    return {
      error: {
        status: (result.error.status as number) || 500,
        message:
          (result.error.data as ApiResponse)?.message ||
          (result.error.data as ApiResponse)?.error ||
          "An unexpected error occurred.",
      },
    };
  }

  const data = result.data as ApiResponse;
  if (data?.error || (data?.statusCode && data?.statusCode >= 400)) {
     
    return {
      error: {
        status: data?.statusCode || 400,
        message: data.error || "An unexpected error occurred.",
      },
    };
  }

  return { data: result.data };
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithStandardizedErrors,
  tagTypes: [
    "phaseById",
    "missionById",
    "departmentById",
    "groupById",
    "globalMissions",
    "globalMissionById",
    "workspaces",
    "workspaceById",
    "employees",
    "employeeById",
    "companies",
    "companyById",
    "associationMissions",
    "associationPhases",
    "associationDepartments",
    "associationGroups",
    "workspaceMissions",
    "workspacePhases",
    "workspaceDepartments",
    "workspaceGroups",
  ],
  endpoints: (builder) => ({}),
});
