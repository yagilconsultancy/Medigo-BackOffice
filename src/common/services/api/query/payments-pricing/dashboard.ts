import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../..';
import { getApiClient } from '../../../..';
import {
  ApiPricingDashboardKPIsResponse,
  ApiRouteComparisonResponse,
  ApiRecentChangesResponse,
  ApiPricingHealthResponse,
  RecentChangesQueryPayload,
} from '../../../..';

export const getPricingDashboardKpis = async () => {
  return await getApiClient().get<
    ApiPricingDashboardKPIsResponse,
    AxiosResponse<ApiPricingDashboardKPIsResponse>
  >(resolveRoute(ROUTES.getPricingDashboardKpis));
};

export const getRouteComparison = async () => {
  return await getApiClient().get<
    ApiRouteComparisonResponse,
    AxiosResponse<ApiRouteComparisonResponse>
  >(resolveRoute(ROUTES.getRouteComparison));
};

export const getRecentPricingChanges = async (
  payload?: RecentChangesQueryPayload
) => {
  return await getApiClient().get<
    ApiRecentChangesResponse,
    AxiosResponse<ApiRecentChangesResponse>
  >(resolveRoute(ROUTES.getRecentPricingChanges), {
    params: { ...payload },
  });
};

export const getPricingHealth = async () => {
  return await getApiClient().get<
    ApiPricingHealthResponse,
    AxiosResponse<ApiPricingHealthResponse>
  >(resolveRoute(ROUTES.getPricingHealth));
};
