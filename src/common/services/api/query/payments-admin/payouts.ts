import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiPayoutKPIsResponse,
  ApiPayoutScheduleResponse,
  ApiEarningsBreakdownResponse,
  ApiMonthlyDistributionResponse,
  ApiPayoutsBySpecialtyResponse,
  ApiDriverEarningsListResponse,
  ApiPayoutDetailResponse,
  PayoutKpisQueryPayload,
  EarningsBreakdownQueryPayload,
  DriverEarningsListPayload,
} from '../../../../types';

export const getPayoutKpis = async (payload?: PayoutKpisQueryPayload) => {
  return await getApiClient().get<
    ApiPayoutKPIsResponse,
    AxiosResponse<ApiPayoutKPIsResponse>
  >(resolveRoute(ROUTES.getPayoutKpis), {
    params: { ...payload },
  });
};

export const getPayoutSchedule = async () => {
  return await getApiClient().get<
    ApiPayoutScheduleResponse,
    AxiosResponse<ApiPayoutScheduleResponse>
  >(resolveRoute(ROUTES.getPayoutSchedule));
};

export const getEarningsBreakdown = async (
  payload?: EarningsBreakdownQueryPayload
) => {
  return await getApiClient().get<
    ApiEarningsBreakdownResponse,
    AxiosResponse<ApiEarningsBreakdownResponse>
  >(resolveRoute(ROUTES.getEarningsBreakdown), {
    params: { ...payload },
  });
};

export const getMonthlyDistribution = async () => {
  return await getApiClient().get<
    ApiMonthlyDistributionResponse,
    AxiosResponse<ApiMonthlyDistributionResponse>
  >(resolveRoute(ROUTES.getMonthlyDistribution));
};

export const getPayoutsBySpecialty = async (
  payload?: PayoutKpisQueryPayload
) => {
  return await getApiClient().get<
    ApiPayoutsBySpecialtyResponse,
    AxiosResponse<ApiPayoutsBySpecialtyResponse>
  >(resolveRoute(ROUTES.getPayoutsBySpecialty), {
    params: { ...payload },
  });
};

export const getDriverEarningsList = async (
  payload: DriverEarningsListPayload
) => {
  return await getApiClient().get<
    ApiDriverEarningsListResponse,
    AxiosResponse<ApiDriverEarningsListResponse>
  >(resolveRoute(ROUTES.getDriverEarningsList), {
    params: { ...payload },
  });
};

export const getPayoutDetail = async (driverId: string) => {
  return await getApiClient().get<
    ApiPayoutDetailResponse,
    AxiosResponse<ApiPayoutDetailResponse>
  >(resolveRoute(ROUTES.getPayoutDetail, driverId));
};
