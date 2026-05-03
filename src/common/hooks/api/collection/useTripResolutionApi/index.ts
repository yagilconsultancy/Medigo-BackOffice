import { toast } from 'sonner';
import {
  useApproveTripResolution,
  useRejectTripResolution,
} from '../../mutation';
import {
  ApproveTripResolutionTicketPayload,
  RejectTripResolutionTicketPayload,
  ResolveTicketPayload,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useTripResolutionApi = () => {
  const doApproveTripResolution = useApproveTripResolution();
  const doRejectTripResolution = useRejectTripResolution();

  const approveTripResolution = async (
    payload: ApproveTripResolutionTicketPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doApproveTripResolution.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Ticket reopened successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while reopening the ticket');
      }
    );

    return success;
  };

  const rejectTripResolution = async (
    payload: RejectTripResolutionTicketPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doRejectTripResolution.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Ticket rejected successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while resolving the ticket');
      }
    );

    return success;
  };

  return {
    approveTripResolution,
    rejectTripResolution,
  };
};
