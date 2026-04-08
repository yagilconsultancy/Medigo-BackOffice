import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiPricingLogListResponse,
  ApiPricingLogExportResponse,
  PricingLogsQueryPayload,
  PricingLogsExportQueryPayload,
} from '../../../../types';

export const listPricingLogs = async (payload: PricingLogsQueryPayload) => {
  return await getApiClient().get<
    ApiPricingLogListResponse,
    AxiosResponse<ApiPricingLogListResponse>
  >(resolveRoute(ROUTES.listPricingLogs), {
    params: { ...payload },
  });
};

export const exportPricingLogs = async (
  payload?: PricingLogsExportQueryPayload
) => {
  return await getApiClient().get<
    ApiPricingLogExportResponse,
    AxiosResponse<ApiPricingLogExportResponse>
  >(resolveRoute(ROUTES.exportPricingLogs), {
    params: { ...payload },
  });
};
