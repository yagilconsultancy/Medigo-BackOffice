import { AxiosResponse } from "axios";
import { resolveRoute, ROUTES } from "../../../../constants";
import { getApiClient } from "../../../../lib";
import { ActivityLogListPayload, ApiActivityLogListResponse } from "../../../../types";

export const getActivityList = async (payload: ActivityLogListPayload) => {

  return await getApiClient().get<
    ApiActivityLogListResponse,
    AxiosResponse<ApiActivityLogListResponse>
  >(resolveRoute(ROUTES.getActivityList), {
    params: {
      ...payload,
    },
  });
};

export const getExportActivity = async (payload: ActivityLogListPayload) => {
  return await getApiClient().get<
    Blob,
    AxiosResponse<Blob>
  >(resolveRoute(ROUTES.getExportActivity), {
    params: { ...payload },
    responseType: 'blob',
  });
};
