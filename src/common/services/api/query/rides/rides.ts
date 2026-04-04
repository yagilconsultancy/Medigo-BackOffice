import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  AllRidesPayload,
  PendingRidesPayload,
  ApiRideListResponse,
} from '../../../../types';

export const getAllRides = async (payload: AllRidesPayload) => {
  return await getApiClient().get<
    ApiRideListResponse,
    AxiosResponse<ApiRideListResponse>
  >(resolveRoute(ROUTES.getAllRides), {
    params: { ...payload },
  });
};

export const getPendingRides = async (payload: PendingRidesPayload) => {
  return await getApiClient().get<
    ApiRideListResponse,
    AxiosResponse<ApiRideListResponse>
  >(resolveRoute(ROUTES.getPendingRides), {
    params: { ...payload },
  });
};
