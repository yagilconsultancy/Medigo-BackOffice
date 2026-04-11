import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updateCaregiver } from '../../../../../services/api';

export const useUpdateCaregiver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCaregiver,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listCaregivers)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listCaregiverProfiles)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCaregiverKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [
          resolveRoute(ROUTES.getCaregiverDetail, variables.caregiverId),
        ],
      });
    },
  });
};
