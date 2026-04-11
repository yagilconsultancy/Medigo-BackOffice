import { ApiResponse } from './common';

// ─── Response Types ─────────────────────────────────────────────────────────

export interface CityKPIs {
  active_cities: number;
  total_zones: number;
  cities_online: number;
  inactive_cities: number;
}

export interface CityResponse {
  id: string;
  name: string;
  province: string;
  number_of_zones: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface CityRow {
  id: string;
  name: string;
  province: string;
  service_zones: number;
  drivers: number;
  riders: number;
  total_trips: number;
  is_active: boolean;
}

// ─── API Response Wrappers ──────────────────────────────────────────────────

export type ApiCityKpisResponse = ApiResponse<CityKPIs>;
export type ApiCityListResponse = ApiResponse<CityRow[]>;
export type ApiCityResponse = ApiResponse<CityResponse>;

// ─── Request Payloads ───────────────────────────────────────────────────────

export interface CityCreateRequest {
  name: string;
  province: string;
  number_of_zones: number;
}

export interface CityUpdateRequest {
  name?: string | null;
  province?: string | null;
  number_of_zones?: number | null;
  is_active?: boolean | null;
}

export interface ToggleCityRequest {
  is_active: boolean;
}

// ─── Payloads with route params ─────────────────────────────────────────────

export interface UpdateCityPayload extends CityUpdateRequest {
  cityId: string;
}

export interface ToggleCityPayload {
  cityId: string;
  is_active: boolean;
}

export interface DeleteCityPayload {
  cityId: string;
}
