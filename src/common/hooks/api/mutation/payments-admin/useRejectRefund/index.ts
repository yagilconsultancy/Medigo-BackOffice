import { useMutation } from '@tanstack/react-query';
import { rejectRefund } from '../../../../../services';
import { RejectRefundRequest } from '../../../../../types';

export const useRejectRefund = () => {
  return useMutation({
    mutationFn: ({
      refundId,
      payload,
    }: {
      refundId: string;
      payload: RejectRefundRequest;
    }) => rejectRefund(refundId, payload),
  });
};
