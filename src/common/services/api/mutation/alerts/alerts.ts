import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import { ApiAlertResponse } from '../../../../types';

export const acknowledgeAlert = async (payload: { alertId: string }) => {
  return await getApiClient().put<
    ApiAlertResponse,
    AxiosResponse<ApiAlertResponse>
  >(resolveRoute(ROUTES.acknowledgeAlert, payload.alertId));
};

export const resolveAlert = async (payload: { alertId: string }) => {
  return await getApiClient().put<
    ApiAlertResponse,
    AxiosResponse<ApiAlertResponse>
  >(resolveRoute(ROUTES.resolveAlert, payload.alertId));
};
