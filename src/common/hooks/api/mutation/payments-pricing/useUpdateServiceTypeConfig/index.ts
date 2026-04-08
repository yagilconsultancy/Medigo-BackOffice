import { useMutation } from '@tanstack/react-query';
import { updateServiceTypeConfig } from '../../../../../services/api';
import { ServiceTypeConfigUpdate } from '../../../../../types';

export const useUpdateServiceTypeConfig = () => {
  return useMutation({
    mutationFn: ({
      serviceType,
      payload,
    }: {
      serviceType: string;
      payload: ServiceTypeConfigUpdate;
    }) => updateServiceTypeConfig(serviceType, payload),
  });
};
