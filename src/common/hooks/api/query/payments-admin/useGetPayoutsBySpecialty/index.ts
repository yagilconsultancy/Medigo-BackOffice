import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getPayoutsBySpecialty } from '../../../../../services/api';
import { PayoutKpisQueryPayload } from '../../../../../types';

export const useGetPayoutsBySpecialty = (payload?: PayoutKpisQueryPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getPayoutsBySpecialty),
      JSON.stringify(payload),
    ],
    queryFn: () => getPayoutsBySpecialty(payload).then((res) => res.data),
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
