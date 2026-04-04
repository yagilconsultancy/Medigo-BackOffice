import { IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  AppButton,
  AppModal,
  FormikAppTextField,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type AddFleetPartnerFormValues = {
  companyName: string;
  contactPerson: string;
  email: string;
  city: string;
  vehicles: string;
  drivers: string;
};

type AddFleetPartnerModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: (form: AddFleetPartnerFormValues) => Promise<void>;
};

// ─── Constants ──────────────────────────────────────────────────────────────

const initialValues: AddFleetPartnerFormValues = {
  companyName: '',
  contactPerson: '',
  email: '',
  city: '',
  vehicles: '',
  drivers: '',
};

const validationSchema = Yup.object().shape({
  companyName: Yup.string().required('Company name is required'),
  contactPerson: Yup.string().required('Contact person is required'),
  email: Yup.string().email('Invalid email address'),
  city: Yup.string().required('City / State is required'),
  vehicles: Yup.string(),
  drivers: Yup.string(),
});

// ─── Component ──────────────────────────────────────────────────────────────

export const AddFleetPartnerModal = ({
  open,
  setOpen,
  onSubmit,
}: AddFleetPartnerModalProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="Add Fleet Partner"
      sx={{
        '& .MuiDialog-paper': {
          width: '480px',
          maxWidth: '480px',
          padding: '0 !important',
        },
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await onSubmit?.(values);
            resetForm();
            handleClose();
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form>
            <Stack sx={{ width: '100%' }}>
              {/* Header */}
              <RowStack
                justifyContent="space-between"
                sx={{
                  padding: '20px 24px',
                  borderBottom: '0.67px solid #F0F4F8',
                }}
              >
                <Stack spacing={'2px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(15),
                      lineHeight: '1.5em',
                      color: '#111827',
                    }}
                  >
                    Add Fleet Partner
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
                    Register a new fleet company on MediGo
                  </Typography>
                </Stack>
                <IconButton
                  onClick={handleClose}
                  disabled={isSubmitting}
                  sx={{
                    background: '#F3F4F6',
                    border: '0.67px solid #E5E7EB',
                    borderRadius: '8px',
                    width: 30,
                    height: 30,
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                </IconButton>
              </RowStack>

              {/* Form Fields */}
              <Stack spacing={'16px'} sx={{ padding: '24px' }}>
                <Stack spacing={'6px'}>
                  <FieldLabel label="Company Name *" />
                  <FormikAppTextField
                    name="companyName"
                    placeholder="e.g. SwiftCare Mobility"
                    borderRadius="14px"
                  />
                </Stack>

                <Stack spacing={'6px'}>
                  <FieldLabel label="Contact Person *" />
                  <FormikAppTextField
                    name="contactPerson"
                    placeholder="e.g. John Smith"
                    borderRadius="14px"
                  />
                </Stack>

                <Stack spacing={'6px'}>
                  <FieldLabel label="Email Address" />
                  <FormikAppTextField
                    name="email"
                    placeholder="e.g. contact@company.com"
                    borderRadius="14px"
                  />
                </Stack>

                <Stack spacing={'6px'}>
                  <FieldLabel label="City / State *" />
                  <FormikAppTextField
                    name="city"
                    placeholder="e.g. Toronto, ON"
                    borderRadius="14px"
                  />
                </Stack>

                <RowStack spacing={'12px'} alignItems="flex-start">
                  <Stack spacing={'6px'} sx={{ flex: 1 }}>
                    <FieldLabel label="Number of Vehicles" />
                    <FormikAppTextField
                      name="vehicles"
                      placeholder="e.g. 12"
                      borderRadius="14px"
                    />
                  </Stack>
                  <Stack spacing={'6px'} sx={{ flex: 1 }}>
                    <FieldLabel label="Number of Drivers" />
                    <FormikAppTextField
                      name="drivers"
                      placeholder="e.g. 10"
                      borderRadius="14px"
                    />
                  </Stack>
                </RowStack>
              </Stack>

              {/* Footer Buttons */}
              <RowStack spacing={'12px'} sx={{ padding: '0 24px 24px' }}>
                <AppButton
                  variant="contained"
                  color="secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  sx={{
                    flex: 1,
                    height: 41,
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
                  sx={{
                    flex: 1,
                    height: 41,
                    borderRadius: '10px',
                    background: '#2F6FED',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    boxShadow: 'none',
                    '&:hover': {
                      background: '#2860D4',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Add Fleet Partner
                </AppButton>
              </RowStack>
            </Stack>
          </Form>
        )}
      </Formik>
    </AppModal>
  );
};

// ─── Field Label ────────────────────────────────────────────────────────────

const FieldLabel = ({ label }: { label: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 600,
      fontSize: pxToRem(12),
      lineHeight: '1.5em',
      color: '#374151',
    }}
  >
    {label}
  </Typography>
);
