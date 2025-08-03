import {
  fetchBaseQuery,
  createApi,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { useAuth } from "@/hooks/useAuth";



// Define types for API responses
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
  // baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    return headers;
  },
});

// Wrapper for the base query to standardize error handling
const baseQueryWithStandardizedErrors = async (
  args: any,
  api: any,
  extraOptions: any
): Promise<{ data?: any; error?: StandardizedError }> => {
  const result = (await baseQuery(args, api, extraOptions)) as QueryResult;
  const { logout } = useAuth();

  // Handle HTTP-level errors (status codes >= 400)
  if (result.error) {

    if(result.error.data?.error === "Invalid token"){
      logout();
      return {
        error: {
          status: 401,
          message: "Session expired. Please log in again.",
        },
      };
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

  // Handle API-level errors ONLY if there's an error field
  // or if the status code indicates an error
  const data = result.data as ApiResponse;
  if (data?.error || (data?.statusCode && data?.statusCode >= 400)) {
    return {
      error: {
        status: data?.statusCode || 400,
        message: data.error || "An unexpected error occurred.",
      },
    };
  }

  // Return successful data, even if it contains a message field
  return { data: result.data };
};

// Create the API slice
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
