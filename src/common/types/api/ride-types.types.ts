import { ApiResponse } from './common';

// ─── Response Types ─────────────────────────────────────────────────────────

export interface RideTypeResponse {
  id: string;
  service_type: string;
  display_name: string;
  description?: string | null;
  base_fare: number;
  per_km_rate: number;
  per_min_rate: number;
  min_fare: number;
  is_active: boolean;
  created_at: string;
}

export interface RideTypeKPIs {
  total_ride_types: number;
  active: number;
  inactive: number;
  avg_base_fare: number;
}

// ─── API Response Wrappers ──────────────────────────────────────────────────

export type ApiRideTypeKpisResponse = ApiResponse<RideTypeKPIs>;
export type ApiRideTypeListResponse = ApiResponse<RideTypeResponse[]>;
export type ApiRideTypeResponse = ApiResponse<RideTypeResponse>;

// ─── Request Payloads ───────────────────────────────────────────────────────

export interface RideTypeCreateRequest {
  service_type: string;
  display_name: string;
  description?: string | null;
  base_fare: number;
  per_km_rate: number;
  per_min_rate: number;
  min_fare: number;
}

export interface RideTypeUpdateRequest {
  display_name?: string | null;
  description?: string | null;
  base_fare?: number | null;
  per_km_rate?: number | null;
  per_min_rate?: number | null;
  min_fare?: number | null;
  is_active?: boolean | null;
}

export interface ToggleRideTypeRequest {
  is_active: boolean;
}

// ─── Payloads with route params ─────────────────────────────────────────────

export interface UpdateRideTypePayload extends RideTypeUpdateRequest {
  rideTypeId: string;
}

export interface ToggleRideTypePayload {
  rideTypeId: string;
  is_active: boolean;
}
