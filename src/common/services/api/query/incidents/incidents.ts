import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  IncidentListPayload,
  ApiIncidentKpisResponse,
  ApiIncidentListResponseWrapped,
  ApiIncidentResponse,
  ApiIncidentNotesResponse,
} from '../../../../types';

export const getIncidentKpis = async () => {
  return await getApiClient().get<
    ApiIncidentKpisResponse,
    AxiosResponse<ApiIncidentKpisResponse>
  >(resolveRoute(ROUTES.getIncidentKpis));
};

export const listIncidents = async (payload: IncidentListPayload) => {
  return await getApiClient().get<
    ApiIncidentListResponseWrapped,
    AxiosResponse<ApiIncidentListResponseWrapped>
  >(resolveRoute(ROUTES.listIncidents), {
    params: { ...payload },
  });
};

export const getIncidentDetail = async (incidentId: string) => {
  return await getApiClient().get<
    ApiIncidentResponse,
    AxiosResponse<ApiIncidentResponse>
  >(resolveRoute(ROUTES.getIncidentDetail, incidentId));
};

export const getIncidentNotes = async (incidentId: string) => {
  return await getApiClient().get<
    ApiIncidentNotesResponse,
    AxiosResponse<ApiIncidentNotesResponse>
  >(resolveRoute(ROUTES.getIncidentNotes, incidentId));
};
