import { AxiosResponse } from 'axios';
import { getApiClient, resolveRoute, ROUTES } from '../../../../..';
import { ApiResponse, CancellationPolicyBulkUpdate } from '../../../../..';

export const updateCancellationPolicies = async (
  payload: CancellationPolicyBulkUpdate
) => {
  return await getApiClient().put<
    ApiResponse<null>,
    AxiosResponse<ApiResponse<null>>
  >(resolveRoute(ROUTES.updateCancellationPolicies), payload);
};
