import { AxiosResponse } from 'axios';
import { getApiClient, resolveRoute, ROUTES } from '../../../../..';
import { ApiCancellationPolicyResponse } from '../../../../../types';

export const getCancellationPolicies = async () => {
  return await getApiClient().get<
    ApiCancellationPolicyResponse,
    AxiosResponse<ApiCancellationPolicyResponse>
  >(resolveRoute(ROUTES.getCancellationPolicies));
};
