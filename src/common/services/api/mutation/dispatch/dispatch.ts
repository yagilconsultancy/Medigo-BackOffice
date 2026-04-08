import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ManualAssignmentRequest,
  UpdateAutoDispatchSettingsRequest,
  ApiDispatchSettingsResponse,
  ApiTriggerAutoDispatchResponse,
  ApiResponse,
} from '../../../../types';

export const manuallyAssignDriver = async (
  payload: { rideId: string } & ManualAssignmentRequest
) => {
  const { rideId, ...body } = payload;

  return await getApiClient().post<ApiResponse, AxiosResponse<ApiResponse>>(
    resolveRoute(ROUTES.manuallyAssignDriver, rideId),
    body
  );
};

export const updateDispatchSettings = async (
  payload: UpdateAutoDispatchSettingsRequest
) => {
  return await getApiClient().put<
    ApiDispatchSettingsResponse,
    AxiosResponse<ApiDispatchSettingsResponse>
  >(resolveRoute(ROUTES.updateDispatchSettings), payload);
};

export const triggerAutoDispatch = async () => {
  return await getApiClient().post<
    ApiTriggerAutoDispatchResponse,
    AxiosResponse<ApiTriggerAutoDispatchResponse>
  >(resolveRoute(ROUTES.triggerAutoDispatch));
};
