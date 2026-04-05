import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiAllFleetCompaniesResponse,
  ApiFleetCompanyDetailResponse,
  ApiFleetCompanyKpiResponse,
  ApiFleetDocumentListResponse,
  FleetCompanyDriversPayload,
  FleetCompanyDriversPaginatedResponse,
  FleetCompanyListPayload,
  FleetCompanyPaginatedResponse,
} from '../../../../types';

export const getFleetCompaniesKpi = async () => {
  return await getApiClient().get<
    ApiFleetCompanyKpiResponse,
    AxiosResponse<ApiFleetCompanyKpiResponse>
  >(resolveRoute(ROUTES.getFleetCompaniesKpi));
};

export const getFleetCompanies = async (payload: FleetCompanyListPayload) => {
  return await getApiClient().get<
    FleetCompanyPaginatedResponse,
    AxiosResponse<FleetCompanyPaginatedResponse>
  >(resolveRoute(ROUTES.fleetCompanies), {
    params: {
      ...payload,
    },
  });
};

export const getAllFleetCompanies = async () => {
  return await getApiClient().get<
    ApiAllFleetCompaniesResponse,
    AxiosResponse<ApiAllFleetCompaniesResponse>
  >(resolveRoute(ROUTES.getAllFleetCompanies));
};

export const getFleetCompanyDetail = async (businessId: string) => {
  return await getApiClient().get<
    ApiFleetCompanyDetailResponse,
    AxiosResponse<ApiFleetCompanyDetailResponse>
  >(resolveRoute(ROUTES.fleetCompanyDetail, businessId));
};

export const getFleetCompanyDocuments = async (businessId: string) => {
  return await getApiClient().get<
    ApiFleetDocumentListResponse,
    AxiosResponse<ApiFleetDocumentListResponse>
  >(resolveRoute(ROUTES.fleetCompanyDocuments, businessId));
};

export const getFleetCompanyDrivers = async (
  payload: FleetCompanyDriversPayload
) => {
  const { businessId, ...rest } = payload;

  return await getApiClient().get<
    FleetCompanyDriversPaginatedResponse,
    AxiosResponse<FleetCompanyDriversPaginatedResponse>
  >(resolveRoute(ROUTES.fleetCompanyDrivers, businessId), {
    params: {
      ...rest,
    },
  });
};
