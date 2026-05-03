import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiApproveTripResolutionResponse,
  ApproveTripResolutionTicketPayload,
  RejectTripResolutionTicketPayload,
} from '../../../../types';

export const approveTripResolution = async (
  payload: ApproveTripResolutionTicketPayload
) => {
  const { dispute_id, ...rest } = payload;
  return await getApiClient().put<
    ApiApproveTripResolutionResponse,
    AxiosResponse<ApiApproveTripResolutionResponse>
  >(resolveRoute(ROUTES.approveDispute, dispute_id), rest);
};

export const rejectTripResolution = async (
  payload: RejectTripResolutionTicketPayload
) => {
  const { dispute_id, ...rest } = payload;
  return await getApiClient().put<
    ApiApproveTripResolutionResponse,
    AxiosResponse<ApiApproveTripResolutionResponse>
  >(resolveRoute(ROUTES.rejectDispute, dispute_id), rest);
};
