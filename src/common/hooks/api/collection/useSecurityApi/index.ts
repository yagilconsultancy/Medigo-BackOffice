import { toast } from "sonner";
import { useUpdateSecurityData } from "../../mutation";
import { UpdateSecuritySettingsRequest } from "../../../../types";
import { extractResponseErrors, tryExecute } from "../../../../utils";

export const useSecurityApi = () => {
  const doUpdateSecurityData = useUpdateSecurityData();

  const updateSecuritySettings = async (
    payload: UpdateSecuritySettingsRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateSecurityData.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success("Security settings updated successfully");
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error("An error occurred while updating security settings");
      }
    );

    return success;
  };

  return {
    updateSecuritySettings,
  };
};
