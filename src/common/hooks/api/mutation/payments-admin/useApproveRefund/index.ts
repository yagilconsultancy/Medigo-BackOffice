import { useMutation } from '@tanstack/react-query';
import { approveRefund } from '../../../../../services';
import { ApproveRefundRequest } from '../../../../../types';

export const useApproveRefund = () => {
  return useMutation({
    mutationFn: ({
      refundId,
      payload,
    }: {
      refundId: string;
      payload: ApproveRefundRequest;
    }) => approveRefund(refundId, payload),
  });
};
