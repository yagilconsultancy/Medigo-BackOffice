import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiSurchargeRuleResponse,
  ApiResponse,
  SurchargeRuleCreate,
  SurchargeRuleUpdate,
} from '../../../../types';

export const createSurchargeRule = async (payload: SurchargeRuleCreate) => {
  return await getApiClient().post<
    ApiSurchargeRuleResponse,
    AxiosResponse<ApiSurchargeRuleResponse>
  >(resolveRoute(ROUTES.createSurchargeRule), payload);
};

export const updateSurchargeRule = async (
  ruleId: string,
  payload: SurchargeRuleUpdate
) => {
  return await getApiClient().put<
    ApiSurchargeRuleResponse,
    AxiosResponse<ApiSurchargeRuleResponse>
  >(resolveRoute(ROUTES.updateSurchargeRule, ruleId), payload);
};

export const deleteSurchargeRule = async (ruleId: string) => {
  return await getApiClient().delete<
    ApiResponse<Record<string, any>>,
    AxiosResponse<ApiResponse<Record<string, any>>>
  >(resolveRoute(ROUTES.deleteSurchargeRule, ruleId));
};
