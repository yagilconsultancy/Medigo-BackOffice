import {
  getApiClient,
  resolveRoute,
  ROUTES,
  ApiPricingDashboardKPIsResponse,
} from '../../../../..';

export const getPricingDashboardKpis = async () => {
  return await getApiClient().get<ApiPricingDashboardKPIsResponse>(
    resolveRoute(ROUTES.getPricingDashboardKpis)
  );
};
