import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../..';
import { getApiClient } from '../../../..';
import {
  ApiSurchargeKPIsResponse,
  ApiSurchargeRuleListResponse,
} from '../../../..';

export const getSurchargeKpis = async () => {
  return await getApiClient().get<
    ApiSurchargeKPIsResponse,
    AxiosResponse<ApiSurchargeKPIsResponse>
  >(resolveRoute(ROUTES.getSurchargeKpis));
};

export const listSurchargeRules = async () => {
  return await getApiClient().get<
    ApiSurchargeRuleListResponse,
    AxiosResponse<ApiSurchargeRuleListResponse>
  >(resolveRoute(ROUTES.listSurchargeRules));
};
