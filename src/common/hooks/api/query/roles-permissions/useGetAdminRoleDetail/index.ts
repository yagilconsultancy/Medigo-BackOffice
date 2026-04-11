import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getAdminRoleDetail } from '../../../../../services/api';

export const useGetAdminRoleDetail = (roleId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getAdminRoleDetail, roleId)],
    queryFn: () => getAdminRoleDetail(roleId).then((res) => res.data),
    enabled: !!roleId,
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};
