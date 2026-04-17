import type { ApiPaginatedResponse, ApiResponse } from './common';

// ====================== REQUEST PAYLOADS ======================

/**
 * Payload for inviting a new admin
 */
export interface AdminInviteRequest {
  full_name: string;
  email: string;
  role_name: string; // super_admin, operations_manager, finance_manager, or support_admin
}

/**
 * Payload for listing admin invitations
 */
export interface AdminInvitationsListPayload {
  offset?: number;
  limit?: number;
}

// ====================== RESPONSE DATA TYPES ======================

/**
 * Admin invitation success response data
 */
export interface AdminInviteSuccessResponse {
  invitation_id: string;
  message?: string;
}

/**
 * Individual admin invitation response
 */
export interface AdminInvitationResponse {
  id: string;
  email: string;
  full_name: string;
  role_name: string;
  role_display_name: string;
  invited_by_name: string;
  status: string;
  expires_at: string;
  created_at: string;
  accepted_at?: string | null;
}

// ====================== API RESPONSE TYPES ======================

/**
 * API response for inviting an admin
 */
export type ApiAdminInviteResponse = ApiResponse<AdminInviteSuccessResponse>;

/**
 * API response for listing admin invitations (paginated)
 */
export type ApiAdminInvitationsListResponse =
  ApiPaginatedResponse<AdminInvitationResponse>;

/**
 * API response for revoking an admin invitation
 */
export type ApiRevokeAdminInvitationResponse = ApiResponse<Record<string, any>>;
