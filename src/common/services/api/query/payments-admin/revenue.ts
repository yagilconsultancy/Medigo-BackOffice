import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiRevenueKPIsResponse,
  ApiRevenueTrendResponse,
  ApiRevenueByRideTypeResponse,
  ApiRevenueByCityResponse,
  ApiRevenueDistributionResponse,
  RevenueQueryPayload,
} from '../../../../types';

export const getRevenueKpis = async (payload?: RevenueQueryPayload) => {
  return await getApiClient().get<
    ApiRevenueKPIsResponse,
    AxiosResponse<ApiRevenueKPIsResponse>
  >(resolveRoute(ROUTES.getRevenueKpis), {
    params: { ...payload },
  });
};

export const getRevenueTrend = async (payload?: RevenueQueryPayload) => {
  return await getApiClient().get<
    ApiRevenueTrendResponse,
    AxiosResponse<ApiRevenueTrendResponse>
  >(resolveRoute(ROUTES.getRevenueTrend), {
    params: { ...payload },
  });
};

export const getRevenueByRideType = async (payload?: RevenueQueryPayload) => {
  return await getApiClient().get<
    ApiRevenueByRideTypeResponse,
    AxiosResponse<ApiRevenueByRideTypeResponse>
  >(resolveRoute(ROUTES.getRevenueByRideType), {
    params: { ...payload },
  });
};

export const getRevenueByCity = async (payload?: RevenueQueryPayload) => {
  return await getApiClient().get<
    ApiRevenueByCityResponse,
    AxiosResponse<ApiRevenueByCityResponse>
  >(resolveRoute(ROUTES.getRevenueByCity), {
    params: { ...payload },
  });
};

export const getRevenueDistribution = async (payload?: RevenueQueryPayload) => {
  return await getApiClient().get<
    ApiRevenueDistributionResponse,
    AxiosResponse<ApiRevenueDistributionResponse>
  >(resolveRoute(ROUTES.getRevenueDistribution), {
    params: { ...payload },
  });
};
