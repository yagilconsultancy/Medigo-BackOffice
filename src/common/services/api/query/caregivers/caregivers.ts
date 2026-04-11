import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiCaregiverKpisResponse,
  ApiCaregiverProfileListResponse,
  ApiCaregiverListResponse,
  ApiCaregiverDetailResponse,
  ListCaregiverProfilesPayload,
  ListCaregiversPayload,
} from '../../../../types';

export const getCaregiverKpis = async () => {
  return await getApiClient().get<
    ApiCaregiverKpisResponse,
    AxiosResponse<ApiCaregiverKpisResponse>
  >(resolveRoute(ROUTES.getCaregiverKpis));
};

export const listCaregiverProfiles = async (
  payload: ListCaregiverProfilesPayload
) => {
  return await getApiClient().get<
    ApiCaregiverProfileListResponse,
    AxiosResponse<ApiCaregiverProfileListResponse>
  >(resolveRoute(ROUTES.listCaregiverProfiles), {
    params: { ...payload },
  });
};

export const listCaregivers = async (payload: ListCaregiversPayload) => {
  return await getApiClient().get<
    ApiCaregiverListResponse,
    AxiosResponse<ApiCaregiverListResponse>
  >(resolveRoute(ROUTES.listCaregivers), {
    params: { ...payload },
  });
};

export const getCaregiverDetail = async (caregiverId: string) => {
  return await getApiClient().get<
    ApiCaregiverDetailResponse,
    AxiosResponse<ApiCaregiverDetailResponse>
  >(resolveRoute(ROUTES.getCaregiverDetail, caregiverId));
};
