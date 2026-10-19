import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  useChangePassword,
  useForgotPassword,
  useLogin,
  useLogout,
  useResendOtp,
  useRefresh,
  useResetPassword,
} from '../../mutation';
import {
  ApiChangePasswordPayload,
  ApiForgotPasswordPayload,
  ApiLoginPayload,
  ApiLoginRefreshRequest,
  ApiResetPasswordPayload,
  ApiResendOtpPayload,
} from '../../../../types';
import {
  extractApiErrorMessage,
  extractResponseErrors,
  removeForgotPasswordUserId,
  removeMustChangePassword,
  setMustChangePassword,
  setAuthToken,
  setForgotPasswordUserId,
  setRefreshToken,
  tryExecute,
} from '../../../../utils';
import Cookies from 'js-cookie';

export const useAuthApi = () => {
  const doLogin = useLogin();
  const router = useRouter();
  const doLogout = useLogout();
  const doRefresh = useRefresh();
  const doForgotPassword = useForgotPassword();
  const doResetPassword = useResetPassword();
  const doResendOtp = useResendOtp();
  const doChangePassword = useChangePassword();

  const login = async (payload: ApiLoginPayload): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doLogin.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          const token = responseData.data.access_token;
          const refreshToken = responseData.data.refresh_token;

          setAuthToken(token);
          setRefreshToken(refreshToken);

          success = true;
          if (responseData.data.must_change_password) {
            // New admin on a one-time password: must choose their own first
            setMustChangePassword();
            toast.info('Please choose a new password to continue');
            router.push('/change-password-required');
          } else {
            removeMustChangePassword();
            toast.success(`${responseData.message}`);
            router.push('/');
          }
        } else if (response.status === 401) {
          toast.error(extractResponseErrors(responseData));
        } else {
          toast.error('An error occurred');
        }
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
      }
    );

    return success;
  };

  const logout = async (payload: ApiLoginRefreshRequest | null): Promise<void> => {
    let serverOk = false;

    // Tell the server to revoke the refresh token when we have one. If that
    // call fails we still sign out on this device below.
    if (payload?.refresh_token) {
      await tryExecute(
        () => doLogout.mutateAsync(payload),
        async () => {
          serverOk = true;
        },
        async () => {
          serverOk = false;
        }
      );
    }

    // Always clear every sign-in cookie on this device, even if the server
    // call failed, so the session cannot be reused from this browser.
    Cookies.remove('medi_auth');
    Cookies.remove('medi_refresh');
    removeMustChangePassword();

    if (serverOk || !payload?.refresh_token) {
      toast.success('Logged out successfully');
    } else {
      toast.info('Logged out on this device');
    }
    router.push('/login');
  };

  const refresh = async (payload: ApiLoginRefreshRequest): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doRefresh.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          const token = responseData.data.access_token;

          setAuthToken(token);

          success = true;
          toast.success(`${responseData.message}`);
        } else if (response.status === 401) {
          toast.error(extractResponseErrors(responseData));
        } else {
          toast.error('An error occurred');
        }
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
      }
    );

    return success;
  };

  const forgotPassword = async (
    payload: ApiForgotPasswordPayload
  ): Promise<boolean> => {
    return await tryExecute(
      () => doForgotPassword.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          if (responseData.data?.user_id) {
            setForgotPasswordUserId(responseData.data.user_id);
          } else {
            toast.error('Unable to start password reset. Please try again.');
            return false;
          }

          toast.success('Password reset instructions sent to your email');
          return true;
        } else {
          toast.error(extractResponseErrors(responseData));
          return false;
        }
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
        return false;
      }
    );
  };

  const resetPassword = async (
    payload: ApiResetPasswordPayload
  ): Promise<boolean> => {
    return await tryExecute(
      () => doResetPassword.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          removeForgotPasswordUserId();
          toast.success(
            'Password reset successfully. Please sign in with your new password.'
          );
          return true;
        } else {
          toast.error(extractResponseErrors(responseData));
          return false;
        }
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
        return false;
      }
    );
  };

  const resendResetPasswordOtp = async (
    payload: ApiResendOtpPayload
  ): Promise<boolean> => {
    return await tryExecute(
      () => doResendOtp.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          toast.success(
            responseData.message ??
              'A new password reset code has been sent to your email.'
          );
          return true;
        } else {
          toast.error(extractResponseErrors(responseData));
          return false;
        }
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
        return false;
      }
    );
  };

  const changePassword = async (
    payload: ApiChangePasswordPayload
  ): Promise<boolean> => {
    return await tryExecute(
      () => doChangePassword.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          toast.success('Password changed successfully');
          return true;
        } else {
          toast.error(extractResponseErrors(responseData));
          return false;
        }
      },
      async (error) => {
        toast.error(
          extractApiErrorMessage(
            error,
            error?.response?.status === 401
              ? 'Current password is incorrect'
              : 'An error occurred while changing password'
          )
        );
        return false;
      }
    );
  };

  return {
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
    resendResetPasswordOtp,
    changePassword,
  };
};
