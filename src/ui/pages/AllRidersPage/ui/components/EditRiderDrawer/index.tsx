'use client';

import { useMemo } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import {
  pxToRem,
  useGetRiderDetail,
  useResolvedApiQuery,
  useRidersApi,
  type AdminRiderDetailResponse,
  type IDTypeValue,
  type UpdateRiderPayload,
} from '../../../../../../common';
import { AppButton, RowStack } from '../../../../../modules/components';

export type EditRiderDrawerProps = {
  open: boolean;
  onClose: () => void;
  riderId: string | null;
  onSuccess?: () => void;
};

// Mirrors IDType in the backend's shared enums.
const ID_TYPE_OPTIONS: { value: IDTypeValue; label: string }[] = [
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'passport', label: 'Passport' },
  { value: 'provincial_id', label: 'Provincial ID' },
  { value: 'health_card', label: 'Health Card' },
  { value: 'permanent_resident_card', label: 'Permanent Resident Card' },
  { value: 'other', label: 'Other' },
];

const toDateInput = (value?: string | null): string =>
  value && dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : '';

const toIsoDate = (value: string): string | null =>
  value && dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : null;

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string(),
  dateOfBirth: Yup.string(),
  gender: Yup.string(),
  homeAddress: Yup.string(),
  city: Yup.string(),
  province: Yup.string(),
  postalCode: Yup.string(),
  country: Yup.string(),
  medicalNotes: Yup.string(),
  insuranceProvider: Yup.string(),
  insurancePolicyNumber: Yup.string(),
  insuranceGroupNumber: Yup.string(),
  insuranceMemberId: Yup.string(),
  insuranceExpiry: Yup.string(),
  idType: Yup.string(),
  idNumber: Yup.string(),
  idIssuingCountry: Yup.string(),
  idIssuingAuthority: Yup.string(),
  idExpiry: Yup.string(),
  dobVerified: Yup.boolean(),
});

const EMPTY = {
  firstName: '',
  lastName: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  homeAddress: '',
  city: '',
  province: '',
  postalCode: '',
  country: '',
  medicalNotes: '',
  insuranceProvider: '',
  insurancePolicyNumber: '',
  insuranceGroupNumber: '',
  insuranceMemberId: '',
  insuranceExpiry: '',
  idType: '',
  idNumber: '',
  idIssuingCountry: '',
  idIssuingAuthority: '',
  idExpiry: '',
  dobVerified: false,
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontSize: pxToRem(13.5),
  },
  '& .MuiInputLabel-root': { fontSize: pxToRem(13.5) },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E8ECF0' },
};

const SectionHeader = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <RowStack spacing={'8px'}>
    {icon}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(11),
        letterSpacing: '0.6px',
        color: '#6B7280',
        textTransform: 'uppercase',
      }}
    >
      {title}
    </Typography>
  </RowStack>
);

const twoCol = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: '16px',
};

/**
 * Full rider record editor.
 *
 * Riders previously had no admin edit path at all — only suspend/reinstate — so
 * this is the only way to correct a rider's details or capture their KYC.
 */
