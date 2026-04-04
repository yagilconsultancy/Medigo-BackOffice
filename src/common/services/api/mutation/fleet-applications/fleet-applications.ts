import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  ApiFleetApplicationDetailResponse,
  ApiFleetDocumentUploadResponse,
  ApproveFleetApplicationPayload,
  RejectFleetApplicationPayload,
  RequestInfoFleetApplicationPayload,
  UploadFleetApplicationDocumentPayload,
} from '../../../../types';

export const approveFleetApplication = async (
  payload: ApproveFleetApplicationPayload
) => {
  const { appId, ...rest } = payload;

  return await getApiClient().put<
    ApiFleetApplicationDetailResponse,
    AxiosResponse<ApiFleetApplicationDetailResponse>
  >(resolveRoute(ROUTES.approveFleetApplication, appId), rest);
};

export const rejectFleetApplication = async (
  payload: RejectFleetApplicationPayload
) => {
  const { appId, ...rest } = payload;

  return await getApiClient().put<
    ApiFleetApplicationDetailResponse,
    AxiosResponse<ApiFleetApplicationDetailResponse>
  >(resolveRoute(ROUTES.rejectFleetApplication, appId), rest);
};

export const requestInfoFleetApplication = async (
  payload: RequestInfoFleetApplicationPayload
) => {
  const { appId, ...rest } = payload;

  return await getApiClient().put<
    ApiFleetApplicationDetailResponse,
    AxiosResponse<ApiFleetApplicationDetailResponse>
  >(resolveRoute(ROUTES.requestInfoFleetApplication, appId), rest);
};

export const uploadFleetApplicationDocument = async (
  payload: UploadFleetApplicationDocumentPayload
) => {
  const { appId, documentType, file } = payload;

  const data = new FormData();
  data.append('document_type', documentType);
  data.append('file', file);

  return await getApiClient().post<
    ApiFleetDocumentUploadResponse,
    AxiosResponse<ApiFleetDocumentUploadResponse>,
    FormData
  >(resolveRoute(ROUTES.uploadDocumentFleetApplication, appId), data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
