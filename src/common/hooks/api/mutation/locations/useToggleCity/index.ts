import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { toggleCity } from '../../../../../services';

export const useToggleCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCity,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listCities)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCityKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCity, variables.cityId)],
      });
    },
  });
};
