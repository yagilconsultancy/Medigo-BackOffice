import { toast } from 'sonner';
import { useCreateCaregiver, useUpdateCaregiver } from '../../mutation';
import { tryExecute, extractResponseErrors } from '../../../../utils';
import {
  CaregiverCreateRequest,
  UpdateCaregiverPayload,
} from '../../../../types';

export const useCaregiversApi = () => {
  const doCreateCaregiver = useCreateCaregiver();
  const doUpdateCaregiver = useUpdateCaregiver();

  const createCaregiver = async (
    payload: CaregiverCreateRequest
  ): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doCreateCaregiver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Caregiver created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating the caregiver');
      }
    );
    return success;
  };

  const updateCaregiver = async (
    payload: UpdateCaregiverPayload
  ): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doUpdateCaregiver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Caregiver updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating the caregiver');
      }
    );
    return success;
  };

  return {
    createCaregiver,
    updateCaregiver,
  };
};
