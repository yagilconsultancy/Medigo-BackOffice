import { toast } from 'sonner';
import {
  useApproveFleetApplication,
  useDeleteFleetApplication,
  useRejectFleetApplication,
  useRequestInfoFleetApplication,
  useUploadFleetApplicationDocument,
} from '../../mutation';
import {
  ApproveFleetApplicationPayload,
  DeleteFleetApplicationPayload,
  RejectFleetApplicationPayload,
  RequestInfoFleetApplicationPayload,
  UploadFleetApplicationDocumentPayload,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useFleetApplicationsApi = () => {
  const doApprove = useApproveFleetApplication();
  const doReject = useRejectFleetApplication();
  const doRequestInfo = useRequestInfoFleetApplication();
  const doUploadDocument = useUploadFleetApplicationDocument();
  const doDelete = useDeleteFleetApplication();

  const approveApplication = async (
    payload: ApproveFleetApplicationPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doApprove.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Application approved successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while approving the application');
      }
    );

    return success;
  };

  const rejectApplication = async (
    payload: RejectFleetApplicationPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doReject.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Application rejected successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while rejecting the application');
      }
    );

    return success;
  };

  const requestInfoApplication = async (
    payload: RequestInfoFleetApplicationPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doRequestInfo.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Information request sent successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while requesting information');
      }
    );

    return success;
  };

  const deleteApplication = async (
    payload: DeleteFleetApplicationPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doDelete.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Application deleted successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while deleting the application');
      }
    );

    return success;
  };

  const uploadApplicationDocument = async (
    payload: UploadFleetApplicationDocumentPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUploadDocument.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Document uploaded successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while uploading the document');
      }
    );

    return success;
  };

  return {
    approveApplication,
    rejectApplication,
    requestInfoApplication,
    deleteApplication,
    uploadApplicationDocument,
  };
};
