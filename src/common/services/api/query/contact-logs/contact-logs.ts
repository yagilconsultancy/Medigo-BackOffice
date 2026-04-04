import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiContactKpisResponse,
  ApiContactLogListResponse,
  ContactLogListPayload,
} from '../../../../types';

export const getContactKpis = async () => {
  return await getApiClient().get<
    ApiContactKpisResponse,
    AxiosResponse<ApiContactKpisResponse>
  >(resolveRoute(ROUTES.getContactKpis));
};

export const listContactLogs = async (payload: ContactLogListPayload) => {
  return await getApiClient().get<
    ApiContactLogListResponse,
    AxiosResponse<ApiContactLogListResponse>
  >(resolveRoute(ROUTES.listContactLogs), {
    params: { ...payload },
  });
};
