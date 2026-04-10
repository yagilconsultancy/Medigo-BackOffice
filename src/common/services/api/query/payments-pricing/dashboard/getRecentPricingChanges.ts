import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  ApiRecentChangesResponse,
  RecentChangesQueryPayload,
} from '../../../../types';

export const getRecentPricingChanges = async (
  payload?: RecentChangesQueryPayload
) => {
  return await getApiClient().get<ApiRecentChangesResponse>(
    resolveRoute(ROUTES.getRecentPricingChanges),
    { params: { ...payload } }
  );
};
