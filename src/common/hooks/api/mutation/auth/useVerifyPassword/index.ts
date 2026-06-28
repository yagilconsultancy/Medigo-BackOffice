import { useMutation } from '@tanstack/react-query';
import { verifyPassword } from '../../../../../services';

export const useVerifyPassword = () => {
  return useMutation({
    mutationFn: verifyPassword,
  });
};
