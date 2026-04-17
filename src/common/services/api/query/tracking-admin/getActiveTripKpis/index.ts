import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../../lib/api-client';
import { resolveRoute, ROUTES } from '../../../../../constants/routes';
import type { ApiActiveTripKPIsResponse } from '../../../../../types';

export const getActiveTripKpis = async () => {
  return await getApiClient().get<
    ApiActiveTripKPIsResponse,
    AxiosResponse<ApiActiveTripKPIsResponse>
  >(resolveRoute(ROUTES.getActiveTripKpis));
};
