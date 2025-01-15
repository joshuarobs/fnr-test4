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
  contributors: {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      avatarColour: string;
      staff?: {
        id: number;
        employeeId: string;
        department: string;
        position: string;
      };
    };
  }[];
  allocatedSuppliers: {
    supplier: {
      id: number;
      supplierId: string;
      company: string;
      baseUser: {
        firstName: string;
        lastName: string;
        avatarColour: string;
      };
    };
  }[];
}

interface Message {
  message: string;
}

// Sign up request interface
interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone?: string;
  role: 'STAFF' | 'ADMIN' | 'SUPPLIER' | 'INSURED';
}

interface SignUpResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface StaffDetail {
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  avatarColour: string | null;
  staff: {
    department: string;
    employeeId: string;
    position: string;
  };
}

// Used when fetching the list of claims for the overview table
export interface ClaimOverview {
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
  isDeleted: boolean;
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

// Used for recently viewed claims
export interface RecentlyViewedClaim {
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
  };
}

interface RecalculateResponse {
  success: boolean;
  totalClaimed: number;
  totalApproved: number;
  insuredProgressPercent: number;
  ourProgressPercent: number;
  lastProgressUpdate: string;
}

// Add the interface for update user details request
export interface UpdateUserDetailsRequest {
  firstName: string;
  lastName: string;
  department: string;
  avatarColour: string;
}

// User interface for the users table
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STAFF' | 'ADMIN' | 'SUPPLIER' | 'INSURED';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  avatarColour?: string;
  staff?: {
    employeeId: string;
  };
  handledClaims: any[];
  contributedClaims: any[];
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl + '/',
    credentials: 'include', // Include credentials in requests
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Claim',
    'Item',
    'Claims',
    'RecentViews',
    'ArchivedClaims',
    'User',
    'Staff',
    'Users',
    'Suppliers',
  ],
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string; employeeId: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (credentials) => ({
        url: 'auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    updateUserDetails: builder.mutation<
      StaffDetail,
      UpdateUserDetailsRequest & { employeeId: string }
    >({
      query: ({ employeeId, ...details }) => ({
        url: `staff/${employeeId}`,
        method: 'PATCH',
        body: details,
      }),
      invalidatesTags: ['Staff', 'User'],
    }),
    getMessage: builder.query<Message, void>({
      query: () => '',
    }),
    getStaff: builder.query<StaffDetail, string>({
      query: (employeeId) => `staff/${employeeId}`,
      providesTags: ['User'],
    }),
    getAllStaff: builder.query<StaffDetail[], number | void>({
      query: (limit = 10) => `staff?limit=${limit}`,
      providesTags: ['Staff'],
    }),
    getClaims: builder.query<
      {
        claims: ClaimOverview[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      },
      { page: number; pageSize: number }
    >({
      query: ({ page, pageSize }) => `claims?page=${page}&pageSize=${pageSize}`,
      providesTags: ['Claims'],
    }),
    getAssignedClaims: builder.query<
      ClaimOverview[],
      { employeeId: string; limit?: number }
    >({
      query: ({ employeeId, limit }) =>
        `claims/assigned/${employeeId}${limit ? `?limit=${limit}` : ''}`,
      providesTags: ['Claims'],
    }),
    getClaim: builder.query<ClaimDetail, string>({
      query: (id) => `claims/${id}`,
      providesTags: ['Claim'],
    }),
    getRecentlyViewedClaims: builder.query<
      {
        claims: ClaimOverview[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      },
      void
    >({
      query: () => 'claims/recent-views',
      transformResponse: (response: RecentlyViewedClaim[]) => {
        const claims = response.map((recentClaim) => ({
          id: recentClaim.id,
          claimNumber: recentClaim.claim.claimNumber,
          description: recentClaim.claim.description,
          status: recentClaim.claim.status,
          items: [], // We don't have items in the recent view data
          totalClaimed: recentClaim.claim.totalClaimed,
          totalApproved: recentClaim.claim.totalApproved,
          createdAt: recentClaim.claim.createdAt,
          updatedAt: recentClaim.claim.updatedAt,
          insuredProgressPercent: 0, // These fields aren't in recent view data
          ourProgressPercent: 0,
          lastProgressUpdate: null,
          isDeleted: false,
          handler: recentClaim.claim.handler,
        }));

        return {
          claims,
          total: response.length,
          page: 1,
          pageSize: response.length,
          totalPages: 1,
        };
      },
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
      { claimNumber: string; employeeId: string | null }
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
      async onQueryStarted(claimNumber, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData(
              'getClaims',
              { page: 1, pageSize: 10 },
              (draft) => {
                const claim = draft.claims.find(
                  (c: ClaimOverview) => c.claimNumber === claimNumber
                );
                if (claim) {
                  claim.totalClaimed = data.totalClaimed;
                  claim.totalApproved = data.totalApproved;
                  claim.insuredProgressPercent = data.insuredProgressPercent;
                  claim.ourProgressPercent = data.ourProgressPercent;
                  claim.lastProgressUpdate = data.lastProgressUpdate;
                }
              }
            )
          );
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
          console.error('Failed to recalculate quotes');
        }
      },
    }),
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['Users'],
    }),
    getStaffUsers: builder.query<User[], void>({
      query: () => 'users/staff',
      providesTags: ['Users'],
    }),
    getCustomers: builder.query<User[], void>({
      query: () => 'users/customers',
      providesTags: ['Users'],
    }),
    getSuppliers: builder.query<Supplier[], void>({
      query: () => 'suppliers',
      providesTags: ['Suppliers'],
    }),
    getSupplier: builder.query<Supplier, string>({
      query: (supplierId) => `suppliers/${supplierId}`,
      providesTags: ['Suppliers'],
    }),
    getSupplierClaims: builder.query<ClaimOverview[], string>({
      query: (supplierId) => `suppliers/${supplierId}/claims`,
      providesTags: ['Claims'],
    }),
    updateClaimDescription: builder.mutation<
      void,
      { claimNumber: string; description: string }
    >({
      query: ({ claimNumber, description }) => ({
        url: `claims/${claimNumber}/description`,
        method: 'PATCH',
        body: { description },
      }),
      invalidatesTags: ['Claim', 'Claims'],
    }),
  }),
});

// Supplier interface
export interface Supplier {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  avatarColour?: string;
  role: string;
  supplier: {
    supplierId: string;
    company: string;
    allocatedClaims: number;
  };
}

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetStaffUsersQuery,
  useSignUpMutation,
  useGetMessageQuery,
  useGetClaimsQuery,
  useGetClaimQuery,
  useGetAssignedClaimsQuery,
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
  useUpdateUserDetailsMutation,
  useGetAllStaffQuery,
  useGetUsersQuery,
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useGetSupplierClaimsQuery,
  useGetCustomersQuery,
  useUpdateClaimDescriptionMutation,
} = api;
