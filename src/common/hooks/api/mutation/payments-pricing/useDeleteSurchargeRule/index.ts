import { useMutation } from '@tanstack/react-query';
import { deleteSurchargeRule } from '../../../../../services/api';

export const useDeleteSurchargeRule = () => {
  return useMutation({
    mutationFn: (ruleId: string) => deleteSurchargeRule(ruleId),
  });
};
