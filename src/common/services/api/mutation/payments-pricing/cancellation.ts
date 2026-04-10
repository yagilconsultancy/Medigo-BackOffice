import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../..';
import { getApiClient } from '../../../..';
import { ApiResponse, CancellationPolicyBulkUpdate } from '../../../..';

export const updateCancellationPolicies = async (
  payload: CancellationPolicyBulkUpdate
) => {
  return await getApiClient().put<
    ApiResponse<Record<string, any>>,
    AxiosResponse<ApiResponse<Record<string, any>>>
  >(resolveRoute(ROUTES.updateCancellationPolicies), payload);
};
