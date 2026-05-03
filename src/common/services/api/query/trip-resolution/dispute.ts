import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiTripResolutionKpisResponse,
  ApiTripResolutionListResponse,
  listTripResolutionTicketsPayload,
  TripResolutionDetailPayload,
} from '../../../../types';

export const getTripResolutionKpis = async () => {
  return await getApiClient().get<
    ApiTripResolutionKpisResponse,
    AxiosResponse<ApiTripResolutionKpisResponse>
  >(resolveRoute(ROUTES.getDisputeKpis));
};

export const listTripResolutionTickets = async (
  payload: listTripResolutionTicketsPayload
) => {
  return await getApiClient().get<
    ApiTripResolutionListResponse,
    AxiosResponse<ApiTripResolutionListResponse>
  >(resolveRoute(ROUTES.listDisputes), {
    params: { ...payload },
  });
};

export const getTripResolutionDetail = async (
  payload: TripResolutionDetailPayload
) => {
  return await getApiClient().get<
    ApiTripResolutionKpisResponse,
    AxiosResponse<ApiTripResolutionKpisResponse>
  >(resolveRoute(ROUTES.getDisputeDetail, payload.dispute_id));
};
