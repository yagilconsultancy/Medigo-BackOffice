import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiSupportKpisResponse,
  ApiSupportTicketListResponse,
  SupportTicketListPayload,
} from '../../../../types';

export const getSupportKpis = async () => {
  return await getApiClient().get<
    ApiSupportKpisResponse,
    AxiosResponse<ApiSupportKpisResponse>
  >(resolveRoute(ROUTES.getSupportKpis));
};

export const listSupportTickets = async (
  payload: SupportTicketListPayload
) => {
  return await getApiClient().get<
    ApiSupportTicketListResponse,
    AxiosResponse<ApiSupportTicketListResponse>
  >(resolveRoute(ROUTES.listSupportTickets), {
    params: { ...payload },
  });
};
