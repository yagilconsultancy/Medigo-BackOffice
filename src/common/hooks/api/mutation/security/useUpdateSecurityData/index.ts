import { useMutation } from '@tanstack/react-query';
import { updateSecurityData } from '../../../../../services';

export const useUpdateSecurityData = () => {
  return useMutation({
    mutationFn: updateSecurityData,
  });
};
