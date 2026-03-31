import { useState, useMemo, useCallback, useEffect } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CheckIcon from '@mui/icons-material/Check';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
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
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
  });

  const [documents, setDocuments] = useState({
    businessLicense: false,
    insuranceCertificate: false,
    vehicleFleetList: false,
    driverCertifications: false,
  });

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
      setDocuments({ ...profile.documents });
    }
  }, [profile]);

  const handleChange = useCallback(
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  const toggleDocument = useCallback((key: keyof typeof documents) => {
    setDocuments((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const isFormValid = useMemo(
    () =>
      form.companyName.trim() !== '' &&
      form.contactPerson.trim() !== '' &&
      form.city.trim() !== '',
    [form.companyName, form.contactPerson, form.city]
  );

  if (!profile) return null;

  const documentItems: {
    key: keyof typeof documents;
    label: string;
  }[] = [
    { key: 'businessLicense', label: 'Business License' },
    { key: 'insuranceCertificate', label: 'Insurance Certificate' },
    { key: 'vehicleFleetList', label: 'Vehicle Fleet List' },
    { key: 'driverCertifications', label: 'Driver Certifications' },
  ];

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

          {/* Documents on File */}
          <Stack spacing={'10px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: '#374151',
              }}
            >
              Documents on File
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              {documentItems.map((doc) => (
                <DocumentCheckbox
                  key={doc.key}
                  label={doc.label}
                  checked={documents[doc.key]}
                  onClick={() => toggleDocument(doc.key)}
                />
              ))}
            </Box>
          </Stack>
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
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: '41px',
              background: isFormValid ? '#2F6FED' : 'rgba(47, 111, 237, 0.5)',
              borderRadius: '10px',
              cursor: isFormValid ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
              '&:hover': { opacity: isFormValid ? 0.85 : 1 },
            }}
          >
            <SaveOutlinedIcon sx={{ fontSize: 14, color: '#FFFFFF' }} />
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
              Save Changes
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

const DocumentCheckbox = ({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) => (
  <RowStack
    spacing={'8px'}
    onClick={onClick}
    sx={{
      background: checked ? '#F0FDF4' : '#F7F9FB',
      border: `0.67px solid ${checked ? '#BBF7D0' : '#E8ECF0'}`,
      borderRadius: '14px',
      padding: '10px 12px',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      '&:hover': { opacity: 0.85 },
    }}
  >
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: '4px',
        background: checked ? '#059669' : '#E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {checked && <CheckIcon sx={{ fontSize: 10, color: '#FFFFFF' }} />}
    </Box>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(12),
        lineHeight: '1.5em',
        color: checked ? '#374151' : '#9CA3AF',
      }}
    >
      {label}
    </Typography>
  </RowStack>
);
