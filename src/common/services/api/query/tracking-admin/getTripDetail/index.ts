import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../../lib/api-client';
import { resolveRoute, ROUTES } from '../../../../../constants/routes';
import type { ApiActiveTripDetailResponse } from '../../../../../types';

export const getTripDetail = async (rideId: string) => {
  return await getApiClient().get<
    ApiActiveTripDetailResponse,
    AxiosResponse<ApiActiveTripDetailResponse>
  >(resolveRoute(ROUTES.getTripDetail, rideId));
};
