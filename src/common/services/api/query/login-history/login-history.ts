import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiLoginHistoryListResponse,
  ApiResponse,
  LoginHistoryKPIs,
  LoginHistoryListPayload,
} from '../../../../types';

export const getLoginHistoryKpi = async () => {
  return await getApiClient().get<
    ApiResponse<LoginHistoryKPIs>,
    AxiosResponse<ApiResponse<LoginHistoryKPIs>>
  >(resolveRoute(ROUTES.getLoginHistoryKpi));
};

export const getLoginHistory = async (payload: LoginHistoryListPayload) => {
  return await getApiClient().get<
    ApiLoginHistoryListResponse,
    AxiosResponse<ApiLoginHistoryListResponse>
  >(resolveRoute(ROUTES.getLoginHistory), {
    params: { ...payload },
  });
};

export const getExportLoginHistory = async (
  payload: LoginHistoryListPayload
) => {
  return await getApiClient().get<Blob, AxiosResponse<Blob>>(
    resolveRoute(ROUTES.getExportLoginHistory),
    {
      params: { ...payload },
      responseType: 'blob',
    }
  );
};
