import { useMutation } from '@tanstack/react-query';
import { createRefundRequest } from '../../../../../services';

export const useCreateRefundRequest = () => {
  return useMutation({
    mutationFn: createRefundRequest,
  });
};
