import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useLogin } from '../../mutation';
import { ApiLoginPayload } from '../../../../types';
import {
  extractResponseErrors,
  setAuthToken,
  tryExecute,
} from '../../../../utils';

export const useAuthApi = () => {
  const doLogin = useLogin();
  const router = useRouter();

  const login = async (payload: ApiLoginPayload): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doLogin.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        console.log('Okkaaaayyy', response, responseData);

        if (responseData.success) {
          const token = responseData.data.access_token;
          //   const role = responseData.data.role;

          setAuthToken(token);
          //   setUserToken(token);

          //   if (role === "admin") {
          success = true;
          toast.success(`${responseData.message}`);
          router.push('/');
          //   } else {
          //     toast.error("You do not have access to this panel");
          //   }
          //Todo: handle the 403 error here
        } else if (response.status === 401) {
          toast.error(extractResponseErrors(responseData));
        } else {
          toast.error('An error occurred');
        }
      },
      async () => {
        toast.error('An error occurred');
      }
    );

    return success;
  };

  //   const activateAdmin = async (payload: ApiActivateAdminPayload): Promise<boolean> => {
  //     let success = false;

  //     await tryExecute(
  //       () => doActivateAdmin.mutateAsync(payload),
  //       async (response) => {
  //         const responseData = response.data;
  //         console.log("activate response", responseData);

  //         if (responseData.success) {
  //           success = true;
  //           router.push("/login");
  //           //Todo: handle the 403 error here
  //         } else if (response.status === 400) {
  //           toast.error(extractResponseErrors(responseData));
  //         } else {
  //           toast.error("An error occurred");
  //         }
  //       },
  //       async () => {
  //         toast.error("An error occurred");
  //       },
  //     );

  //     return success;
  //   };

  //   const logout = async (): Promise<void> => {
  //     await tryExecute(
  //       () => doLogout.mutateAsync(),
  //       async () => {
  //         // Clear server-side cookie (Next.js server action)
  //         await deleteAuthToken();

  //         // Clear client-side cookie
  //         setUserToken("");

  //         toast.success("Logged out successfully");
  //         router.push("/login");
  //       },
  //       async () => {
  //         toast.error("An error occurred during logout");
  //       },
  //     );
  //   };

  return {
    login,
    // activateAdmin,
    // logout,
  };
};
