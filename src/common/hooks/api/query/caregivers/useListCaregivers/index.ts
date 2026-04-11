import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { listCaregivers } from '../../../../../services/api';
import { ListCaregiversPayload } from '../../../../../types';

export const useListCaregivers = (payload: ListCaregiversPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listCaregivers), JSON.stringify(payload)],
    queryFn: () => listCaregivers(payload).then((res) => res.data),
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
