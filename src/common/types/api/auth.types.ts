import { ApiResponse } from './common';

// ====================== ACTIVITY LOGS ======================
export interface ActivityLogItem {
  id: string; // uuid
  action_title: string;
  action_description: string;
  category: string;
  severity: string;
  admin_name: string;
  created_at: string; // date-time
}

export interface ActivityLogKPIs {
  total_logs?: number;
  info?: number;
  warnings?: number;
  critical?: number;
}
export type ApiActivityLogKPIsResponse = ApiResponse<ActivityLogKPIs>;

export interface ActivityLogList {
  items: ActivityLogItem[];
  total: number;
  page: number;
  page_size: number;
}
export type ApiActivityLogListResponse = ApiResponse<ActivityLogList>;

export interface ActivityLogListPayload {
  severity: 'all' | 'info' | 'warning' | 'critical';
  search: string;
  page: number;
  page_size: number;
}

export interface CreateActivityLogRequest {
  admin_id: string; // uuid
  admin_name: string;
  admin_email: string;
  action_title: string;
  action_description: string;
  category: string;
  severity?: string; // default: "info"
  target_entity_id?: string | null;
  target_entity_type?: string | null;
}

// ====================== SESSIONS ======================
export interface SessionResponse {
  id: string; // uuid
  device_name: string;
  device_type: string;
  ip_address?: string | null;
  last_active_at: string; // date-time
  is_active: boolean;
  created_at: string; // date-time
}

// ====================== SECURITY & AUTH ======================
export interface ApiLoginPayload {
  email?: string | null; // email format
  phone?: string | null;
  password: string;
}

export interface ApiLogoutResponse {
  success: boolean;
  message?: string;
  data?: null;
}
export type ApiLogoutApiResponse = ApiResponse<ApiLogoutResponse>;

export interface ApiLoginRefreshRequest {
  refresh_token: string;
}

export type ApiLoginRefreshResponse = ApiResponse<LoginResponse>;

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type?: string; // default: "bearer"
  expires_in: number;
}

export type ApiLoginResponse = ApiResponse<LoginResponse>;

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string; // minLength: 8, maxLength: 128
}

export type ApiChangePasswordPayload = ChangePasswordRequest;
export type ApiChangePasswordResponse = ApiResponse<null>;

export interface ForgotPasswordRequest {
  email?: string | null; // email format
  phone?: string | null;
}

export interface ForgotPasswordResponse {
  user_id: string;
  message?: string;
}

export type ApiForgotPasswordPayload = Pick<ForgotPasswordRequest, 'email'>;
export type ApiForgotPasswordResponse = ApiResponse<ForgotPasswordResponse>;

export interface ResetPasswordRequest {
  user_id: string;
  code: string;
  new_password: string; // minLength: 8, maxLength: 128
}

export type ApiResetPasswordPayload = ResetPasswordRequest;
export type ApiResetPasswordResponse = ApiResponse<null>;

export interface ResendOtpRequest {
  user_id: string; // uuid
  purpose?: string; // default: "registration"
}

export type ApiResendOtpPayload = ResendOtpRequest;
export type ApiResendOtpResponse = ApiResponse<null>;

export interface VerifyOTPRequest {
  user_id: string; // uuid
  code: string; // exactly 6 characters
  purpose?: string; // default: "registration"
}

export interface OTPVerifyResponse {
  verified?: boolean; // default: true
  message?: string; // default: "Account verified successfully"
}

export interface RegisterRequest {
  email?: string | null;
  phone?: string | null;
  password: string; // minLength: 8, maxLength: 128
  role?: UserRole; // default: "rider"
}

export interface RegisterResponse {
  user_id: string; // uuid
  message?: string; // default: "Registration successful. Please verify your account."
}

export interface DriverRegisterRequest {
  invite_token: string;
  password: string; // minLength: 8, maxLength: 128
}

export interface DriverVerifyInviteRequest {
  invite_token: string;
}

export interface InviteVerifyResponse {
  valid: boolean;
  fleet_name?: string | null;
  email?: string | null;
}

// ====================== SECURITY SETTINGS ======================
export interface SecurityKPIs {
  two_fa_enabled_count?: number;
  total_admin_count?: number;
  password_policy?: string;
  session_timeout_hours?: number;
  threats_blocked?: number;
}

export interface SecuritySettingsResponse {
  two_factor_enabled?: boolean;
  ip_geo_blocking_enabled?: boolean;
  ip_whitelist_enabled?: boolean;
  audit_logging_enabled?: boolean;
  session_timeout_hours?: number;
  min_password_length?: number;
  require_uppercase?: boolean;
  require_lowercase?: boolean;
  require_numbers?: boolean;
  require_special_chars?: boolean;
  whitelisted_ips?: Record<string, any> | null;
  two_fa_enabled_count?: number;
  total_admin_count?: number;
  threats_blocked?: number;
}

export interface UpdateSecuritySettingsRequest {
  two_factor_enabled?: boolean | null;
  ip_geo_blocking_enabled?: boolean | null;
  ip_whitelist_enabled?: boolean | null;
  audit_logging_enabled?: boolean | null;
  session_timeout_hours?: number | null;
  min_password_length?: number | null;
  require_uppercase?: boolean | null;
  require_lowercase?: boolean | null;
  require_numbers?: boolean | null;
  require_special_chars?: boolean | null;
  whitelisted_ips?: Record<string, any> | null;
}

// ====================== LOGIN HISTORY ======================
export interface LoginRecordItem {
  id: string; // uuid
  admin_name: string;
  admin_email: string;
  ip_address: string;
  device_info: string;
  location?: string | null;
  success: boolean;
  failure_reason?: string | null;
  is_suspicious?: boolean;
  created_at: string; // date-time
}

export interface LoginHistoryKPIs {
  total_logins?: number;
  successful?: number;
  failed_attempts?: number;
  unique_locations?: number;
}

export interface LoginHistoryListPayload {
  status: 'all' | 'success' | 'failed';
  search: string;
  page: number;
  page_size: number;
}

export interface LoginHistoryList {
  items: LoginRecordItem[];
  total: number;
  page: number;
  page_size: number;
}

export type ApiLoginHistoryListResponse = ApiResponse<LoginHistoryList>;

// ====================== COMMON TYPES ======================
export enum UserRole {
  admin = 'admin',
  business = 'business',
  driver = 'driver',
  rider = 'rider',
}
