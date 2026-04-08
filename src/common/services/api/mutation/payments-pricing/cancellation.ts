import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import { ApiResponse, CancellationPolicyBulkUpdate } from '../../../../types';

export const updateCancellationPolicies = async (
  payload: CancellationPolicyBulkUpdate
) => {
  return await getApiClient().put<
    ApiResponse<Record<string, any>>,
    AxiosResponse<ApiResponse<Record<string, any>>>
  >(resolveRoute(ROUTES.updateCancellationPolicies), payload);
};
