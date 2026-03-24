'use client';

import { alpha, Divider, Stack, TextField, Typography } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {
  AppButton,
  AppModal,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { FleetApplication } from '../ApplicationCard';

type FleetRequestDocsModalProps = {
  open: boolean;
  handleClose: () => void;
  application: FleetApplication | null;
};

export const FleetRequestDocsModal = ({
  open,
  handleClose,
  application,
}: FleetRequestDocsModalProps) => {
  if (!application) return null;

  return (
    <AppModal
      label="fleet-request-docs-modal"
      open={open}
      setOpen={handleClose}
    >
      <Stack spacing={2} divider={<Divider />}>
        <RowStack spacing={'12px'}>
          <DescriptionOutlinedIcon sx={{ fontSize: 22, color: '#6366F1' }} />
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
              Request Documents
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

        <Stack spacing={2}>
          <Stack
            sx={{
              background: '#F7F9FB',
              borderRadius: '14px',
              padding: '17px 16px',
            }}
            spacing={'8px'}
          >
            <Typography
              sx={{
                color: (theme) => theme.color.lightGrey,
                fontWeight: 400,
                fontFamily: (theme) => theme.typography.fontFamily,
                fontSize: pxToRem(11),
                textTransform: 'uppercase',
              }}
            >
              Current Documents
            </Typography>
            <RowStack spacing={'8px'} flexWrap="wrap">
              {application.documents.map((doc) => (
                <Typography
                  key={doc}
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12),
                    color: '#374151',
                    background: '#FFFFFF',
                    border: '0.67px solid #E8ECF0',
                    borderRadius: '100px',
                    padding: '4px 12px',
                  }}
                >
                  {doc}
                </Typography>
              ))}
            </RowStack>
          </Stack>

          <Stack spacing={'8px'}>
            <Typography
              sx={{
                color: (theme) => theme.color.deepBlue,
                fontWeight: 600,
                fontFamily: (theme) => theme.typography.fontFamily,
                fontSize: pxToRem(13),
              }}
            >
              Additional Documents Needed
            </Typography>
            <TextField
              multiline
              rows={3}
              placeholder="Specify which additional documents are required..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontSize: pxToRem(13),
                  fontFamily: (theme) => theme.typography.fontFamily,
                  '& fieldset': {
                    borderColor: '#E8ECF0',
                  },
                },
              }}
            />
          </Stack>

          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: pxToRem(13),
              lineHeight: '19px',
            }}
          >
            The applicant will be notified to submit the requested documents.
            The application status will be updated to &ldquo;More Info
            Required&rdquo;.
          </Typography>
        </Stack>

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
              background: '#6366F1',
              color: (theme) => theme.palette.background.default,
              fontWeight: 600,
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
              '&:hover': {
                background: alpha('#6366F1', 0.95),
              },
            }}
            fullWidth
          >
            Send Request
          </AppButton>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
