import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiResponse,
  ApiRideTypeResponse,
  RideTypeCreateRequest,
  UpdateRideTypePayload,
  ToggleRideTypePayload,
  DeleteRideTypePayload,
} from '../../../../types';

export const createRideType = async (payload: RideTypeCreateRequest) => {
  return await getApiClient().post<
    ApiRideTypeResponse,
    AxiosResponse<ApiRideTypeResponse>
  >(resolveRoute(ROUTES.createRideType), payload);
};

export const updateRideType = async (payload: UpdateRideTypePayload) => {
  const { rideTypeId, ...rest } = payload;
  return await getApiClient().put<
    ApiRideTypeResponse,
    AxiosResponse<ApiRideTypeResponse>
  >(resolveRoute(ROUTES.updateRideType, rideTypeId), rest);
};

export const toggleRideType = async (payload: ToggleRideTypePayload) => {
  const { rideTypeId, is_active } = payload;
  return await getApiClient().put<
    ApiRideTypeResponse,
    AxiosResponse<ApiRideTypeResponse>
  >(resolveRoute(ROUTES.toggleRideType, rideTypeId), null, {
    params: { is_active },
  });
};

export const deleteRideType = async (payload: DeleteRideTypePayload) => {
  const { rideTypeId } = payload;
  return await getApiClient().delete<
    ApiResponse<null>,
    AxiosResponse<ApiResponse<null>>
  >(resolveRoute(ROUTES.deleteRideType, rideTypeId));
};
