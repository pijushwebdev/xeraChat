/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedOut } from "../features/auth/authSlice";
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:9000",
  prepareHeaders: async (headers, { getState, endpoint }) => {
    // set auth header to all endpoints // we can do more with specific route using endpoint and headers
    const token = getState()?.auth?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
})

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if(result.error && result.error.status === 401){
      api.dispatch(userLoggedOut());
      localStorage.removeItem('auth');
    }
    return result;
  },
  tagTypes: [],
  endpoints: (builder) => ({}),
});
