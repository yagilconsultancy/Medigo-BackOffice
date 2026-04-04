import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiFleetEarningsKpiResponse,
  ApiFleetEarningsTrendResponse,
  FleetEarningsBreakdownPayload,
  FleetEarningsBreakdownPaginatedResponse,
  FleetEarningsKpiPayload,
  FleetEarningsTrendPayload,
} from '../../../../types';

export const getFleetEarningsKpi = async (payload: FleetEarningsKpiPayload) => {
  return await getApiClient().get<
    ApiFleetEarningsKpiResponse,
    AxiosResponse<ApiFleetEarningsKpiResponse>
  >(resolveRoute(ROUTES.getFleetEarningsKpi), {
    params: { ...payload },
  });
};

export const getFleetEarningsTrend = async (
  payload: FleetEarningsTrendPayload
) => {
  return await getApiClient().get<
    ApiFleetEarningsTrendResponse,
    AxiosResponse<ApiFleetEarningsTrendResponse>
  >(resolveRoute(ROUTES.getFleetEarningsTrend), {
    params: { ...payload },
  });
};

export const getFleetEarningsBreakdown = async (
  payload: FleetEarningsBreakdownPayload
) => {
  return await getApiClient().get<
    FleetEarningsBreakdownPaginatedResponse,
    AxiosResponse<FleetEarningsBreakdownPaginatedResponse>
  >(resolveRoute(ROUTES.getFleetEarningsBreakdown), {
    params: { ...payload },
  });
};
