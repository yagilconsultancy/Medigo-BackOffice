import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  ApiSurchargeRuleResponse,
  SurchargeRuleCreate,
} from '../../../../types';

export const createSurchargeRule = async (data: SurchargeRuleCreate) => {
  return await getApiClient().post<ApiSurchargeRuleResponse>(
    resolveRoute(ROUTES.createSurchargeRule),
    data
  );
};
