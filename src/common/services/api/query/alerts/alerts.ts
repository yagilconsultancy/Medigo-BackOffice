import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  AlertFeedPayload,
  ApiAlertKpisResponse,
  ApiAlertListResponseWrapped,
  ApiAlertResponse,
} from '../../../../types';

export const getAlertKpis = async () => {
  return await getApiClient().get<
    ApiAlertKpisResponse,
    AxiosResponse<ApiAlertKpisResponse>
  >(resolveRoute(ROUTES.getAlertKpis));
};

export const getAlertFeed = async (payload: AlertFeedPayload) => {
  return await getApiClient().get<
    ApiAlertListResponseWrapped,
    AxiosResponse<ApiAlertListResponseWrapped>
  >(resolveRoute(ROUTES.getAlertFeed), {
    params: { ...payload },
  });
};

export const getAlertDetail = async (alertId: string) => {
  return await getApiClient().get<
    ApiAlertResponse,
    AxiosResponse<ApiAlertResponse>
  >(resolveRoute(ROUTES.getAlertDetail, alertId));
};
