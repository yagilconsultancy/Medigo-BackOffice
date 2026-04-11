import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiCityKpisResponse,
  ApiCityListResponse,
  ApiCityResponse,
} from '../../../../types';

export const getCityKpis = async () => {
  return await getApiClient().get<
    ApiCityKpisResponse,
    AxiosResponse<ApiCityKpisResponse>
  >(resolveRoute(ROUTES.getCityKpis));
};

export const listCities = async () => {
  return await getApiClient().get<
    ApiCityListResponse,
    AxiosResponse<ApiCityListResponse>
  >(resolveRoute(ROUTES.listCities));
};

export const getCity = async (cityId: string) => {
  return await getApiClient().get<
    ApiCityResponse,
    AxiosResponse<ApiCityResponse>
  >(resolveRoute(ROUTES.getCity, cityId));
};
