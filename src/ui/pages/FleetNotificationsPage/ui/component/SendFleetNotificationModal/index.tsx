'use client';

import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { AppModal } from '../../../../../modules/components/AppModal';
import {
  AppButton,
  AppTextField,
  FormikAppTextField,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem, useBroadcastsApi } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type SendFleetNotificationModalProps = {
  open: boolean;
  onClose: () => void;
};

type FleetNotificationFormValues = {
  fleetAudience: string;
  title: string;
  message: string;
};

// ─── Validation ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  fleetAudience: Yup.string().required('Fleet audience is required'),
  title: Yup.string().required('Title is required'),
  message: Yup.string(),
});

const initialValues: FleetNotificationFormValues = {
  fleetAudience: '',
  title: '',
  message: '',
};

// ─── Label Component ────────────────────────────────────────────────────────

const FieldLabel = ({ label }: { label: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: pxToRem(11),
      color: '#374151',
      lineHeight: '1.5em',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }}
  >
    {label}
  </Typography>
);

// ─── Component ──────────────────────────────────────────────────────────────

export const SendFleetNotificationModal = ({
  open,
  onClose,
}: SendFleetNotificationModalProps) => {
  const { sendFleetBroadcast } = useBroadcastsApi();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const success = await sendFleetBroadcast({
        notification_type: 'Notice',
        title: values.title,
        message: values.message,
        audience_segment: values.fleetAudience,
      });

      if (success) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="send-fleet-notification-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: 480,
          maxWidth: 480,
          borderRadius: '16px',
          boxShadow: '0px 32px 80px 0px rgba(0, 0, 0, 0.22)',
          overflow: 'hidden',
        },
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty, setFieldValue, values }) => (
          <Form>
            <Stack>
              {/* ── Header ─────────────────────────────────────── */}
              <RowStack
                justifyContent={'space-between'}
                alignItems={'flex-start'}
                sx={{
                  padding: '20px 24px',
                  borderBottom: '0.67px solid #F0F4F8',
                }}
              >
                <Stack spacing={'4px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(16),
                      color: '#111827',
                    }}
                  >
                    Send Fleet Notification
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(13),
                      color: '#6B7280',
                    }}
                  >
                    Compose a message for all or segmented fleet partners
                  </Typography>
                </Stack>

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

              {/* ── Body ──────────────────────────────────────── */}
              <Stack spacing={'20px'} sx={{ padding: '24px' }}>
                {/* Fleet Audience */}
                <Stack spacing={'8px'}>
                  <FieldLabel label="Fleet Audience" />
                  <FormikAppTextField
                    name="fleetAudience"
                    placeholder="e.g. All Fleet Partners / WAV Fleets / Expiring Contracts"
                    borderRadius="10px"
                  />
                </Stack>

                {/* Title */}
                <Stack spacing={'8px'}>
                  <FieldLabel label="Title" />
                  <FormikAppTextField
                    name="title"
                    placeholder="Notification title..."
                    borderRadius="10px"
                  />
                </Stack>

                {/* Message (optional) */}
                <Stack spacing={'8px'}>
                  <FieldLabel label="Message" />
                  <AppTextField
                    name="message"
                    placeholder="Write your message here..."
                    multiline
                    rows={4}
                    borderRadius="10px"
                    value={values.message}
                    onChange={(e) => setFieldValue('message', e.target.value)}
                  />
                </Stack>

                {/* ── Footer Buttons ─────────────────────────── */}
                <RowStack spacing={'12px'} sx={{ pt: '4px' }}>
                  <AppButton
                    variant="contained"
                    color="secondary"
                    onClick={onClose}
                    disabled={isSubmitting}
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
                    type="submit"
                    variant="contained"
                    isLoading={isSubmitting}
                    disabled={!isValid || !dirty}
                    startIcon={<SendOutlinedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      flex: 1,
                      height: 43,
                      borderRadius: '10px',
                      background: '#2F6FED',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      boxShadow: 'none',
                      '&:hover': {
                        background: '#2558C9',
                        boxShadow: 'none',
                      },
                      '&.Mui-disabled': {
                        background: 'rgba(47, 111, 237, 0.5)',
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    Send Now
                  </AppButton>
                </RowStack>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </AppModal>
  );
};
