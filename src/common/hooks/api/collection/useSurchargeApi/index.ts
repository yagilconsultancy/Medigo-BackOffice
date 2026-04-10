import { toast } from 'sonner';
import {
  useCreateSurchargeRule,
  useUpdateSurchargeRule,
  useDeleteSurchargeRule,
} from '../../mutation';
import { SurchargeRuleCreate, SurchargeRuleUpdate } from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useSurchargeApi = () => {
  const doCreateSurchargeRule = useCreateSurchargeRule();
  const doUpdateSurchargeRule = useUpdateSurchargeRule();
  const doDeleteSurchargeRule = useDeleteSurchargeRule();

  const createSurchargeRule = async (
    data: SurchargeRuleCreate
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doCreateSurchargeRule.mutateAsync(data),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Surcharge created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating surcharge');
      }
    );

    return success;
  };

  const updateSurchargeRule = async (payload: {
    ruleId: string;
    data: SurchargeRuleUpdate;
  }): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateSurchargeRule.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating surcharge');
      }
    );

    return success;
  };

  const deleteSurchargeRule = async (ruleId: string): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doDeleteSurchargeRule.mutateAsync(ruleId),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Surcharge deleted successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while deleting surcharge');
      }
    );

    return success;
  };

  return {
    createSurchargeRule,
    updateSurchargeRule,
    deleteSurchargeRule,
  };
};
