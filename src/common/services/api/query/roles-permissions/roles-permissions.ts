import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiAdminRoleListResponse,
  ApiAdminRoleDetailResponse,
  ApiPermissionMatrixResponse,
  ApiUserPermissionsResponse,
} from '../../../../types';

export const listAdminRoles = async () => {
  return await getApiClient().get<
    ApiAdminRoleListResponse,
    AxiosResponse<ApiAdminRoleListResponse>
  >(resolveRoute(ROUTES.listAdminRoles));
};

export const getAdminRoleDetail = async (roleId: string) => {
  return await getApiClient().get<
    ApiAdminRoleDetailResponse,
    AxiosResponse<ApiAdminRoleDetailResponse>
  >(resolveRoute(ROUTES.getAdminRoleDetail, roleId));
};

export const getPermissionMatrix = async () => {
  return await getApiClient().get<
    ApiPermissionMatrixResponse,
    AxiosResponse<ApiPermissionMatrixResponse>
  >(resolveRoute(ROUTES.getPermissionMatrix));
};

export const getMyPermissions = async () => {
  return await getApiClient().get<
    ApiUserPermissionsResponse,
    AxiosResponse<ApiUserPermissionsResponse>
  >(resolveRoute(ROUTES.getMyPermissions));
};
