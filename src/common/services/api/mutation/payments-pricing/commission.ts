import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../..';
import { getApiClient } from '../../../..';
import {
  ApiCommissionConfigResponse,
  CommissionConfigUpdate,
} from '../../../..';

export const updateCommissionConfig = async (
  payload: CommissionConfigUpdate
) => {
  return await getApiClient().put<
    ApiCommissionConfigResponse,
    AxiosResponse<ApiCommissionConfigResponse>
  >(resolveRoute(ROUTES.updateCommissionConfig), payload);
};
