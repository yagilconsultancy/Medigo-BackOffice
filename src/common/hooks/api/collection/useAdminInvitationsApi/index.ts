import { toast } from 'sonner';
import { tryExecute, extractResponseErrors } from '../../../../utils';
import { useInviteAdmin, useRevokeAdminInvitation } from '../../mutation';
import type { AdminInviteRequest } from '../../../../types';

/**
 * Collection hook for admin invitation operations
 * Bundles mutation hooks with tryExecute, toast notifications, and Promise<boolean> returns
 */
export const useAdminInvitationsApi = () => {
  const doInviteAdmin = useInviteAdmin();
  const doRevokeInvitation = useRevokeAdminInvitation();

  /**
   * Send an admin invitation email
   * @param payload - Admin invitation details (full_name, email, role_name)
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const inviteAdmin = async (payload: AdminInviteRequest): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doInviteAdmin.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success(
            responseData.data.message || 'Admin invitation sent successfully'
          );
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while sending the admin invitation');
      }
    );
    return success;
  };

  /**
   * Revoke a pending admin invitation
   * @param invitationId - UUID of the invitation to revoke
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const revokeInvitation = async (invitationId: string): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doRevokeInvitation.mutateAsync(invitationId),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('Admin invitation revoked successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while revoking the admin invitation');
      }
    );
    return success;
  };

  return {
    inviteAdmin,
    revokeInvitation,
  };
};
