import { ApiResponse } from './common';

export interface ApproveTripResolution {
  id: string;
  dispute_number: number;
  dispute_type: string;
  status: string;
  ride_id: string;
  rider_id: string;
  rider_name: string;
  driver_id: string;
  driver_name: string;
  trip_code: string;
  billed_amount: number;
  claimed_amount: number;
  reason: string;
  reviewed_by: string;
  reviewed_at: string;
  decision_note: string;
  refund_request_id: string;
  created_at: string;
  updated_at: string;
  notes: [];
}

export interface TripResolutionTicket {
  id: string;
  dispute_number: number;
  dispute_type: string;
  status: string;
  rider_name: string;
  trip_code: string;
  billed_amount: number;
  claimed_amount: number;
  created_at: string;
}

export interface PaginatedTripResolutionTickets {
  items: TripResolutionTicket[];
  total: number;
  page: number;
  page_size: number;
}
export interface TripResolutionDetailPayload {
  dispute_id: string;
}
export interface ApproveTripResolutionTicketPayload extends TripResolutionDetailPayload {
  decision_note: string;
  create_refund: boolean;
  refund_amount: number;
}
export interface RejectTripResolutionTicketPayload extends TripResolutionDetailPayload {
  decision_note: string;
}

export interface TripResolutionKpis {
  open_disputes: number;
  refunds_approved: number;
  rejected: number;
}

export interface listTripResolutionTicketsPayload {
  status?: 'all' | 'under_review' | 'approved' | 'rejected';
  dispute_type?: 'fare_dispute' | 'refund_request' | 'trip_fraud';
  search?: string | null;
  page?: number;
  page_size?: number;
}

export type ApiTripResolutionKpisResponse = ApiResponse<TripResolutionKpis>;
export type ApiTripResolutionListResponse =
  ApiResponse<PaginatedTripResolutionTickets>;
export type ApiApproveTripResolutionResponse =
  ApiResponse<ApproveTripResolution>;
