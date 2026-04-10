import { AxiosResponse } from 'axios';
import { getApiClient, resolveRoute, ROUTES } from '../../../../..';
import { ApiCommissionKPIsResponse } from '../../../../..';

export const getCommissionKpis = async () => {
  return await getApiClient().get<
    ApiCommissionKPIsResponse,
    AxiosResponse<ApiCommissionKPIsResponse>
  >(resolveRoute(ROUTES.getCommissionKpis));
};
