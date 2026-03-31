'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import {
  AppModal,
  RowStack,
  AppDatePickerPopover,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import dayjs, { Dayjs } from 'dayjs';
import type { VehicleRow } from '../../..';

// ─── Types ──────────────────────────────────────────────────────────────────

type ScheduleServiceModalProps = {
  open: boolean;
  onClose: () => void;
  vehicle: VehicleRow | null;
  onConfirm: (serviceType: string, date: string, notes: string) => void;
};

const serviceTypes = [
  'Full Service',
  'Oil Change',
  'Tire Rotation',
  'Brake Inspection',
  'Engine Diagnostic',
  'Transmission Service',
  'Other',
];

// ─── Component ──────────────────────────────────────────────────────────────

export const ScheduleServiceModal = ({
  open,
  onClose,
  vehicle,
  onConfirm,
}: ScheduleServiceModalProps) => {
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState<Dayjs | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setServiceType('');
      setDate(null);
      setNotes('');
    }
  }, [open]);

  const isFormValid = useMemo(
    () => serviceType.trim().length > 0 && date !== null,
    [serviceType, date]
  );

  const handleConfirm = useCallback(() => {
    if (isFormValid && date) {
      onConfirm(serviceType, date.format('YYYY-MM-DD'), notes);
    }
  }, [isFormValid, serviceType, date, notes, onConfirm]);

  if (!vehicle) return null;

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="schedule-service-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: '460px',
          borderRadius: '16px',
          boxShadow: '0px 24px 64px 0px rgba(0, 0, 0, 0.18)',
          overflow: 'visible',
        },
      }}
    >
      <Stack
        spacing={'20px'}
        sx={{
          padding: '24px',
        }}
      >
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
                fontSize: pxToRem(15),
                lineHeight: '1.5em',
                color: '#111827',
              }}
            >
              Schedule Service
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
              {vehicle.vehicle} · {vehicle.mileage}
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
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
            }}
          >
            <CloseIcon sx={{ fontSize: 15, color: '#111827' }} />
          </IconButton>
        </RowStack>

        {/* Next Service Info Banner */}
        <RowStack
          spacing={'8px'}
          sx={{
            background: '#FFFBEB',
            border: '0.67px solid #FDE68A',
            borderRadius: '14px',
            padding: '10px 12px',
          }}
        >
          <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: '#D97706' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12.5),
              lineHeight: '1.5em',
              color: '#92400E',
            }}
          >
            Next scheduled service: {vehicle.nextService}
          </Typography>
        </RowStack>

        {/* Form Fields */}
        <Stack spacing={'16px'}>
          {/* Service Type */}
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
              Service Type
            </Typography>
            <Select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              displayEmpty
              fullWidth
              renderValue={(selected) =>
                selected || (
                  <Typography sx={{ color: 'rgba(55, 65, 81, 0.5)' }}>
                    Select service type
                  </Typography>
                )
              }
              sx={{
                height: '39px',
                background: '#F7F9FB',
                borderRadius: '10px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: '#111827',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E8ECF0',
                  borderWidth: '0.67px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E8ECF0',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2F6FED',
                  borderWidth: '1px',
                },
              }}
            >
              {serviceTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          {/* Service Date */}
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
              Service Date
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

          {/* Technician Notes */}
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
              Technician Notes (optional)
            </Typography>
            <TextField
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Check rear brakes, inspect tires…"
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
              Schedule Service
            </Typography>
          </Box>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
