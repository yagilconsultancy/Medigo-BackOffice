import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import { ApiBroadcastResponse, SendBroadcastRequest } from '../../../../types';

export const sendSystemBroadcast = async (payload: SendBroadcastRequest) => {
  return await getApiClient().post<
    ApiBroadcastResponse,
    AxiosResponse<ApiBroadcastResponse>
  >(resolveRoute(ROUTES.sendSystemBroadcast), payload);
};

export const sendRiderBroadcast = async (payload: SendBroadcastRequest) => {
  return await getApiClient().post<
    ApiBroadcastResponse,
    AxiosResponse<ApiBroadcastResponse>
  >(resolveRoute(ROUTES.sendRiderBroadcast), payload);
};

export const sendDriverBroadcast = async (payload: SendBroadcastRequest) => {
  return await getApiClient().post<
    ApiBroadcastResponse,
    AxiosResponse<ApiBroadcastResponse>
  >(resolveRoute(ROUTES.sendDriverBroadcast), payload);
};

export const sendFleetBroadcast = async (payload: SendBroadcastRequest) => {
  return await getApiClient().post<
    ApiBroadcastResponse,
    AxiosResponse<ApiBroadcastResponse>
  >(resolveRoute(ROUTES.sendFleetBroadcast), payload);
};
