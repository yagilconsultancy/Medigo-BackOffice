import { toast } from 'sonner';
import {
  useApproveAccountDeletion,
  useRejectAccountDeletion,
} from '../../mutation';
import {
  ApproveAccountDeletionPayload,
  RejectAccountDeletionPayload,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useAccountDeletionRequestsApi = () => {
  const doApprove = useApproveAccountDeletion();
  const doReject = useRejectAccountDeletion();

  const approveRequest = async (
    payload: ApproveAccountDeletionPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doApprove.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Account deleted and request marked as approved');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async (error) => {
        const responseData = error?.response?.data;

        if (responseData) {
          toast.error(extractResponseErrors(responseData));
          return;
        }

        toast.error('An error occurred while approving the request');
      }
    );

    return success;
  };

  const rejectRequest = async (
    payload: RejectAccountDeletionPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doReject.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Deletion request rejected');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async (error) => {
        const responseData = error?.response?.data;

        if (responseData) {
          toast.error(extractResponseErrors(responseData));
          return;
        }

        toast.error('An error occurred while rejecting the request');
      }
    );

    return success;
  };

  return {
    approveRequest,
    rejectRequest,
    isApproving: doApprove.isPending,
    isRejecting: doReject.isPending,
  };
};
