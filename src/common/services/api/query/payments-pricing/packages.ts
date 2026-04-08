import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiPackageKPIsResponse,
  ApiRidePackageListResponse,
  ApiRidePackageResponse,
  PackageListQueryPayload,
} from '../../../../types';

export const getPackageKpis = async () => {
  return await getApiClient().get<
    ApiPackageKPIsResponse,
    AxiosResponse<ApiPackageKPIsResponse>
  >(resolveRoute(ROUTES.getPackageKpis));
};

export const listPackages = async (payload?: PackageListQueryPayload) => {
  return await getApiClient().get<
    ApiRidePackageListResponse,
    AxiosResponse<ApiRidePackageListResponse>
  >(resolveRoute(ROUTES.listPackages), {
    params: { ...payload },
  });
};

export const getPackage = async (packageId: string) => {
  return await getApiClient().get<
    ApiRidePackageResponse,
    AxiosResponse<ApiRidePackageResponse>
  >(resolveRoute(ROUTES.getPackage, packageId));
};
