import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  AddRiderIssueNotePayload,
  ApiAdminRiderDetailResponse,
  ApiResponse,
  ApproveRiderKYCPayload,
  ApiRiderIssueDetailResponse,
  CreateRiderIssuePayload,
  RejectRiderKYCPayload,
  ReinstateRiderPayload,
  RiderDocumentInfo,
  SuspendRiderPayload,
  UpdateRiderIssueStatusPayload,
  UpdateRiderPayload,
  VerifyUserDocumentPayload,
} from '../../../../types';

export const createRiderIssue = async (payload: CreateRiderIssuePayload) => {
  return await getApiClient().post<
    ApiRiderIssueDetailResponse,
    AxiosResponse<ApiRiderIssueDetailResponse>
  >(resolveRoute(ROUTES.ridersIssues), payload);
};

export const updateRiderIssueStatus = async (
  payload: UpdateRiderIssueStatusPayload
) => {
  const { issueId, ...rest } = payload;

  return await getApiClient().put<
    ApiRiderIssueDetailResponse,
    AxiosResponse<ApiRiderIssueDetailResponse>
  >(resolveRoute(ROUTES.ridersIssuesStatus, issueId), rest);
};

export const addRiderIssueNote = async (payload: AddRiderIssueNotePayload) => {
  const { issueId, ...rest } = payload;

  return await getApiClient().post<
    ApiRiderIssueDetailResponse,
    AxiosResponse<ApiRiderIssueDetailResponse>
  >(resolveRoute(ROUTES.ridersIssuesNotes, issueId), rest);
};

export const suspendRider = async (payload: SuspendRiderPayload) => {
  const { riderId, ...rest } = payload;

  return await getApiClient().put<
    ApiAdminRiderDetailResponse,
    AxiosResponse<ApiAdminRiderDetailResponse>
  >(resolveRoute(ROUTES.suspendRider, riderId), rest);
};

export const reinstateRider = async (payload: ReinstateRiderPayload) => {
  const { riderId } = payload;

  return await getApiClient().put<
    ApiAdminRiderDetailResponse,
    AxiosResponse<ApiAdminRiderDetailResponse>
  >(resolveRoute(ROUTES.reinstateRider, riderId));
};

export const updateRider = async (payload: UpdateRiderPayload) => {
  const { riderId, ...rest } = payload;

  return await getApiClient().put<
    ApiAdminRiderDetailResponse,
    AxiosResponse<ApiAdminRiderDetailResponse>
  >(resolveRoute(ROUTES.updateRider, riderId), rest);
};

export const approveRiderKyc = async (payload: ApproveRiderKYCPayload) => {
  const { riderId } = payload;

  return await getApiClient().put<
    ApiAdminRiderDetailResponse,
    AxiosResponse<ApiAdminRiderDetailResponse>
  >(resolveRoute(ROUTES.approveRiderKyc, riderId));
};

export const rejectRiderKyc = async (payload: RejectRiderKYCPayload) => {
  const { riderId, ...rest } = payload;

  return await getApiClient().put<
    ApiAdminRiderDetailResponse,
    AxiosResponse<ApiAdminRiderDetailResponse>
  >(resolveRoute(ROUTES.rejectRiderKyc, riderId), rest);
};

export const verifyUserDocument = async (
  payload: VerifyUserDocumentPayload
) => {
  const { userId, documentId, ...rest } = payload;

  return await getApiClient().put<
    ApiResponse<RiderDocumentInfo>,
    AxiosResponse<ApiResponse<RiderDocumentInfo>>
  >(resolveRoute(ROUTES.verifyUserDocument, userId, documentId), rest);
};
