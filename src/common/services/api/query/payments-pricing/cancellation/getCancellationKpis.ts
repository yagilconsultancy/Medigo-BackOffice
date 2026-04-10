import { AxiosResponse } from 'axios';
import { getApiClient, resolveRoute, ROUTES } from '../../../../..';
import { ApiCancellationKPIsResponse } from '../../../../../types';

export const getCancellationKpis = async () => {
  return await getApiClient().get<
    ApiCancellationKPIsResponse,
    AxiosResponse<ApiCancellationKPIsResponse>
  >(resolveRoute(ROUTES.getCancellationKpis));
};
