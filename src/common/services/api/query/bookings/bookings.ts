import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  AllBookingsPayload,
  PendingBookingsPayload,
  ScheduledTripsPayload,
  CancelledTripsPayload,
  ApiRideListResponse,
  ApiPendingBookingListResponse,
  ApiPendingBookingsKpisResponse,
  ApiScheduledTripListResponse,
  ApiScheduledTripsKpisResponse,
  ApiCancelledTripListResponse,
  ApiCancelledTripsKpisResponse,
  ApiBookingDetailResponse,
  ApiAvailableDriversResponse,
  ApiBookingNotesResponse,
} from '../../../../types';

export const getAllBookings = async (payload: AllBookingsPayload) => {
  return await getApiClient().get<
    ApiRideListResponse,
    AxiosResponse<ApiRideListResponse>
  >(resolveRoute(ROUTES.getAllBookings), {
    params: { ...payload },
  });
};

export const getPendingBookings = async (payload: PendingBookingsPayload) => {
  return await getApiClient().get<
    ApiPendingBookingListResponse,
    AxiosResponse<ApiPendingBookingListResponse>
  >(resolveRoute(ROUTES.getPendingBookings), {
    params: { ...payload },
  });
};

export const getPendingBookingsKpis = async () => {
  return await getApiClient().get<
    ApiPendingBookingsKpisResponse,
    AxiosResponse<ApiPendingBookingsKpisResponse>
  >(resolveRoute(ROUTES.getPendingBookingsKpis));
};

export const getScheduledTrips = async (payload: ScheduledTripsPayload) => {
  return await getApiClient().get<
    ApiScheduledTripListResponse,
    AxiosResponse<ApiScheduledTripListResponse>
  >(resolveRoute(ROUTES.getScheduledTrips), {
    params: { ...payload },
  });
};

export const getScheduledTripsKpis = async () => {
  return await getApiClient().get<
    ApiScheduledTripsKpisResponse,
    AxiosResponse<ApiScheduledTripsKpisResponse>
  >(resolveRoute(ROUTES.getScheduledTripsKpis));
};

export const getCancelledTrips = async (payload: CancelledTripsPayload) => {
  return await getApiClient().get<
    ApiCancelledTripListResponse,
    AxiosResponse<ApiCancelledTripListResponse>
  >(resolveRoute(ROUTES.getCancelledTrips), {
    params: { ...payload },
  });
};

export const getCancelledTripsKpis = async () => {
  return await getApiClient().get<
    ApiCancelledTripsKpisResponse,
    AxiosResponse<ApiCancelledTripsKpisResponse>
  >(resolveRoute(ROUTES.getCancelledTripsKpis));
};

export const getBookingDetail = async (rideId: string) => {
  return await getApiClient().get<
    ApiBookingDetailResponse,
    AxiosResponse<ApiBookingDetailResponse>
  >(resolveRoute(ROUTES.getBookingDetail, rideId));
};

export const getAvailableDrivers = async (rideId: string) => {
  return await getApiClient().get<
    ApiAvailableDriversResponse,
    AxiosResponse<ApiAvailableDriversResponse>
  >(resolveRoute(ROUTES.getAvailableDrivers, rideId));
};

export const getBookingNotes = async (rideId: string) => {
  return await getApiClient().get<
    ApiBookingNotesResponse,
    AxiosResponse<ApiBookingNotesResponse>
  >(resolveRoute(ROUTES.getBookingNotes, rideId));
};
