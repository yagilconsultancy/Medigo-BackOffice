import { useMutation } from '@tanstack/react-query';

import { updateSurchargeRule } from '../../../../../services/api';

export const useUpdateSurchargeRule = () => {
  return useMutation({
    mutationFn: updateSurchargeRule,
  });
};
