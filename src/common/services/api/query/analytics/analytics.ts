import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  DashboardKPIsResponse,
  RecentActivityParams,
  RecentActivityResponseWrapped,
  TopDriversParams,
  TopDriversResponseWrapped,
  TopFleetPartnersParams,
  TopFleetPartnersResponseWrapped,
  TransportDistributionParams,
  TransportDistributionResponseWrapped,
  TripStatusDistributionResponseWrapped,
  TripVolumeTrendParams,
  TripVolumeTrendResponseWrapped,
} from '../../../../types';

export const getDashboardOverview = async () => {
  return await getApiClient().get<
    DashboardKPIsResponse,
    AxiosResponse<DashboardKPIsResponse>
  >(resolveRoute(ROUTES.getDashboardOverview));
};

export const getTripVolumeTrend = async (params?: TripVolumeTrendParams) => {
  return await getApiClient().get<
    TripVolumeTrendResponseWrapped,
    AxiosResponse<TripVolumeTrendResponseWrapped>
  >(resolveRoute(ROUTES.getTripVolumeTrend), {
    ...(params && { params }),
  });
};

export const getTripStatusDistribution = async () => {
  return await getApiClient().get<
    TripStatusDistributionResponseWrapped,
    AxiosResponse<TripStatusDistributionResponseWrapped>
  >(resolveRoute(ROUTES.getTripStatusDistribution));
};

export const getTopDrivers = async (params?: TopDriversParams) => {
  return await getApiClient().get<
    TopDriversResponseWrapped,
    AxiosResponse<TopDriversResponseWrapped>
  >(resolveRoute(ROUTES.getTopDrivers), {
    ...(params && { params }),
  });
};

export const getRecentActivity = async (params?: RecentActivityParams) => {
  return await getApiClient().get<
    RecentActivityResponseWrapped,
    AxiosResponse<RecentActivityResponseWrapped>
  >(resolveRoute(ROUTES.getRecentActivity), {
    ...(params && { params }),
  });
};

export const getTransportDistribution = async (
  params?: TransportDistributionParams
) => {
  return await getApiClient().get<
    TransportDistributionResponseWrapped,
    AxiosResponse<TransportDistributionResponseWrapped>
  >(resolveRoute(ROUTES.getTransportDistribution), {
    ...(params && { params }),
  });
};

export const getTopFleetPartners = async (
  params?: TopFleetPartnersParams
) => {
  return await getApiClient().get<
    TopFleetPartnersResponseWrapped,
    AxiosResponse<TopFleetPartnersResponseWrapped>
  >(resolveRoute(ROUTES.getTopFleetPartners), {
    ...(params && { params }),
  });
};
