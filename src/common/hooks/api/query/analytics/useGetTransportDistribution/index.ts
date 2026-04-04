import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getTransportDistribution } from '../../../../../services';
import { TransportDistributionParams } from '../../../../../types';

export const useGetTransportDistribution = (
  params?: TransportDistributionParams
) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getTransportDistribution), params],
    queryFn: () => getTransportDistribution(params).then((res) => res.data),
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
