import { UserData } from '@flxfleet-backend-apps/user-service-lib';
import { ApiResponse } from './common';
import { PaymentFrequency } from '@flxfleet-backend-apps/payment-service-lib';

export interface ApiUserIdPayload {
  userId: string;
}

export type ApiGenericMessageResponse = ApiResponse<{
  message: string;
}>;

export interface ApiUserInfo extends UserData {
  countryIso3: string;

  countryCode: string;
  profilePhotoUri: string;
}
export type ApiFetchUserInfoResponse = ApiResponse<ApiUserInfo>;

export interface ApiUserProfile extends ApiUserInfo {
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isSocialAuthenticated: boolean;
  isPushNotificationEnabled: boolean;
  isEmailNotificationEnabled: boolean;
  rating?: string;
  availability?: boolean;
  paymentFrequency?: PaymentFrequency;
  availableAsHelper?: boolean;
  hasHelperTeam?: boolean;
  helperTeamSize?: number;
  isDriverVerificationCompleted?: boolean;
  isDriverVehicleSetupCompleted?: boolean;
  isMoverVerificationCompleted?: boolean;
  isMoverProfileSetupCompleted?: boolean;
}

export type ApiGetUserProfileResponse = ApiResponse<ApiUserProfile>;

export interface ApiUpdateUserProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  countryIso3?: string;
  logo?: File | null;
}

export interface ApiUpdateUserPasswordPayload {
  password: string;
  oldPassword: string;
}

export interface ApiToggleNotificationPayload {
  type: 'email' | 'push';
  isEnabled: boolean;
}

export interface ApiToggleAvailabilityPayload {
  availability: boolean;
}
