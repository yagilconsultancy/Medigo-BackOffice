import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  ApiLoginRefreshRequest,
  ApiLogoutApiResponse,
} from '../../../../types';

export const logout = async (payload: ApiLoginRefreshRequest) => {
  return await getApiClient().post<
    ApiLogoutApiResponse,
    AxiosResponse<ApiLogoutApiResponse>,
    ApiLoginRefreshRequest
  >(resolveRoute(ROUTES.adminLogout), payload);
};
