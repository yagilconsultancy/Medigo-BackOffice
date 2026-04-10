import { AxiosResponse } from 'axios';
import { getApiClient, resolveRoute, ROUTES } from '../../../../..';
import { ApiResponse, CommissionConfigUpdate } from '../../../../../types';

export const updateCommissionConfig = async (
  payload: CommissionConfigUpdate
) => {
  return await getApiClient().put<
    ApiResponse<null>,
    AxiosResponse<ApiResponse<null>>
  >(resolveRoute(ROUTES.updateCommissionConfig), payload);
};
