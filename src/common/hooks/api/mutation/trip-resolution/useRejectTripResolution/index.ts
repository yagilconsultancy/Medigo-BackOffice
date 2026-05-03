import { useMutation } from '@tanstack/react-query';
import { rejectTripResolution } from '../../../../../services';

export const useRejectTripResolution = () => {
  return useMutation({
    mutationFn: rejectTripResolution,
  });
};
