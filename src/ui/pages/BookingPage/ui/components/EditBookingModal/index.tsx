import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import {
  AppButton,
  AppPasswordField,
  RowStack,
} from '../../../../../modules/components';
import {
  pxToRem,
  useGetBookingDetail,
  useEditBooking,
  useVerifyPassword,
  useChangeBookingStatus,
  extractValidationErrorMessage,
} from '../../../../../../common';
import {
  AdminBookingDetailResponse,
  UpdateBookingRequest,
} from '../../../../../../common/types';
import { DriverNotesSection } from '../DriverNotesSection';

// Booking edit exposes a simplified 4-status model.
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'requested', label: 'Pending' },
  { value: 'confirmed', label: 'Approved' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Declined' },
];

// Collapse a raw backend status into one of the 4 simplified buckets.
const STATUS_TO_BUCKET: Record<string, string> = {
  requested: 'requested',
  pending_business_assignment: 'requested',
  confirmed: 'confirmed',
  driver_assigned: 'confirmed',
  driver_en_route: 'confirmed',
  driver_arrived: 'confirmed',
  in_progress: 'confirmed',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'cancelled',
};

const toBucket = (s: string) => STATUS_TO_BUCKET[s] ?? s;
const statusLabel = (s: string) =>
  STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;

type EditBookingModalProps = {
  open: boolean;
  handleClose: () => void;
  rideId: string;
  bookingId: string;
};

type FormState = {
  pickup_address: string;
  destination_address: string;
  scheduled_at: string; // datetime-local value: YYYY-MM-DDTHH:mm
  ride_type: string;
  trip_type: string;
  trip_structure: string;
  visit_type: string;
  facility_name: string;
  mobility_level: string;
  assistance_level: string;
  passenger_first_name: string;
  passenger_last_name: string;
  passenger_phone: string;
  special_instructions: string;
};

const RIDE_TYPE_OPTIONS = ['ambulatory', 'wheelchair', 'stretcher'];
const TRIP_TYPE_OPTIONS = ['transport_only', 'transport_care_assistant'];
const TRIP_STRUCTURE_OPTIONS = ['one_way', 'round_trip'];
const VISIT_TYPE_OPTIONS = [
  'mobile',
  'checkup',
  'therapy',
  'lab_ride',
  'surgery',
  'other',
];

const EMPTY_FORM: FormState = {
  pickup_address: '',
  destination_address: '',
  scheduled_at: '',
  ride_type: '',
  trip_type: '',
  trip_structure: '',
  visit_type: '',
  facility_name: '',
  mobility_level: '',
  assistance_level: '',
  passenger_first_name: '',
  passenger_last_name: '',
  passenger_phone: '',
  special_instructions: '',
};

const labelText = (value: string) =>
  value
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const toForm = (d: AdminBookingDetailResponse): FormState => ({
  pickup_address: d.pickup_address ?? '',
  destination_address: d.destination_address ?? '',
  scheduled_at: d.scheduled_at
    ? dayjs(d.scheduled_at).format('YYYY-MM-DDTHH:mm')
    : '',
  ride_type: d.ride_type ?? '',
  trip_type: d.trip_type ?? '',
  trip_structure: d.trip_structure ?? '',
  visit_type: d.visit_type ?? '',
  facility_name: d.facility_name ?? '',
  mobility_level: d.mobility_level ?? '',
  assistance_level: d.assistance_level ?? '',
  passenger_first_name: d.passenger_first_name ?? '',
  passenger_last_name: d.passenger_last_name ?? '',
  passenger_phone: d.passenger_phone ?? '',
  special_instructions: d.special_instructions ?? '',
});

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontSize: pxToRem(13.5),
    backgroundColor: 'white',
  },
  '& .MuiOutlinedInput-input': {
    padding: '13px 14px',
  },
  '& .MuiInputLabel-root': {
    fontSize: pxToRem(13.5),
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#E8ECF0',
  },
};

// Two-column rows collapse to a single column on small screens.
const twoColSx = {
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'stretch',
};

