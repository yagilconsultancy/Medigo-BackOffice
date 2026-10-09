import { toast } from 'sonner';
import {
  useApproveDriver,
  useSuspendDriver,
  useReactivateDriver,
  useResendDriverInvite,
  useResendDriverReactivation,
  useReAssignDriver,
  useCreateDriver,
  useUpdateDriver,
  useDeactivateDriver,
} from '../../mutation';
import {
  ApproveDriverPayload,
  CreateDriverPayload,
  DeactivateDriverPayload,
  ReactivateDriverPayload,
  ReassignDriverFleetPayload,
  ResendDriverInvitePayload,
  ResendDriverReactivationPayload,
  SuspendDriverPayload,
  UpdateDriverPayload,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useDriversApi = () => {
  const doApproveDriver = useApproveDriver();
  const doSuspendDriver = useSuspendDriver();
  const doReactivateDriver = useReactivateDriver();
  const doResendDriverInvite = useResendDriverInvite();
  const doResendDriverReactivation = useResendDriverReactivation();
  const doReAssignDriver = useReAssignDriver();
  const doCreateDriver = useCreateDriver();
  const doUpdateDriver = useUpdateDriver();
  const doDeactivateDriver = useDeactivateDriver();

  const approveDriver = async (
    payload: ApproveDriverPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doApproveDriver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver approved successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while approving the driver');
      }
    );

    return success;
  };

  const suspendDriver = async (
    payload: SuspendDriverPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doSuspendDriver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver suspended successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while suspending the driver');
      }
    );

    return success;
  };

  const reactivateDriver = async (
    payload: ReactivateDriverPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doReactivateDriver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver reactivated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while reactivating the driver');
      }
    );

    return success;
  };

  const resendDriverInvite = async (
    payload: ResendDriverInvitePayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doResendDriverInvite.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Activation code resent successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error(
          'Could not resend the code. The driver must be approved and must not have set a password yet.'
        );
      }
    );

    return success;
  };

  const resendDriverReactivation = async (
    payload: ResendDriverReactivationPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doResendDriverReactivation.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Reactivation email resent successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while resending the reactivation email');
      }
    );

    return success;
  };

  const reassignDriver = async (
    payload: ReassignDriverFleetPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doReAssignDriver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver reassigned successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while reassigning the driver');
      }
    );

    return success;
  };

  const createDriver = async (
    payload: CreateDriverPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doCreateDriver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating the driver');
      }
    );

    return success;
  };

  const updateDriver = async (
    payload: UpdateDriverPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateDriver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating the driver');
      }
    );

    return success;
  };

  const deactivateDriver = async (
    payload: DeactivateDriverPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doDeactivateDriver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver deleted successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while deleting the driver');
      }
    );

    return success;
  };

  return {
    approveDriver,
    suspendDriver,
    reactivateDriver,
    resendDriverInvite,
    resendDriverReactivation,
    reassignDriver,
    createDriver,
    updateDriver,
    deactivateDriver,
  };
};
