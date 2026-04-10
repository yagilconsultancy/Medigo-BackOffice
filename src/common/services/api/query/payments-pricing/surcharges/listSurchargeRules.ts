import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import { ApiSurchargeRuleListResponse } from '../../../../types';

export const listSurchargeRules = async () => {
  return await getApiClient().get<ApiSurchargeRuleListResponse>(
    resolveRoute(ROUTES.listSurchargeRules)
  );
};
