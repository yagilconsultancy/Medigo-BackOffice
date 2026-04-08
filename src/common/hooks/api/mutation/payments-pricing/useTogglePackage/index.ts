import { useMutation } from '@tanstack/react-query';
import { togglePackage } from '../../../../../services/api';

export const useTogglePackage = () => {
  return useMutation({
    mutationFn: (packageId: string) => togglePackage(packageId),
  });
};
