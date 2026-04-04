import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getTopFacilities } from '../../../../../services';
import { TopFacilitiesParams } from '../../../../../types';

export const useGetTopFacilities = (params?: TopFacilitiesParams) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getTopFacilities), params],
    queryFn: () => getTopFacilities(params).then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};
