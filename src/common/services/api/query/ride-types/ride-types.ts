import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiRideTypeKpisResponse,
  ApiRideTypeListResponse,
  ApiRideTypeResponse,
} from '../../../../types';

export const getRideTypeKpis = async () => {
  return await getApiClient().get<
    ApiRideTypeKpisResponse,
    AxiosResponse<ApiRideTypeKpisResponse>
  >(resolveRoute(ROUTES.getRideTypeKpis));
};

export const listRideTypes = async () => {
  return await getApiClient().get<
    ApiRideTypeListResponse,
    AxiosResponse<ApiRideTypeListResponse>
  >(resolveRoute(ROUTES.listRideTypes));
};

export const getRideType = async (rideTypeId: string) => {
  return await getApiClient().get<
    ApiRideTypeResponse,
    AxiosResponse<ApiRideTypeResponse>
  >(resolveRoute(ROUTES.getRideType, rideTypeId));
};
