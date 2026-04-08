import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import { ApiProcessPayoutResponse } from '../../../../types';

export const processPayout = async (driverId: string) => {
  return await getApiClient().post<
    ApiProcessPayoutResponse,
    AxiosResponse<ApiProcessPayoutResponse>
  >(resolveRoute(ROUTES.processPayout, driverId));
};
