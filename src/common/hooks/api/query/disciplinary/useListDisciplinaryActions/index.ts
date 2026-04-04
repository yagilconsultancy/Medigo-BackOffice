import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { listDisciplinaryActions } from '../../../../../services';
import { DisciplinaryListPayload } from '../../../../../types';

export const useListDisciplinaryActions = (
  payload: DisciplinaryListPayload
) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.listDisciplinaryActions),
      JSON.stringify(payload),
    ],
    queryFn: () => listDisciplinaryActions(payload).then((res) => res.data),
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
