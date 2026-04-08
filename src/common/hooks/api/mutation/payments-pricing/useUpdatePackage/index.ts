import { useMutation } from '@tanstack/react-query';
import { updatePackage } from '../../../../../services/api';
import { RidePackageUpdate } from '../../../../../types';

export const useUpdatePackage = () => {
  return useMutation({
    mutationFn: ({
      packageId,
      payload,
    }: {
      packageId: string;
      payload: RidePackageUpdate;
    }) => updatePackage(packageId, payload),
  });
};
