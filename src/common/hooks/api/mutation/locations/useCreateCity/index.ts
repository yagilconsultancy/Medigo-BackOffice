import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { createCity } from '../../../../../services';

export const useCreateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listCities)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCityKpis)],
      });
    },
  });
};
