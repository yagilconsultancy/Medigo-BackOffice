import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiContactLogResponse,
  CreateContactLogRequest,
} from '../../../../types';

export const createContactLog = async (payload: CreateContactLogRequest) => {
  return await getApiClient().post<
    ApiContactLogResponse,
    AxiosResponse<ApiContactLogResponse>
  >(resolveRoute(ROUTES.createContactLog), payload);
};
