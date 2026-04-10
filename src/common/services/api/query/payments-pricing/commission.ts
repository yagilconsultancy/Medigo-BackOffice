import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../..';
import { getApiClient } from '../../../..';
import {
  ApiCommissionKPIsResponse,
  ApiCommissionConfigResponse,
} from '../../../..';

export const getCommissionKpis = async () => {
  return await getApiClient().get<
    ApiCommissionKPIsResponse,
    AxiosResponse<ApiCommissionKPIsResponse>
  >(resolveRoute(ROUTES.getCommissionKpis));
};

export const getCommissionConfig = async () => {
  return await getApiClient().get<
    ApiCommissionConfigResponse,
    AxiosResponse<ApiCommissionConfigResponse>
  >(resolveRoute(ROUTES.getCommissionConfig));
};
