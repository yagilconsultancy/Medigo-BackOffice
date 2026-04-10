import {
  getApiClient,
  resolveRoute,
  ROUTES,
  ApiSurchargeRuleResponse,
  SurchargeRuleCreate,
} from '../../../../..';

export const createSurchargeRule = async (data: SurchargeRuleCreate) => {
  return await getApiClient().post<ApiSurchargeRuleResponse>(
    resolveRoute(ROUTES.createSurchargeRule),
    data
  );
};
