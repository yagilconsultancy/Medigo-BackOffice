import type { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib/api-client';
import { resolveRoute, ROUTES } from '../../../../constants/routes';
import type {
  AdminInvitationsListPayload,
  ApiAdminInvitationsListResponse,
} from '../../../../types';

/**
 * Get list of pending admin invitations (paginated)
 * @param payload - Pagination parameters (offset, limit)
 */
export const getAdminInvitations = async (
  payload: AdminInvitationsListPayload
) => {
  return await getApiClient().get<
    ApiAdminInvitationsListResponse,
    AxiosResponse<ApiAdminInvitationsListResponse>
  >(resolveRoute(ROUTES.getAdminInvitations), {
    params: { ...payload },
  });
};
