import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiCancellationKPIsResponse,
  ApiCancellationPolicyResponse,
} from '../../../../types';

export const getCancellationKpis = async () => {
  return await getApiClient().get<
    ApiCancellationKPIsResponse,
    AxiosResponse<ApiCancellationKPIsResponse>
  >(resolveRoute(ROUTES.getCancellationKpis));
};

export const getCancellationPolicies = async () => {
  return await getApiClient().get<
    ApiCancellationPolicyResponse,
    AxiosResponse<ApiCancellationPolicyResponse>
  >(resolveRoute(ROUTES.getCancellationPolicies));
};
