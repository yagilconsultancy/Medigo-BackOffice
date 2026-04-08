import { useState, useEffect, useMemo, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import {
  AppModal,
  RowStack,
  AppDatePickerPopover,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import type { FleetVehicleRow } from '../../..';

// ─── Component ──────────────────────────────────────────────────────────────

type ScheduleMaintenanceModalProps = {
  open: boolean;
  onClose: () => void;
  vehicle: FleetVehicleRow | null;
  onConfirm: (date: string, notes: string) => void;
};

export const ScheduleMaintenanceModal = ({
  open,
  onClose,
  vehicle,
  onConfirm,
}: ScheduleMaintenanceModalProps) => {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setDate(null);
      setNotes('');
    }
  }, [open]);

  const isFormValid = useMemo(() => date !== null, [date]);

  const handleConfirm = useCallback(() => {
    if (isFormValid && date) {
      onConfirm(date.format('YYYY-MM-DD'), notes);
    }
  }, [isFormValid, date, notes, onConfirm]);

  if (!vehicle) return null;

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="schedule-maintenance-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: '420px',
          maxWidth: '420px',
          borderRadius: '16px',
          boxShadow: '0px 24px 64px 0px rgba(0, 0, 0, 0.18)',
          overflow: 'visible',
        },
      }}
    >
      <Stack spacing={'20px'} sx={{ padding: '24px 24px 0' }}>
        {/* Header */}
        <RowStack spacing={'12px'} sx={{ position: 'relative' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: '#FFFBEB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BuildOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />
          </Box>
          <Stack spacing={'1px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(14),
                lineHeight: '1.5em',
                color: '#111827',
              }}
            >
              Schedule Maintenance
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                lineHeight: '1.5em',
                color: '#9CA3AF',
              }}
            >
              {vehicle.vehicle} · {vehicle.plate}
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <CloseIcon sx={{ fontSize: 15, color: '#111827' }} />
          </IconButton>
        </RowStack>

        {/* Form Fields */}
        <Stack spacing={'16px'}>
          {/* Maintenance Date */}
          <Stack spacing={'6px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: '#374151',
              }}
            >
              Maintenance Date *
            </Typography>
            <AppDatePickerPopover
              value={date}
              onChange={(newDate) => setDate(newDate)}
              minDate={dayjs()}
              buttonSx={{
                height: 39,
                borderRadius: '10px',
                background: '#F7F9FB',
                border: '0.67px solid #E8ECF0',
                width: '100%',
              }}
              textSx={{
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: date ? '#111827' : 'rgba(55, 65, 81, 0.5)',
              }}
            />
          </Stack>

          {/* Notes */}
          <Stack spacing={'6px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: '#374151',
              }}
            >
              Notes (optional)
            </Typography>
            <TextField
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the maintenance required..."
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: '#F7F9FB',
                  borderRadius: '10px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#111827',
                  alignItems: 'flex-start',
                  '& fieldset': {
                    borderColor: '#E8ECF0',
                    borderWidth: '0.67px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#E8ECF0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2F6FED',
                    borderWidth: '1px',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(55, 65, 81, 0.5)',
                  opacity: 1,
                },
              }}
            />
          </Stack>
        </Stack>

        {/* Footer Buttons */}
        <RowStack spacing={'8px'} sx={{ paddingBottom: '24px' }}>
          <Box
            onClick={onClose}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '41px',
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              borderRadius: '10px',
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
              background: isFormValid ? '#2F6FED' : 'rgba(47, 111, 237, 0.5)',
              borderRadius: '10px',
              cursor: isFormValid ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
              '&:hover': { opacity: isFormValid ? 0.9 : 1 },
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
              Confirm Schedule
            </Typography>
          </Box>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
