import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import { ApiPricingHealthResponse } from '../../../../types';

export const getPricingHealth = async () => {
  return await getApiClient().get<ApiPricingHealthResponse>(
    resolveRoute(ROUTES.getPricingHealth)
  );
};
