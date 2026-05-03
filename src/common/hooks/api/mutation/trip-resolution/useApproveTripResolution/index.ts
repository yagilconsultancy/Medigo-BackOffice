import { useMutation } from '@tanstack/react-query';
import { approveTripResolution } from '../../../../../services';

export const useApproveTripResolution = () => {
  return useMutation({
    mutationFn: approveTripResolution,
  });
};
