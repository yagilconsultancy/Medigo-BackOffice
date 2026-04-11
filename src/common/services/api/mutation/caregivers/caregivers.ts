import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiResponse,
  CaregiverCreateRequest,
  UpdateCaregiverPayload,
} from '../../../../types';

export const createCaregiver = async (payload: CaregiverCreateRequest) => {
  return await getApiClient().post<
    ApiResponse<Record<string, any>>,
    AxiosResponse<ApiResponse<Record<string, any>>>
  >(resolveRoute(ROUTES.createCaregiver), payload);
};

export const updateCaregiver = async (payload: UpdateCaregiverPayload) => {
  const { caregiverId, ...rest } = payload;
  return await getApiClient().put<
    ApiResponse<Record<string, any>>,
    AxiosResponse<ApiResponse<Record<string, any>>>
  >(resolveRoute(ROUTES.updateCaregiver, caregiverId), rest);
};
