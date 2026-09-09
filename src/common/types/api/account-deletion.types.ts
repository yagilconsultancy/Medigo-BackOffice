import { ApiPaginatedResponseData, ApiResponse } from './common';

/**
 * Account deletion requests filed from the public form at
 * getmedigo.com/medigo-delete-account (the Google Play deletion URL).
 *
 * Requests only reach this queue after the requester has confirmed an emailed
 * code, so every row here has a verified mailbox behind it. Approving one runs
 * the same soft-delete as the in-app Delete Account button.
 */
export type AccountDeletionStatus =
  | 'pending_verification'
  | 'pending_review'
  | 'approved'
  | 'rejected';

export interface AccountDeletionRequestResponse {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  reason: string | null;
  user_id: string;
  status: AccountDeletionStatus;
  email_verified_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  admin_notes: string | null;
  source: string;
  created_at: string;
  updated_at: string;

  // Resolved from the linked account, so the form details can be compared
  // against the account without a second lookup.
  account_email: string | null;
  account_phone: string | null;
  account_name: string | null;
  account_role: string | null;
  account_created_at: string | null;
  account_deleted_at: string | null;
  reviewer_name: string | null;
}

export interface AccountDeletionKPIs {
  total_requests: number;
  pending_review: number;
  approved: number;
  rejected: number;
  awaiting_verification: number;
}

export interface AccountDeletionListPayload {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export type AccountDeletionPaginatedResponse =
  ApiPaginatedResponseData<AccountDeletionRequestResponse>;

export type ApiAccountDeletionDetailResponse =
  ApiResponse<AccountDeletionRequestResponse>;

export type ApiAccountDeletionKPIsResponse = ApiResponse<AccountDeletionKPIs>;

// Mutation payloads
export interface ApproveAccountDeletionPayload {
  requestId: string;
  notes?: string | null;
}

export interface RejectAccountDeletionPayload {
  requestId: string;
  reason: string;
}
