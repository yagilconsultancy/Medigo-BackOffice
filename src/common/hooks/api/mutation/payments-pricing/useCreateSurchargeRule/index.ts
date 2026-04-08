import { useMutation } from '@tanstack/react-query';
import { createSurchargeRule } from '../../../../../services/api';
import { SurchargeRuleCreate } from '../../../../../types';

export const useCreateSurchargeRule = () => {
  return useMutation({
    mutationFn: (payload: SurchargeRuleCreate) => createSurchargeRule(payload),
  });
};
