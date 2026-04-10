import { useMutation } from '@tanstack/react-query';

import { createSurchargeRule } from '../../../../../services/api';

export const useCreateSurchargeRule = () => {
  return useMutation({
    mutationFn: createSurchargeRule,
  });
};
