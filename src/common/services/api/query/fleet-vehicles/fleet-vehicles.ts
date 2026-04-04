import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiVehicleCategoryListResponse,
  ApiVehicleCompositionResponse,
  ApiVehicleDetailResponse,
  ApiVehicleDocumentListResponse,
  ApiVehicleDocumentOverviewResponse,
  ApiVehicleKpiResponse,
  FleetVehicleDocumentOverviewPayload,
  FleetVehicleListPayload,
  FleetVehicleProfilesPaginatedResponse,
  FleetVehiclePaginatedResponse,
} from '../../../../types';

export const getFleetVehicleKpi = async () => {
  return await getApiClient().get<
    ApiVehicleKpiResponse,
    AxiosResponse<ApiVehicleKpiResponse>
  >(resolveRoute(ROUTES.getFleetVehicleKpi));
};

export const getFleetVehicleDocumentOverview = async (
  payload: FleetVehicleDocumentOverviewPayload
) => {
  return await getApiClient().get<
    ApiVehicleDocumentOverviewResponse,
    AxiosResponse<ApiVehicleDocumentOverviewResponse>
  >(resolveRoute(ROUTES.getFleetVehicle), {
    params: { ...payload },
  });
};

export const getFleetCategories = async () => {
  return await getApiClient().get<
    ApiVehicleCategoryListResponse,
    AxiosResponse<ApiVehicleCategoryListResponse>
  >(resolveRoute(ROUTES.getFleetCategories));
};

export const getFleetComposition = async () => {
  return await getApiClient().get<
    ApiVehicleCompositionResponse,
    AxiosResponse<ApiVehicleCompositionResponse>
  >(resolveRoute(ROUTES.getFleetCompisition));
};

export const getFleetProfiles = async (payload: FleetVehicleListPayload) => {
  return await getApiClient().get<
    FleetVehicleProfilesPaginatedResponse,
    AxiosResponse<FleetVehicleProfilesPaginatedResponse>
  >(resolveRoute(ROUTES.getFleetProfiles), {
    params: { ...payload },
  });
};

export const getFleetVehicles = async (payload: FleetVehicleListPayload) => {
  return await getApiClient().get<
    FleetVehiclePaginatedResponse,
    AxiosResponse<FleetVehiclePaginatedResponse>
  >(resolveRoute(ROUTES.fleetVehicles), {
    params: { ...payload },
  });
};

export const getFleetVehicleById = async (vehicleId: string) => {
  return await getApiClient().get<
    ApiVehicleDetailResponse,
    AxiosResponse<ApiVehicleDetailResponse>
  >(resolveRoute(ROUTES.fleetVehiclesId, vehicleId));
};

export const getFleetVehicleDocuments = async (vehicleId: string) => {
  return await getApiClient().get<
    ApiVehicleDocumentListResponse,
    AxiosResponse<ApiVehicleDocumentListResponse>
  >(resolveRoute(ROUTES.getFleetVehicleDocuments, vehicleId));
};
