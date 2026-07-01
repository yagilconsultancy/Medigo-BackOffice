import { useMutation } from '@tanstack/react-query';
import { resendDriverReactivation } from '../../../../../services';

export const useResendDriverReactivation = () => {
  return useMutation({
    mutationFn: resendDriverReactivation,
  });
};
