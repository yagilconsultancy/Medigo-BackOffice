import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getBookingChannels } from '../../../../../services';
import { BookingChannelParams } from '../../../../../types';

export const useGetBookingChannels = (params?: BookingChannelParams) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getBookingChannels), params],
    queryFn: () => getBookingChannels(params).then((res) => res.data),
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
