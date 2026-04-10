import {
  getApiClient,
  resolveRoute,
  ROUTES,
  ApiSurchargeRuleResponse,
  SurchargeRuleUpdate,
} from '../../../../..';

export const updateSurchargeRule = async (
  ruleId: string,
  payload: SurchargeRuleUpdate
) => {
  return await getApiClient().put<ApiSurchargeRuleResponse>(
    resolveRoute(ROUTES.updateSurchargeRule, ruleId),
    payload
  );
};
