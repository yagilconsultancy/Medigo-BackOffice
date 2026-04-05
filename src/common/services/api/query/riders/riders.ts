import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiAdminRiderActivityResponse,
  ApiAdminRiderDetailResponse,
  ApiAdminRiderListResponse,
  ApiResponse,
  ApiRiderIssueDetailResponse,
  ApiRiderIssueListResponse,
  RiderActivityPayload,
  RiderIssueListPayload,
  RiderListPayload,
  RiderProfileCardsPaginatedResponse,
  RiderProfileCardsPayload,
  RiderRidesPayload,
} from '../../../../types';

export const getRidersProfiles = async (payload: RiderProfileCardsPayload) => {
  return await getApiClient().get<
    RiderProfileCardsPaginatedResponse,
    AxiosResponse<RiderProfileCardsPaginatedResponse>
  >(resolveRoute(ROUTES.getRidersProfiles), {
    params: { ...payload },
  });
};

export const getRidersActivity = async (payload: RiderActivityPayload) => {
  return await getApiClient().get<
    ApiAdminRiderActivityResponse,
    AxiosResponse<ApiAdminRiderActivityResponse>
  >(resolveRoute(ROUTES.getRidersActivity), {
    params: { ...payload },
  });
};

export const listRiderIssues = async (payload: RiderIssueListPayload) => {
  return await getApiClient().get<
    ApiRiderIssueListResponse,
    AxiosResponse<ApiRiderIssueListResponse>
  >(resolveRoute(ROUTES.ridersIssues), {
    params: { ...payload },
  });
};

export const getRiderIssueDetail = async (issueId: string) => {
  return await getApiClient().get<
    ApiRiderIssueDetailResponse,
    AxiosResponse<ApiRiderIssueDetailResponse>
  >(resolveRoute(ROUTES.ridersIssuesDetail, issueId));
};

export const searchRiders = async (payload: RiderListPayload) => {
  return await getApiClient().get<
    ApiAdminRiderListResponse,
    AxiosResponse<ApiAdminRiderListResponse>
  >(resolveRoute(ROUTES.searchRiders), {
    params: { ...payload },
  });
};

export const getRiderDetail = async (riderId: string) => {
  return await getApiClient().get<
    ApiAdminRiderDetailResponse,
    AxiosResponse<ApiAdminRiderDetailResponse>
  >(resolveRoute(ROUTES.riderDetail, riderId));
};

export const getRiderRides = async (payload: RiderRidesPayload) => {
  const { riderId, ...rest } = payload;

  return await getApiClient().get<
    ApiResponse<any>,
    AxiosResponse<ApiResponse<any>>
  >(resolveRoute(ROUTES.riderRides, riderId), {
    params: { ...rest },
  });
};
