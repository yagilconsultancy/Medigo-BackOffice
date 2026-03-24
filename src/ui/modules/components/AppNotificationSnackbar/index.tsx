import { IconButton, Snackbar, Stack, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { pxToRem } from '../../../../common';

type AppNotificationSnackbarProps = {
  open: boolean;
  onClose: () => void;
  message: string;
  autoHideDuration?: number;
};

export const AppNotificationSnackbar = ({
  open,
  onClose,
  message,
  autoHideDuration = 4000,
}: AppNotificationSnackbarProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          padding: 0,
          minWidth: 'unset',
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          width: '330px',
          height: '42px',
          background: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0px 8px 28px 0px rgba(0, 0, 0, 0.2)',
          padding: '0 14px 0 18px',
          gap: '10px',
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ fontSize: 15, color: '#07C035', flexShrink: 0 }}
        />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            lineHeight: '1.5em',
            color: '#111827',
            flex: 1,
          }}
        >
          {message}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            width: 26,
            height: 26,
            borderRadius: '6px',
            border: '0.58px solid #E5E7EB',
            flexShrink: 0,
          }}
        >
          <CloseIcon sx={{ fontSize: 11, color: '#6B7280' }} />
        </IconButton>
      </Stack>
    </Snackbar>
  );
};
