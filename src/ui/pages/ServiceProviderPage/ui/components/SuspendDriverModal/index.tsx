'use client';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { pxToRem, useDriversApi } from '../../../../../../common';
import {
  AppButton,
  AppModal,
  RowStack,
} from '../../../../../modules/components';
import { DriverProfileCardData } from '../DriverProfileCard';

// ─── Types ──────────────────────────────────────────────────────────────────

type SuspendDriverModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  driver: DriverProfileCardData | null;
};

// ─── Reason options ─────────────────────────────────────────────────────────

const suspensionReasons = [
  'Safety Policy Violation',
  'Document Non-Compliance',
  'Passenger Complaint',
  'Background Check Issue',
  'Unauthorized Route Deviation',
  'Other',
];

// ─── Timing options ─────────────────────────────────────────────────────────

const timingOptions = [
  {
    value: 'immediately',
    label: 'Immediately',
    description: 'Suspend right now',
  },
  {
    value: 'after_trip',
    label: 'After Current Trip',
    description: 'Let them finish',
  },
];

// ─── Status styles ──────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  Available: '#166534',
  'On Trip': '#6366F1',
  Suspended: '#991B1B',
};

// ─── Validation ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  reason: Yup.string().required('Reason is required'),
  notes: Yup.string(),
  timing: Yup.string().required('Timing is required'),
});

// ─── Component ──────────────────────────────────────────────────────────────

