import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import { ApiPricingDashboardKPIsResponse } from '../../../../types';

export const getPricingDashboardKpis = async () => {
  return await getApiClient().get<ApiPricingDashboardKPIsResponse>(
    resolveRoute(ROUTES.getPricingDashboardKpis)
  );
};
