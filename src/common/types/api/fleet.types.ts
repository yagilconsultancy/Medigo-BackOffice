import { ApiPaginatedResponseData, ApiResponse } from './common';

// Fleet Application Types
export interface FleetApplicationListPayload {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export type FleetApplicationPaginatedResponse =
  ApiPaginatedResponseData<FleetApplicationResponse>;

export type ApiFleetApplicationDetailResponse =
  ApiResponse<FleetApplicationResponse>;

export type ApiFleetApplicationKPIsResponse = ApiResponse<FleetApplicationKPIs>;

export type ApiFleetDocumentUploadResponse = ApiResponse<FleetDocumentResponse>;

// Mutation payloads
export interface ApproveFleetApplicationPayload {
  appId: string;
  notes?: string | null;
}

export interface RejectFleetApplicationPayload {
  appId: string;
  reason: string;
}

export interface RequestInfoFleetApplicationPayload {
  appId: string;
  message: string;
}

export interface UploadFleetApplicationDocumentPayload {
  appId: string;
  documentType: string;
  file: File;
}

export interface FleetApplicationCreate {
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  province?: string | null;
  fleet_size?: number;
  driver_count?: number;
  description?: string | null;
}

export interface FleetApplicationResponse {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  province?: string | null;
  fleet_size: number;
  driver_count: number;
  description?: string | null;
  status: string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  info_request_message?: string | null;
  business_id?: string | null;
  created_at: string;
  updated_at: string;
  documents: FleetDocumentResponse[];
}

export interface FleetApplicationKPIs {
  total_applications: number;
  pending_review: number;
  approved: number;
  rejected: number;
}

// Fleet Companies Types
export interface FleetCompanyResponse {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  logo_url: string;
  is_active: boolean;
  vehicle_count: number;
  driver_count: number;
  revenue: number;
  created_at: string;
}

export interface FleetCompanyDetailResponse {
  id: string;
  name: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  address?: string | null;
  logo_url?: string | null;
  is_active: boolean;
  vehicle_count: number;
  driver_count: number;
  total_revenue: number;
  avg_rating: number;
  documents: FleetDocumentResponse[];
  created_at: string;
  updated_at: string;
}

export interface FleetCompanyKPIs {
  total_fleets: number;
  active_fleets: number;
  total_fleet_vehicles: number;
  fleet_drivers: number;
}

export interface UpdateFleetProfileRequest {
  name?: string | null;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
}

// Fleet Vehicles Types
export interface VehicleResponse {
  id: string;
  business_id: string;
  driver_profile_id?: string | null;
  vehicle_name?: string | null;
  make: string;
  model: string;
  year: number;
  plate_number: string;
  color?: string | null;
  vin?: string | null;
  category: string;
  status: string;
  photo_url?: string | null;
  mileage?: number | null;
  insurance_expiry?: string | null;
  registration_expiry?: string | null;
  passenger_capacity?: number | null;
  special_equipment?: string[];
  insurance_provider?: string | null;
  registration_authority?: string | null;
  last_inspection_date?: string | null;
  internal_notes?: string | null;
  created_at: string;
  fleet_name?: string | null;
  driver_name?: string | null;
}

export interface VehicleDetailResponse {
  id: string;
  business_id: string;
  driver_profile_id?: string | null;
  vehicle_name?: string | null;
  make: string;
  model: string;
  year: number;
  plate_number: string;
  color?: string | null;
  vin?: string | null;
  category: string;
  status: string;
  photo_url?: string | null;
  mileage?: number | null;
  insurance_expiry?: string | null;
  registration_expiry?: string | null;
  passenger_capacity?: number | null;
  special_equipment?: string[];
  insurance_provider?: string | null;
  registration_authority?: string | null;
  last_inspection_date?: string | null;
  internal_notes?: string | null;
  created_at: string;
  fleet_name?: string | null;
  driver_name?: string | null;
  maintenance_logs: MaintenanceLogResponse[];
  documents: VehicleDocumentResponse[];
}

export interface VehicleCreate {
  business_id: string;
  driver_profile_id?: string | null;
  vehicle_name?: string | null;
  make: string;
  model: string;
  year: number;
  plate_number: string;
  color?: string | null;
  vin?: string | null;
  category: string;
  mileage?: number | null;
  insurance_expiry?: string | null;
  registration_expiry?: string | null;
  passenger_capacity?: number | null;
  special_equipment?: string[];
  insurance_provider?: string | null;
  registration_authority?: string | null;
  last_inspection_date?: string | null;
  internal_notes?: string | null;
  insurance_file?: File | null;
  registration_file?: File | null;
  inspection_file?: File | null;
}

export interface VehicleKPIs {
  total_vehicles: number;
  active: number;
  maintenance: number;
  inactive: number;
}

export interface VehicleDocumentResponse {
  id: string;
  vehicle_id: string;
  document_type: string;
  file_key: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  expires_at?: string | null;
  status: string;
  uploaded_by: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

// Fleet Earnings Types
export interface FleetEarningsKPIs {
  total_revenue: number;
  total_payouts: number;
  revenue_change_percent: number;
  payout_change_percent: number;
  revenue_trend: string;
  payout_trend: string;
}

export interface FleetEarningsBreakdownRow {
  fleet_id: string;
  fleet_name: string;
  trips: number;
  revenue: number;
  commission: number;
  net_earnings: number;
  avg_per_trip: number;
}

export interface FleetRevenueTrendPoint {
  date: string;
  revenue: number;
}

export interface FleetRevenueTrendResponse {
  period_days: number;
  trend: FleetRevenueTrendPoint[];
}

// Fleet Earnings — Payloads

export interface FleetEarningsKpiPayload {
  fleet_id?: string | null;
  days?: number;
}

export interface FleetEarningsTrendPayload {
  fleet_id?: string | null;
  days?: number;
}

export interface FleetEarningsBreakdownPayload {
  fleet_id?: string | null;
  days?: number;
  page?: number;
  limit?: number;
}

// Fleet Earnings — Wrapped Response Aliases

export type ApiFleetEarningsKpiResponse = ApiResponse<FleetEarningsKPIs>;
export type ApiFleetEarningsTrendResponse =
  ApiResponse<FleetRevenueTrendResponse>;
export type FleetEarningsBreakdownPaginatedResponse =
  ApiPaginatedResponseData<FleetEarningsBreakdownRow>;

// Admin Driver Management Types
export interface AdminDriverListItem {
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  fleet_id?: string | null;
  fleet_name?: string | null;
  account_status: string;
  is_online: boolean;
  is_approved: boolean;
  rating: number;
  total_trips: number;
  vehicle_type?: string | null;
  vehicle_make?: string | null;
  vehicle_model?: string | null;
  vehicle_year?: number | null;
  vehicle_plate?: string | null;
  specialty?: string | null;
  document_status?: string;
  created_at?: string | null;
}

export interface AdminDriverListResponse {
  kpis: AdminDriverKPIs;
  drivers: AdminDriverListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AdminDriverKPIs {
  total_drivers: number;
  active_count: number;
  suspended_count: number;
  pending_count: number;
  online_count: number;
  available_now?: number;
  on_trip?: number;
  total_mileage?: number;
  approval_rate: number;
}

export interface AdminDriverDetailResponse {
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  fleet_id?: string | null;
  fleet_name?: string | null;
  account_status: string;
  is_online: boolean;
  is_approved: boolean;
  rating: number;
  total_trips: number;
  specialty?: string | null;
  service_capabilities: string[];
  vehicle_type?: string | null;
  vehicle_make?: string | null;
  vehicle_model?: string | null;
  vehicle_year?: number | null;
  vehicle_plate?: string | null;
  vehicle_color?: string | null;
  vehicle_vin?: string | null;
  vehicle_photo_url?: string | null;
  license_number?: string | null;
  license_expiry?: string | null;
  medical_transport_certification?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  background_check_status?: string | null;
  suspension_reason?: string | null;
  suspended_at?: string | null;
  deactivated_at?: string | null;
  approved_at?: string | null;
  notes?: string | null;
  invited_via_email?: string | null;
  trip_stats: AdminDriverTripStats;
  documents: DriverDocumentSummary[];
  ratings: AdminDriverRatingItem[];
  suspension_history: SuspensionLogItem[];
  invite_token?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdminDriverTripStats {
  total_trips: number;
  hours_online: number;
  average_earnings: number;
}

// Admin Rider Management Types
export interface AdminRiderListItem {
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  joined_at?: string | null;
  total_trips: number;
  total_spent: number;
  frequency: string;
  open_tickets: number;
  status: string;
}

export interface AdminRiderListResponse {
  kpis: AdminRiderKPIs;
  riders: AdminRiderListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AdminRiderKPIs {
  total_riders: number;
  active_count: number;
  suspended_count: number;
  open_tickets: number;
}

export interface AdminRiderDetailResponse {
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  home_address?: string | null;
  medical_notes?: string | null;
  insurance_provider?: string | null;
  insurance_policy_number?: string | null;
  status: string;
  suspension_reason?: string | null;
  suspended_at?: string | null;
  created_at?: string | null;
  trip_stats: RiderTripStats;
  emergency_contacts: RiderEmergencyContactInfo[];
  payment_methods: RiderPaymentMethodInfo[];
}

export interface AdminRiderActivityResponse {
  kpis: AdminRiderActivityKPIs;
  riders: AdminRiderActivityItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AdminRiderActivityKPIs {
  daily_active_riders: number;
  avg_trips_per_week: number;
  inactive_30_days: number;
}

// Fleet Application (already mostly complete, but added missing if any)
export interface FleetDocumentResponse {
  id: string;
  document_type: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  verification_status: string;
  created_at: string;
}

// Fleet Companies — Response & Request Types

export interface FleetResponse {
  id: string;
  name: string;
  type?: string | null;
  tax_id?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  phone?: string | null;
  email?: string | null;
  logo_url?: string | null;
  is_active: boolean;
}

export interface AddFleetPartnerRequest {
  name: string;
  contact_person: string;
  email: string;
  city?: string | null;
  state?: string | null;
  num_vehicles?: number;
  num_drivers?: number;
}

export interface ToggleStatusRequest {
  is_active: boolean;
}

export interface DriverProfileResponse {
  user_id: string;
  business_id: string;
  license_number?: string | null;
  license_expiry?: string | null;
  vehicle_type?: string | null;
  vehicle_make?: string | null;
  vehicle_model?: string | null;
  vehicle_year?: number | null;
  vehicle_plate?: string | null;
  vehicle_color?: string | null;
  vehicle_vin?: string | null;
  vehicle_photo_url?: string | null;
  vehicle_verified: boolean;
  background_check_status: string;
  is_approved: boolean;
  is_online: boolean;
  rating: number;
  total_trips: number;
}

// Fleet Companies — Payloads (with route param bundled)

export interface FleetCompanyListPayload {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface FleetCompanyDriversPayload {
  businessId: string;
  page?: number;
  limit?: number;
}

export interface UpdateFleetCompanyPayload extends UpdateFleetProfileRequest {
  businessId: string;
}

export interface ToggleFleetCompanyStatusPayload {
  businessId: string;
  is_active: boolean;
}

export interface UploadFleetCompanyDocumentPayload {
  businessId: string;
  documentType: string;
  file: File;
}

// Fleet Companies — Wrapped Response Aliases

export type ApiFleetCompanyKpiResponse = ApiResponse<FleetCompanyKPIs>;
export type FleetCompanyPaginatedResponse =
  ApiPaginatedResponseData<FleetCompanyResponse>;
export type ApiFleetCompanyDetailResponse =
  ApiResponse<FleetCompanyDetailResponse>;
export type ApiAllFleetCompaniesResponse = ApiResponse<
  FleetCompanyDetailResponse[]
>;
export type ApiFleetResponse = ApiResponse<FleetResponse>;
export type ApiFleetDocumentListResponse = ApiResponse<FleetDocumentResponse[]>;
export type FleetCompanyDriversPaginatedResponse =
  ApiPaginatedResponseData<DriverProfileResponse>;

// Fleet Vehicles — Response Types

export interface VehicleDocumentKPIs {
  total_documents: number;
  valid_count: number;
  expiring_soon_count: number;
  expired_count: number;
}

export interface VehicleDocumentMatrixItem {
  document_type: string;
  status: string;
  file_name?: string | null;
  expires_at?: string | null;
  doc_id?: string | null;
}

export interface VehicleDocumentOverviewItem {
  vehicle_id: string;
  vehicle_name?: string | null;
  make: string;
  model: string;
  plate_number: string;
  fleet_name?: string | null;
  documents: VehicleDocumentMatrixItem[];
}

export interface VehicleDocumentOverview {
  kpis: VehicleDocumentKPIs;
  vehicles: VehicleDocumentOverviewItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface VehicleCategoryConfigResponse {
  id: string;
  category: string;
  display_name: string;
  base_fare: string;
  per_km_rate: string;
  requirements: string[];
  common_vehicles: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryBreakdownItem {
  category: string;
  display_name: string;
  count: number;
  percentage: number;
}

export interface VehicleCategoryFleetComposition {
  total_vehicles: number;
  breakdown: CategoryBreakdownItem[];
}

export interface VehicleProfileResponse extends VehicleDetailResponse {}

export interface VehicleDocumentUploadResponse {
  id: string;
  vehicle_id: string;
  document_type: string;
  file_name: string;
  status: string;
  expires_at?: string | null;
  created_at: string;
}

// Fleet Vehicles — Request Types

export interface VehicleUpdate {
  vehicle_name?: string | null;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  plate_number?: string | null;
  color?: string | null;
  vin?: string | null;
  category?: string | null;
  mileage?: number | null;
  insurance_expiry?: string | null;
  registration_expiry?: string | null;
  passenger_capacity?: number | null;
  special_equipment?: string[] | null;
  insurance_provider?: string | null;
  registration_authority?: string | null;
  last_inspection_date?: string | null;
  internal_notes?: string | null;
}

export interface VehicleCategoryConfigUpdate {
  display_name?: string | null;
  base_fare?: number | string | null;
  per_km_rate?: number | string | null;
  requirements?: string[] | null;
  common_vehicles?: string[] | null;
  is_active?: boolean | null;
}

export interface ChangeVehicleStatusRequest {
  status: string;
}

export interface AssignDriverToVehicleRequest {
  driver_id: string;
}

export interface ScheduleMaintenanceRequest {
  scheduled_date: string;
  service_type?: string | null;
  notes?: string | null;
  technician_notes?: string | null;
}

// Fleet Vehicles — Payloads (with route param bundled)

export interface FleetVehicleListPayload {
  page?: number;
  limit?: number;
  category?: string;
  fleet_id?: string;
  search?: string;
  status?: string;
}

export interface FleetVehicleDocumentOverviewPayload {
  page?: number;
  limit?: number;
}

export interface FleetVehicleProfilesPayload {
  page?: number;
  limit?: number;
  category?: string;
}

export interface UpdateVehiclePayload extends VehicleUpdate {
  vehicleId: string;
}

export interface ChangeVehicleStatusPayload {
  vehicleId: string;
  status: string;
}

export interface AssignDriverToVehiclePayload {
  vehicleId: string;
  driver_id: string;
}

export interface UnassignDriverFromVehiclePayload {
  vehicleId: string;
}

export interface UploadVehicleDocumentPayload {
  vehicleId: string;
  document_type: string;
  file: File;
  expires_at?: string | null;
  notes?: string | null;
}

export interface ReplaceVehicleDocumentPayload {
  vehicleId: string;
  docId: string;
  file: File;
  expires_at?: string | null;
  notes?: string | null;
}

export interface ScheduleMaintenancePayload extends ScheduleMaintenanceRequest {
  vehicleId: string;
}

export interface UpdateVehicleCategoryPayload extends VehicleCategoryConfigUpdate {
  categoryId: string;
}

// Fleet Vehicles — Wrapped Response Aliases

export type ApiVehicleKpiResponse = ApiResponse<VehicleKPIs>;
export type ApiVehicleDocumentOverviewResponse =
  ApiResponse<VehicleDocumentOverview>;
export type ApiVehicleCategoryListResponse = ApiResponse<
  VehicleCategoryConfigResponse[]
>;
export type ApiVehicleCompositionResponse =
  ApiResponse<VehicleCategoryFleetComposition>;
export type FleetVehiclePaginatedResponse =
  ApiPaginatedResponseData<VehicleResponse>;
export type FleetVehicleProfilesPaginatedResponse =
  ApiPaginatedResponseData<VehicleProfileResponse>;
export type ApiVehicleDetailResponse = ApiResponse<VehicleDetailResponse>;
export type ApiVehicleResponse = ApiResponse<VehicleResponse>;
export type ApiVehicleDocumentListResponse = ApiResponse<
  VehicleDocumentResponse[]
>;
export type ApiVehicleDocumentUploadResponse =
  ApiResponse<VehicleDocumentUploadResponse>;
export type ApiVehicleCategoryResponse =
  ApiResponse<VehicleCategoryConfigResponse>;
export type ApiMaintenanceLogResponse = ApiResponse<MaintenanceLogResponse>;

export interface MaintenanceLogResponse {
  id: string;
  scheduled_date: string; // date
  completed_date?: string | null; // date
  service_type?: string | null;
  notes?: string | null;
  technician_notes?: string | null;
  created_at: string; // date-time
}

export interface VehicleDocumentResponse {
  id: string;
  vehicle_id: string;
  document_type: string;
  file_key: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  expires_at?: string | null; // date
  status: string;
  uploaded_by: string; // uuid
  notes?: string | null;
  created_at: string; // date-time
  updated_at: string; // date-time
}

// Admin Driver Management - Missing supporting types
export interface AdminDriverTripStats {
  total_trips: number;
  hours_online: number;
  average_earnings: number;
}

export interface DriverDocumentSummary {
  id: string;
  document_type: string;
  file_name: string;
  verification_status: string;
  expires_at?: string | null; // date
  created_at?: string | null; // date-time
}

export interface AdminDriverRatingItem {
  ride_id: string; // uuid
  rated_by_user_id?: string | null; // uuid
  rating: number;
  comment?: string | null;
  created_at?: string | null; // date-time
}

export interface SuspensionLogItem {
  id: string; // uuid
  action: string;
  reason?: string | null;
  performed_by: string; // uuid
  created_at?: string | null; // date-time
}

// Admin Rider Management - Missing supporting types
export interface RiderTripStats {
  total_rides: number;
  total_spent: number;
  avg_cost: number;
}

export interface RiderEmergencyContactInfo {
  name: string;
  phone: string;
  relationship_type?: string | null;
}

export interface RiderPaymentMethodInfo {
  brand?: string | null;
  last_four?: string | null;
  is_default?: boolean;
}

// Rider Activity (you had the response and KPIs, but missing the item)
export interface AdminRiderActivityItem {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  last_seen?: string | null; // date-time
  frequency: string;
  avg_trips_per_week: number;
  monthly_trips: number;
  trend: string;
  status: string;
}

export interface AdminRiderProfileCard {
  user_id: string; // uuid
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  date_of_birth?: string | null; // date
  member_since?: string | null; // date-time
  total_rides?: number;
  email?: string | null;
  phone?: string | null;
  last_ride?: string | null; // date-time
  insurance_provider?: string | null;
  insurance_policy_number?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_relationship?: string | null;
  payment_brand?: string | null;
  payment_last_four?: string | null;
}

export interface RiderIssueKPIs {
  open_count: number;
  under_review_count: number;
  resolved_count: number;
}

export interface RiderIssueListItem {
  id: string; // uuid
  ticket_number: string;
  rider_id: string; // uuid
  rider_name: string;
  issue_type: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string; // date-time
}

export interface RiderIssueListResponse {
  kpis: RiderIssueKPIs;
  issues: RiderIssueListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface RiderIssueNoteResponse {
  id: string; // uuid
  author_id: string; // uuid
  note_text: string;
  action?: string | null;
  created_at: string; // date-time
}

export interface RiderIssueDetailResponse {
  id: string; // uuid
  ticket_number: string;
  rider_id: string; // uuid
  rider_name: string;
  issue_type: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assigned_to?: string | null; // uuid
  resolved_at?: string | null; // date-time
  created_by: string; // uuid
  created_at: string; // date-time
  updated_at: string; // date-time
  notes?: RiderIssueNoteResponse[];
}

export interface RiderProfileCardsPayload {
  search?: string;
  page?: number;
  limit?: number;
}

export interface RiderActivityPayload {
  page?: number;
  limit?: number;
}

export interface RiderListPayload {
  search?: string;
  status?: string;
  sort_by?: 'created_at' | 'name';
  page?: number;
  limit?: number;
}

export interface RiderIssueListPayload {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface RiderRidesPayload {
  riderId: string;
  page?: number;
  limit?: number;
}

export interface CreateRiderIssuePayload {
  rider_id: string; // uuid
  issue_type: string;
  subject: string;
  description: string;
  priority?: string;
}

export interface UpdateRiderIssueStatusPayload {
  issueId: string;
  status: string;
}

export interface AddRiderIssueNotePayload {
  issueId: string;
  note_text: string;
}

export interface SuspendRiderPayload {
  riderId: string;
  reason: string;
}

export interface ReinstateRiderPayload {
  riderId: string;
}

export type ApiAdminRiderListResponse = ApiResponse<AdminRiderListResponse>;
export type ApiAdminRiderDetailResponse = ApiResponse<AdminRiderDetailResponse>;
export type ApiAdminRiderActivityResponse =
  ApiResponse<AdminRiderActivityResponse>;
export type ApiRiderIssueListResponse = ApiResponse<RiderIssueListResponse>;
export type ApiRiderIssueDetailResponse = ApiResponse<RiderIssueDetailResponse>;
export type RiderProfileCardsPaginatedResponse =
  ApiPaginatedResponseData<AdminRiderProfileCard>;

// ─── Admin Driver Management — Document Overview ────────────────────────────

export interface AdminDriverDocumentKPIs {
  total_drivers: number;
  all_docs_verified: number;
  pending_review: number;
  expired_docs: number;
}

export interface AdminDriverDocumentListItem {
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  fleet_name?: string | null;
  documents: DriverDocumentSummary[];
  document_status: string;
}

export interface AdminDriverDocumentOverview {
  kpis: AdminDriverDocumentKPIs;
  drivers: AdminDriverDocumentListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// ─── Admin Driver Management — Status Overview ──────────────────────────────

export interface DriverStatusKPIs {
  active_count: number;
  suspended_count: number;
  pending_count: number;
  deactivated_count: number;
}

export interface DriverStatusItem {
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  fleet_name?: string | null;
  account_status: string;
  suspension_reason?: string | null;
  suspended_at?: string | null;
  created_at?: string | null;
}

export interface DriverStatusSection {
  status: string;
  count: number;
  drivers: DriverStatusItem[];
}

export interface AdminDriverStatusOverview {
  kpis: DriverStatusKPIs;
  sections: DriverStatusSection[];
}

// ─── Admin Driver Management — Request Payloads ─────────────────────────────

export interface DriverDocumentOverviewPayload {
  search?: string;
  status_filter?: string;
  page?: number;
  limit?: number;
}

export interface DriverListPayload {
  search?: string;
  fleet_id?: string;
  account_status?: string;
  is_online?: boolean;
  sort_by?: 'created_at' | 'name' | 'rating' | 'total_trips';
  page?: number;
  limit?: number;
}

export interface DriverTripsPayload {
  driverId: string;
  page?: number;
  limit?: number;
}

export interface DriverRatingsPayload {
  driverId: string;
  limit?: number;
}

export interface SuspendDriverPayload {
  driverId: string;
  reason: string;
}

export interface ReactivateDriverPayload {
  driverId: string;
}

export interface ApproveDriverPayload {
  driverId: string;
}

export interface ResendDriverInvitePayload {
  driverId: string;
}

export interface ReassignDriverFleetPayload {
  driverId: string;
  fleet_id: string;
}

export interface CreateDriverPayload {
  first_name: string;
  last_name: string;
  email: string;
  fleet_id: string;
  phone?: string | null;
  license_number?: string | null;
  license_expiry?: string | null;
  medical_transport_certification?: string | null;
  background_check_status?: string;
  vehicle_id?: string | null;
  service_capabilities?: string | null;
  specialty?: string | null;
  date_of_birth?: string | null;
  account_status?: string;
  is_approved?: boolean;
  vehicle_insurance_file?: File | null;
  drivers_license_file?: File | null;
  certificate_file?: File | null;
}

export interface UpdateDriverPayload {
  driverId: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  fleet_id?: string | null;
  license_number?: string | null;
  license_expiry?: string | null;
  medical_transport_certification?: string | null;
  background_check_status?: string | null;
  vehicle_id?: string | null;
  service_capabilities?: string[] | null;
  specialty?: string | null;
  date_of_birth?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  account_status?: string | null;
  notes?: string | null;
}

export interface DeactivateDriverPayload {
  driverId: string;
}

// ─── Admin Driver Management — Envelope Response Aliases ────────────────────

export type ApiAdminDriverListResponse = ApiResponse<AdminDriverListResponse>;
export type ApiAdminDriverDetailResponse =
  ApiResponse<AdminDriverDetailResponse>;
export type ApiAdminDriverDocumentOverviewResponse =
  ApiResponse<AdminDriverDocumentOverview>;
export type ApiAdminDriverStatusOverviewResponse =
  ApiResponse<AdminDriverStatusOverview>;
