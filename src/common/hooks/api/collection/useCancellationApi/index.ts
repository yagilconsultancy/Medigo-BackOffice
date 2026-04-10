import { toast } from 'sonner';
import { tryExecute, extractResponseErrors } from '../../../..';
import { useUpdateCancellationPolicies } from '../../mutation/payments-pricing';
import { CancellationPolicyBulkUpdate } from '../../../../types';

export const useCancellationApi = () => {
  const doUpdatePolicies = useUpdateCancellationPolicies();

  const updatePolicies = async (
    payload: CancellationPolicyBulkUpdate
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdatePolicies.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Cancellation policies updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating cancellation policies');
      }
    );

    return success;
  };

  return { updatePolicies };
};
