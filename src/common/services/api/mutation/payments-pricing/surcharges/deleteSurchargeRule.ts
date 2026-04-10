import {
  getApiClient,
  resolveRoute,
  ROUTES,
  ApiResponse,
} from '../../../../..';

export const deleteSurchargeRule = async (ruleId: string) => {
  return await getApiClient().delete<ApiResponse<null>>(
    resolveRoute(ROUTES.deleteSurchargeRule, ruleId)
  );
};
