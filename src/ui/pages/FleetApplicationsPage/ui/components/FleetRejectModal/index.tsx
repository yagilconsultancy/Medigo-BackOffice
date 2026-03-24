'use client';

import { alpha, Divider, Stack, TextField, Typography } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {
  AppButton,
  AppModal,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { FleetApplication } from '../ApplicationCard';

type FleetRejectModalProps = {
  open: boolean;
  handleClose: () => void;
  application: FleetApplication | null;
};

export const FleetRejectModal = ({
  open,
  handleClose,
  application,
}: FleetRejectModalProps) => {
  if (!application) return null;

  return (
    <AppModal label="fleet-reject-modal" open={open} setOpen={handleClose}>
      <Stack 
       spacing={2} 
       divider={<Divider />}
       sx={{
        width: '350px'
       }}
      >
        <RowStack spacing={'12px'}>
          <Stack spacing={0.5}>
            <Typography
              sx={{
                color: (theme) => theme.color.deepBlue,
                fontWeight: 700,
                fontFamily: (theme) => theme.typography.fontFamily,
                fontSize: pxToRem(15),
                lineHeight: '22.5px',
              }}
            >
              Reject Application
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                fontFamily: (theme) => theme.typography.fontFamily,
                fontSize: pxToRem(13),
                lineHeight: '19.5px',
              }}
            >
              {application.appId} &middot; {application.companyName}
            </Typography>
          </Stack>
        </RowStack>

        <Typography
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: pxToRem(13),
            lineHeight: '19px',
          }}
        >
          This will reject the application and notify the applicant with the
          reason provided.
        </Typography>

        <RowStack spacing={'12px'} width={'100%'}>
          <AppButton
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              color: (theme) => theme.color.grey,
              fontWeight: 600,
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
              '&:hover': {
                background: alpha('#F7F9FB', 0.1),
              },
            }}
            fullWidth
            onClick={handleClose}
          >
            Cancel
          </AppButton>
          <AppButton
            sx={{
              background: '#EF4444',
              color: (theme) => theme.palette.background.default,
              fontWeight: 600,
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
              '&:hover': {
                background: alpha('#EF4444', 0.95),
              },
            }}
            fullWidth
          >
            Confirm Rejection
          </AppButton>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
