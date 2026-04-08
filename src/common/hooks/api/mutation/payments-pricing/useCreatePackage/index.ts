import { useMutation } from '@tanstack/react-query';
import { createPackage } from '../../../../../services/api';
import { RidePackageCreate } from '../../../../../types';

export const useCreatePackage = () => {
  return useMutation({
    mutationFn: (payload: RidePackageCreate) => createPackage(payload),
  });
};
