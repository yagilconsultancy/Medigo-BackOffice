import {
  getApiClient,
  resolveRoute,
  ROUTES,
  ApiRecentChangesResponse,
  RecentChangesQueryPayload,
} from '../../../../..';

export const getRecentPricingChanges = async (
  payload?: RecentChangesQueryPayload
) => {
  return await getApiClient().get<ApiRecentChangesResponse>(
    resolveRoute(ROUTES.getRecentPricingChanges),
    { params: { ...payload } }
  );
};
