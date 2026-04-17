import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../../lib/api-client';
import { resolveRoute, ROUTES } from '../../../../../constants/routes';
import type { ApiLiveDriversResponse } from '../../../../../types';

export const getLiveDrivers = async () => {
  return await getApiClient().get<
    ApiLiveDriversResponse,
    AxiosResponse<ApiLiveDriversResponse>
  >(resolveRoute(ROUTES.getLiveDrivers));
};
