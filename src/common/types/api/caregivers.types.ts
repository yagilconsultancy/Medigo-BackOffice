import { ApiResponse, ApiPaginatedResponse } from './common';

// ====================== CAREGIVER KPIS ======================

export interface CaregiverKPIs {
  total_caregivers: number;
  available_now: number;
  on_assignment: number;
  avg_rating: number;
}

export type ApiCaregiverKpisResponse = ApiResponse<CaregiverKPIs>;

// ====================== CAREGIVER PROFILE CARD ======================

export interface CaregiverProfileCard {
  caregiver_id: string;
  caregiver_profile_id: string;
  full_name: string;
  avatar_url?: string | null;
  specialty: string;
  phone?: string | null;
  location?: string | null;
  capabilities: string[];
  rating?: number | null;
  assignments: number;
  joined: string;
}

export interface ListCaregiverProfilesPayload {
  specialty?: string | null;
  page?: number;
  limit?: number;
}

export type ApiCaregiverProfileListResponse =
  ApiPaginatedResponse<CaregiverProfileCard>;

// ====================== CAREGIVER ROSTER ROW ======================

export interface CaregiverRosterRow {
  caregiver_id: string;
  caregiver_profile_id: string;
  full_name: string;
  avatar_url?: string | null;
  specialty: string;
  certifications: string[];
  capabilities: string[];
  status: string;
  rating?: number | null;
  total_assignments: number;
  joined: string;
}

export interface ListCaregiversPayload {
  specialty?: string | null;
  status?: string | null;
  search?: string | null;
  page?: number;
  limit?: number;
}

export type ApiCaregiverListResponse = ApiPaginatedResponse<CaregiverRosterRow>;

// ====================== CAREGIVER DETAIL ======================

export interface CaregiverPersonalInfo {
  full_name: string;
  phone?: string | null;
  email?: string | null;
  specialty: string;
  city?: string | null;
  province?: string | null;
  joined: string;
  languages: string[];
  capabilities: string[];
}

export interface CaregiverCertification {
  name: string;
  status: string;
  expiry_date?: string | null;
}

export interface CaregiverAssignment {
  assignment_id: string;
  patient_name: string;
  route: string;
  date: string;
  duration: string;
  status: string;
}

export interface CaregiverRating {
  patient_name: string;
  rating: number;
  review?: string | null;
  date: string;
}

export interface CaregiverDocument {
  id: string;
  document_type: string;
  file_name: string;
  file_uri?: string | null;
  mime_type?: string | null;
  verification_status?: string | null;
  created_at?: string | null;
}

export interface CaregiverDetailResponse {
  caregiver_id: string;
  caregiver_profile_id: string;
  personal_info: CaregiverPersonalInfo;
  certifications: CaregiverCertification[];
  documents?: CaregiverDocument[];
  assignments: CaregiverAssignment[];
  ratings: CaregiverRating[];
  total_assignments: number;
  avg_rating?: number | null;
}

export type ApiCaregiverDetailResponse = ApiResponse<CaregiverDetailResponse>;

// ====================== CAREGIVER CREATE ======================

export interface CaregiverCreateRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialty: string;
  city?: string | null;
  province?: string | null;
  capabilities?: string[] | null;
  fleet_id?: string | null;
}

// ====================== CAREGIVER UPDATE ======================

export interface CaregiverUpdateRequest {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  specialty?: string | null;
  city?: string | null;
  province?: string | null;
  capabilities?: string[] | null;
  fleet_id?: string | null;
}

export interface UpdateCaregiverPayload extends CaregiverUpdateRequest {
  caregiverId: string;
}
