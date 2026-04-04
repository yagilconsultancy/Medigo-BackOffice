import { toast } from 'sonner';
import {
  useAssignInvestigator,
  useUpdateInvestigationStatus,
  useUpdateInvestigationProgress,
  useCloseInvestigation,
  useAddInvestigationNote,
} from '../../mutation';
import {
  AssignInvestigatorRequest,
  UpdateInvestigationStatusRequest,
  UpdateProgressRequest,
  CreateInvestigationNoteRequest,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useInvestigationsApi = () => {
  const doAssignInvestigator = useAssignInvestigator();
  const doUpdateStatus = useUpdateInvestigationStatus();
  const doUpdateProgress = useUpdateInvestigationProgress();
  const doCloseInvestigation = useCloseInvestigation();
  const doAddNote = useAddInvestigationNote();

  const assignInvestigator = async (
    payload: { invId: string } & AssignInvestigatorRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doAssignInvestigator.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Investigator assigned successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while assigning the investigator');
      }
    );

    return success;
  };

  const updateStatus = async (
    payload: { invId: string } & UpdateInvestigationStatusRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateStatus.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Investigation status updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error(
          'An error occurred while updating the investigation status'
        );
      }
    );

    return success;
  };

  const updateProgress = async (
    payload: { invId: string } & UpdateProgressRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateProgress.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Investigation progress updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error(
          'An error occurred while updating the investigation progress'
        );
      }
    );

    return success;
  };

  const closeInvestigation = async (payload: {
    invId: string;
  }): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doCloseInvestigation.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Investigation closed successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while closing the investigation');
      }
    );

    return success;
  };

  const addNote = async (
    payload: { invId: string } & CreateInvestigationNoteRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doAddNote.mutateAsync(payload),
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

  return {
    assignInvestigator,
    updateStatus,
    updateProgress,
    closeInvestigation,
    addNote,
  };
};
