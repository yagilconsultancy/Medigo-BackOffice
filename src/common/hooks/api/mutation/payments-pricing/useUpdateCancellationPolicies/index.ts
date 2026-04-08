import { useMutation } from '@tanstack/react-query';
import { updateCancellationPolicies } from '../../../../../services/api';
import { CancellationPolicyBulkUpdate } from '../../../../../types';

export const useUpdateCancellationPolicies = () => {
  return useMutation({
    mutationFn: (payload: CancellationPolicyBulkUpdate) =>
      updateCancellationPolicies(payload),
  });
};
