import { Stack, Typography, IconButton, alpha } from '@mui/material';
import { AppButton, AppModal, RowStack } from '../../../../../components';
import { pxToRem } from '../../../../../../../common';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';

type LogoutModalProps = {
  open: boolean;
  handleClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

export const LogoutModal = ({
  open,
  handleClose,
  onConfirm,
  isLoading = false,
}: LogoutModalProps) => {
  return (
    <AppModal label="logout-modal" open={open} setOpen={handleClose}>
      <Stack spacing={3} sx={{ width: '420px', alignItems: 'center' }}>
        <RowStack width={'100%'} justifyContent={'flex-end'}>
          <IconButton
            onClick={handleClose}
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #E5E7EB',
              borderRadius: '14px',
              width: '33.3px',
              height: '33.3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CloseIcon sx={{ color: '#6B7280', fontSize: 18 }} />
          </IconButton>
        </RowStack>

        <Stack spacing={2} alignItems="center">
          <Stack
            sx={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: alpha('#EF4444', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogoutIcon sx={{ color: '#EF4444', fontSize: 28 }} />
          </Stack>

          <Stack spacing={1} alignItems="center">
            <Typography
              sx={{
                color: (theme) => theme.color.deepBlue,
                fontWeight: 600,
                fontSize: pxToRem(20),
                lineHeight: '30px',
                fontFamily: (theme) => theme.typography.fontFamily,
              }}
            >
              Log out?
            </Typography>
            <Typography
              sx={{
                color: '#6B7280',
                fontWeight: 400,
                fontSize: pxToRem(14),
                lineHeight: '21px',
                fontFamily: (theme) => theme.typography.fontFamily,
                textAlign: 'center',
              }}
            >
              Any unsaved changes will be lost
            </Typography>
          </Stack>
        </Stack>

        <RowStack spacing={2} width={'100%'}>
          <AppButton
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              color: '#344054',
              fontWeight: 600,
              fontSize: pxToRem(14),
              lineHeight: '21px',
              '&:hover': {
                background: '#F7F9FB',
              },
            }}
            fullWidth
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </AppButton>
          <AppButton
            sx={{
              background: '#EF4444',
              color: '#FFF',
              fontWeight: 600,
              fontSize: pxToRem(14),
              lineHeight: '21px',
              '&:hover': {
                background: alpha('#EF4444', 0.9),
              },
            }}
            fullWidth
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Log out'}
          </AppButton>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
