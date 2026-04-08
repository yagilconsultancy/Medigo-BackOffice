import { useMutation } from '@tanstack/react-query';
import { updateSurchargeRule } from '../../../../../services/api';
import { SurchargeRuleUpdate } from '../../../../../types';

export const useUpdateSurchargeRule = () => {
  return useMutation({
    mutationFn: ({
      ruleId,
      payload,
    }: {
      ruleId: string;
      payload: SurchargeRuleUpdate;
    }) => updateSurchargeRule(ruleId, payload),
  });
};
