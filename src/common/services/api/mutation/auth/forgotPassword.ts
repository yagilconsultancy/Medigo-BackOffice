import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  ApiForgotPasswordPayload,
  ApiForgotPasswordResponse,
} from '../../../../types';

export const forgotPassword = async (payload: ApiForgotPasswordPayload) => {
  return await getApiClient().post<
    ApiForgotPasswordResponse,
    AxiosResponse<ApiForgotPasswordResponse>,
    ApiForgotPasswordPayload
  >(resolveRoute(ROUTES.forgotPassword), payload);
};
