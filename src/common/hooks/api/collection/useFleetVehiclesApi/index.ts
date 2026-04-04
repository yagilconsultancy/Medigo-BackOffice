import { toast } from 'sonner';
import {
  useCreateFleetVehicle,
  useUpdateFleetVehicle,
  useChangeFleetVehicleStatus,
  useAssignDriverToVehicle,
  useUnassignDriverFromVehicle,
  useUploadVehicleDocument,
  useReplaceVehicleDocument,
  useScheduleVehicleMaintenance,
  useUpdateVehicleCategory,
} from '../../mutation';
import {
  AssignDriverToVehiclePayload,
  ChangeVehicleStatusPayload,
  ReplaceVehicleDocumentPayload,
  ScheduleMaintenancePayload,
  UnassignDriverFromVehiclePayload,
  UpdateVehicleCategoryPayload,
  UpdateVehiclePayload,
  UploadVehicleDocumentPayload,
  VehicleCreate,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useFleetVehiclesApi = () => {
  const doCreate = useCreateFleetVehicle();
  const doUpdate = useUpdateFleetVehicle();
  const doChangeStatus = useChangeFleetVehicleStatus();
  const doAssignDriver = useAssignDriverToVehicle();
  const doUnassignDriver = useUnassignDriverFromVehicle();
  const doUploadDocument = useUploadVehicleDocument();
  const doReplaceDocument = useReplaceVehicleDocument();
  const doScheduleMaintenance = useScheduleVehicleMaintenance();
  const doUpdateCategory = useUpdateVehicleCategory();

  const createVehicle = async (
    payload: VehicleCreate
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doCreate.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Vehicle created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating the vehicle');
      }
    );

    return success;
  };

  const updateVehicle = async (
    payload: UpdateVehiclePayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdate.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Vehicle updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating the vehicle');
      }
    );

    return success;
  };

  const changeVehicleStatus = async (
    payload: ChangeVehicleStatusPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doChangeStatus.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Vehicle status updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while changing vehicle status');
      }
    );

    return success;
  };

  const assignDriver = async (
    payload: AssignDriverToVehiclePayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doAssignDriver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver assigned to vehicle successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while assigning the driver');
      }
    );

    return success;
  };

  const unassignDriver = async (
    payload: UnassignDriverFromVehiclePayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUnassignDriver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver unassigned from vehicle successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while unassigning the driver');
      }
    );

    return success;
  };

  const uploadDocument = async (
    payload: UploadVehicleDocumentPayload
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

  const replaceDocument = async (
    payload: ReplaceVehicleDocumentPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doReplaceDocument.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Document replaced successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while replacing the document');
      }
    );

    return success;
  };

  const scheduleMaintenance = async (
    payload: ScheduleMaintenancePayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doScheduleMaintenance.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Maintenance scheduled successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while scheduling maintenance');
      }
    );

    return success;
  };

  const updateCategory = async (
    payload: UpdateVehicleCategoryPayload
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateCategory.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Vehicle category updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating the category');
      }
    );

    return success;
  };

  return {
    createVehicle,
    updateVehicle,
    changeVehicleStatus,
    assignDriver,
    unassignDriver,
    uploadDocument,
    replaceDocument,
    scheduleMaintenance,
    updateCategory,
  };
};
