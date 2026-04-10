import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../..';
import { getApiClient } from '../../../..';
import { ApiRateCardResponse, CreateRateCardRequest } from '../../../..';

export const saveConfiguration = async (payload: CreateRateCardRequest) => {
  return await getApiClient().put<
    ApiRateCardResponse,
    AxiosResponse<ApiRateCardResponse>
  >(resolveRoute(ROUTES.saveConfiguration), payload);
};
