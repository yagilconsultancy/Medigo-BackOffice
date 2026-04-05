import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getDriverDocumentOverview } from '../../../../../services';
import { DriverDocumentOverviewPayload } from '../../../../../types';

export const useGetDriverDocumentOverview = (
  payload: DriverDocumentOverviewPayload
) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getDriverDocumentOverview),
      JSON.stringify(payload),
    ],
    queryFn: () => getDriverDocumentOverview(payload).then((res) => res.data),
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
