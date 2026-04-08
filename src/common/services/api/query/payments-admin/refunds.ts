import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiRefundKPIsResponse,
  ApiRefundListResponse,
  ApiRefundDetailResponse,
  RefundListPayload,
} from '../../../../types';

export const getRefundKpis = async () => {
  return await getApiClient().get<
    ApiRefundKPIsResponse,
    AxiosResponse<ApiRefundKPIsResponse>
  >(resolveRoute(ROUTES.getRefundKpis));
};

export const getRefundRequests = async (payload: RefundListPayload) => {
  return await getApiClient().get<
    ApiRefundListResponse,
    AxiosResponse<ApiRefundListResponse>
  >(resolveRoute(ROUTES.getRefundRequests), {
    params: { ...payload },
  });
};

export const getRefundDetail = async (refundId: string) => {
  return await getApiClient().get<
    ApiRefundDetailResponse,
    AxiosResponse<ApiRefundDetailResponse>
  >(resolveRoute(ROUTES.getRefundDetail, refundId));
};
