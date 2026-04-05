import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  AddRiderIssueNotePayload,
  ApiAdminRiderDetailResponse,
  ApiRiderIssueDetailResponse,
  CreateRiderIssuePayload,
  ReinstateRiderPayload,
  SuspendRiderPayload,
  UpdateRiderIssueStatusPayload,
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
