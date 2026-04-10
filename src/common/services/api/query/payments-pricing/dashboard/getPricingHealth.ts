import {
  getApiClient,
  resolveRoute,
  ROUTES,
  ApiPricingHealthResponse,
} from '../../../../..';

export const getPricingHealth = async () => {
  return await getApiClient().get<ApiPricingHealthResponse>(
    resolveRoute(ROUTES.getPricingHealth)
  );
};
