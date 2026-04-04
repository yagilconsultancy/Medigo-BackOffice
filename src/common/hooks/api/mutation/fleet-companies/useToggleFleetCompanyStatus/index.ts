import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFleetCompanyStatus } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useToggleFleetCompanyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFleetCompanyStatus,
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
