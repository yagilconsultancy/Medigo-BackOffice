import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiTransactionKPIsResponse,
  ApiPaymentMethodBreakdownResponse,
  ApiTransactionListResponse,
  ApiTransactionDetailResponse,
  TransactionListPayload,
} from '../../../../types';

export const getTransactionKpis = async () => {
  return await getApiClient().get<
    ApiTransactionKPIsResponse,
    AxiosResponse<ApiTransactionKPIsResponse>
  >(resolveRoute(ROUTES.getTransactionKpis));
};

export const getPaymentMethodBreakdown = async () => {
  return await getApiClient().get<
    ApiPaymentMethodBreakdownResponse,
    AxiosResponse<ApiPaymentMethodBreakdownResponse>
  >(resolveRoute(ROUTES.getPaymentMethodBreakdown));
};

export const getAllTransactions = async (payload: TransactionListPayload) => {
  return await getApiClient().get<
    ApiTransactionListResponse,
    AxiosResponse<ApiTransactionListResponse>
  >(resolveRoute(ROUTES.getAllTransactions), {
    params: { ...payload },
  });
};

export const getTransactionDetail = async (transactionId: string) => {
  return await getApiClient().get<
    ApiTransactionDetailResponse,
    AxiosResponse<ApiTransactionDetailResponse>
  >(resolveRoute(ROUTES.getTransactionDetail, transactionId));
};
