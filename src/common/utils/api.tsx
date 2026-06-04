import { ReactNode } from 'react';
import { ApiResponse } from '../types';

export const extractResponseErrors = (
  apiResponse: ApiResponse<any>
): ReactNode => {
  if (apiResponse.success) {
    return null;
  }
  // @ts-ignore
  if (!apiResponse.error) {
    return 'An error occurred';
  }
  // @ts-ignore
  const errors = Array.isArray(apiResponse.error)
    ? // @ts-ignore
      apiResponse.error
    : // @ts-ignore
      [apiResponse.error];
  if (errors.length === 1) {
    return errors[0];
  }

  const errorNodes: ReactNode[] = errors.map((error, index) => (
    <li key={index}>{error}</li>
  ));

  return <ul>{errorNodes}</ul>;
};

export const extractValidationErrorMessage = (
  error: any,
  fallback = 'An error occurred'
): string => {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail) && detail.length > 0) {
    const messages = detail
      .map((item) => item?.msg)
      .filter((msg): msg is string => Boolean(msg));

    if (messages.length > 0) {
      return messages.join(', ');
    }
  }

  const responseData = error?.response?.data;
  if (typeof responseData?.message === 'string' && responseData.message) {
    return responseData.message;
  }

  if (typeof responseData?.error === 'string' && responseData.error) {
    return responseData.error;
  }

  return fallback;
};
