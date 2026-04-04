import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  AddFleetPartnerRequest,
  ApiFleetDocumentUploadResponse,
  ApiFleetResponse,
  ToggleFleetCompanyStatusPayload,
  UpdateFleetCompanyPayload,
  UploadFleetCompanyDocumentPayload,
} from '../../../../types';

export const addFleetPartner = async (payload: AddFleetPartnerRequest) => {
  return await getApiClient().post<
    ApiFleetResponse,
    AxiosResponse<ApiFleetResponse>
  >(resolveRoute(ROUTES.fleetCompanies), payload);
};

export const updateFleetCompany = async (
  payload: UpdateFleetCompanyPayload
) => {
  const { businessId, ...rest } = payload;

  return await getApiClient().put<
    ApiFleetResponse,
    AxiosResponse<ApiFleetResponse>
  >(resolveRoute(ROUTES.fleetCompanyDetail, businessId), rest);
};

export const toggleFleetCompanyStatus = async (
  payload: ToggleFleetCompanyStatusPayload
) => {
  const { businessId, ...rest } = payload;

  return await getApiClient().put<
    ApiFleetResponse,
    AxiosResponse<ApiFleetResponse>
  >(resolveRoute(ROUTES.fleetCompanyStatus, businessId), rest);
};

export const uploadFleetCompanyDocument = async (
  payload: UploadFleetCompanyDocumentPayload
) => {
  const { businessId, documentType, file } = payload;

  const data = new FormData();
  data.append('document_type', documentType);
  data.append('file', file);

  return await getApiClient().post<
    ApiFleetDocumentUploadResponse,
    AxiosResponse<ApiFleetDocumentUploadResponse>,
    FormData
  >(resolveRoute(ROUTES.fleetCompanyDocuments, businessId), data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
