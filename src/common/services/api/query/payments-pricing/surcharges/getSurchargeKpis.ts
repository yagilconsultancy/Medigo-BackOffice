import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import { ApiSurchargeKPIsResponse } from '../../../../types';

export const getSurchargeKpis = async () => {
  return await getApiClient().get<ApiSurchargeKPIsResponse>(
    resolveRoute(ROUTES.getSurchargeKpis)
  );
};
