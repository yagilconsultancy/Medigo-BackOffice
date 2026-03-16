import { ApiResponse } from '@/common/types';
import { ReactNode } from 'react';

export const extractResponseErrors = (
  apiResponse: ApiResponse<any>
): ReactNode => {
  if (apiResponse.success) {
    return null;
  }

  if (!apiResponse.error) {
    return 'An error occurred';
  }

  const errors = Array.isArray(apiResponse.error)
    ? apiResponse.error
    : [apiResponse.error];
  if (errors.length === 1) {
    return errors[0];
  }

  const errorNodes: ReactNode[] = errors.map((error, index) => (
    <li key={index}>{error}</li>
  ));

  return <ul>{errorNodes}</ul>;
};
