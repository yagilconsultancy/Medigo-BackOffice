import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  ApiResetPasswordPayload,
  ApiResetPasswordResponse,
} from '../../../../types';

export const resetPassword = async (payload: ApiResetPasswordPayload) => {
  return await getApiClient().post<
    ApiResetPasswordResponse,
    AxiosResponse<ApiResetPasswordResponse>,
    ApiResetPasswordPayload
  >(resolveRoute(ROUTES.resetPassword), payload);
};
