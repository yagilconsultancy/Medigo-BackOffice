import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiResponse,
  ApiCityResponse,
  CityCreateRequest,
  UpdateCityPayload,
  ToggleCityPayload,
  DeleteCityPayload,
} from '../../../../types';

export const createCity = async (payload: CityCreateRequest) => {
  return await getApiClient().post<
    ApiCityResponse,
    AxiosResponse<ApiCityResponse>
  >(resolveRoute(ROUTES.createCity), payload);
};

export const updateCity = async (payload: UpdateCityPayload) => {
  const { cityId, ...rest } = payload;
  return await getApiClient().put<
    ApiCityResponse,
    AxiosResponse<ApiCityResponse>
  >(resolveRoute(ROUTES.updateCity, cityId), rest);
};

export const toggleCity = async (payload: ToggleCityPayload) => {
  const { cityId, is_active } = payload;
  return await getApiClient().put<
    ApiCityResponse,
    AxiosResponse<ApiCityResponse>
  >(resolveRoute(ROUTES.toggleCity, cityId), null, {
    params: { is_active },
  });
};

export const deleteCity = async (payload: DeleteCityPayload) => {
  const { cityId } = payload;
  return await getApiClient().delete<
    ApiResponse<null>,
    AxiosResponse<ApiResponse<null>>
  >(resolveRoute(ROUTES.deleteCity, cityId));
};
