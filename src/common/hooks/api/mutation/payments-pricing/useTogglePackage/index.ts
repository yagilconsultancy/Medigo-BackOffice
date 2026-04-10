import { useMutation, useQueryClient } from '@tanstack/react-query';
import { togglePackage } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useTogglePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packageId: string) => togglePackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listPackages)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getPackageKpis)],
      });
    },
  });
};
