import { toast } from 'sonner';
import { useAcknowledgeAlert, useResolveAlert } from '../../mutation';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useAlertsApi = () => {
  const doAcknowledgeAlert = useAcknowledgeAlert();
  const doResolveAlert = useResolveAlert();

  const acknowledgeAlert = async (payload: {
    alertId: string;
  }): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doAcknowledgeAlert.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Alert acknowledged successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while acknowledging the alert');
      }
    );

    return success;
  };

  const resolveAlert = async (payload: {
    alertId: string;
  }): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doResolveAlert.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Alert resolved successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while resolving the alert');
      }
    );

    return success;
  };

  return {
    acknowledgeAlert,
    resolveAlert,
  };
};
