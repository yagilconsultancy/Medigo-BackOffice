import { toast } from 'sonner';
import {
  useCreateAdminRole,
  useUpdateAdminRole,
  useDeleteAdminRole,
  useAssignRole,
  useRemoveRole,
  useSavePermissions,
} from '../../mutation';
import { tryExecute, extractResponseErrors } from '../../../../utils';
import {
  AdminRoleCreateRequest,
  UpdateAdminRolePayload,
  DeleteAdminRolePayload,
  AssignRoleRequest,
  ModulePermissionUpdate,
} from '../../../../types';

export const useRolesPermissionsApi = () => {
  const doCreateAdminRole = useCreateAdminRole();
  const doUpdateAdminRole = useUpdateAdminRole();
  const doDeleteAdminRole = useDeleteAdminRole();
  const doAssignRole = useAssignRole();
  const doRemoveRole = useRemoveRole();
  const doSavePermissions = useSavePermissions();

  const createAdminRole = async (
    payload: AdminRoleCreateRequest
  ): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doCreateAdminRole.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Admin role created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating the admin role');
      }
    );
    return success;
  };

  const updateAdminRole = async (
    payload: UpdateAdminRolePayload
  ): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doUpdateAdminRole.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Admin role updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating the admin role');
      }
    );
    return success;
  };

  const deleteAdminRole = async (
    payload: DeleteAdminRolePayload
  ): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doDeleteAdminRole.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Admin role deleted successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while deleting the admin role');
      }
    );
    return success;
  };

  const assignRole = async (payload: AssignRoleRequest): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doAssignRole.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Role assigned successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while assigning the role');
      }
    );
    return success;
  };

  const removeRole = async (payload: AssignRoleRequest): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doRemoveRole.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Role removed successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while removing the role');
      }
    );
    return success;
  };

  const savePermissions = async (
    permissions: ModulePermissionUpdate[]
  ): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doSavePermissions.mutateAsync(permissions),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Permissions saved successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while saving permissions');
      }
    );
    return success;
  };

  return {
    createAdminRole,
    updateAdminRole,
    deleteAdminRole,
    assignRole,
    removeRole,
    savePermissions,
  };
};
