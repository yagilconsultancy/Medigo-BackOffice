import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import { ApiResponse, ApiRateCardResponse } from '../../../../types';

export const getConfigKpis = async () => {
  return await getApiClient().get<
    ApiResponse<Record<string, any>>,
    AxiosResponse<ApiResponse<Record<string, any>>>
  >(resolveRoute(ROUTES.getConfigKpis));
};

export const getCurrentConfig = async () => {
  return await getApiClient().get<
    ApiRateCardResponse,
    AxiosResponse<ApiRateCardResponse>
  >(resolveRoute(ROUTES.getCurrentConfig));
};
