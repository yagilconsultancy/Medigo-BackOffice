'use client';

import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { AppModal } from '../../../../../modules/components/AppModal';
import { AppButton, RowStack } from '../../../../../modules/components';
import { pxToRem, useRolesPermissionsApi } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type DeleteRoleModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roleId: string;
  roleName: string;
};

export const DeleteRoleModal = ({
  open,
  onClose,
  onSuccess,
  roleId,
  roleName,
}: DeleteRoleModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteAdminRole } = useRolesPermissionsApi();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteAdminRole({ roleId });
      if (success) {
        onClose();
        onSuccess();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="delete-role-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: 440,
          maxWidth: 440,
          borderRadius: '16px',
          boxShadow: '0px 32px 80px 0px rgba(0, 0, 0, 0.22)',
          overflow: 'hidden',
        },
      }}
    >
      <Stack>
        {/* Header */}
        <RowStack
          justifyContent={'space-between'}
          alignItems={'center'}
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
              color: '#111827',
            }}
          >
            Delete Role
          </Typography>

          <Box
            onClick={onClose}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '14px',
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              '&:hover': { background: '#E8ECF0' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </Box>
        </RowStack>

        {/* Content */}
        <Stack spacing={'20px'} sx={{ padding: '24px' }}>
          {/* Warning Icon */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            <WarningAmberRoundedIcon
              sx={{ fontSize: 28, color: '#EF4444' }}
            />
          </Box>

          {/* Message */}
          <Stack spacing={'8px'} alignItems={'center'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(15),
                color: '#111827',
                textAlign: 'center',
              }}
            >
              Are you sure you want to delete{' '}
              <Box component="span" sx={{ color: '#EF4444' }}>
                {roleName}
              </Box>
              ?
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: '#6B7280',
                textAlign: 'center',
                lineHeight: '1.6em',
              }}
            >
              This action cannot be undone. All admins assigned to this role
              will lose their permissions.
            </Typography>
          </Stack>

          {/* Buttons */}
          <RowStack spacing={'12px'} sx={{ pt: '4px' }}>
            <AppButton
              variant="contained"
              color="secondary"
              onClick={onClose}
              disabled={isDeleting}
              sx={{
                flex: 1,
                height: 43,
                borderRadius: '10px',
                background: '#F7F9FB',
                border: '0.67px solid #E8ECF0',
                color: '#374151',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: pxToRem(13),
                boxShadow: 'none',
                '&:hover': {
                  background: '#E8ECF0',
                  boxShadow: 'none',
                },
              }}
            >
              Cancel
            </AppButton>
            <AppButton
              variant="contained"
              onClick={handleDelete}
              isLoading={isDeleting}
              sx={{
                flex: 1,
                height: 43,
                borderRadius: '10px',
                background: '#EF4444',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: pxToRem(13),
                boxShadow: 'none',
                '&:hover': {
                  background: '#DC2626',
                  boxShadow: 'none',
                },
                '&.Mui-disabled': {
                  background: 'rgba(239, 68, 68, 0.5)',
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            >
              Delete Role
            </AppButton>
          </RowStack>
        </Stack>
      </Stack>
    </AppModal>
  );
};
