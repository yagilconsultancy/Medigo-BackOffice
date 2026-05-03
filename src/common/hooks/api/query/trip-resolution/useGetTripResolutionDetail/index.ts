import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants/routes';
import { getTripResolutionDetail } from '@/common/services';
import { TripResolutionDetailPayload } from '@/common/types';

export const useGetTripResolutionDetail = (
  payload: TripResolutionDetailPayload
) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getDisputeDetail, payload.dispute_id),
      JSON.stringify(payload),
    ],
    queryFn: () => getTripResolutionDetail(payload).then((res) => res.data),
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
