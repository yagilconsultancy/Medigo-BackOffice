import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../..';
import { getApiClient } from '../../../..';
import {
  ApiPricingLogListResponse,
  ApiPricingLogExportResponse,
  PricingLogsQueryPayload,
  PricingLogsExportQueryPayload,
} from '../../../..';

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
