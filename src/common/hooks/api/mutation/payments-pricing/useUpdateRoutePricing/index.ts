import { useMutation } from '@tanstack/react-query';
import { updateRoutePricing } from '../../../../../services/api';
import { RoutePricingUpdate } from '../../../../../types';

export const useUpdateRoutePricing = () => {
  return useMutation({
    mutationFn: ({
      serviceType,
      payload,
    }: {
      serviceType: string;
      payload: RoutePricingUpdate;
    }) => updateRoutePricing(serviceType, payload),
  });
};
