import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  ApiMaintenanceLogResponse,
  ApiVehicleCategoryResponse,
  ApiVehicleDocumentUploadResponse,
  ApiVehicleResponse,
  AssignDriverToVehiclePayload,
  ChangeVehicleStatusPayload,
  ReplaceVehicleDocumentPayload,
  ScheduleMaintenancePayload,
  UnassignDriverFromVehiclePayload,
  UpdateVehicleCategoryPayload,
  UpdateVehiclePayload,
  UploadVehicleDocumentPayload,
  VehicleCreate,
} from '../../../../types';

export const createFleetVehicle = async (payload: VehicleCreate) => {
  return await getApiClient().post<
    ApiVehicleResponse,
    AxiosResponse<ApiVehicleResponse>
  >(resolveRoute(ROUTES.fleetVehicles), payload);
};

export const updateFleetVehicle = async (payload: UpdateVehiclePayload) => {
  const { vehicleId, ...rest } = payload;

  return await getApiClient().put<
    ApiVehicleResponse,
    AxiosResponse<ApiVehicleResponse>
  >(resolveRoute(ROUTES.fleetVehiclesId, vehicleId), rest);
};

export const changeFleetVehicleStatus = async (
  payload: ChangeVehicleStatusPayload
) => {
  const { vehicleId, ...rest } = payload;

  return await getApiClient().put<
    ApiVehicleResponse,
    AxiosResponse<ApiVehicleResponse>
  >(resolveRoute(ROUTES.fleetVehicleStatus, vehicleId), rest);
};

export const assignDriverToVehicle = async (
  payload: AssignDriverToVehiclePayload
) => {
  const { vehicleId, ...rest } = payload;

  return await getApiClient().put<
    ApiVehicleResponse,
    AxiosResponse<ApiVehicleResponse>
  >(resolveRoute(ROUTES.fleetVehicleAssignDriver, vehicleId), rest);
};

export const unassignDriverFromVehicle = async (
  payload: UnassignDriverFromVehiclePayload
) => {
  return await getApiClient().put<
    ApiVehicleResponse,
    AxiosResponse<ApiVehicleResponse>
  >(resolveRoute(ROUTES.fleetVehicleUnAssignDriver, payload.vehicleId));
};

export const uploadVehicleDocument = async (
  payload: UploadVehicleDocumentPayload
) => {
  const { vehicleId, document_type, file, expires_at, notes } = payload;

  const data = new FormData();
  data.append('document_type', document_type);
  data.append('file', file);
  if (expires_at) data.append('expires_at', expires_at);
  if (notes) data.append('notes', notes);

  return await getApiClient().post<
    ApiVehicleDocumentUploadResponse,
    AxiosResponse<ApiVehicleDocumentUploadResponse>,
    FormData
  >(resolveRoute(ROUTES.getFleetVehicleDocuments, vehicleId), data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const replaceVehicleDocument = async (
  payload: ReplaceVehicleDocumentPayload
) => {
  const { vehicleId, docId, file, expires_at, notes } = payload;

  const data = new FormData();
  data.append('file', file);
  if (expires_at) data.append('expires_at', expires_at);
  if (notes) data.append('notes', notes);

  return await getApiClient().put<
    ApiVehicleDocumentUploadResponse,
    AxiosResponse<ApiVehicleDocumentUploadResponse>,
    FormData
  >(resolveRoute(ROUTES.fleetReplaceVehicleDocuments, vehicleId, docId), data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const scheduleVehicleMaintenance = async (
  payload: ScheduleMaintenancePayload
) => {
  const { vehicleId, ...rest } = payload;

  return await getApiClient().post<
    ApiMaintenanceLogResponse,
    AxiosResponse<ApiMaintenanceLogResponse>
  >(resolveRoute(ROUTES.fleetVehicleMaintenance, vehicleId), rest);
};

export const updateVehicleCategory = async (
  payload: UpdateVehicleCategoryPayload
) => {
  const { categoryId, ...rest } = payload;

  return await getApiClient().put<
    ApiVehicleCategoryResponse,
    AxiosResponse<ApiVehicleCategoryResponse>
  >(resolveRoute(ROUTES.fleetVehicleByCategory, categoryId), rest);
};
