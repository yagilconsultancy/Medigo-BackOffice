import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getDisciplinaryReason } from '../../../../../services';

export const useGetDisciplinaryReason = (actionId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getDisciplinaryReason, actionId)],
    queryFn: () => getDisciplinaryReason(actionId).then((res) => res.data),
    enabled: !!actionId,
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
