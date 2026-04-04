import { toast } from 'sonner';
import {
  useCreateIncident,
  useUpdateIncidentStatus,
  useAddIncidentNote,
} from '../../mutation';
import {
  CreateIncidentRequest,
  UpdateIncidentStatusRequest,
  CreateIncidentNoteRequest,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useIncidentsApi = () => {
  const doCreateIncident = useCreateIncident();
  const doUpdateStatus = useUpdateIncidentStatus();
  const doAddNote = useAddIncidentNote();

  const createIncident = async (
    payload: CreateIncidentRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doCreateIncident.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Incident created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating the incident');
      }
    );

    return success;
  };

  const updateIncidentStatus = async (
    payload: { incidentId: string } & UpdateIncidentStatusRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateStatus.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Incident status updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating the incident status');
      }
    );

    return success;
  };

  const addIncidentNote = async (
    payload: { incidentId: string } & CreateIncidentNoteRequest
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
    createIncident,
    updateIncidentStatus,
    addIncidentNote,
  };
};
