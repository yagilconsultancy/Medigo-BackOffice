import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  ApiSurchargeRuleResponse,
  SurchargeRuleUpdate,
} from '../../../../types';

export const updateSurchargeRule = async (payload: {
  ruleId: string;
  data: SurchargeRuleUpdate;
}) => {
  return await getApiClient().put<ApiSurchargeRuleResponse>(
    resolveRoute(ROUTES.updateSurchargeRule, payload.ruleId),
    payload.data
  );
};
