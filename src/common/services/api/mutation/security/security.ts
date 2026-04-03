import { AxiosResponse } from "axios";
import { getApiClient } from "../../../../lib";
import { resolveRoute, ROUTES } from "../../../../constants";
import { ApiResponse, SecuritySettingsResponse, UpdateSecuritySettingsRequest } from "../../../../types";

export const updateSecurityData = async (payload: UpdateSecuritySettingsRequest) => {
  return await getApiClient().put<
    ApiResponse<SecuritySettingsResponse>,
    AxiosResponse<ApiResponse<SecuritySettingsResponse>>,
    UpdateSecuritySettingsRequest
  >(resolveRoute(ROUTES.SecurityData), payload);
};
