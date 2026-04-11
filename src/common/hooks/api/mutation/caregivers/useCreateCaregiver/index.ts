import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { createCaregiver } from '../../../../../services/api';

export const useCreateCaregiver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCaregiver,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listCaregivers)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listCaregiverProfiles)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCaregiverKpis)],
      });
    },
  });
};
