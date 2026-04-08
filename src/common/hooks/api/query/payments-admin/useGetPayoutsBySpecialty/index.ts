import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getPayoutsBySpecialty } from '../../../../../services/api';

export const useGetPayoutsBySpecialty = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getPayoutsBySpecialty)],
    queryFn: () => getPayoutsBySpecialty(),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
