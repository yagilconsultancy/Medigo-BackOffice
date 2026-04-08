import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiCommissionKPIsResponse,
  ApiCommissionConfigResponse,
} from '../../../../types';

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
