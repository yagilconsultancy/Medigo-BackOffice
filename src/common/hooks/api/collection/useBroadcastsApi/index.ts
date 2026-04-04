import { toast } from 'sonner';
import {
  useSendSystemBroadcast,
  useSendRiderBroadcast,
  useSendDriverBroadcast,
  useSendFleetBroadcast,
} from '../../mutation';
import { SendBroadcastRequest } from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useBroadcastsApi = () => {
  const doSendSystemBroadcast = useSendSystemBroadcast();
  const doSendRiderBroadcast = useSendRiderBroadcast();
  const doSendDriverBroadcast = useSendDriverBroadcast();
  const doSendFleetBroadcast = useSendFleetBroadcast();

  const sendSystemBroadcast = async (
    payload: SendBroadcastRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doSendSystemBroadcast.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('System broadcast sent successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while sending the system broadcast');
      }
    );

    return success;
  };

  const sendRiderBroadcast = async (
    payload: SendBroadcastRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doSendRiderBroadcast.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Rider broadcast sent successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while sending the rider broadcast');
      }
    );

    return success;
  };

  const sendDriverBroadcast = async (
    payload: SendBroadcastRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doSendDriverBroadcast.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver broadcast sent successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while sending the driver broadcast');
      }
    );

    return success;
  };

  const sendFleetBroadcast = async (
    payload: SendBroadcastRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doSendFleetBroadcast.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Fleet broadcast sent successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while sending the fleet broadcast');
      }
    );

    return success;
  };

  return {
    sendSystemBroadcast,
    sendRiderBroadcast,
    sendDriverBroadcast,
    sendFleetBroadcast,
  };
};
