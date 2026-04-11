import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiResponse,
  AdminRoleCreateRequest,
  UpdateAdminRolePayload,
  DeleteAdminRolePayload,
  AssignRoleRequest,
  ModulePermissionUpdate,
} from '../../../../types';

export const createAdminRole = async (payload: AdminRoleCreateRequest) => {
  return await getApiClient().post<
    ApiResponse<Record<string, any>>,
    AxiosResponse<ApiResponse<Record<string, any>>>
  >(resolveRoute(ROUTES.createAdminRole), payload);
};

export const updateAdminRole = async (payload: UpdateAdminRolePayload) => {
  const { roleId, ...rest } = payload;
  return await getApiClient().put<
    ApiResponse<Record<string, any>>,
    AxiosResponse<ApiResponse<Record<string, any>>>
  >(resolveRoute(ROUTES.updateAdminRole, roleId), rest);
};

export const deleteAdminRole = async (payload: DeleteAdminRolePayload) => {
  const { roleId } = payload;
  return await getApiClient().delete<
    ApiResponse<null>,
    AxiosResponse<ApiResponse<null>>
  >(resolveRoute(ROUTES.deleteAdminRole, roleId));
};

export const assignRole = async (payload: AssignRoleRequest) => {
  return await getApiClient().post<
    ApiResponse<Record<string, any>>,
    AxiosResponse<ApiResponse<Record<string, any>>>
  >(resolveRoute(ROUTES.assignRole), payload);
};

export const removeRole = async (payload: AssignRoleRequest) => {
  return await getApiClient().post<
    ApiResponse<null>,
    AxiosResponse<ApiResponse<null>>
  >(resolveRoute(ROUTES.removeRole), payload);
};

export const savePermissions = async (
  permissions: ModulePermissionUpdate[]
) => {
  return await getApiClient().post<
    ApiResponse<null>,
    AxiosResponse<ApiResponse<null>>
  >(resolveRoute(ROUTES.savePermissions), permissions);
};
