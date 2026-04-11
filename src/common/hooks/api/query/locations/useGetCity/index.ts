import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getCity } from '../../../../../services';

export const useGetCity = (cityId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getCity, cityId)],
    queryFn: () => getCity(cityId).then((res) => res.data),
    enabled: !!cityId,
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
