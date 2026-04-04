import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFleetApplicationDocument } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useUploadFleetApplicationDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadFleetApplicationDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.fleetApplications)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getFleetApplicationsKpi)],
      });
    },
  });
};
