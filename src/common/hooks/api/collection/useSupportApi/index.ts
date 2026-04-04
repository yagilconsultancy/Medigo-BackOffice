import { toast } from 'sonner';
import { useReopenTicket, useResolveTicket } from '../../mutation';
import { ReopenTicketPayload, ResolveTicketPayload } from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useSupportApi = () => {
  const doReopenTicket = useReopenTicket();
  const doResolveTicket = useResolveTicket();

  const reopenTicket = async (
    payload: ReopenTicketPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doReopenTicket.mutateAsync(payload),
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

  const resolveTicket = async (
    payload: ResolveTicketPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doResolveTicket.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Ticket resolved successfully');
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
    reopenTicket,
    resolveTicket,
  };
};
