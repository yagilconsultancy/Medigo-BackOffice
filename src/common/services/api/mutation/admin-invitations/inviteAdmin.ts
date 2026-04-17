import type { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib/api-client';
import { resolveRoute, ROUTES } from '../../../../constants/routes';
import type {
  AdminInviteRequest,
  ApiAdminInviteResponse,
} from '../../../../types';

/**
 * Send an admin invitation email
 * @param payload - Admin invitation details (full_name, email, role_name)
 */
export const inviteAdmin = async (payload: AdminInviteRequest) => {
  return await getApiClient().post<
    ApiAdminInviteResponse,
    AxiosResponse<ApiAdminInviteResponse>
  >(resolveRoute(ROUTES.inviteAdmin), payload);
};
