import { ApiResponse } from './common';

// ====================== DISPATCH PAYLOADS ======================
export interface UnassignedRidesPayload {
  page?: number;
  limit?: number;
}

export interface ManualAssignmentRequest {
  driver_id: string;
}

export interface UpdateAutoDispatchSettingsRequest {
  auto_dispatch_enabled: boolean;
  distance_matching: DistanceMatchingLogic;
  priority_rules: DispatchPriorityRules;
  fallback_behavior: FallbackBehavior;
}

// ====================== NESTED OBJECTS ======================
export interface DistanceMatchingLogic {
  search_radius_km?: number; // 2-15, default 5
}

export interface DispatchPriorityRules {
  prioritize_by_rating?: boolean;
  prioritize_by_fleet?: boolean;
  match_vehicle_type?: boolean;
}

export interface FallbackBehavior {
  expand_search_radius?: boolean;
  notify_dispatch_team?: boolean;
  notify_rider?: boolean;
}

// ====================== DISPATCH RESPONSE SHAPES ======================
export interface DispatchKPIs {
  pending_assignments: number;
  assigned_today: number;
  available_drivers: number;
  drivers_on_trip: number;
}

export interface UnassignedRideItem {
  ride_id: string;
  booking_number: string;
  rider_name: string;
  ride_type: string;
  pickup_address: string;
  destination_address: string;
  scheduled_at: string; // ISO datetime
  distance_km?: number | null;
  estimated_fare?: number | null;
  special_requirements?: string[];
  assigned_status?: string | null;
}

export interface AvailableDriverItem {
  driver_id: string;
  driver_name: string;
  vehicle_type: string;
  vehicle_info: string;
  rating: number;
  total_trips: number;
  distance_from_pickup?: number | null;
  eta_minutes?: number | null;
  specialty?: string | null;
  fleet_name?: string | null;
}

export interface DispatchDashboardResponse {
  kpis: DispatchKPIs;
  unassigned_rides: UnassignedRideItem[];
  available_drivers: AvailableDriverItem[];
}

export interface AutoDispatchSettings {
  id?: string | null;
  auto_dispatch_enabled?: boolean;
  distance_matching?: DistanceMatchingLogic;
  priority_rules?: DispatchPriorityRules;
  fallback_behavior?: FallbackBehavior;
  updated_at?: string | null; // ISO datetime
  updated_by?: string | null;
}

export interface AutoAssignmentResult {
  ride_id: string;
  driver_id?: string | null;
  assigned: boolean;
  reason?: string | null;
}

export interface TriggerAutoDispatchResponse {
  total_rides: number;
  assigned_count: number;
  failed_count: number;
  results: AutoAssignmentResult[];
}

export interface UnassignedRidesListResponse {
  items: UnassignedRideItem[];
  total: number;
  page: number;
  limit: number;
}

// ====================== WRAPPED RESPONSE ALIASES ======================
export type ApiDispatchDashboardResponse =
  ApiResponse<DispatchDashboardResponse>;
export type ApiUnassignedRidesResponse =
  ApiResponse<UnassignedRidesListResponse>;
export type ApiAvailableDispatchDriversResponse = ApiResponse<
  AvailableDriverItem[]
>;
export type ApiDispatchSettingsResponse = ApiResponse<AutoDispatchSettings>;
export type ApiTriggerAutoDispatchResponse =
  ApiResponse<TriggerAutoDispatchResponse>;
