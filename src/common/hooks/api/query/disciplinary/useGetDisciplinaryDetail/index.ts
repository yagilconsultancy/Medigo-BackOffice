import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getDisciplinaryDetail } from '../../../../../services';

export const useGetDisciplinaryDetail = (actionId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getDisciplinaryDetail, actionId)],
    queryFn: () => getDisciplinaryDetail(actionId).then((res) => res.data),
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
