import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  AccountDeletionListPayload,
  AccountDeletionPaginatedResponse,
  ApiAccountDeletionDetailResponse,
  ApiAccountDeletionKPIsResponse,
} from '../../../../types';

export const getAccountDeletionKpis = async () => {
  return await getApiClient().get<
    ApiAccountDeletionKPIsResponse,
    AxiosResponse<ApiAccountDeletionKPIsResponse>
  >(resolveRoute(ROUTES.getAccountDeletionKpis));
};

export const getAccountDeletionRequests = async (
  payload: AccountDeletionListPayload
) => {
  return await getApiClient().get<
    AccountDeletionPaginatedResponse,
    AxiosResponse<AccountDeletionPaginatedResponse>
  >(resolveRoute(ROUTES.accountDeletionRequests), {
    params: {
      ...payload,
    },
  });
};

export const getAccountDeletionRequestById = async (requestId: string) => {
  return await getApiClient().get<
    ApiAccountDeletionDetailResponse,
    AxiosResponse<ApiAccountDeletionDetailResponse>
  >(resolveRoute(ROUTES.accountDeletionRequestDetail, requestId));
};
