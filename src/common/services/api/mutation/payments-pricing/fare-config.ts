import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiServiceTypeConfigResponse,
  ApiRoutePricingResponse,
  ServiceTypeConfigUpdate,
  RoutePricingUpdate,
} from '../../../../types';

export const updateServiceTypeConfig = async (
  serviceType: string,
  payload: ServiceTypeConfigUpdate
) => {
  return await getApiClient().put<
    ApiServiceTypeConfigResponse,
    AxiosResponse<ApiServiceTypeConfigResponse>
  >(resolveRoute(ROUTES.updateServiceTypeConfig, serviceType), payload);
};

export const updateRoutePricing = async (
  serviceType: string,
  payload: RoutePricingUpdate
) => {
  return await getApiClient().put<
    ApiRoutePricingResponse,
    AxiosResponse<ApiRoutePricingResponse>
  >(resolveRoute(ROUTES.updateRoutePricing, serviceType), payload);
};
