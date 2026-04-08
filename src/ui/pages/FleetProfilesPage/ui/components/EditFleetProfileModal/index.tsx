import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem, useFleetCompaniesApi } from '../../../../../../common';
import { FleetProfileData } from '../FleetProfileCard';

// ─── Component ──────────────────────────────────────────────────────────────

type EditFleetProfileModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profile: FleetProfileData | null;
};

export const EditFleetProfileModal = ({
  open,
  setOpen,
  profile,
}: EditFleetProfileModalProps) => {
  const { updateCompany } = useFleetCompaniesApi();
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when profile changes
  useEffect(() => {
    if (profile) {
      setForm({
        companyName: profile.companyName,
        contactPerson: profile.contactPerson,
        email: profile.contactEmail,
        phone: profile.contactPhone,
        city: profile.city,
      });
    }
  }, [profile]);

  const handleChange = useCallback(
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  const isFormValid = useMemo(
    () =>
      form.companyName.trim() !== '' &&
      form.contactPerson.trim() !== '' &&
      form.city.trim() !== '',
    [form.companyName, form.contactPerson, form.city]
  );

  const handleSave = useCallback(async () => {
    if (!profile || !isFormValid || isSaving) return;

    const [cityPart, statePart] = form.city.split(',').map((s) => s.trim());

    setIsSaving(true);
    const success = await updateCompany({
      businessId: profile.id,
      name: form.companyName.trim(),
      contact_person: form.contactPerson.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      city: cityPart || null,
      state: statePart || null,
    });
    setIsSaving(false);

    if (success) {
      setOpen(false);
    }
  }, [profile, isFormValid, isSaving, form, updateCompany, setOpen]);

  if (!profile) return null;

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="Edit Fleet Profile"
      sx={{
        '& .MuiDialog-paper': {
          width: '520px',
          maxWidth: '520px',
          padding: '0 !important',
        },
      }}
    >
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
              Edit Fleet Profile
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
              {profile.companyName} · {profile.fleetId}
            </Typography>
          </Stack>
          <IconButton
            onClick={() => setOpen(false)}
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
          <FormField
            label="Company Name"
            placeholder="e.g. MedRide Express"
            value={form.companyName}
            onChange={handleChange('companyName')}
            icon={
              <BusinessOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
            }
          />
          <FormField
            label="Contact Person"
            placeholder="e.g. Ryan MacDougall"
            value={form.contactPerson}
            onChange={handleChange('contactPerson')}
            icon={<PersonOutlineIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />}
          />
          <FormField
            label="Email"
            placeholder="e.g. ryan@medride.ca"
            value={form.email}
            onChange={handleChange('email')}
            icon={<EmailOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />}
          />
          <FormField
            label="Phone"
            placeholder="e.g. +1 416 555 0101"
            value={form.phone}
            onChange={handleChange('phone')}
            icon={<PhoneOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />}
          />
          <FormField
            label="City / State"
            placeholder="e.g. Toronto, ON"
            value={form.city}
            onChange={handleChange('city')}
            icon={
              <LocationOnOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
            }
          />
        </Stack>

        {/* Footer Buttons */}
        <RowStack spacing={'12px'} sx={{ padding: '0 24px 24px' }}>
          <Box
            onClick={() => setOpen(false)}
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
                textAlign: 'center',
              }}
            >
              Cancel
            </Typography>
          </Box>
          <Box
            onClick={handleSave}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: '41px',
              background:
                isFormValid && !isSaving
                  ? '#2F6FED'
                  : 'rgba(47, 111, 237, 0.5)',
              borderRadius: '10px',
              cursor: isFormValid && !isSaving ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
              '&:hover': { opacity: isFormValid && !isSaving ? 0.85 : 1 },
            }}
          >
            {isSaving ? (
              <CircularProgress size={14} sx={{ color: '#FFFFFF' }} />
            ) : (
              <SaveOutlinedIcon sx={{ fontSize: 14, color: '#FFFFFF' }} />
            )}
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                lineHeight: '1.5em',
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </Typography>
          </Box>
        </RowStack>
      </Stack>
    </AppModal>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const FormField = ({
  label,
  placeholder,
  icon,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
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
      {label}
    </Typography>
    <RowStack
      spacing={'8px'}
      sx={{
        background: '#F7F9FB',
        border: '0.67px solid #E8ECF0',
        borderRadius: '14px',
        padding: '0 12px',
        height: '40px',
      }}
    >
      {icon}
      <Box
        component="input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        sx={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '13px',
          lineHeight: '1.5em',
          color: '#111827',
          '&::placeholder': {
            color: 'rgba(55, 65, 81, 0.5)',
          },
        }}
      />
    </RowStack>
  </Stack>
);
