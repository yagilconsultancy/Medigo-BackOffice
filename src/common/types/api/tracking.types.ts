// ====================== TRACKING TYPES ======================

import type { ApiResponse } from './common';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null;
  recorded_at: string;
}

export interface ActiveTripKPIs {
  active_trips: number;
  arriving_soon: number;
  avg_speed?: number | null;
  completed_today: number;
}

export interface ActiveTripOverview {
  session_id: string;
  ride_id: string;
  trip_id_display: string;
  status: string;
  driver_id: string;
  driver_name?: string | null;
  driver_avatar?: string | null;
  driver_vehicle?: string | null;
  rider_id: string;
  patient_name?: string | null;
  current_latitude?: number | null;
  current_longitude?: number | null;
  current_heading?: number | null;
  current_speed?: number | null;
  eta_minutes?: number | null;
  distance_remaining?: number | null;
  progress_percent?: number | null;
  pickup_address?: string | null;
  pickup_latitude?: number | null;
  pickup_longitude?: number | null;
  destination_address?: string | null;
  destination_latitude?: number | null;
  destination_longitude?: number | null;
  ride_type?: string | null;
  medical_alerts?: string[];
  started_at?: string | null;
  elapsed_minutes?: number | null;
}

export interface ActiveTripDetail extends ActiveTripOverview {
  special_instructions?: string | null;
  mobility_level?: string | null;
  estimated_distance?: number | null;
  estimated_duration?: number | null;
  driver_rating?: number | null;
  driver_phone?: string | null;
  route_history?: LocationPoint[];
}

export interface LiveDriverEntry {
  driver_id: string;
  driver_name?: string | null;
  driver_avatar?: string | null;
  driver_vehicle?: string | null;
  current_latitude?: number | null;
  current_longitude?: number | null;
  current_heading?: number | null;
  current_speed?: number | null;
  ride_id?: string | null;
  trip_id_display?: string | null;
  trip_status?: string | null;
  eta_minutes?: number | null;
  pickup_address?: string | null;
  destination_address?: string | null;
}

// API Response Types (using standard ApiResponse format)
export type ApiActiveTripKPIsResponse = ApiResponse<ActiveTripKPIs>;
export type ApiActiveTripsResponse = ApiResponse<ActiveTripOverview[]>;
export type ApiActiveTripDetailResponse = ApiResponse<ActiveTripDetail>;
export type ApiLiveDriversResponse = ApiResponse<LiveDriverEntry[]>;
