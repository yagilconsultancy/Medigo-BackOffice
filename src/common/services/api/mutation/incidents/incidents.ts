import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  CreateIncidentRequest,
  UpdateIncidentStatusRequest,
  CreateIncidentNoteRequest,
  ApiIncidentResponse,
  ApiIncidentNoteResponse,
} from '../../../../types';

export const createIncident = async (payload: CreateIncidentRequest) => {
  return await getApiClient().post<
    ApiIncidentResponse,
    AxiosResponse<ApiIncidentResponse>
  >(resolveRoute(ROUTES.createIncident), payload);
};

export const updateIncidentStatus = async (
  payload: { incidentId: string } & UpdateIncidentStatusRequest
) => {
  const { incidentId, ...body } = payload;

  return await getApiClient().put<
    ApiIncidentResponse,
    AxiosResponse<ApiIncidentResponse>
  >(resolveRoute(ROUTES.updateIncidentStatus, incidentId), body);
};

export const addIncidentNote = async (
  payload: { incidentId: string } & CreateIncidentNoteRequest
) => {
  const { incidentId, ...body } = payload;

  return await getApiClient().post<
    ApiIncidentNoteResponse,
    AxiosResponse<ApiIncidentNoteResponse>
  >(resolveRoute(ROUTES.addIncidentNote, incidentId), body);
};
