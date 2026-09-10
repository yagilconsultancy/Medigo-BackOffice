import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiAccountDeletionDetailResponse,
  ApproveAccountDeletionPayload,
  RejectAccountDeletionPayload,
} from '../../../../types';

/**
 * Approving actually deletes the account: it soft-deletes the profile and
 * deactivates the login credentials. The backend refuses anything that has
 * not been email-verified.
 */
export const approveAccountDeletionRequest = async (
  payload: ApproveAccountDeletionPayload
) => {
  const { requestId, ...rest } = payload;

  return await getApiClient().post<
    ApiAccountDeletionDetailResponse,
    AxiosResponse<ApiAccountDeletionDetailResponse>
  >(resolveRoute(ROUTES.approveAccountDeletionRequest, requestId), rest);
};

export const rejectAccountDeletionRequest = async (
  payload: RejectAccountDeletionPayload
) => {
  const { requestId, ...rest } = payload;

  return await getApiClient().post<
    ApiAccountDeletionDetailResponse,
    AxiosResponse<ApiAccountDeletionDetailResponse>
  >(resolveRoute(ROUTES.rejectAccountDeletionRequest, requestId), rest);
};
