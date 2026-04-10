import { AxiosResponse } from 'axios';
import { getApiClient, resolveRoute, ROUTES } from '../../../../..';
import { ApiCommissionConfigResponse } from '../../../../..';

export const getCommissionConfig = async () => {
  return await getApiClient().get<
    ApiCommissionConfigResponse,
    AxiosResponse<ApiCommissionConfigResponse>
  >(resolveRoute(ROUTES.getCommissionConfig));
};
