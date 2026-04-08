import { useMutation } from '@tanstack/react-query';
import { processPayout } from '../../../../../services';

export const useProcessPayout = () => {
  return useMutation({
    mutationFn: (driverId: string) => processPayout(driverId),
  });
};
