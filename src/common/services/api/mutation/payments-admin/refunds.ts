import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiRefundDetailResponse,
  CreateRefundRequest,
  ApproveRefundRequest,
  RejectRefundRequest,
} from '../../../../types';

export const createRefundRequest = async (payload: CreateRefundRequest) => {
  return await getApiClient().post<
    ApiRefundDetailResponse,
    AxiosResponse<ApiRefundDetailResponse>
  >(resolveRoute(ROUTES.createRefundRequest), payload);
};

export const approveRefund = async (
  refundId: string,
  payload: ApproveRefundRequest
) => {
  return await getApiClient().put<
    ApiRefundDetailResponse,
    AxiosResponse<ApiRefundDetailResponse>
  >(resolveRoute(ROUTES.approveRefund, refundId), payload);
};

export const rejectRefund = async (
  refundId: string,
  payload: RejectRefundRequest
) => {
  return await getApiClient().put<
    ApiRefundDetailResponse,
    AxiosResponse<ApiRefundDetailResponse>
  >(resolveRoute(ROUTES.rejectRefund, refundId), payload);
};
