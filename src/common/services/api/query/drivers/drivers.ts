import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiAdminDriverDetailResponse,
  ApiAdminDriverDocumentOverviewResponse,
  ApiAdminDriverListResponse,
  ApiAdminDriverStatusOverviewResponse,
  ApiResponse,
  DriverDocumentOverviewPayload,
  DriverListPayload,
  DriverRatingsPayload,
  DriverTripsPayload,
} from '../../../../types';

export const getDriverDocumentOverview = async (
  payload: DriverDocumentOverviewPayload
) => {
  return await getApiClient().get<
    ApiAdminDriverDocumentOverviewResponse,
    AxiosResponse<ApiAdminDriverDocumentOverviewResponse>
  >(resolveRoute(ROUTES.getDriverDocumentOverview), {
    params: { ...payload },
  });
};

export const getDriverStatusOverview = async () => {
  return await getApiClient().get<
    ApiAdminDriverStatusOverviewResponse,
    AxiosResponse<ApiAdminDriverStatusOverviewResponse>
  >(resolveRoute(ROUTES.getDriverStatusOverview));
};

export const searchDrivers = async (payload: DriverListPayload) => {
  return await getApiClient().get<
    ApiAdminDriverListResponse,
    AxiosResponse<ApiAdminDriverListResponse>
  >(resolveRoute(ROUTES.searchDrivers), {
    params: { ...payload },
  });
};

export const getDriverDetail = async (driverId: string) => {
  return await getApiClient().get<
    ApiAdminDriverDetailResponse,
    AxiosResponse<ApiAdminDriverDetailResponse>
  >(resolveRoute(ROUTES.driverDetail, driverId));
};

export const getDriverDocuments = async (driverId: string) => {
  return await getApiClient().get<
    ApiResponse<any>,
    AxiosResponse<ApiResponse<any>>
  >(resolveRoute(ROUTES.getDriverDocuments, driverId));
};

export const getDriverTrips = async (payload: DriverTripsPayload) => {
  const { driverId, ...rest } = payload;

  return await getApiClient().get<
    ApiResponse<any>,
    AxiosResponse<ApiResponse<any>>
  >(resolveRoute(ROUTES.getDriverTrips, driverId), {
    params: { ...rest },
  });
};

export const getDriverRatings = async (payload: DriverRatingsPayload) => {
  const { driverId, ...rest } = payload;

  return await getApiClient().get<
    ApiResponse<any>,
    AxiosResponse<ApiResponse<any>>
  >(resolveRoute(ROUTES.getDriverRatings, driverId), {
    params: { ...rest },
  });
};
