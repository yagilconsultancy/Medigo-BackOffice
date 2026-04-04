import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFleetCompanyDocument } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useUploadFleetCompanyDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadFleetCompanyDocument,
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
