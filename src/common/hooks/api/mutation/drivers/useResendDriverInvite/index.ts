import { useMutation } from '@tanstack/react-query';
import { resendDriverInvite } from '../../../../../services';

export const useResendDriverInvite = () => {
  return useMutation({
    mutationFn: resendDriverInvite,
  });
};
