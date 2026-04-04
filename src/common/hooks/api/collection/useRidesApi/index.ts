import { toast } from 'sonner';
import { useAdminAssignDriver } from '../../mutation';
import { AdminAssignDriverRequest } from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useRidesApi = () => {
  const doAssignDriver = useAdminAssignDriver();

  const assignDriver = async (
    payload: { rideId: string } & AdminAssignDriverRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doAssignDriver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver assigned successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while assigning the driver');
      }
    );

    return success;
  };

  return {
    assignDriver,
  };
};
