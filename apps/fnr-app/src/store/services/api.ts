import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Item } from '../../components/contents-table/item';

// Used when fetching a single claim with full item details
interface ClaimDetail {
  items: Item[];
  localItemIds: number[];
}

interface Message {
  message: string;
}

// Used when fetching the list of claims for the overview table
interface ClaimOverview {
  id: number;
  claimNumber: string;
  description: string;
  status: string;
  items: { id: number }[]; // Only need IDs for the overview
  totalClaimed: number;
  totalApproved: number | null;
  createdAt: string;
  updatedAt: string;
}

// Used for recently viewed claims
interface RecentlyViewedClaim {
  id: number;
  viewedAt: string;
  claim: {
    claimNumber: string;
    description: string;
    status: string;
    totalClaimed: number;
    totalApproved: number | null;
    createdAt: string;
    updatedAt: string;
  };
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3333/api/' }),
  tagTypes: ['Claim', 'Item', 'Claims', 'RecentViews'],
  endpoints: (builder) => ({
    getMessage: builder.query<Message, void>({
      query: () => '',
    }),
    getClaims: builder.query<ClaimOverview[], void>({
      query: () => 'claims?limit=10',
      providesTags: ['Claims'],
    }),
    getClaim: builder.query<ClaimDetail, string>({
      query: (id) => `claims/${id}`,
      providesTags: ['Claim'],
    }),
    getRecentlyViewedClaims: builder.query<RecentlyViewedClaim[], void>({
      query: () => 'claims/recent-views',
      providesTags: ['RecentViews'],
    }),
    recordClaimView: builder.mutation<void, string>({
      query: (id) => ({
        url: `claims/${id}/view`,
        method: 'POST',
      }),
      invalidatesTags: ['RecentViews'],
    }),
    updateItem: builder.mutation<Item, Partial<Item>>({
      query: (item) => ({
        url: `items/${item.id}`,
        method: 'PATCH',
        body: {
          name: item.name,
          ourQuote: item.ourquote,
          insuredsQuote: item.insuredsQuote,
        },
      }),
      invalidatesTags: ['Claim'],
    }),
    addItem: builder.mutation<Item, { claimId: string; item: Partial<Item> }>({
      query: ({ claimId, item }) => ({
        url: `claims/${claimId}/items`,
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Claim'],
    }),
    removeItem: builder.mutation<void, { claimId: string; itemId: number }>({
      query: ({ claimId, itemId }) => ({
        url: `claims/${claimId}/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Claim'],
    }),
  }),
});

export const {
  useGetMessageQuery,
  useGetClaimsQuery,
  useGetClaimQuery,
  useGetRecentlyViewedClaimsQuery,
  useRecordClaimViewMutation,
  useUpdateItemMutation,
  useAddItemMutation,
  useRemoveItemMutation,
} = api;
