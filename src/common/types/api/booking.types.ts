import { ApiResponse, ApiPaginatedResponseData } from './common';

// ====================== ADMIN RIDES ======================
export interface RideResponse {
  id: string;
  rider_id: string;
  driver_id?: string | null;
  caregiver_id?: string | null;
  business_id?: string | null;
  ride_type: string;
  trip_type: string;
  trip_structure: string;
  pickup_address: string;
  destination_address: string;
  scheduled_at: string;
  status: string;
  estimated_distance_miles?: number | null;
  estimated_duration_minutes?: number | null;
  estimated_fare?: number | null;
  final_fare?: number | null;
  special_instructions?: string | null;
  visit_type?: string | null;
  facility_name?: string | null;
  rider_name?: string;
  booking_channel?: string;
  facility_id?: string | null;
  use_highway_407?: boolean;
  highway_407_route?: string | null;
  is_dialysis_trip?: boolean;
  created_at: string;
}

export interface AdminAssignDriverRequest {
  driver_id: string;
}

export interface CancelTripRequest {
  reason: string;
}

// ====================== RIDE/BOOKING PAYLOADS ======================
export interface AllRidesPayload {
  status?: string | null;
  ride_type?: string | null;
  page?: number;
  limit?: number;
}

export interface PendingRidesPayload {
  page?: number;
  limit?: number;
}

export interface AllBookingsPayload {
  status?: string | null;
  ride_type?: string | null;
  search?: string | null;
  page?: number;
  limit?: number;
}

export interface PendingBookingsPayload {
  page?: number;
  limit?: number;
}

export interface ScheduledTripsPayload {
  page?: number;
  limit?: number;
}

export interface CancelledTripsPayload {
  page?: number;
  limit?: number;
}

// ====================== WRAPPED RESPONSE ALIASES ======================
export type ApiRideListResponse = ApiPaginatedResponseData<RideResponse>;
export type ApiPendingBookingListResponse =
  ApiPaginatedResponseData<PendingBookingResponse>;
export type ApiScheduledTripListResponse =
  ApiPaginatedResponseData<ScheduledTripResponse>;
export type ApiCancelledTripListResponse =
  ApiPaginatedResponseData<CancelledTripResponse>;
export type ApiBookingDetailResponse = ApiResponse<AdminBookingDetailResponse>;
export type ApiPendingBookingsKpisResponse = ApiResponse<PendingBookingsKPIs>;
export type ApiScheduledTripsKpisResponse = ApiResponse<ScheduledTripsKPIs>;
export type ApiCancelledTripsKpisResponse = ApiResponse<CancelledTripsKPIs>;
export type ApiAvailableDriversResponse = ApiResponse<
  AvailableDriverResponse[]
>;
export type ApiBookingNotesResponse = ApiResponse<AdminNoteResponse[]>;
export type ApiBookingNoteResponse = ApiResponse<AdminNoteResponse>;
export type ApiRideActionResponse = ApiResponse<RideResponse>;

// ====================== ADMIN BOOKING MANAGEMENT ======================
export interface AdminBookingDetailResponse {
  id: string;
  rider_id: string;
  driver_id?: string | null;
  caregiver_id?: string | null;
  business_id?: string | null;
  ride_type: string;
  trip_type: string;
  trip_structure: string;
  status: string;
  pickup_address: string;
  pickup_latitude?: number | null;
  pickup_longitude?: number | null;
  destination_address: string;
  destination_latitude?: number | null;
  destination_longitude?: number | null;
  scheduled_at: string;
  pickup_at?: string | null;
  dropoff_at?: string | null;
  created_at: string;
  estimated_distance_miles?: number | null;
  actual_distance_miles?: number | null;
  estimated_duration_minutes?: number | null;
  actual_duration_minutes?: number | null;
  estimated_fare?: number | null;
  final_fare?: number | null;
  special_instructions?: string | null;
  mobility_level?: string | null;
  assistance_level?: string | null;
  visit_type?: string | null;
  facility_name?: string | null;
  appointment_time?: string | null;
  passenger_first_name?: string | null;
  passenger_last_name?: string | null;
  passenger_phone?: string | null;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  cancelled_by?: string | null;
  use_highway_407: boolean;
  is_dialysis_trip: boolean;
  rider_name: string;
  rider_phone?: string | null;
  rider_rating: number;
  rider_trip_count: number;
  caregiver_name?: string | null;
  driver_name?: string | null;
  driver_phone?: string | null;
  driver_rating?: number | null;
  driver_vehicle_type?: string | null;
  driver_vehicle_make?: string | null;
  driver_vehicle_model?: string | null;
  driver_vehicle_plate?: string | null;
  driver_vehicle_color?: string | null;
  timeline: StatusLogEntry[];
  admin_notes: AdminNoteResponse[];
  fare_breakdown?: FareBreakdownDetail | null;
  recurring_ride_id?: string | null;
  is_recurring: boolean;
}

