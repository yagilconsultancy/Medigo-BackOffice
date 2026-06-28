import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  ApiVerifyPasswordPayload,
  ApiVerifyPasswordResponse,
} from '../../../../types';

export const verifyPassword = async (payload: ApiVerifyPasswordPayload) => {
  return await getApiClient().post<
    ApiVerifyPasswordResponse,
    AxiosResponse<ApiVerifyPasswordResponse>,
    ApiVerifyPasswordPayload
  >(resolveRoute(ROUTES.verifyPassword), payload);
};
