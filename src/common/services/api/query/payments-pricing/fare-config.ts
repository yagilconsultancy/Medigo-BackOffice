import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiServiceTypeListResponse,
  ApiServiceTypeConfigResponse,
  ApiRoutePricingResponse,
  ApiCommissionViewResponse,
} from '../../../../types';

export const listServiceTypes = async () => {
  return await getApiClient().get<
    ApiServiceTypeListResponse,
    AxiosResponse<ApiServiceTypeListResponse>
  >(resolveRoute(ROUTES.listServiceTypes));
};

export const getServiceTypeConfig = async (serviceType: string) => {
  return await getApiClient().get<
    ApiServiceTypeConfigResponse,
    AxiosResponse<ApiServiceTypeConfigResponse>
  >(resolveRoute(ROUTES.getServiceTypeConfig, serviceType));
};

export const getRoutePricing = async (serviceType: string) => {
  return await getApiClient().get<
    ApiRoutePricingResponse,
    AxiosResponse<ApiRoutePricingResponse>
  >(resolveRoute(ROUTES.getRoutePricing, serviceType));
};

export const getCommissionView = async (serviceType: string) => {
  return await getApiClient().get<
    ApiCommissionViewResponse,
    AxiosResponse<ApiCommissionViewResponse>
  >(resolveRoute(ROUTES.getCommissionView, serviceType));
};
