import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import { ApiActivityLogKPIsResponse } from '../../../../types';

export const getActivityAnalytics = async () => {
  return await getApiClient().get<
    ApiActivityLogKPIsResponse,
    AxiosResponse<ApiActivityLogKPIsResponse>
  >(resolveRoute(ROUTES.getActivityKPI));
};
