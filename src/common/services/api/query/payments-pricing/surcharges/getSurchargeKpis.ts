import { getApiClient } from '../../../../..';
import { resolveRoute, ROUTES } from '../../../../..';
import { ApiSurchargeKPIsResponse } from '../../../../..';

export const getSurchargeKpis = async () => {
  return await getApiClient().get<ApiSurchargeKPIsResponse>(
    resolveRoute(ROUTES.getSurchargeKpis)
  );
};
