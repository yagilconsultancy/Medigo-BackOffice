import { useState, useMemo, useCallback } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Component ──────────────────────────────────────────────────────────────

type AddFleetPartnerModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialFormState = {
  companyName: '',
  contactPerson: '',
  email: '',
  city: '',
  vehicles: '',
  drivers: '',
};

export const AddFleetPartnerModal = ({
  open,
  setOpen,
}: AddFleetPartnerModalProps) => {
  const [form, setForm] = useState(initialFormState);

  const handleChange = useCallback(
    (field: keyof typeof initialFormState) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleClose = () => {
    setOpen(false);
    setForm(initialFormState);
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
            label="Company Name *"
            placeholder="e.g. SwiftCare Mobility"
            value={form.companyName}
            onChange={handleChange('companyName')}
            icon={
              <BusinessOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
            }
          />
          <FormField
            label="Contact Person *"
            placeholder="e.g. John Smith"
            value={form.contactPerson}
            onChange={handleChange('contactPerson')}
            icon={<PersonOutlineIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />}
          />
          <FormField
            label="Email Address"
            placeholder="e.g. contact@company.com"
            value={form.email}
            onChange={handleChange('email')}
            icon={<EmailOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />}
          />
          <FormField
            label="City / State *"
            placeholder="e.g. Toronto, ON"
            value={form.city}
            onChange={handleChange('city')}
            icon={
              <LocationOnOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
            }
          />
          <RowStack spacing={'12px'} alignItems="flex-start">
            <Box sx={{ flex: 1 }}>
              <FormField
                label="Number of Vehicles"
                placeholder="e.g. 12"
                value={form.vehicles}
                onChange={handleChange('vehicles')}
                icon={
                  <DirectionsCarOutlinedIcon
                    sx={{ fontSize: 13, color: '#9CA3AF' }}
                  />
                }
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormField
                label="Number of Drivers"
                placeholder="e.g. 10"
                value={form.drivers}
                onChange={handleChange('drivers')}
                icon={
                  <GroupOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
                }
              />
            </Box>
          </RowStack>
        </Stack>

        {/* Footer Buttons */}
        <RowStack spacing={'12px'} sx={{ padding: '0 24px 24px' }}>
          <Box
            onClick={handleClose}
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
              height: '41px',
              background: isFormValid ? '#2F6FED' : 'rgba(47, 111, 237, 0.5)',
              borderRadius: '10px',
              cursor: isFormValid ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
              '&:hover': { opacity: isFormValid ? 0.85 : 1 },
            }}
          >
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
              Add Fleet Partner
            </Typography>
          </Box>
        </RowStack>
      </Stack>
    </AppModal>
  );
};

// ─── Form Field ─────────────────────────────────────────────────────────────

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
          lineHeight: '1.2em',
          color: '#111827',
          '&::placeholder': {
            color: 'rgba(55, 65, 81, 0.5)',
          },
        }}
      />
    </RowStack>
  </Stack>
);
