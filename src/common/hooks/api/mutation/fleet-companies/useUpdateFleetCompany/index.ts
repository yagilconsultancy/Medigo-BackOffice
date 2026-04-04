import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFleetCompany } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useUpdateFleetCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFleetCompany,
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
