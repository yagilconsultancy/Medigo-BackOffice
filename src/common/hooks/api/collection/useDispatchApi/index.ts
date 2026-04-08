import { toast } from 'sonner';
import {
  useManuallyAssignDriver,
  useUpdateDispatchSettings,
  useTriggerAutoDispatch,
} from '../../mutation';
import {
  ManualAssignmentRequest,
  UpdateAutoDispatchSettingsRequest,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useDispatchApi = () => {
  const doManuallyAssignDriver = useManuallyAssignDriver();
  const doUpdateSettings = useUpdateDispatchSettings();
  const doTriggerAutoDispatch = useTriggerAutoDispatch();

  const manuallyAssignDriver = async (
    payload: { rideId: string } & ManualAssignmentRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doManuallyAssignDriver.mutateAsync(payload),
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

  const updateDispatchSettings = async (
    payload: UpdateAutoDispatchSettingsRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateSettings.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Dispatch settings updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating dispatch settings');
      }
    );

    return success;
  };

  const triggerAutoDispatch = async (): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doTriggerAutoDispatch.mutateAsync(),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          const data = responseData.data;
          toast.success(
            `Auto-dispatch completed: ${data?.assigned_count || 0} rides assigned, ${data?.failed_count || 0} failed`
          );
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while triggering auto-dispatch');
      }
    );

    return success;
  };

  return {
    manuallyAssignDriver,
    updateDispatchSettings,
    triggerAutoDispatch,
  };
};
