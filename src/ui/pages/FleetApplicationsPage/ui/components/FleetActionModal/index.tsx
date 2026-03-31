import { Box, Stack, Typography } from '@mui/material';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { FleetApplicationRow } from '../ApplicationCard';

// ─── Action Config ──────────────────────────────────────────────────────────

export type FleetActionType = 'approve' | 'reject' | 'request-docs';

const actionConfig: Record<
  FleetActionType,
  {
    title: string;
    message: string;
    confirmBg: string;
    confirmColor: string;
    confirmBorder?: string;
  }
> = {
  approve: {
    title: 'Approve Application',
    message:
      'This will approve the fleet partner application and notify the applicant.',
    confirmBg: '#059669',
    confirmColor: '#FFFFFF',
  },
  reject: {
    title: 'Reject Application',
    message:
      'This will reject the application. The applicant will be notified.',
    confirmBg: '#EF4444',
    confirmColor: '#FFFFFF',
  },
  'request-docs': {
    title: 'Request Documents',
    message: 'This will request additional documents from the applicant.',
    confirmBg: '#F7F9FB',
    confirmColor: '#374151',
    confirmBorder: '#E8ECF0',
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

type FleetActionModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  actionType: FleetActionType;
  application: FleetApplicationRow | null;
  onConfirm?: () => void;
};

export const FleetActionModal = ({
  open,
  setOpen,
  actionType,
  application,
  onConfirm,
}: FleetActionModalProps) => {
  if (!application) return null;

  const config = actionConfig[actionType];

  const handleConfirm = () => {
    onConfirm?.();
    setOpen(false);
  };

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label={config.title}
      sx={{
        '& .MuiDialog-paper': {
          width: '400px',
          maxWidth: '400px',
          padding: '0 !important',
        },
      }}
    >
      <Stack sx={{ width: '100%' }}>
        {/* Header */}
        <Stack
          spacing={'3px'}
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(15),
              lineHeight: '1.5em',
              color: '#111827',
            }}
          >
            {config.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              lineHeight: '1.5em',
              color: '#6B7280',
            }}
          >
            {application.companyName} · {application.appId}
          </Typography>
        </Stack>

        {/* Body */}
        <Stack spacing={'20px'} sx={{ padding: '20px 24px' }}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              lineHeight: '1.5em',
              color: '#6B7280',
            }}
          >
            {config.message}
          </Typography>

          {/* Buttons */}
          <RowStack spacing={'12px'}>
            <Box
              onClick={() => setOpen(false)}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '41px',
                background: '#F7F9FB',
                border: '0.67px solid #E8ECF0',
                borderRadius: '9px',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
                '&:hover': { opacity: 0.85 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: '#374151',
                  textAlign: 'center',
                }}
              >
                Cancel
              </Typography>
            </Box>
            <Box
              onClick={handleConfirm}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '41px',
                background: config.confirmBg,
                border: `0.67px solid ${config.confirmBorder || config.confirmBg}`,
                borderRadius: '9px',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
                '&:hover': { opacity: 0.85 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: config.confirmColor,
                  textAlign: 'center',
                }}
              >
                Confirm
              </Typography>
            </Box>
          </RowStack>
        </Stack>
      </Stack>
    </AppModal>
  );
};