export const EditRiderDrawer = ({
  open,
  onClose,
  riderId,
  onSuccess,
}: EditRiderDrawerProps) => {
  const { data: detail, isFetching } = useResolvedApiQuery(
    useGetRiderDetail,
    null as unknown as AdminRiderDetailResponse,
    open ? (riderId ?? '') : ''
  );
  const { updateRider } = useRidersApi();

  const hasDetail = Boolean(detail && detail.user_id);

  const initialValues = useMemo(() => {
    if (!hasDetail) return EMPTY;
    const kyc = detail.kyc;
    return {
      firstName: detail.first_name || '',
      lastName: detail.last_name || '',
      phone: detail.phone || '',
      dateOfBirth: toDateInput(detail.date_of_birth),
      gender: detail.gender || '',
      homeAddress: detail.home_address || '',
      city: detail.city || '',
      province: detail.province || '',
      postalCode: detail.postal_code || '',
      country: detail.country || '',
      medicalNotes: detail.medical_notes || '',
      insuranceProvider: detail.insurance_provider || '',
      insurancePolicyNumber: detail.insurance_policy_number || '',
      insuranceGroupNumber: detail.insurance_group_number || '',
      insuranceMemberId: detail.insurance_member_id || '',
      insuranceExpiry: toDateInput(detail.insurance_expiry),
      idType: kyc?.id_type || '',
      idNumber: kyc?.id_number || '',
      idIssuingCountry: kyc?.id_issuing_country || '',
      idIssuingAuthority: kyc?.id_issuing_authority || '',
      idExpiry: toDateInput(kyc?.id_expiry),
      dobVerified: Boolean(kyc?.dob_verified),
    };
  }, [hasDetail, detail]);

  if (!riderId) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 720 },
          boxShadow: '-4px 0px 48px rgba(0, 0, 0, 0.14)',
        },
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const payload: UpdateRiderPayload = {
              riderId,
              first_name: values.firstName.trim() || null,
              last_name: values.lastName.trim() || null,
              phone: values.phone.trim() || null,
              date_of_birth: toIsoDate(values.dateOfBirth),
              gender: values.gender.trim() || null,
              home_address: values.homeAddress.trim() || null,
              city: values.city.trim() || null,
              province: values.province.trim() || null,
              postal_code: values.postalCode.trim() || null,
              country: values.country.trim() || null,
              medical_notes: values.medicalNotes.trim() || null,
              insurance_provider: values.insuranceProvider.trim() || null,
              insurance_policy_number:
                values.insurancePolicyNumber.trim() || null,
              insurance_group_number:
                values.insuranceGroupNumber.trim() || null,
              insurance_member_id: values.insuranceMemberId.trim() || null,
              insurance_expiry: toIsoDate(values.insuranceExpiry),
              // Omit rather than null: the backend validates against IDType and
              // an empty string is not a member.
              id_type: (values.idType as IDTypeValue) || undefined,
              id_number: values.idNumber.trim() || null,
              id_issuing_country: values.idIssuingCountry.trim() || null,
              id_issuing_authority: values.idIssuingAuthority.trim() || null,
              id_expiry: toIsoDate(values.idExpiry),
              dob_verified: values.dobVerified,
            };

            const ok = await updateRider(payload);
            if (ok) {
              onClose();
              onSuccess?.();
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, handleChange, setFieldValue, isSubmitting, dirty }) => (
          <Form
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            {/* Header */}
            <RowStack
              justifyContent="space-between"
              sx={{ px: 4, py: 2.5, borderBottom: '0.67px solid #EAECF0' }}
            >
              <Stack spacing={0.25}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: pxToRem(15),
                    color: '#111827',
                  }}
                >
                  Edit Rider
                </Typography>
                <Typography sx={{ fontSize: pxToRem(12), color: '#9CA3AF' }}>
                  {detail?.first_name} {detail?.last_name}
                </Typography>
              </Stack>
              <IconButton onClick={onClose} size="small" aria-label="Close">
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </RowStack>

            {/* Body */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 4, py: 3 }}>
              {isFetching && !hasDetail ? (
                <Stack alignItems="center" sx={{ py: 6 }}>
                  <CircularProgress size={22} sx={{ color: '#2F6FED' }} />
                </Stack>
              ) : (
                <Stack spacing={4}>
                  {/* Personal */}
                  <Stack spacing={2}>
                    <SectionHeader
                      icon={
                        <PersonOutlineIcon
                          sx={{ fontSize: 16, color: '#2F6FED' }}
                        />
                      }
                      title="Personal Information"
                    />
                    <Box sx={twoCol}>
                      <TextField
                        label="First Name"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Last Name"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                    </Box>
                    <Box sx={twoCol}>
                      <TextField
                        label="Phone"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={values.dateOfBirth}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                    </Box>
                    <TextField
                      label="Gender"
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      sx={fieldSx}
                    />
                  </Stack>

                  {/* Address */}
                  <Stack spacing={2}>
                    <SectionHeader
                      icon={
                        <HomeOutlinedIcon
                          sx={{ fontSize: 16, color: '#2F6FED' }}
                        />
                      }
                      title="Address"
                    />
                    <TextField
                      label="Street Address"
                      name="homeAddress"
                      value={values.homeAddress}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      sx={fieldSx}
                    />
                    <Box sx={twoCol}>
                      <TextField
                        label="City"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Province"
                        name="province"
                        value={values.province}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                    </Box>
                    <Box sx={twoCol}>
                      <TextField
                        label="Postal Code"
                        name="postalCode"
                        value={values.postalCode}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Country"
                        name="country"
                        value={values.country}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                    </Box>
                  </Stack>

                  {/* Medical & Insurance */}
                  <Stack spacing={2}>
                    <SectionHeader
                      icon={
                        <LocalHospitalOutlinedIcon
                          sx={{ fontSize: 16, color: '#2F6FED' }}
                        />
                      }
                      title="Medical & Insurance"
                    />
                    <TextField
                      label="Medical Notes"
                      name="medicalNotes"
                      value={values.medicalNotes}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      multiline
                      minRows={3}
                      sx={fieldSx}
                    />
                    <Box sx={twoCol}>
                      <TextField
                        label="Insurance Provider"
                        name="insuranceProvider"
                        value={values.insuranceProvider}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Policy Number"
                        name="insurancePolicyNumber"
                        value={values.insurancePolicyNumber}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                    </Box>
                    <Box sx={twoCol}>
                      <TextField
                        label="Group Number"
                        name="insuranceGroupNumber"
                        value={values.insuranceGroupNumber}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Member ID"
                        name="insuranceMemberId"
                        value={values.insuranceMemberId}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                    </Box>
                    <TextField
                      label="Insurance Expiry"
                      name="insuranceExpiry"
                      type="date"
                      value={values.insuranceExpiry}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={fieldSx}
                    />
                  </Stack>

                  {/* KYC */}
                  <Stack spacing={2}>
                    <SectionHeader
                      icon={
                        <BadgeOutlinedIcon
                          sx={{ fontSize: 16, color: '#2F6FED' }}
                        />
                      }
                      title="KYC — Identity Document"
                    />
                    <Box sx={twoCol}>
                      <TextField
                        select
                        label="ID Type"
                        name="idType"
                        value={values.idType}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      >
                        <MenuItem value="">Not specified</MenuItem>
                        {ID_TYPE_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="ID Number"
                        name="idNumber"
                        value={values.idNumber}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                    </Box>
                    <Box sx={twoCol}>
                      <TextField
                        label="Issuing Country"
                        name="idIssuingCountry"
                        value={values.idIssuingCountry}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                      <TextField
                        label="Issuing Authority"
                        name="idIssuingAuthority"
                        value={values.idIssuingAuthority}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                    </Box>
                    <Box sx={twoCol}>
                      <TextField
                        label="ID Expiry"
                        name="idExpiry"
                        type="date"
                        value={values.idExpiry}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                      />
                      <TextField
                        select
                        label="Date of Birth Verified"
                        name="dobVerified"
                        value={values.dobVerified ? 'yes' : 'no'}
                        onChange={(e) =>
                          setFieldValue('dobVerified', e.target.value === 'yes')
                        }
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      >
                        <MenuItem value="no">No</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                      </TextField>
                    </Box>
                    <Typography
                      sx={{ fontSize: pxToRem(11.5), color: '#9CA3AF' }}
                    >
                      Approving or rejecting the submission is done from the
                      rider&apos;s detail view.
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Box>

            {/* Footer */}
            <RowStack
              spacing={'14px'}
              sx={{ px: 4, py: 2.5, borderTop: '0.67px solid #EAECF0' }}
            >
              <AppButton
                onClick={onClose}
                sx={{
                  flex: 1,
                  background: '#F7F9FB',
                  border: '0.67px solid #E8ECF0',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  textTransform: 'none',
                }}
              >
                Cancel
              </AppButton>
              <AppButton
                type="submit"
                isLoading={isSubmitting}
                disabled={!dirty || isSubmitting}
                sx={{
                  flex: 1,
                  background: '#2F6FED',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  textTransform: 'none',
                  '&:hover': { background: '#2760D4' },
                  '&.Mui-disabled': { background: '#A8C3F8', color: '#FFFFFF' },
                }}
              >
                Save Changes
              </AppButton>
            </RowStack>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
};
