import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getAllRides } from '../../../../../services';
import { AllRidesPayload } from '../../../../../types';

export const useGetAllRides = (payload: AllRidesPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getAllRides), JSON.stringify(payload)],
    queryFn: () => getAllRides(payload).then((res) => res.data),
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
