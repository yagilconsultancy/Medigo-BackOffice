import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  AssignInvestigatorRequest,
  UpdateInvestigationStatusRequest,
  UpdateProgressRequest,
  CreateInvestigationNoteRequest,
  ApiInvestigationResponse,
  ApiInvestigationNoteResponse,
} from '../../../../types';

export const assignInvestigator = async (
  payload: { invId: string } & AssignInvestigatorRequest
) => {
  const { invId, ...body } = payload;

  return await getApiClient().put<
    ApiInvestigationResponse,
    AxiosResponse<ApiInvestigationResponse>
  >(resolveRoute(ROUTES.assignInvestigator, invId), body);
};

export const updateInvestigationStatus = async (
  payload: { invId: string } & UpdateInvestigationStatusRequest
) => {
  const { invId, ...body } = payload;

  return await getApiClient().put<
    ApiInvestigationResponse,
    AxiosResponse<ApiInvestigationResponse>
  >(resolveRoute(ROUTES.updateInvestigationStatus, invId), body);
};

export const updateInvestigationProgress = async (
  payload: { invId: string } & UpdateProgressRequest
) => {
  const { invId, ...body } = payload;

  return await getApiClient().put<
    ApiInvestigationResponse,
    AxiosResponse<ApiInvestigationResponse>
  >(resolveRoute(ROUTES.updateInvestigationProgress, invId), body);
};

export const closeInvestigation = async (payload: { invId: string }) => {
  return await getApiClient().put<
    ApiInvestigationResponse,
    AxiosResponse<ApiInvestigationResponse>
  >(resolveRoute(ROUTES.closeInvestigation, payload.invId));
};

export const addInvestigationNote = async (
  payload: { invId: string } & CreateInvestigationNoteRequest
) => {
  const { invId, ...body } = payload;

  return await getApiClient().post<
    ApiInvestigationNoteResponse,
    AxiosResponse<ApiInvestigationNoteResponse>
  >(resolveRoute(ROUTES.addInvestigationNote, invId), body);
};
