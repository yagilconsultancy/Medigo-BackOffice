import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  AdminAssignDriverRequest,
  ApiRideActionResponse,
} from '../../../../types';

export const adminAssignDriver = async (
  payload: { rideId: string } & AdminAssignDriverRequest
) => {
  const { rideId, ...body } = payload;

  return await getApiClient().put<
    ApiRideActionResponse,
    AxiosResponse<ApiRideActionResponse>
  >(resolveRoute(ROUTES.adminAssignDriver, rideId), body);
};
