import { useMutation } from '@tanstack/react-query';
import { saveConfiguration } from '../../../../../services/api';
import { CreateRateCardRequest } from '../../../../../types';

export const useSaveConfiguration = () => {
  return useMutation({
    mutationFn: (payload: CreateRateCardRequest) => saveConfiguration(payload),
  });
};