export const SuspendDriverModal = ({
  open,
  setOpen,
  driver,
}: SuspendDriverModalProps) => {
  const { suspendDriver } = useDriversApi();

  if (!driver) return null;

  const nameParts = driver.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="Suspend Driver"
      padding="0"
      sx={{
        '& .MuiDialog-paper': {
          width: '480px',
          maxWidth: '480px',
        },
      }}
    >
      <Formik
        initialValues={{
          reason: '',
          notes: '',
          timing: 'immediately',
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values) => {
          const reason = values.notes.trim()
            ? `${values.reason}: ${values.notes.trim()}`
            : values.reason;
          const suspended = await suspendDriver({
            driverId: driver.id,
            reason,
          });
          if (suspended) {
            setOpen(false);
          }
        }}
      >
        {({ values, setFieldValue, isValid, dirty }) => (
          <Form>
            <Stack>
              {/* ── Header ──────────────────────────────────────────── */}
              <RowStack
                justifyContent={'space-between'}
                sx={{
                  padding: '24px 24px 16px',
                  borderBottom: '0.67px solid #F0F4F8',
                }}
              >
                <RowStack spacing={'12px'}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '12px',
                      background: '#FEF2F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BlockOutlinedIcon
                      sx={{ fontSize: 20, color: '#EF4444' }}
                    />
                  </Box>
                  <Stack spacing={0}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(16),
                        lineHeight: '1.5em',
                        color: '#111827',
                      }}
                    >
                      Suspend Driver
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(12.5),
                        lineHeight: '1.5em',
                        color: '#6B7280',
                      }}
                    >
                      This will immediately restrict access
                    </Typography>
                  </Stack>
                </RowStack>
                <IconButton
                  onClick={() => setOpen(false)}
                  sx={{
                    width: 30,
                    height: 30,
                    background: '#F3F4F6',
                    border: '0.67px solid #E5E7EB',
                    borderRadius: '8px',
                    '&:hover': { background: '#E5E7EB' },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                </IconButton>
              </RowStack>

              {/* ── Driver Info Bar ──────────────────────────────────── */}
              <Box sx={{ padding: '16px 24px 0' }}>
                <RowStack
                  justifyContent={'space-between'}
                  sx={{
                    background: '#F7F9FB',
                    border: '0.67px solid #F0F2F5',
                    borderRadius: '14px',
                    padding: '12px 16px',
                  }}
                >
                  <RowStack spacing={'12px'}>
                    <Avatar
                      src={driver.avatar || undefined}
                      alt={driver.name}
                      sx={{
                        width: 40,
                        height: 40,
                        fontSize: pxToRem(13),
                        fontWeight: 600,
                        background: '#EBF2FF',
                        color: '#2F6FED',
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Stack spacing={0}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(14),
                          lineHeight: '1.5em',
                          color: '#111827',
                        }}
                      >
                        {driver.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(12),
                          lineHeight: '1.5em',
                          color: '#9CA3AF',
                        }}
                      >
                        {driver.fleet} · {driver.vehicle}
                      </Typography>
                    </Stack>
                  </RowStack>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(11.5),
                      lineHeight: '1.5em',
                      color: statusColors[driver.status] || '#6B7280',
                    }}
                  >
                    {driver.status}
                  </Typography>
                </RowStack>
              </Box>

              {/* ── Form Fields ──────────────────────────────────────── */}
              <Stack spacing={'16px'} sx={{ padding: '16px 24px' }}>
                {/* Reason for Suspension */}
                <Stack spacing={'8px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(12),
                      lineHeight: '1.5em',
                      color: '#374151',
                    }}
                  >
                    Reason for Suspension *
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                    }}
                  >
                    {suspensionReasons.map((reason) => {
                      const isSelected = values.reason === reason;
                      return (
                        <Box
                          key={reason}
                          onClick={() => setFieldValue('reason', reason)}
                          sx={{
                            padding: '12px 13px',
                            borderRadius: '14px',
                            border: `1.33px solid ${isSelected ? '#2F6FED' : '#E8ECF0'}`,
                            background: isSelected ? '#F2F5FE' : '#FFFFFF',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            '&:hover': {
                              borderColor: isSelected ? '#2F6FED' : '#D1D5DB',
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(12),
                              lineHeight: '1.5em',
                              color: isSelected ? '#2F6FED' : '#374151',
                            }}
                          >
                            {reason}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Stack>

                {/* Additional Notes */}
                <Stack spacing={'6px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(12),
                      lineHeight: '1.5em',
                      color: '#374151',
                    }}
                  >
                    Additional Notes (optional)
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    placeholder="Provide any supporting details for this suspension..."
                    value={values.notes}
                    onChange={(e) => setFieldValue('notes', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '9px',
                        background: '#FFFFFF',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: pxToRem(13),
                        '& fieldset': {
                          borderColor: '#E8ECF0',
                          borderWidth: '0.67px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#D1D5DB',
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

                {/* Suspension Timing */}
                <Stack spacing={'8px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(12),
                      lineHeight: '1.5em',
                      color: '#374151',
                    }}
                  >
                    Suspension Timing
                  </Typography>
                  <RowStack spacing={'8px'}>
                    {timingOptions.map((option) => {
                      const isSelected = values.timing === option.value;
                      return (
                        <Box
                          key={option.value}
                          onClick={() => setFieldValue('timing', option.value)}
                          sx={{
                            flex: 1,
                            padding: '13px 17px',
                            borderRadius: '14px',
                            border: `1.33px solid ${isSelected ? '#2F6FED' : '#E8ECF0'}`,
                            background: isSelected ? '#F2F5FE' : '#FFFFFF',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            '&:hover': {
                              borderColor: isSelected ? '#2F6FED' : '#D1D5DB',
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 700,
                              fontSize: pxToRem(12.5),
                              lineHeight: '1.5em',
                              color: isSelected ? '#2F6FED' : '#374151',
                            }}
                          >
                            {option.label}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 500,
                              fontSize: pxToRem(11),
                              lineHeight: '1.5em',
                              color: isSelected ? '#2F6FED' : '#9CA3AF',
                            }}
                          >
                            {option.description}
                          </Typography>
                        </Box>
                      );
                    })}
                  </RowStack>
                </Stack>
              </Stack>

              {/* ── Footer ──────────────────────────────────────────── */}
              <RowStack
                spacing={'12px'}
                sx={{
                  padding: '16px 24px',
                  borderTop: '0.67px solid #F0F4F8',
                  background: '#FAFBFF',
                }}
              >
                <Box
                  onClick={() => setOpen(false)}
                  sx={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px',
                    background: '#F7F9FB',
                    border: '0.67px solid #E8ECF0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    '&:hover': { background: '#F0F2F5' },
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
                <AppButton
                  type="submit"
                  disabled={!values.reason}
                  sx={{
                    flex: 1,
                    height: '41px',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: pxToRem(13),
                    background: !values.reason ? '#D1D5DB' : '#EF4444',
                    color: '#FFFFFF',
                    '&:hover': {
                      background: '#DC2626',
                    },
                    '&:disabled': {
                      background: '#D1D5DB',
                      color: '#FFFFFF',
                      opacity: 1,
                    },
                  }}
                >
                  <BlockOutlinedIcon sx={{ fontSize: 14 }} />
                  Confirm Suspension
                </AppButton>
              </RowStack>
            </Stack>
          </Form>
        )}
      </Formik>
    </AppModal>
  );
};
