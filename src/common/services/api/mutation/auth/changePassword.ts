import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  ApiChangePasswordPayload,
  ApiChangePasswordResponse,
} from '../../../../types';

export const changePassword = async (payload: ApiChangePasswordPayload) => {
  return await getApiClient().post<
    ApiChangePasswordResponse,
    AxiosResponse<ApiChangePasswordResponse>,
    ApiChangePasswordPayload
  >(resolveRoute(ROUTES.changePassword), payload);
};
