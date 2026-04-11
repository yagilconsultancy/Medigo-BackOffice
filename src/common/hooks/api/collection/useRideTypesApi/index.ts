import { toast } from 'sonner';
import {
  useCreateRideType,
  useUpdateRideType,
  useToggleRideType,
} from '../../mutation';
import { tryExecute, extractResponseErrors } from '../../../../utils';
import {
  RideTypeCreateRequest,
  UpdateRideTypePayload,
  ToggleRideTypePayload,
} from '../../../../types';

export const useRideTypesApi = () => {
  const doCreateRideType = useCreateRideType();
  const doUpdateRideType = useUpdateRideType();
  const doToggleRideType = useToggleRideType();

  const createRideType = async (
    payload: RideTypeCreateRequest
  ): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doCreateRideType.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Ride type created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating the ride type');
      }
    );
    return success;
  };

  const updateRideType = async (
    payload: UpdateRideTypePayload
  ): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doUpdateRideType.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Ride type updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating the ride type');
      }
    );
    return success;
  };

  const toggleRideType = async (
    payload: ToggleRideTypePayload
  ): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doToggleRideType.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success(
            `Ride type ${payload.is_active ? 'activated' : 'deactivated'} successfully`
          );
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while toggling the ride type');
      }
    );
    return success;
  };

  return {
    createRideType,
    updateRideType,
    toggleRideType,
  };
};
