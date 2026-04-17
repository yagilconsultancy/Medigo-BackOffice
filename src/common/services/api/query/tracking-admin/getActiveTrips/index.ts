import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../../lib/api-client';
import { resolveRoute, ROUTES } from '../../../../../constants/routes';
import type { ApiActiveTripsResponse } from '../../../../../types';

export const getActiveTrips = async () => {
  return await getApiClient().get<
    ApiActiveTripsResponse,
    AxiosResponse<ApiActiveTripsResponse>
  >(resolveRoute(ROUTES.getActiveTrips));
};
