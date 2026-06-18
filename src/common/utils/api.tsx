import { ReactNode } from 'react';
import { ApiResponse } from '../types';

export const extractResponseErrors = (
  apiResponse: ApiResponse<any>
): ReactNode => {
  if (apiResponse.success) {
    return null;
  }

  const responseErrors =
    'error' in apiResponse
      ? apiResponse.error
      : 'message' in apiResponse
        ? apiResponse.message
        : null;

  if (!responseErrors) {
    return 'An error occurred';
  }

  const errors = Array.isArray(responseErrors)
    ? responseErrors
    : [responseErrors];
  if (errors.length === 1) {
    return errors[0];
  }

  const errorNodes: ReactNode[] = errors.map((error, index) => (
    <li key={index}>{error}</li>
  ));

  return <ul>{errorNodes}</ul>;
};

export const extractApiErrorMessage = (
  error: any,
  fallback = 'An error occurred'
): ReactNode => {
  const responseData = error?.response?.data || error?.data || error;

  if (responseData && typeof responseData === 'object') {
    if ('success' in responseData) {
      return extractResponseErrors(responseData as ApiResponse<any>);
    }

    if (Array.isArray(responseData.detail) && responseData.detail.length > 0) {
      const messages = responseData.detail
        .map((item: any) => item?.msg)
        .filter((msg: any): msg is string => Boolean(msg));

      if (messages.length === 1) {
        return messages[0];
      }

      if (messages.length > 1) {
        return (
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        );
      }
    }

    const backendError = responseData.error || responseData.message;

    if (Array.isArray(backendError)) {
      if (backendError.length === 1) {
        return backendError[0];
      }

      return (
        <ul>
          {backendError.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      );
    }

    if (typeof backendError === 'string' && backendError) {
      return backendError;
    }
  }

  if (typeof responseData === 'string' && responseData) {
    return responseData;
  }

  return fallback;
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
