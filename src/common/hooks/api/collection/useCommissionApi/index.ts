import { toast } from 'sonner';
import { tryExecute, extractResponseErrors } from '../../../..';
import { useUpdateCommissionConfig } from '../../mutation/payments-pricing';
import { CommissionConfigUpdate } from '../../../../types';

export const useCommissionApi = () => {
  const doUpdateConfig = useUpdateCommissionConfig();

  const updateConfig = async (
    payload: CommissionConfigUpdate
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateConfig.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Commission settings updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating commission settings');
      }
    );

    return success;
  };

  return { updateConfig };
};
