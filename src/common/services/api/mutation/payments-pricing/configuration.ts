import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import { ApiRateCardResponse, CreateRateCardRequest } from '../../../../types';

export const saveConfiguration = async (payload: CreateRateCardRequest) => {
  return await getApiClient().put<
    ApiRateCardResponse,
    AxiosResponse<ApiRateCardResponse>
  >(resolveRoute(ROUTES.saveConfiguration), payload);
};