export const EditBookingModal = ({
  open,
  handleClose,
  rideId,
  bookingId,
}: EditBookingModalProps) => {
  const { data, isFetching, refetch } = useGetBookingDetail(open ? rideId : '');
  const detail = data && data.success ? data.data : undefined;
  const editMutation = useEditBooking();
  const verifyPasswordMutation = useVerifyPassword();
  const changeStatusMutation = useChangeBookingStatus();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [initial, setInitial] = useState<FormState>(EMPTY_FORM);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const currentBucket = toBucket(detail?.status ?? '');
  const canChangeStatus =
    !!selectedStatus && !!detail?.status && selectedStatus !== currentBucket;

  const handleChangeStatus = () => {
    if (!canChangeStatus) return;
    changeStatusMutation.mutate(
      { rideId, status: selectedStatus },
      {
        onSuccess: () => {
          toast.success(`Status changed to ${statusLabel(selectedStatus)}`);
          refetch();
        },
        onError: (error) => {
          toast.error(
            extractValidationErrorMessage(error, 'Failed to change status')
          );
        },
      }
    );
  };

  // Reset the confirmation password whenever the dialog closes.
  useEffect(() => {
    if (!open) {
      setPassword('');
      setPasswordError('');
    }
  }, [open]);

  useEffect(() => {
    if (detail) {
      const next = toForm(detail);
      setForm(next);
      setInitial(next);
      setSelectedStatus(toBucket(detail.status ?? ''));
    }
  }, [detail]);

  const setField = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Only send fields the admin actually changed.
  const changedPayload = useMemo<UpdateBookingRequest>(() => {
    const payload: UpdateBookingRequest = {};
    (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
      if (form[key] === initial[key]) return;
      if (key === 'scheduled_at') {
        payload.scheduled_at = form.scheduled_at
          ? dayjs(form.scheduled_at).toISOString()
          : null;
      } else {
        (payload as Record<string, string>)[key] = form[key];
      }
    });
    return payload;
  }, [form, initial]);

  const hasChanges = Object.keys(changedPayload).length > 0;

  const saveEdit = () => {
    editMutation.mutate(
      { rideId, ...changedPayload },
      {
        onSuccess: () => {
          toast.success('Booking updated successfully');
          handleClose();
        },
        onError: () => {
          toast.error('Failed to update booking');
        },
      }
    );
  };

  const handleSave = () => {
    if (!hasChanges) {
      toast.info('No changes to save');
      return;
    }
    if (!password.trim()) {
      setPasswordError('Enter your password to confirm');
      return;
    }
    setPasswordError('');
    // Re-authenticate the admin before applying the edit.
    verifyPasswordMutation.mutate(
      { password },
      {
        onSuccess: () => saveEdit(),
        onError: (error: unknown) => {
          const status = (error as { response?: { status?: number } })?.response
            ?.status;
          if (status === 401) {
            setPasswordError('Incorrect password');
          } else {
            toast.error('Could not verify password. Please try again.');
          }
        },
      }
    );
  };

  const isSaving = verifyPasswordMutation.isPending || editMutation.isPending;

  const renderText = (
    key: keyof FormState,
    label: string,
    opts?: { multiline?: boolean; placeholder?: string }
  ) => (
    <TextField
      label={label}
      value={form[key]}
      onChange={(e) => setField(key)(e.target.value)}
      fullWidth
      size="small"
      multiline={opts?.multiline}
      minRows={opts?.multiline ? 3 : undefined}
      placeholder={opts?.placeholder}
      sx={fieldSx}
    />
  );

  const renderSelect = (
    key: keyof FormState,
    label: string,
    options: string[]
  ) => (
    <TextField
      select
      label={label}
      value={form[key]}
      onChange={(e) => setField(key)(e.target.value)}
      fullWidth
      size="small"
      sx={fieldSx}
    >
      {options.map((opt) => (
        <MenuItem key={opt} value={opt} sx={{ fontSize: pxToRem(13) }}>
          {labelText(opt)}
        </MenuItem>
      ))}
    </TextField>
  );

  const sectionTitle = (text: string) => (
    <Typography
      sx={{
        color: (theme) => theme.color.lightGrey,
        fontWeight: 600,
        fontSize: pxToRem(11),
        lineHeight: '16px',
        letterSpacing: '0.6px',
        textTransform: 'uppercase',
      }}
    >
      {text}
    </Typography>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 720 },
          maxWidth: '100%',
          boxShadow: '-4px 0px 48px rgba(0, 0, 0, 0.14)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Header */}
        <RowStack
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{
            px: 4,
            py: 2.5,
            borderBottom: '0.67px solid #EAECF0',
          }}
        >
          <Stack spacing={0.75}>
            <Typography
              sx={{
                color: (theme) => theme.color.deepBlue,
                fontWeight: 700,
                fontSize: pxToRem(17),
                lineHeight: '26px',
              }}
            >
              Edit Booking
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                fontSize: pxToRem(13),
                lineHeight: '19px',
              }}
            >
              Booking #{bookingId} · Update trip and medical details
            </Typography>
          </Stack>
          <IconButton
            onClick={handleClose}
            sx={{
              width: 32,
              height: 32,
              background: '#F3F4F6',
              border: '0.67px solid #E5E7EB',
              borderRadius: '8px',
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {isFetching && !detail ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: 320 }}
          >
            <CircularProgress size={28} />
          </Stack>
        ) : (
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 4,
              py: 3.5,
              // Hide the scrollbar while keeping the content scrollable.
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <Stack spacing={4.5}>
              {/* Status */}
              <Stack spacing={2}>
                {sectionTitle('Status')}
                <RowStack spacing={2} sx={{ alignItems: 'stretch' }}>
                  <TextField
                    select
                    label="Booking Status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    fullWidth
                    size="small"
                    sx={fieldSx}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <MenuItem
                        key={opt.value}
                        value={opt.value}
                        sx={{ fontSize: pxToRem(13) }}
                      >
                        {opt.label}
                        {opt.value === currentBucket ? ' (current)' : ''}
                      </MenuItem>
                    ))}
                  </TextField>
                  <AppButton
                    sx={{
                      flexShrink: 0,
                      px: 2.5,
                      background: (theme) => theme.palette.primary.main,
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: pxToRem(12.5),
                      '&:hover': { background: alpha('#2F6FED', 0.9) },
                      '&.Mui-disabled': {
                        background: alpha('#2F6FED', 0.4),
                        color: '#fff',
                      },
                    }}
                    onClick={handleChangeStatus}
                    disabled={
                      !canChangeStatus || changeStatusMutation.isPending
                    }
                  >
                    {changeStatusMutation.isPending ? 'Updating...' : 'Update'}
                  </AppButton>
                </RowStack>
              </Stack>

              <Divider />

              {/* Trip Details */}
              <Stack spacing={3}>
                {sectionTitle('Trip Details')}
                {renderText('pickup_address', 'Pickup Address')}
                {renderText('destination_address', 'Destination Address')}
                <RowStack spacing={3} sx={twoColSx}>
                  <TextField
                    label="Scheduled Date & Time"
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(e) => setField('scheduled_at')(e.target.value)}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  />
                  {renderSelect('ride_type', 'Ride Type', RIDE_TYPE_OPTIONS)}
                </RowStack>
                <RowStack spacing={3} sx={twoColSx}>
                  {renderSelect('trip_type', 'Trip Type', TRIP_TYPE_OPTIONS)}
                  {renderSelect(
                    'trip_structure',
                    'Trip Structure',
                    TRIP_STRUCTURE_OPTIONS
                  )}
                </RowStack>
              </Stack>

              <Divider />

              {/* Medical & Passenger */}
              <Stack spacing={3}>
                {sectionTitle('Medical & Passenger')}
                <RowStack spacing={3} sx={twoColSx}>
                  {renderSelect('visit_type', 'Visit Type', VISIT_TYPE_OPTIONS)}
                  {renderText('facility_name', 'Facility Name')}
                </RowStack>
                <RowStack spacing={3} sx={twoColSx}>
                  {renderText('mobility_level', 'Mobility Level', {
                    placeholder: 'e.g. wheelchair, ambulatory',
                  })}
                  {renderText('assistance_level', 'Assistance Level', {
                    placeholder: 'e.g. minimal, full',
                  })}
                </RowStack>
                <RowStack spacing={3} sx={twoColSx}>
                  {renderText('passenger_first_name', 'Passenger First Name')}
                  {renderText('passenger_last_name', 'Passenger Last Name')}
                </RowStack>
                {renderText('passenger_phone', 'Passenger Phone')}
                {/* This is the rider's own note from the booking form. Labelled
                      as theirs so it isn't mistaken for the place to write
                      instructions for the driver — editing it overwrites what
                      the rider wrote. Use "Notes for driver" below for that. */}
                {renderText(
                  'special_instructions',
                  "Rider's note (from booking)",
                  {
                    multiline: true,
                    placeholder: 'The rider left no note on this booking',
                  }
                )}
              </Stack>

              <Divider />

              {/* Notes for driver */}
              <DriverNotesSection rideId={rideId} />
            </Stack>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ borderTop: '0.67px solid #EAECF0', px: 4, py: 2.5 }}>
          {hasChanges && (
            <Stack spacing={0.75} sx={{ pb: 2 }}>
              <Typography
                sx={{
                  color: (theme) => theme.color.deepBlue,
                  fontSize: pxToRem(12.5),
                  fontWeight: 600,
                }}
              >
                Confirm with your password
              </Typography>
              <AppPasswordField
                placeholder="Enter your password to apply changes"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
                error={!!passwordError}
                errorMessage={passwordError}
                fullWidth
                size="small"
              />
            </Stack>
          )}
          <RowStack spacing={'14px'} width={'100%'}>
            <AppButton
              sx={{
                background: '#F7F9FB',
                border: '0.67px solid #E8ECF0',
                color: (theme) => theme.color.grey,
                fontWeight: 600,
                fontSize: pxToRem(13),
                py: 1.25,
                '&:hover': { background: alpha('#F7F9FB', 0.1) },
              }}
              fullWidth
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </AppButton>
            <AppButton
              sx={{
                background: (theme) => theme.palette.primary.main,
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: pxToRem(13),
                py: 1.25,
                '&:hover': { background: alpha('#2F6FED', 0.9) },
                '&.Mui-disabled': {
                  background: alpha('#2F6FED', 0.4),
                  color: '#fff',
                },
              }}
              fullWidth
              onClick={handleSave}
              disabled={isSaving || !hasChanges || !password.trim()}
            >
              {verifyPasswordMutation.isPending
                ? 'Verifying...'
                : editMutation.isPending
                  ? 'Saving...'
                  : 'Save Changes'}
            </AppButton>
          </RowStack>
        </Box>
      </Box>
    </Drawer>
  );
};
