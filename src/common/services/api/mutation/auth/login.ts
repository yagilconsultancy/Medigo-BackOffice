import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import { ApiLoginPayload, ApiLoginResponse } from '../../../../types';

export const login = async (payload: ApiLoginPayload) => {
  return await getApiClient().post<
    ApiLoginResponse,
    AxiosResponse<ApiLoginResponse>,
    ApiLoginPayload
  >(resolveRoute(ROUTES.adminLogin), payload);
};
