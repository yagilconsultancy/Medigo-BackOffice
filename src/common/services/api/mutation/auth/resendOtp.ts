import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import { ApiResendOtpPayload, ApiResendOtpResponse } from '../../../../types';

export const resendOtp = async (payload: ApiResendOtpPayload) => {
  return await getApiClient().post<
    ApiResendOtpResponse,
    AxiosResponse<ApiResendOtpResponse>,
    void
  >(resolveRoute(ROUTES.resendOtp), undefined, {
    params: payload,
  });
};
