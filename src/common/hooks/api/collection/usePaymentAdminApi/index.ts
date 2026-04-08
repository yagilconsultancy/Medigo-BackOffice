import { toast } from 'sonner';
import {
  useProcessPayout,
  useCreateRefundRequest,
  useApproveRefund,
  useRejectRefund,
} from '../../mutation';
import {
  CreateRefundRequest,
  ApproveRefundRequest,
  RejectRefundRequest,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const usePaymentAdminApi = () => {
  const doProcessPayout = useProcessPayout();
  const doCreateRefundRequest = useCreateRefundRequest();
  const doApproveRefund = useApproveRefund();
  const doRejectRefund = useRejectRefund();

  const processPayout = async (driverId: string): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doProcessPayout.mutateAsync(driverId),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Payout processed successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while processing payout');
      }
    );

    return success;
  };

  const createRefundRequest = async (
    payload: CreateRefundRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doCreateRefundRequest.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Refund request created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating refund request');
      }
    );

    return success;
  };

  const approveRefund = async (
    refundId: string,
    payload: ApproveRefundRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doApproveRefund.mutateAsync({ refundId, payload }),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Refund approved successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while approving refund');
      }
    );

    return success;
  };

  const rejectRefund = async (
    refundId: string,
    payload: RejectRefundRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doRejectRefund.mutateAsync({ refundId, payload }),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Refund rejected successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while rejecting refund');
      }
    );

    return success;
  };

  return {
    processPayout,
    createRefundRequest,
    approveRefund,
    rejectRefund,
  };
};
