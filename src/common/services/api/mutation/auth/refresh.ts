import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import { ApiLoginRefreshRequest, ApiLoginResponse } from '../../../../types';

export const refresh = async (payload: ApiLoginRefreshRequest) => {
  return await getApiClient().post<
    ApiLoginResponse,
    AxiosResponse<ApiLoginResponse>,
    ApiLoginRefreshRequest
  >(resolveRoute(ROUTES.adminRefresh), payload);
};
