import { toast } from 'sonner';
import {
  useAddFleetPartner,
  useUpdateFleetCompany,
  useToggleFleetCompanyStatus,
  useUploadFleetCompanyDocument,
} from '../../mutation';
import {
  AddFleetPartnerRequest,
  ToggleFleetCompanyStatusPayload,
  UpdateFleetCompanyPayload,
  UploadFleetCompanyDocumentPayload,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useFleetCompaniesApi = () => {
  const doAddPartner = useAddFleetPartner();
  const doUpdate = useUpdateFleetCompany();
  const doToggleStatus = useToggleFleetCompanyStatus();
  const doUploadDocument = useUploadFleetCompanyDocument();

  const addPartner = async (
    payload: AddFleetPartnerRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doAddPartner.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Fleet partner added successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while adding the fleet partner');
      }
    );

    return success;
  };

  const updateCompany = async (
    payload: UpdateFleetCompanyPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdate.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Fleet company updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating the fleet company');
      }
    );

    return success;
  };

  const toggleCompanyStatus = async (
    payload: ToggleFleetCompanyStatusPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doToggleStatus.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success(
            payload.is_active
              ? 'Fleet company activated successfully'
              : 'Fleet company deactivated successfully'
          );
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while toggling company status');
      }
    );

    return success;
  };

  const uploadCompanyDocument = async (
    payload: UploadFleetCompanyDocumentPayload
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
    addPartner,
    updateCompany,
    toggleCompanyStatus,
    uploadCompanyDocument,
  };
};
