import { AxiosResponse } from "axios";
import { resolveRoute, ROUTES } from "../../../../constants";
import { getApiClient } from "../../../../lib";
import { ApiResponse, SecurityKPIs, SecuritySettingsResponse } from "../../../../types";

export const getSecurityKpi = async () => {
  return await getApiClient().get<
    ApiResponse<SecurityKPIs>,
    AxiosResponse<ApiResponse<SecurityKPIs>>
  >(resolveRoute(ROUTES.getSecurityKpi));
};

export const getSecurityData = async () => {
  return await getApiClient().get<
    ApiResponse<SecuritySettingsResponse>,
    AxiosResponse<ApiResponse<SecuritySettingsResponse>>
  >(resolveRoute(ROUTES.getSecurityData));
};
