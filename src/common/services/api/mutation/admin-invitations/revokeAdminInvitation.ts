import type { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib/api-client';
import { resolveRoute, ROUTES } from '../../../../constants/routes';
import type { ApiRevokeAdminInvitationResponse } from '../../../../types';

/**
 * Revoke a pending admin invitation
 * @param invitationId - UUID of the invitation to revoke
 */
export const revokeAdminInvitation = async (invitationId: string) => {
  return await getApiClient().delete<
    ApiRevokeAdminInvitationResponse,
    AxiosResponse<ApiRevokeAdminInvitationResponse>
  >(resolveRoute(ROUTES.revokeAdminInvitation, invitationId));
};
