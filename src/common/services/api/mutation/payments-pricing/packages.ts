import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiRidePackageResponse,
  RidePackageCreate,
  RidePackageUpdate,
} from '../../../../types';

export const createPackage = async (payload: RidePackageCreate) => {
  return await getApiClient().post<
    ApiRidePackageResponse,
    AxiosResponse<ApiRidePackageResponse>
  >(resolveRoute(ROUTES.createPackage), payload);
};

export const updatePackage = async (
  packageId: string,
  payload: RidePackageUpdate
) => {
  return await getApiClient().put<
    ApiRidePackageResponse,
    AxiosResponse<ApiRidePackageResponse>
  >(resolveRoute(ROUTES.updatePackage, packageId), payload);
};

export const togglePackage = async (packageId: string) => {
  return await getApiClient().put<
    ApiRidePackageResponse,
    AxiosResponse<ApiRidePackageResponse>
  >(resolveRoute(ROUTES.togglePackage, packageId));
};
