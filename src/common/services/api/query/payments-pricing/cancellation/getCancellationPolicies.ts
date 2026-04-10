import { AxiosResponse } from 'axios';
import { getApiClient, resolveRoute, ROUTES } from '../../../../..';
import { ApiCancellationPolicyResponse } from '../../../../..';

export const getCancellationPolicies = async () => {
  return await getApiClient().get<
    ApiCancellationPolicyResponse,
    AxiosResponse<ApiCancellationPolicyResponse>
  >(resolveRoute(ROUTES.getCancellationPolicies));
};
