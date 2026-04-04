import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  CreateDisciplinaryActionRequest,
  ApiDisciplinaryResponse,
} from '../../../../types';

export const createDisciplinaryAction = async (
  payload: CreateDisciplinaryActionRequest
) => {
  return await getApiClient().post<
    ApiDisciplinaryResponse,
    AxiosResponse<ApiDisciplinaryResponse>
  >(resolveRoute(ROUTES.createDisciplinaryAction), payload);
};

export const reinstateDisciplinaryAction = async (payload: {
  actionId: string;
}) => {
  return await getApiClient().put<
    ApiDisciplinaryResponse,
    AxiosResponse<ApiDisciplinaryResponse>
  >(resolveRoute(ROUTES.reinstateDisciplinaryAction, payload.actionId));
};

export const toggleCollapseDisciplinary = async (payload: {
  actionId: string;
}) => {
  return await getApiClient().put<
    ApiDisciplinaryResponse,
    AxiosResponse<ApiDisciplinaryResponse>
  >(resolveRoute(ROUTES.toggleCollapseDisciplinary, payload.actionId));
};
