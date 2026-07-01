import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  ApiAdminDriverDetailResponse,
  ApiResponse,
  ApproveDriverPayload,
  CreateDriverPayload,
  DeactivateDriverPayload,
  ReactivateDriverPayload,
  ReassignDriverFleetPayload,
  ResendDriverInvitePayload,
  ResendDriverReactivationPayload,
  SuspendDriverPayload,
  UpdateDriverPayload,
} from '../../../../types';

export const approveDriver = async (payload: ApproveDriverPayload) => {
  const { driverId } = payload;

  return await getApiClient().put<
    ApiAdminDriverDetailResponse,
    AxiosResponse<ApiAdminDriverDetailResponse>
  >(resolveRoute(ROUTES.approveDriver, driverId));
};

export const suspendDriver = async (payload: SuspendDriverPayload) => {
  const { driverId, ...rest } = payload;

  return await getApiClient().put<
    ApiAdminDriverDetailResponse,
    AxiosResponse<ApiAdminDriverDetailResponse>
  >(resolveRoute(ROUTES.suspendDriver, driverId), rest);
};

export const reactivateDriver = async (payload: ReactivateDriverPayload) => {
  const { driverId } = payload;

  return await getApiClient().put<
    ApiAdminDriverDetailResponse,
    AxiosResponse<ApiAdminDriverDetailResponse>
  >(resolveRoute(ROUTES.reactivateDriver, driverId));
};

export const resendDriverInvite = async (
  payload: ResendDriverInvitePayload
) => {
  const { driverId } = payload;

  return await getApiClient().post<
    ApiResponse<any>,
    AxiosResponse<ApiResponse<any>>
  >(resolveRoute(ROUTES.resendDriverInvite, driverId));
};

export const resendDriverReactivation = async (
  payload: ResendDriverReactivationPayload
) => {
  const { driverId } = payload;

  return await getApiClient().post<
    ApiResponse<any>,
    AxiosResponse<ApiResponse<any>>
  >(resolveRoute(ROUTES.resendDriverReactivation, driverId));
};

export const reAssignDriver = async (payload: ReassignDriverFleetPayload) => {
  const { driverId, ...rest } = payload;

  return await getApiClient().put<
    ApiAdminDriverDetailResponse,
    AxiosResponse<ApiAdminDriverDetailResponse>
  >(resolveRoute(ROUTES.reAssignDriver, driverId), rest);
};

export const createDriver = async (payload: CreateDriverPayload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  return await getApiClient().post<
    ApiAdminDriverDetailResponse,
    AxiosResponse<ApiAdminDriverDetailResponse>
  >(resolveRoute(ROUTES.searchDrivers), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateDriver = async (payload: UpdateDriverPayload) => {
  const { driverId, ...rest } = payload;

  return await getApiClient().put<
    ApiAdminDriverDetailResponse,
    AxiosResponse<ApiAdminDriverDetailResponse>
  >(resolveRoute(ROUTES.driverDetail, driverId), rest);
};

export const deactivateDriver = async (payload: DeactivateDriverPayload) => {
  const { driverId } = payload;

  return await getApiClient().delete<
    ApiAdminDriverDetailResponse,
    AxiosResponse<ApiAdminDriverDetailResponse>
  >(resolveRoute(ROUTES.driverDetail, driverId));
};
