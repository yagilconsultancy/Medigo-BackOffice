import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFleetPartner } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useAddFleetPartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFleetPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.fleetCompanies)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getFleetCompaniesKpi)],
      });
    },
  });
};
