import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiCommissionConfigResponse,
  CommissionConfigUpdate,
} from '../../../../types';

export const updateCommissionConfig = async (
  payload: CommissionConfigUpdate
) => {
  return await getApiClient().put<
    ApiCommissionConfigResponse,
    AxiosResponse<ApiCommissionConfigResponse>
  >(resolveRoute(ROUTES.updateCommissionConfig), payload);
};
