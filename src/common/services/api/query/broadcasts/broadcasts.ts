import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiBroadcastKpisResponse,
  ApiBroadcastListResponse,
  BroadcastListPayload,
} from '../../../../types';

// ─── System ─────────────────────────────────────────────────────────────────

export const getSystemBroadcastKpis = async () => {
  return await getApiClient().get<
    ApiBroadcastKpisResponse,
    AxiosResponse<ApiBroadcastKpisResponse>
  >(resolveRoute(ROUTES.getSystemKpis));
};

export const listSystemBroadcasts = async (payload: BroadcastListPayload) => {
  return await getApiClient().get<
    ApiBroadcastListResponse,
    AxiosResponse<ApiBroadcastListResponse>
  >(resolveRoute(ROUTES.listSystemBroadcasts), {
    params: { ...payload },
  });
};

// ─── Riders ─────────────────────────────────────────────────────────────────

export const getRiderBroadcastKpis = async () => {
  return await getApiClient().get<
    ApiBroadcastKpisResponse,
    AxiosResponse<ApiBroadcastKpisResponse>
  >(resolveRoute(ROUTES.getRiderKpis));
};

export const listRiderBroadcasts = async (payload: BroadcastListPayload) => {
  return await getApiClient().get<
    ApiBroadcastListResponse,
    AxiosResponse<ApiBroadcastListResponse>
  >(resolveRoute(ROUTES.listRiderBroadcasts), {
    params: { ...payload },
  });
};

// ─── Drivers ────────────────────────────────────────────────────────────────

export const getDriverBroadcastKpis = async () => {
  return await getApiClient().get<
    ApiBroadcastKpisResponse,
    AxiosResponse<ApiBroadcastKpisResponse>
  >(resolveRoute(ROUTES.getDriverKpis));
};

export const listDriverBroadcasts = async (payload: BroadcastListPayload) => {
  return await getApiClient().get<
    ApiBroadcastListResponse,
    AxiosResponse<ApiBroadcastListResponse>
  >(resolveRoute(ROUTES.listDriverBroadcasts), {
    params: { ...payload },
  });
};

// ─── Fleets ─────────────────────────────────────────────────────────────────

export const getFleetBroadcastKpis = async () => {
  return await getApiClient().get<
    ApiBroadcastKpisResponse,
    AxiosResponse<ApiBroadcastKpisResponse>
  >(resolveRoute(ROUTES.getFleetKpis));
};

export const listFleetBroadcasts = async (payload: BroadcastListPayload) => {
  return await getApiClient().get<
    ApiBroadcastListResponse,
    AxiosResponse<ApiBroadcastListResponse>
  >(resolveRoute(ROUTES.listFleetBroadcasts), {
    params: { ...payload },
  });
};
