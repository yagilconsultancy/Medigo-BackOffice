import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiFleetApplicationDetailResponse,
  ApiFleetApplicationKPIsResponse,
  FleetApplicationListPayload,
  FleetApplicationPaginatedResponse,
} from '../../../../types';

export const getFleetApplicationsKpi = async () => {
  return await getApiClient().get<
    ApiFleetApplicationKPIsResponse,
    AxiosResponse<ApiFleetApplicationKPIsResponse>
  >(resolveRoute(ROUTES.getFleetApplicationsKpi));
};

export const getFleetApplications = async (
  payload: FleetApplicationListPayload
) => {
  return await getApiClient().get<
    FleetApplicationPaginatedResponse,
    AxiosResponse<FleetApplicationPaginatedResponse>
  >(resolveRoute(ROUTES.fleetApplications), {
    params: {
      ...payload,
    },
  });
};

export const getFleetApplicationById = async (appId: string) => {
  return await getApiClient().get<
    ApiFleetApplicationDetailResponse,
    AxiosResponse<ApiFleetApplicationDetailResponse>
  >(resolveRoute(ROUTES.getFleetApplicationId, appId));
};
