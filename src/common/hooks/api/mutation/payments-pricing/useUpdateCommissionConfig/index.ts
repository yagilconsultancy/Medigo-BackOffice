import { useMutation } from '@tanstack/react-query';
import { updateCommissionConfig } from '../../../../../services/api';
import { CommissionConfigUpdate } from '../../../../../types';

export const useUpdateCommissionConfig = () => {
  return useMutation({
    mutationFn: (payload: CommissionConfigUpdate) =>
      updateCommissionConfig(payload),
  });
};
