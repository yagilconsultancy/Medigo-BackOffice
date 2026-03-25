'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { toast } from 'sonner';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { AllDriverRow } from '../../../index';

// ─── Dropdown Options ───────────────────────────────────────────────────────

const fleetOptions = [
  'Independent (MediGo Direct)',
  'MediRide Express',
  'QuickHealth Transport',
  'SwiftCare Logistics',
  'RapidMed Transit',
  'HealthLink Services',
];

const tripStatusOptions = ['Available', 'On Trip', 'Off Duty'];

const accountStatusOptions = ['Active', 'Pending Verification', 'Suspended'];

const documentStatusOptions = ['Complete', 'Pending'];

// ─── Component ──────────────────────────────────────────────────────────────

type EditDriverDrawerProps = {
  open: boolean;
  onClose: () => void;
  driver: AllDriverRow | null;
};

export const EditDriverDrawer = ({
  open,
  onClose,
  driver,
}: EditDriverDrawerProps) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fleet, setFleet] = useState('');
  const [tripStatus, setTripStatus] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [documentStatus, setDocumentStatus] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (driver) {
      setFullName(driver.name);
      setPhone(driver.phone);
      setEmail(driver.email);
      setFleet(driver.fleet === 'MediGo Direct' ? 'Independent (MediGo Direct)' : driver.fleet);
      setTripStatus(driver.status === 'Suspended' ? 'Off Duty' : driver.status);
      setAccountStatus(
        driver.status === 'Suspended' ? 'Suspended' : 'Active'
      );
      setDocumentStatus(driver.docsStatus);
      setAvatarPreview(driver.avatar || '');
    }
  }, [driver]);

  if (!driver) return null;

  const nameParts = driver.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG or WebP image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    toast.success(`${fullName} updated successfully`);
    onClose();
  };

  const selectSx = {
    background: '#F9FAFB',
    borderRadius: '10px',
    fontFamily: 'Inter, sans-serif',
    fontSize: pxToRem(13),
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E8ECF0',
      borderWidth: '0.67px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#C7D7F9',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2F6FED',
      borderWidth: '1px',
    },
    '& .MuiSelect-select': {
      padding: '9px 12px',
    },
  };

  const menuItemSx = {
    fontFamily: 'Inter, sans-serif',
    fontSize: pxToRem(14),
    padding: '10px 17px 12px',
    color: '#374151',
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '460px',
          boxShadow: '-4px 0px 48px rgba(0, 0, 0, 0.14)',
          border: 'none',
        },
      }}
    >
      <Stack sx={{ height: '100%' }}>
        {/* ─── Header ────────────────────────────────────────────── */}
        <RowStack
          sx={{
            padding: '0 24px',
            height: '83px',
            borderBottom: '0.67px solid #F0F4F8',
            justifyContent: 'space-between',
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
              Edit Driver
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
              Manage driver details here
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: '#F3F4F6',
              border: '0.67px solid #E5E7EB',
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* ─── Form Content ──────────────────────────────────────── */}
        <Stack
          sx={{
            flex: 1,
            overflow: 'auto',
            padding: '24px 24px 0 24px',
          }}
          spacing={'16px'}
        >
          {/* Profile Photo */}
          <Stack
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #EAECF0',
              borderRadius: '14px',
              padding: '17px 17px 1px 17px',
            }}
            spacing={'10px'}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: '#374151',
              }}
            >
              Profile Photo
            </Typography>
            <RowStack spacing={'16px'}>
              <Avatar
                src={avatarPreview || undefined}
                alt={driver.name}
                sx={{
                  width: 56,
                  height: 56,
                  fontSize: pxToRem(18),
                  fontWeight: 700,
                  background: '#EBF2FF',
                  color: '#2F6FED',
                }}
              >
                {initials}
              </Avatar>
              <Stack spacing={'5px'}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handleFileChange}
                />
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 15px',
                    border: '1.33px solid #D1D5DB',
                    borderRadius: '9px',
                    cursor: 'pointer',
                    '&:hover': { background: '#FFFFFF' },
                  }}
                >
                  <FileUploadOutlinedIcon
                    sx={{ fontSize: 13, color: '#6B7280' }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(12.5),
                      lineHeight: '1.5em',
                      color: '#374151',
                    }}
                  >
                    Upload New Photo
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11),
                    lineHeight: '1.5em',
                    color: '#9CA3AF',
                  }}
                >
                  JPG, PNG or WebP · max 5 MB
                </Typography>
              </Stack>
            </RowStack>
          </Stack>

          {/* Full Name */}
          <FormField label="Full Name">
            <Box
              component="input"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
              sx={{
                width: '100%',
                padding: '9px 12px',
                background: '#F9FAFB',
                border: '0.67px solid #E8ECF0',
                borderRadius: '10px',
                fontFamily: 'Inter, sans-serif',
                fontSize: pxToRem(13),
                lineHeight: '1.5em',
                color: '#374151',
                outline: 'none',
                '&:focus': {
                  borderColor: '#2F6FED',
                  borderWidth: '1px',
                },
              }}
            />
          </FormField>

          {/* Phone Number */}
          <FormField label="Phone Number">
            <Box sx={{ position: 'relative' }}>
              <PhoneOutlinedIcon
                sx={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 13,
                  color: '#9CA3AF',
                  zIndex: 1,
                }}
              />
              <Box
                component="input"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value)
                }
                sx={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  background: '#F9FAFB',
                  border: '0.67px solid #E8ECF0',
                  borderRadius: '10px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: '#374151',
                  outline: 'none',
                  '&:focus': {
                    borderColor: '#2F6FED',
                    borderWidth: '1px',
                  },
                }}
              />
            </Box>
          </FormField>

          {/* Email Address */}
          <FormField label="Email Address">
            <Box sx={{ position: 'relative' }}>
              <EmailOutlinedIcon
                sx={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 13,
                  color: '#9CA3AF',
                  zIndex: 1,
                }}
              />
              <Box
                component="input"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                sx={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  background: '#F9FAFB',
                  border: '0.67px solid #E8ECF0',
                  borderRadius: '10px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: '#374151',
                  outline: 'none',
                  '&:focus': {
                    borderColor: '#2F6FED',
                    borderWidth: '1px',
                  },
                }}
              />
            </Box>
          </FormField>

          {/* Fleet Assignment */}
          <FormField label="Fleet Assignment">
            <Box sx={{ position: 'relative' }}>
              <ViewListOutlinedIcon
                sx={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 13,
                  color: '#9CA3AF',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
              <Select
                value={fleet}
                onChange={(e) => setFleet(e.target.value)}
                size="small"
                IconComponent={KeyboardArrowDownIcon}
                sx={{
                  ...selectSx,
                  width: '100%',
                  '& .MuiSelect-select': {
                    padding: '9px 12px 9px 34px',
                  },
                }}
              >
                {fleetOptions.map((opt) => (
                  <MenuItem key={opt} value={opt} sx={menuItemSx}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormField>

          {/* Trip Status */}
          <FormField label="Trip Status">
            <Select
              value={tripStatus}
              onChange={(e) => setTripStatus(e.target.value)}
              size="small"
              IconComponent={KeyboardArrowDownIcon}
              sx={{ ...selectSx, width: '100%' }}
            >
              {tripStatusOptions.map((opt) => (
                <MenuItem key={opt} value={opt} sx={menuItemSx}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormField>

          {/* Account Status */}
          <FormField label="Account Status">
            <Select
              value={accountStatus}
              onChange={(e) => setAccountStatus(e.target.value)}
              size="small"
              IconComponent={KeyboardArrowDownIcon}
              sx={{ ...selectSx, width: '100%' }}
            >
              {accountStatusOptions.map((opt) => (
                <MenuItem key={opt} value={opt} sx={menuItemSx}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormField>

          {/* Document Status */}
          <FormField label="Document Status">
            <Select
              value={documentStatus}
              onChange={(e) => setDocumentStatus(e.target.value)}
              size="small"
              IconComponent={KeyboardArrowDownIcon}
              sx={{ ...selectSx, width: '100%' }}
            >
              {documentStatusOptions.map((opt) => (
                <MenuItem key={opt} value={opt} sx={menuItemSx}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormField>
        </Stack>

        {/* ─── Footer ────────────────────────────────────────────── */}
        <RowStack
          sx={{
            padding: '16px 24px 24px 24px',
            borderTop: '0.67px solid #F0F4F8',
            gap: '12px',
          }}
        >
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
              gap: '5px',
              height: '41px',
              background: '#2F6FED',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <SaveOutlinedIcon
              sx={{ fontSize: 14, color: '#FFFFFF' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
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
    </Drawer>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const FormField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
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
      {label}
    </Typography>
    {children}
  </Stack>
);
