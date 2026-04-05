import { toast } from 'sonner';
import {
  useCreateRiderIssue,
  useUpdateRiderIssueStatus,
  useAddRiderIssueNote,
  useSuspendRider,
  useReinstateRider,
} from '../../mutation';
import {
  AddRiderIssueNotePayload,
  CreateRiderIssuePayload,
  ReinstateRiderPayload,
  SuspendRiderPayload,
  UpdateRiderIssueStatusPayload,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useRidersApi = () => {
  const doCreateIssue = useCreateRiderIssue();
  const doUpdateIssueStatus = useUpdateRiderIssueStatus();
  const doAddIssueNote = useAddRiderIssueNote();
  const doSuspendRider = useSuspendRider();
  const doReinstateRider = useReinstateRider();

  const createIssue = async (
    payload: CreateRiderIssuePayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doCreateIssue.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Issue created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating the issue');
      }
    );

    return success;
  };

  const updateIssueStatus = async (
    payload: UpdateRiderIssueStatusPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateIssueStatus.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Issue status updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating the issue status');
      }
    );

    return success;
  };

  const addIssueNote = async (
    payload: AddRiderIssueNotePayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doAddIssueNote.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Note added successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while adding the note');
      }
    );

    return success;
  };

  const suspendRider = async (
    payload: SuspendRiderPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doSuspendRider.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Rider suspended successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while suspending the rider');
      }
    );

    return success;
  };

  const reinstateRider = async (
    payload: ReinstateRiderPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doReinstateRider.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Rider reinstated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while reinstating the rider');
      }
    );

    return success;
  };

  return {
    createIssue,
    updateIssueStatus,
    addIssueNote,
    suspendRider,
    reinstateRider,
  };
};
