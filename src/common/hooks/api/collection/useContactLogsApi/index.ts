import { toast } from 'sonner';
import { useCreateContactLog } from '../../mutation';
import { CreateContactLogRequest } from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useContactLogsApi = () => {
  const doCreateContactLog = useCreateContactLog();

  const createContactLog = async (
    payload: CreateContactLogRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doCreateContactLog.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Contact log created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating the contact log');
      }
    );

    return success;
  };

  return {
    createContactLog,
  };
};
