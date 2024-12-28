import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Item } from '../../components/contents-table/item';
import { API_CONFIG } from '../../config';

// Used when fetching a single claim with full item details
interface ClaimDetail {
  id: number;
  claimNumber: string;
  items: Item[];
  localItemIds: number[];
  description: string;
  status: string;
  totalClaimed: number;
  totalApproved: number | null;
  createdAt: string;
  updatedAt: string;
  insuredProgressPercent: number;
  ourProgressPercent: number;
  lastProgressUpdate: string | null;
  isDeleted: boolean;
  insuredId: number;
  handler?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarColour: string;
    staff: {
      id: number;
      employeeId: string;
      department: string;
      position: string;
    };
  };
}

interface Message {
  message: string;
}

interface StaffDetail {
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  staff: {
    department: string;
    employeeId: string;
    position: string;
  };
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
  insuredProgressPercent: number;
  ourProgressPercent: number;
  lastProgressUpdate: string | null;
  handler?: {
    id: number;
    firstName: string;
    lastName: string;
    avatarColour: string;
    staff: {
      employeeId: string;
      department: string;
      position: string;
    };
  };
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

interface RecalculateResponse {
  success: boolean;
  totalClaimed: number;
  totalApproved: number;
  insuredProgressPercent: number;
  ourProgressPercent: number;
  lastProgressUpdate: string; // Added this field
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl + '/' }),
  tagTypes: [
    'Claim',
    'Item',
    'Claims',
    'RecentViews',
    'ArchivedClaims',
    'User',
  ],
  endpoints: (builder) => ({
    getMessage: builder.query<Message, void>({
      query: () => '',
    }),
    getStaff: builder.query<StaffDetail, string>({
      query: (employeeId) => `staff/${employeeId}`,
      providesTags: ['User'],
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
    }),
    updateItem: builder.mutation<
      Item,
      { claimNumber: string; item: Partial<Item> }
    >({
      query: ({ claimNumber, item }) => ({
        url: `claims/${claimNumber}/items/${item.id}`,
        method: 'PATCH',
        body: {
          name: item.name,
          ourQuote: item.ourQuote,
          ourQuoteProof: item.ourQuoteProof,
          insuredsQuote: item.insuredsQuote,
          itemStatus: item.itemStatus,
          roomCategory: item.roomCategory,
          category: item.category,
          quantity: item.quantity,
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
    archiveClaim: builder.mutation<
      { success: boolean; message: string },
      { claimNumber: string; userId: number; reason: string }
    >({
      query: ({ claimNumber, userId, reason }) => ({
        url: `claims/${claimNumber}/archive`,
        method: 'POST',
        body: { userId, reason },
      }),
      invalidatesTags: ['Claims', 'Claim', 'ArchivedClaims'],
    }),

    unarchiveClaim: builder.mutation<
      { success: boolean; message: string },
      { claimNumber: string; userId: number }
    >({
      query: ({ claimNumber, userId }) => ({
        url: `claims/${claimNumber}/unarchive`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: ['Claims', 'Claim', 'ArchivedClaims'],
    }),

    reassignClaim: builder.mutation<
      { success: boolean; handler: ClaimDetail['handler'] },
      { claimNumber: string; employeeId: string }
    >({
      query: ({ claimNumber, employeeId }) => ({
        url: `claims/${claimNumber}/reassign`,
        method: 'POST',
        body: { employeeId },
      }),
      invalidatesTags: ['Claim', 'Claims'],
    }),

    recalculateQuotes: builder.mutation<RecalculateResponse, string>({
      query: (claimNumber) => ({
        url: `claims/${claimNumber}/recalculate`,
        method: 'POST',
      }),
      // Optimistically update both the claims list and individual claim
      async onQueryStarted(claimNumber, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update the claims list
          dispatch(
            api.util.updateQueryData('getClaims', undefined, (draft) => {
              const claim = draft.find((c) => c.claimNumber === claimNumber);
              if (claim) {
                claim.totalClaimed = data.totalClaimed;
                claim.totalApproved = data.totalApproved;
                claim.insuredProgressPercent = data.insuredProgressPercent;
                claim.ourProgressPercent = data.ourProgressPercent;
                claim.lastProgressUpdate = data.lastProgressUpdate;
              }
            })
          );

          // Update the individual claim view
          dispatch(
            api.util.updateQueryData('getClaim', claimNumber, (draft) => {
              draft.totalClaimed = data.totalClaimed;
              draft.totalApproved = data.totalApproved;
              draft.insuredProgressPercent = data.insuredProgressPercent;
              draft.ourProgressPercent = data.ourProgressPercent;
              draft.lastProgressUpdate = data.lastProgressUpdate;
            })
          );
        } catch {
          // If the mutation fails, the cache will remain unchanged
          console.error('Failed to recalculate quotes');
        }
      },
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
  useRecalculateQuotesMutation,
  useArchiveClaimMutation,
  useUnarchiveClaimMutation,
  useGetStaffQuery,
  useReassignClaimMutation,
} = api;
