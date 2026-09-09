import { Box, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { DeletionRequestRow } from '../DeletionRequestCard';

// ─── Action Config ──────────────────────────────────────────────────────────

export type DeletionActionType = 'approve' | 'reject';

const actionConfig: Record<
  DeletionActionType,
  { title: string; message: string; confirmLabel: string; confirmBg: string }
> = {
  approve: {
    title: 'Approve & Delete Account',
    message:
      'This permanently deletes the account: the profile is removed and the login credentials are deactivated, so the user can no longer sign in. They will receive a confirmation email. This cannot be undone.',
    confirmLabel: 'Delete Account',
    confirmBg: '#EF4444',
  },
  reject: {
    title: 'Reject Deletion Request',
    message:
      'The account will be left active and the requester will be emailed the reason you give below. Write it for them to read.',
    confirmLabel: 'Reject Request',
    confirmBg: '#EF4444',
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

type DeletionActionModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  actionType: DeletionActionType;
  request: DeletionRequestRow | null;
  isSubmitting?: boolean;
  /** Receives the rejection reason, or the optional note on approval. */
  onConfirm?: (message?: string) => void;
};

export const DeletionActionModal = ({
  open,
  setOpen,
  actionType,
  request,
  isSubmitting,
  onConfirm,
}: DeletionActionModalProps) => {
  const config = actionConfig[actionType];
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage('');
  }, [actionType, request?.id, open]);

  if (!request) return null;

  // A rejection email with no explanation is worse than useless, so the
  // reason is mandatory; the approval note is internal and optional.
  const requiresMessage = actionType === 'reject';
  const isBlocked = (requiresMessage && !message.trim()) || Boolean(isSubmitting);

  const handleConfirm = () => {
    if (isBlocked) return;
    onConfirm?.(message.trim());
    setOpen(false);
  };

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label={config.title}
      sx={{
        '& .MuiDialog-paper': {
          width: '440px',
          maxWidth: '440px',
          padding: '0 !important',
        },
      }}
    >
      <Stack sx={{ width: '100%' }}>
        {/* Header */}
        <Stack
          spacing={'3px'}
          sx={{ padding: '20px 24px', borderBottom: '0.67px solid #F0F4F8' }}
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
            {request.submittedName} · {request.accountEmail || request.submittedEmail}
          </Typography>
        </Stack>

        {/* Body */}
        <Stack spacing={'18px'} sx={{ padding: '20px 24px' }}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              lineHeight: '1.6em',
              color: '#6B7280',
            }}
          >
            {config.message}
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={actionType === 'reject' ? 4 : 3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              actionType === 'reject'
                ? 'e.g. We could not confirm your identity from the details provided. Please contact info@getmedigo.com from the email address on your account.'
                : 'Optional internal note (not sent to the requester).'
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                background: '#FFFFFF',
              },
            }}
          />

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
                border: `0.67px solid ${config.confirmBg}`,
                borderRadius: '9px',
                cursor: isBlocked ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.15s ease',
                opacity: isBlocked ? 0.55 : 1,
                pointerEvents: isBlocked ? 'none' : 'auto',
                '&:hover': { opacity: 0.85 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: '#FFFFFF',
                }}
              >
                {isSubmitting ? 'Working…' : config.confirmLabel}
              </Typography>
            </Box>
          </RowStack>
        </Stack>
      </Stack>
    </AppModal>
  );
};
