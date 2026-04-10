import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import { ApiRouteComparisonResponse } from '../../../../types';

export const getRouteComparison = async () => {
  return await getApiClient().get<ApiRouteComparisonResponse>(
    resolveRoute(ROUTES.getRouteComparison)
  );
};
