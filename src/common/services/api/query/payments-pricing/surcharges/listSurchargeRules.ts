import { getApiClient } from '../../../../..';
import { resolveRoute, ROUTES } from '../../../../..';
import { ApiSurchargeRuleListResponse } from '../../../../..';

export const listSurchargeRules = async () => {
  return await getApiClient().get<ApiSurchargeRuleListResponse>(
    resolveRoute(ROUTES.listSurchargeRules)
  );
};
