import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  UnassignedRidesPayload,
  ApiDispatchDashboardResponse,
  ApiUnassignedRidesResponse,
  ApiDispatchSettingsResponse,
  ApiAvailableDispatchDriversResponse,
} from '../../../../types';

export const getDispatchDashboard = async () => {
  return await getApiClient().get<
    ApiDispatchDashboardResponse,
    AxiosResponse<ApiDispatchDashboardResponse>
  >(resolveRoute(ROUTES.getDispatchDashboard));
};

export const getUnassignedRides = async (payload: UnassignedRidesPayload) => {
  return await getApiClient().get<
    ApiUnassignedRidesResponse,
    AxiosResponse<ApiUnassignedRidesResponse>
  >(resolveRoute(ROUTES.getUnassignedRides), {
    params: { ...payload },
  });
};

export const getAvailableDispatchDrivers = async () => {
  return await getApiClient().get<
    ApiAvailableDispatchDriversResponse,
    AxiosResponse<ApiAvailableDispatchDriversResponse>
  >(resolveRoute(ROUTES.getAvailableDispatchDrivers));
};

export const getDispatchSettings = async () => {
  return await getApiClient().get<
    ApiDispatchSettingsResponse,
    AxiosResponse<ApiDispatchSettingsResponse>
  >(resolveRoute(ROUTES.getDispatchSettings));
};
