import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { listCaregiverProfiles } from '../../../../../services/api';
import { ListCaregiverProfilesPayload } from '../../../../../types';

export const useListCaregiverProfiles = (
  payload: ListCaregiverProfilesPayload
) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.listCaregiverProfiles),
      JSON.stringify(payload),
    ],
    queryFn: () => listCaregiverProfiles(payload).then((res) => res.data),
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
