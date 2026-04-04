import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getAllBookings } from '../../../../../services';
import { AllBookingsPayload } from '../../../../../types';

export const useGetAllBookings = (payload: AllBookingsPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getAllBookings), JSON.stringify(payload)],
    queryFn: () => getAllBookings(payload).then((res) => res.data),
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
