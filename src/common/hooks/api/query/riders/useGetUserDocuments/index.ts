import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getUserDocuments } from '../../../../../services';

/** Identity documents for any user id — riders and drivers share this route. */
export const useGetUserDocuments = (userId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getUserDocuments, userId)],
    queryFn: () => getUserDocuments(userId).then((res) => res.data),
    enabled: !!userId,
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};
