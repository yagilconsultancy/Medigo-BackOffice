// Fleet Application Types
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
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  logo_url?: string | null;
  is_active: boolean;
  vehicle_count?: number;
  driver_count?: number;
  revenue?: number;
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

// Fleet Companies (no major missing)

// Fleet Vehicles
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
