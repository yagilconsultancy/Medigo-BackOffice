import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  DisciplinaryListPayload,
  ApiDisciplinaryKpisResponse,
  ApiDisciplinaryListResponseWrapped,
  ApiDisciplinaryResponse,
  ApiDisciplinaryReasonResponseWrapped,
} from '../../../../types';

export const getDisciplinaryKpis = async () => {
  return await getApiClient().get<
    ApiDisciplinaryKpisResponse,
    AxiosResponse<ApiDisciplinaryKpisResponse>
  >(resolveRoute(ROUTES.getDisciplinaryKpis));
};

export const listDisciplinaryActions = async (
  payload: DisciplinaryListPayload
) => {
  return await getApiClient().get<
    ApiDisciplinaryListResponseWrapped,
    AxiosResponse<ApiDisciplinaryListResponseWrapped>
  >(resolveRoute(ROUTES.listDisciplinaryActions), {
    params: { ...payload },
  });
};

export const getDisciplinaryDetail = async (actionId: string) => {
  return await getApiClient().get<
    ApiDisciplinaryResponse,
    AxiosResponse<ApiDisciplinaryResponse>
  >(resolveRoute(ROUTES.getDisciplinaryDetail, actionId));
};

export const getDisciplinaryReason = async (actionId: string) => {
  return await getApiClient().get<
    ApiDisciplinaryReasonResponseWrapped,
    AxiosResponse<ApiDisciplinaryReasonResponseWrapped>
  >(resolveRoute(ROUTES.getDisciplinaryReason, actionId));
};
