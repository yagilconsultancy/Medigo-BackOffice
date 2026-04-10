import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../..';
import { getApiClient } from '../../../..';
import { ApiResponse, ApiRateCardResponse } from '../../../..';

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
