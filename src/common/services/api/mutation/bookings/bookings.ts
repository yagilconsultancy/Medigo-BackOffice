import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApproveBookingRequest,
  DeclineBookingRequest,
  AssignDriverRequest,
  ReassignDriverRequest,
  CancelTripRequest,
  CreateAdminNoteRequest,
  ApiRideActionResponse,
  ApiBookingNoteResponse,
} from '../../../../types';

export const approveBooking = async (
  payload: { rideId: string } & ApproveBookingRequest
) => {
  const { rideId, ...body } = payload;

  return await getApiClient().put<
    ApiRideActionResponse,
    AxiosResponse<ApiRideActionResponse>
  >(resolveRoute(ROUTES.approveBooking, rideId), body);
};

export const declineBooking = async (
  payload: { rideId: string } & DeclineBookingRequest
) => {
  const { rideId, ...body } = payload;

  return await getApiClient().put<
    ApiRideActionResponse,
    AxiosResponse<ApiRideActionResponse>
  >(resolveRoute(ROUTES.declineBooking, rideId), body);
};

export const assignDriverToBooking = async (
  payload: { rideId: string } & AssignDriverRequest
) => {
  const { rideId, ...body } = payload;

  return await getApiClient().put<
    ApiRideActionResponse,
    AxiosResponse<ApiRideActionResponse>
  >(resolveRoute(ROUTES.assignDriverToBooking, rideId), body);
};

export const reassignDriver = async (
  payload: { rideId: string } & ReassignDriverRequest
) => {
  const { rideId, ...body } = payload;

  return await getApiClient().put<
    ApiRideActionResponse,
    AxiosResponse<ApiRideActionResponse>
  >(resolveRoute(ROUTES.reassignDriver, rideId), body);
};

export const adminCancelTrip = async (
  payload: { rideId: string } & CancelTripRequest
) => {
  const { rideId, ...body } = payload;

  return await getApiClient().put<
    ApiRideActionResponse,
    AxiosResponse<ApiRideActionResponse>
  >(resolveRoute(ROUTES.adminCancelTrip, rideId), body);
};

export const addBookingNote = async (
  payload: { rideId: string } & CreateAdminNoteRequest
) => {
  const { rideId, ...body } = payload;

  return await getApiClient().post<
    ApiBookingNoteResponse,
    AxiosResponse<ApiBookingNoteResponse>
  >(resolveRoute(ROUTES.addBookingNote, rideId), body);
};
