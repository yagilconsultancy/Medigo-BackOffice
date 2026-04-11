import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { deleteCity } from '../../../../../services';

export const useDeleteCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCity,
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
