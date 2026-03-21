import { Box, IconButton, Stack, Typography } from '@mui/material';
import {
  AppButton,
  AppModal,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

type DetailRow = {
  label: string;
  value: string;
};

type PendingBookingDetailModalProps = {
  open: boolean;
  handleClose: () => void;
  bookingId: string;
  subtitle: string;
  details: DetailRow[];
  specialNote?: string;
  onAssignDriver: () => void;
};

export const PendingBookingDetailModal = ({
  open,
  handleClose,
  bookingId,
  subtitle,
  details,
  specialNote,
  onAssignDriver,
}: PendingBookingDetailModalProps) => {
  return (
    <AppModal label="pending-booking-detail" open={open} setOpen={handleClose}>
      <Stack spacing={'12px'} sx={{ width: '500px' }}>
        {/* Header */}
        <RowStack
          justifyContent="space-between"
          sx={{
            background: '#F7F9FB',
            margin: '-28px -32px 0',
            padding: '20px 24px',
          }}
        >
          <Stack spacing={'0px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(15),
                color: (theme) => theme.color.deepBlue,
              }}
            >
              Booking Detail
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: (theme) => theme.color.lightGrey,
              }}
            >
              {bookingId} · {subtitle}
            </Typography>
          </Stack>
          <IconButton
            onClick={handleClose}
            sx={{
              background: '#FFFFFF',
              borderRadius: '8px',
              width: 30,
              height: 30,
            }}
          >
            <CloseIcon sx={{ fontSize: 15, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* Detail Rows */}
        <Stack spacing={'12px'}>
          {details.map((row, index) => (
            <RowStack
              key={index}
              justifyContent="space-between"
              sx={{
                background: '#F7F9FB',
                borderRadius: '14px',
                padding: '12px 16px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: (theme) => theme.color.lightGrey,
                }}
              >
                {row.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(13),
                  color: (theme) => theme.color.grey,
                }}
              >
                {row.value}
              </Typography>
            </RowStack>
          ))}
        </Stack>

        {/* Special Note */}
        {specialNote && (
          <RowStack
            spacing={'8px'}
            sx={{
              background: '#FFFBEB',
              borderRadius: '14px',
              padding: '13px 16px',
            }}
          >
            <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: '#92400E' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: '#92400E',
              }}
            >
              {specialNote}
            </Typography>
          </RowStack>
        )}

        {/* Footer Buttons */}
        <RowStack spacing={'12px'} width="100%">
          <AppButton
            fullWidth
            onClick={handleClose}
            sx={{
              background: '#F7F9FB',
              color: (theme) => theme.color.grey,
              fontWeight: 600,
              fontSize: pxToRem(13),
              borderRadius: '9px',
            }}
          >
            Close
          </AppButton>
          <AppButton
            fullWidth
            onClick={() => {
              handleClose();
              onAssignDriver();
            }}
            sx={{
              background: 'primary.main',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: pxToRem(13),
              borderRadius: '9px',
              '&:hover': {
                background: '#2563EB',
              },
            }}
          >
            Assign Driver
          </AppButton>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
