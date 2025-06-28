import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MatchingResponse } from "@/types/matching";

export const matchingApi = createApi({
  reducerPath: "matchingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    processMatching: builder.mutation<MatchingResponse, FormData>({
      query: (formData) => ({
        url: "process",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useProcessMatchingMutation } = matchingApi;