export interface PendingBookingResponse {
  id: string;
  rider_id: string;
  rider_name: string;
  rider_phone?: string | null;
  ride_type: string;
  trip_type: string;
  trip_structure: string;
  pickup_address: string;
  destination_address: string;
  scheduled_at: string;
  created_at: string;
  wait_minutes: number;
  special_instructions?: string | null;
  mobility_level?: string | null;
  assistance_level?: string | null;
  recurring_ride_id?: string | null;
  is_recurring: boolean;
}

export interface PendingBookingsKPIs {
  pending_now: number;
  avg_wait_minutes: number;
  assigned_count: number;
}

export interface ScheduledTripResponse {
  id: string;
  rider_id: string;
  rider_name: string;
  ride_type: string;
  trip_type: string;
  pickup_address: string;
  destination_address: string;
  scheduled_at: string;
  status: string;
  driver_id?: string | null;
  driver_name?: string | null;
  recurring_ride_id?: string | null;
  is_recurring: boolean;
  recurring_days?: number[];
  recurring_frequency?: string | null;
}

export interface ScheduledTripsKPIs {
  upcoming_count: number;
  recurring_count: number;
  needs_assignment_count: number;
}

export interface CancelledTripResponse {
  id: string;
  rider_id: string;
  rider_name: string;
  pickup_address: string;
  destination_address: string;
  scheduled_at: string;
  cancelled_at?: string | null;
  cancellation_reason?: string | null;
  cancelled_by?: string | null;
  cancelled_by_name?: string | null;
  status: string;
  driver_id?: string | null;
  driver_name?: string | null;
  final_fare?: number | null;
  refund_status?: string | null;
  refund_amount?: number | null;
}

export interface CancelledTripsKPIs {
  total_cancelled: number;
  no_show_count: number;
  refunds_pending: number;
  refunds_processed: number;
}

export interface AdminNoteResponse {
  id: string;
  ride_id: string;
  author_id?: string | null;
  author_type: string;
  author_name?: string | null;
  content: string;
  created_at: string;
}

export interface CreateAdminNoteRequest {
  content: string;
  author_type?: string; // default: "admin"
}

export interface ApproveBookingRequest {
  notes?: string | null;
}

export interface DeclineBookingRequest {
  reason: string;
}

export interface UpdateBookingRequest {
  pickup_address?: string | null;
  pickup_latitude?: number | null;
  pickup_longitude?: number | null;
  destination_address?: string | null;
  destination_latitude?: number | null;
  destination_longitude?: number | null;
  scheduled_at?: string | null;
  ride_type?: string | null;
  trip_type?: string | null;
  trip_structure?: string | null;
  visit_type?: string | null;
  facility_name?: string | null;
  mobility_level?: string | null;
  assistance_level?: string | null;
  special_instructions?: string | null;
  passenger_first_name?: string | null;
  passenger_last_name?: string | null;
  passenger_phone?: string | null;
}

export interface AssignDriverRequest {
  driver_id: string;
}

export interface AssignCareAssistantRequest {
  caregiver_id: string;
}

export interface ReassignDriverRequest {
  driver_id: string;
  reason?: string | null;
}

export interface AvailableDriverResponse {
  driver_id: string;
  name: string;
  phone?: string | null;
  avatar_url?: string | null;
  rating: number;
  vehicle_type?: string | null;
  vehicle_make?: string | null;
  vehicle_model?: string | null;
  vehicle_plate?: string | null;
}

export interface FareBreakdownDetail {
  base_fare?: number | null;
  distance_charge?: number | null;
  wait_time_charge?: number | null;
  surcharges_capped?: number | null;
  highway_407_toll?: number | null;
  insurance_gateway_fee?: number | null;
  total_fare?: number | null;
  driver_earnings?: number | null;
  payment_method?: string | null;
}

export interface StatusLogEntry {
  from_status?: string | null;
  to_status: string;
  timestamp: string; // ISO date-time
  notes?: string | null;
  changed_by?: string | null; // uuid of who changed it
}

export interface StatusLogResponse {
  from_status?: string | null;
  to_status: string;
  timestamp: string;
  notes?: string | null;
}
