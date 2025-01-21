import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Activity } from '../../components/second-sidebar/placeholderLatestActivities';
import { API_CONFIG } from '../../config';

export const activitiesApi = createApi({
  reducerPath: 'activitiesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getLatestActivities: builder.query<Activity[], number | void>({
      query: (limit = 10) => ({
        url: `/activities?limit=${limit}`,
      }),
    }),
  }),
});

export const { useGetLatestActivitiesQuery } = activitiesApi;
