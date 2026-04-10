import {
  getApiClient,
  resolveRoute,
  ROUTES,
  ApiRouteComparisonResponse,
} from '../../../../..';

export const getRouteComparison = async () => {
  return await getApiClient().get<ApiRouteComparisonResponse>(
    resolveRoute(ROUTES.getRouteComparison)
  );
};
