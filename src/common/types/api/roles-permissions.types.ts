import { ApiResponse } from './common';

// ─── Response Types ─────────────────────────────────────────────────────────

export interface AdminRoleCardResponse {
  id: string;
  name: string;
  display_name: string;
  color?: string | null;
  admin_count: number;
  total_modules: number;
}

export interface AdminRoleResponse {
  id: string;
  name: string;
  display_name: string;
  description?: string | null;
  color?: string | null;
  is_system: boolean;
  admin_count: number;
  created_at: string;
}

export interface AdminRoleDetailResponse {
  id: string;
  name: string;
  display_name: string;
  description?: string | null;
  color?: string | null;
  is_system: boolean;
  admin_count: number;
  created_at: string;
  admins: Record<string, any>[];
}

export interface PermissionMatrixRow {
  module_name: string;
  module_display_name: string;
  category: string;
}

export interface PermissionMatrixResponse {
  roles: AdminRoleResponse[];
  modules: PermissionMatrixRow[];
  permissions: Record<string, Record<string, boolean>>;
}

export interface UserRoleInfo {
  id: string;
  name: string;
  display_name: string;
}

export interface UserPermissionsResponse {
  user: Record<string, any>;
  roles: UserRoleInfo[];
  accessible_modules: string[];
}

// ─── API Response Wrappers ──────────────────────────────────────────────────

export type ApiAdminRoleListResponse = ApiResponse<AdminRoleCardResponse[]>;
export type ApiAdminRoleDetailResponse = ApiResponse<AdminRoleDetailResponse>;
export type ApiPermissionMatrixResponse = ApiResponse<PermissionMatrixResponse>;
export type ApiUserPermissionsResponse = ApiResponse<UserPermissionsResponse>;

// ─── Request Payloads ───────────────────────────────────────────────────────

export interface AdminRoleCreateRequest {
  name: string;
  display_name: string;
  description?: string | null;
  color?: string | null;
}

export interface AdminRoleUpdateRequest {
  display_name?: string | null;
  description?: string | null;
  color?: string | null;
}

export interface AssignRoleRequest {
  user_id: string;
  role_id: string;
}

export interface ModulePermissionUpdate {
  role_id: string;
  module_name: string;
  can_access: boolean;
}

// ─── Payloads with route params ─────────────────────────────────────────────

export interface UpdateAdminRolePayload extends AdminRoleUpdateRequest {
  roleId: string;
}

export interface DeleteAdminRolePayload {
  roleId: string;
}
