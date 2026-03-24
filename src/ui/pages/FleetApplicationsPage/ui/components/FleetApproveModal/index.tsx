'use client';

import { alpha, Divider, Stack, Typography } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import {
  AppButton,
  AppModal,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { FleetApplication } from '../ApplicationCard';

type FleetApproveModalProps = {
  open: boolean;
  handleClose: () => void;
  application: FleetApplication | null;
};

export const FleetApproveModal = ({
  open,
  handleClose,
  application,
}: FleetApproveModalProps) => {
  if (!application) return null;

  return (
    <AppModal label="fleet-approve-modal" open={open} setOpen={handleClose}>
      <Stack 
        spacing={2} 
        divider={<Divider />}
        sx={{
          width: '350px'
        }}
      >
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
            Approve Application
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
        <Stack spacing={1}>
          <Typography
           sx={{
            color: 'text.secondary',
            fontSize: pxToRem(13),
            fontFamily: (theme) => theme.typography.fontFamily,
            lineHeight: '19.5px',
            fontWeight: 400
           }}
          >This will approve the fleet partner application and notify the applicant.</Typography>
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
                background: '#059669',
                color: (theme) => theme.palette.background.default,
                fontWeight: 600,
                fontSize: pxToRem(13),
                lineHeight: '19.5px',
                '&:hover': {
                  background: alpha('#059669', 0.95),
                },
              }}
              fullWidth
              onClick={handleClose}
            >
              Confirm 
            </AppButton>
          </RowStack>
        </Stack>
      </Stack>
    </AppModal>
  );
};
