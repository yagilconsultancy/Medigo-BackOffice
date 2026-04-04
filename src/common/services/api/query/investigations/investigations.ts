import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  InvestigationListPayload,
  ApiInvestigationKpisResponse,
  ApiInvestigationListResponseWrapped,
  ApiInvestigationResponse,
  ApiInvestigationNotesResponse,
} from '../../../../types';

export const getInvestigationKpis = async () => {
  return await getApiClient().get<
    ApiInvestigationKpisResponse,
    AxiosResponse<ApiInvestigationKpisResponse>
  >(resolveRoute(ROUTES.getInvestigationKpis));
};

export const listInvestigations = async (
  payload: InvestigationListPayload
) => {
  return await getApiClient().get<
    ApiInvestigationListResponseWrapped,
    AxiosResponse<ApiInvestigationListResponseWrapped>
  >(resolveRoute(ROUTES.listInvestigations), {
    params: { ...payload },
  });
};

export const getInvestigationDetail = async (invId: string) => {
  return await getApiClient().get<
    ApiInvestigationResponse,
    AxiosResponse<ApiInvestigationResponse>
  >(resolveRoute(ROUTES.getInvestigationDetail, invId));
};

export const getInvestigationNotes = async (invId: string) => {
  return await getApiClient().get<
    ApiInvestigationNotesResponse,
    AxiosResponse<ApiInvestigationNotesResponse>
  >(resolveRoute(ROUTES.getInvestigationNotes, invId));
};
