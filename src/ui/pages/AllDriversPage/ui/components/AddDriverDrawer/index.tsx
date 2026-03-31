'use client';

import { useState, useRef } from 'react';
import {
  Avatar,
  Box,
  Checkbox,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ElderlyIcon from '@mui/icons-material/Elderly';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import AirlineSeatFlatAngledIcon from '@mui/icons-material/AirlineSeatFlatAngled';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  RowStack,
  AppNotificationSnackbar,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Dropdown Options ───────────────────────────────────────────────────────

const fleetOptions = [
  'Independent (MediGo Direct)',
  'MediRide Express',
  'QuickHealth Transport',
  'SwiftCare Logistics',
  'RapidMed Transit',
  'HealthLink Services',
];

const bgCheckOptions = ['Verified', 'Pending', 'Not Verified'];

const vehicleOptions = [
  'Toyota Sienna · 2022',
  'Honda Odyssey · 2022',
  'Chrysler Pacifica · 2022',
  'Honda Odyssey · 2023',
  'Kia Carnival · 2022',
  'Wheelchair Van · 2022',
];

const capabilityOptions = [
  {
    key: 'wheelchair',
    label: 'Wheelchair Assistance',
    icon: <AccessibleForwardIcon sx={{ fontSize: 18, color: '#6B7280' }} />,
    activeIcon: (
      <AccessibleForwardIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
    ),
  },
  {
    key: 'senior',
    label: 'Senior Assistance',
    icon: <ElderlyIcon sx={{ fontSize: 18, color: '#6B7280' }} />,
    activeIcon: <ElderlyIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
  },
  {
    key: 'escort',
    label: 'Medical Escort Support',
    icon: <LocalHospitalOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />,
    activeIcon: (
      <LocalHospitalOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
    ),
  },
  {
    key: 'stretcher',
    label: 'Stretcher Transport',
    icon: <AirlineSeatFlatAngledIcon sx={{ fontSize: 18, color: '#6B7280' }} />,
    activeIcon: (
      <AirlineSeatFlatAngledIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
    ),
  },
];

type DriverStatusOption = 'Active' | 'Pending Verification' | 'Suspended';

// ─── Component ──────────────────────────────────────────────────────────────

type AddDriverDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export const AddDriverDrawer = ({ open, onClose }: AddDriverDrawerProps) => {
  // Personal Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Fleet
  const [fleet, setFleet] = useState('');

  // Credentials
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [certId, setCertId] = useState('');
  const [bgCheck, setBgCheck] = useState('');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const licenseFileRef = useRef<HTMLInputElement>(null);
  const certFileRef = useRef<HTMLInputElement>(null);

  // Vehicle
  const [vehicle, setVehicle] = useState('');

  // Capabilities
  const [capabilities, setCapabilities] = useState<string[]>([]);

  // Account
  const [driverStatus, setDriverStatus] =
    useState<DriverStatusOption>('Active');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: '' });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setSnackbar({
        open: true,
        message: 'Please upload a JPG, PNG or WebP image',
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'File size must be under 5 MB' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCapabilityToggle = (key: string) => {
    setCapabilities((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setSnackbar({
        open: true,
        message: 'First name and last name are required',
      });
      return;
    }
    setSnackbar({
      open: true,
      message: `${firstName} ${lastName} added successfully`,
    });
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
    '& .MuiSelect-select': { padding: '9px 12px' },
  };

  const menuItemSx = {
    fontFamily: 'Inter, sans-serif',
    fontSize: pxToRem(14),
    padding: '10px 17px 12px',
    color: '#374151',
  };

  const inputSx = {
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
    '&:focus': { borderColor: '#2F6FED', borderWidth: '1px' },
    '&::placeholder': { color: '#D1D5DB' },
  };

  const inputWithIconSx = { ...inputSx, paddingLeft: '34px' };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: '860px',
            boxShadow: '-4px 0px 48px rgba(0, 0, 0, 0.14)',
            border: 'none',
          },
        }}
      >
        <Stack sx={{ height: '100%' }}>
          {/* ─── Header ──────────────────────────────────────────── */}
          <Stack
            sx={{
              padding: '20px 24px',
              borderBottom: '0.67px solid #F0F4F8',
            }}
          >
            <RowStack justifyContent="space-between">
              <Typography
                sx={{
                  fontFamily: (t) => t.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  lineHeight: '1.5em',
                  color: '#374151',
                }}
              >
                Add New Driver
              </Typography>
              <IconButton
                onClick={onClose}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: '#F3F4F6',
                  border: '0.67px solid #E5E7EB',
                  '&:hover': { background: '#E5E7EB' },
                }}
              >
                <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
              </IconButton>
            </RowStack>
            <Typography
              sx={{
                fontFamily: (t) => t.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#9CA3AF',
                marginTop: '2px',
              }}
            >
              Create a new driver profile and assign them to a fleet and
              vehicle.
            </Typography>
          </Stack>

          {/* ─── Scrollable Content ──────────────────────────────── */}
          <Stack sx={{ flex: 1, overflow: 'auto' }}>
            {/* ── Section 1: Personal Information ─────────────────── */}
            <SectionHeader
              icon={
                <PersonOutlineIcon sx={{ fontSize: 16, color: '#2F6FED' }} />
              }
              title="Personal Information"
            />
            <Stack spacing="16px" sx={{ padding: '20px 24px' }}>
              {/* Profile Photo */}
              <Stack spacing="8px">
                <Typography
                  sx={{
                    fontFamily: (t) => t.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(13),
                    color: '#111827',
                  }}
                >
                  Profile Photo
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (t) => t.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: '#6B7280',
                  }}
                >
                  Upload a clear headshot. JPG, PNG or WebP, max 5MB.
                </Typography>
                <RowStack spacing="16px" sx={{ marginTop: '4px' }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={avatarPreview || undefined}
                      sx={{
                        width: 72,
                        height: 72,
                        background: '#F3F4F6',
                        border: avatarPreview
                          ? '2px solid #C7D7F9'
                          : '1px solid #E5E7EB',
                      }}
                    />
                    {avatarPreview && (
                      <Box
                        onClick={() => setAvatarPreview('')}
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: 20,
                          height: 20,
                          borderRadius: '10px',
                          background: '#EF4444',
                          border: '2px solid #FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 10, color: '#FFFFFF' }} />
                      </Box>
                    )}
                  </Box>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                    onChange={handlePhotoChange}
                  />
                  <Box
                    onClick={() => photoInputRef.current?.click()}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '9px 15px',
                      background: '#EEF3FF',
                      border: '1px solid #2F6FED',
                      borderRadius: '9px',
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.9 },
                    }}
                  >
                    <FileUploadOutlinedIcon
                      sx={{ fontSize: 13, color: '#2F6FED' }}
                    />
                    <Typography
                      sx={{
                        fontFamily: (t) => t.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12.5),
                        color: '#374151',
                      }}
                    >
                      {avatarPreview ? 'Replace Photo' : 'Upload Photo'}
                    </Typography>
                  </Box>
                </RowStack>
              </Stack>

              {/* Name Row */}
              <RowStack spacing="16px" alignItems="flex-start">
                <FormField label="First Name*" sx={{ flex: 1 }}>
                  <Box
                    component="input"
                    placeholder="e.g. Marcus"
                    value={firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFirstName(e.target.value)
                    }
                    sx={inputSx}
                  />
                </FormField>
                <FormField label="Last Name*" sx={{ flex: 1 }}>
                  <Box
                    component="input"
                    placeholder="e.g. Johnson"
                    value={lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLastName(e.target.value)
                    }
                    sx={inputSx}
                  />
                </FormField>
              </RowStack>

              {/* Contact Row */}
              <RowStack spacing="16px" alignItems="flex-start">
                <FormField label="Phone Number*" sx={{ flex: 1 }}>
                  <Box sx={{ position: 'relative' }}>
                    <PhoneOutlinedIcon
                      sx={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 13,
                        color: '#9CA3AF',
                        zIndex: 1,
                      }}
                    />
                    <Box
                      component="input"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPhone(e.target.value)
                      }
                      sx={inputWithIconSx}
                    />
                  </Box>
                </FormField>
                <FormField label="Email Address*" sx={{ flex: 1 }}>
                  <Box sx={{ position: 'relative' }}>
                    <EmailOutlinedIcon
                      sx={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 13,
                        color: '#9CA3AF',
                        zIndex: 1,
                      }}
                    />
                    <Box
                      component="input"
                      placeholder="driver@example.com"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      sx={inputWithIconSx}
                    />
                  </Box>
                </FormField>
              </RowStack>

              {/* DOB Row */}
              <RowStack spacing="16px" alignItems="flex-start">
                <FormField label="Date of Birth" sx={{ flex: 1 }}>
                  <Box sx={{ position: 'relative' }}>
                    <CalendarTodayOutlinedIcon
                      sx={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 13,
                        color: '#9CA3AF',
                        pointerEvents: 'none',
                      }}
                    />
                    <Box
                      component="input"
                      type="date"
                      value={dob}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDob(e.target.value)
                      }
                      sx={{
                        ...inputSx,
                        paddingRight: '34px',
                        colorScheme: 'light',
                      }}
                    />
                  </Box>
                </FormField>
                <Box sx={{ flex: 1 }} />
              </RowStack>
            </Stack>

            {/* ── Section 2: Fleet Company ────────────────────────── */}
            <SectionHeader
              icon={
                <BusinessOutlinedIcon sx={{ fontSize: 16, color: '#2F6FED' }} />
              }
              title="Fleet Company"
            />
            <Stack spacing="12px" sx={{ padding: '20px 24px' }}>
              <FormField label="Select Fleet*">
                <Select
                  value={fleet}
                  onChange={(e) => setFleet(e.target.value)}
                  displayEmpty
                  size="small"
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{ ...selectSx, width: '100%' }}
                  renderValue={(val) =>
                    val ? (
                      val
                    ) : (
                      <Typography
                        sx={{
                          color: '#D1D5DB',
                          fontFamily: 'Inter',
                          fontSize: pxToRem(13),
                        }}
                      >
                        Independent (MediGo Direct)
                      </Typography>
                    )
                  }
                >
                  {fleetOptions.map((opt) => (
                    <MenuItem key={opt} value={opt} sx={menuItemSx}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormField>
              {fleet && (
                <RowStack
                  spacing="8px"
                  sx={{
                    background: '#EEF3FF',
                    border: '1px solid #C7D7F9',
                    borderRadius: '14px',
                    padding: '12px 16px',
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '4px',
                      background: '#2F6FED',
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (t) => t.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(12.5),
                      color: '#2F6FED',
                    }}
                  >
                    This driver will be directly managed by MediGo (Independent)
                  </Typography>
                </RowStack>
              )}
            </Stack>

            {/* ── Section 3: Driver Credentials ──────────────────── */}
            <SectionHeader
              icon={
                <BadgeOutlinedIcon sx={{ fontSize: 16, color: '#2F6FED' }} />
              }
              title="Driver Credentials"
            />
            <Stack spacing="16px" sx={{ padding: '20px 24px' }}>
              <RowStack spacing="16px" alignItems="flex-start">
                <FormField label="Driver License Number*" sx={{ flex: 1 }}>
                  <Box
                    component="input"
                    placeholder="e.g. DL-NY-448821"
                    value={licenseNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLicenseNumber(e.target.value)
                    }
                    sx={inputSx}
                  />
                </FormField>
                <FormField label="License Expiry Date*" sx={{ flex: 1 }}>
                  <Box sx={{ position: 'relative' }}>
                    <CalendarTodayOutlinedIcon
                      sx={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 13,
                        color: '#9CA3AF',
                        pointerEvents: 'none',
                      }}
                    />
                    <Box
                      component="input"
                      type="date"
                      value={licenseExpiry}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLicenseExpiry(e.target.value)
                      }
                      sx={{
                        ...inputSx,
                        paddingRight: '34px',
                        colorScheme: 'light',
                      }}
                    />
                  </Box>
                </FormField>
              </RowStack>
              <RowStack spacing="16px" alignItems="flex-start">
                <FormField
                  label="Medical Transport Certification"
                  sx={{ flex: 1 }}
                >
                  <Box
                    component="input"
                    placeholder="Certification ID or reference"
                    value={certId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCertId(e.target.value)
                    }
                    sx={inputSx}
                  />
                </FormField>
                <FormField label="Background Check Status" sx={{ flex: 1 }}>
                  <Select
                    value={bgCheck}
                    onChange={(e) => setBgCheck(e.target.value)}
                    displayEmpty
                    size="small"
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{ ...selectSx, width: '100%' }}
                    renderValue={(val) =>
                      val ? (
                        val
                      ) : (
                        <Typography
                          sx={{
                            color: '#D1D5DB',
                            fontFamily: 'Inter',
                            fontSize: pxToRem(13),
                          }}
                        >
                          Verified
                        </Typography>
                      )
                    }
                  >
                    {bgCheckOptions.map((opt) => (
                      <MenuItem key={opt} value={opt} sx={menuItemSx}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormField>
              </RowStack>

              {/* File Uploads */}
              <RowStack spacing="16px" alignItems="flex-start">
                <FileUploadField
                  label="Driver License Upload"
                  file={licenseFile}
                  inputRef={licenseFileRef}
                  onFileChange={(f) => setLicenseFile(f)}
                />
                <FileUploadField
                  label="Certification Upload"
                  file={certFile}
                  inputRef={certFileRef}
                  onFileChange={(f) => setCertFile(f)}
                />
              </RowStack>
            </Stack>

            {/* ── Section 4: Vehicle Assignment ──────────────────── */}
            <SectionHeader
              icon={
                <DirectionsCarOutlinedIcon
                  sx={{ fontSize: 16, color: '#2F6FED' }}
                />
              }
              title="Vehicle Assignment"
            />
            <Stack spacing="12px" sx={{ padding: '20px 24px' }}>
              <FormField label="Assign Vehicle">
                <Select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  displayEmpty
                  size="small"
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{ ...selectSx, width: '100%' }}
                  renderValue={(val) =>
                    val ? (
                      val
                    ) : (
                      <Typography
                        sx={{
                          color: '#D1D5DB',
                          fontFamily: 'Inter',
                          fontSize: pxToRem(13),
                        }}
                      >
                        Select a vehicle
                      </Typography>
                    )
                  }
                >
                  {vehicleOptions.map((opt) => (
                    <MenuItem key={opt} value={opt} sx={menuItemSx}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormField>
              <RowStack
                spacing="8px"
                sx={{
                  background: '#F7F9FB',
                  border: '1px solid #EAECF0',
                  borderRadius: '14px',
                  padding: '12px 16px',
                }}
              >
                <InfoOutlinedIcon
                  sx={{ fontSize: 14, color: '#9CA3AF', flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    fontFamily: (t) => t.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: '#9CA3AF',
                  }}
                >
                  Showing {vehicleOptions.length} vehicles for{' '}
                  {fleet || 'Independent (MediGo Direct)'}. Selecting a
                  different fleet above will update this list.
                </Typography>
              </RowStack>
            </Stack>

            {/* ── Section 5: Service Capabilities ────────────────── */}
            <SectionHeader
              icon={
                <AccessibleForwardIcon
                  sx={{ fontSize: 16, color: '#2F6FED' }}
                />
              }
              title="Service Capabilities"
            />
            <Stack spacing="12px" sx={{ padding: '20px 24px' }}>
              <Typography
                sx={{
                  fontFamily: (t) => t.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#6B7280',
                }}
              >
                Select the service types this driver is certified to provide.
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                {capabilityOptions.map((cap) => {
                  const isActive = capabilities.includes(cap.key);
                  return (
                    <RowStack
                      key={cap.key}
                      onClick={() => handleCapabilityToggle(cap.key)}
                      sx={{
                        padding: '14px 16px',
                        background: isActive ? '#EEF3FF' : '#FFFFFF',
                        border: `1px solid ${isActive ? '#2F6FED' : '#E8ECF0'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          borderColor: isActive ? '#2F6FED' : '#C7D7F9',
                        },
                      }}
                      spacing="12px"
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '10px',
                          background: isActive ? '#DBEAFE' : '#F3F4F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isActive ? cap.activeIcon : cap.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: (t) => t.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13),
                          color: isActive ? '#2F6FED' : '#374151',
                          flex: 1,
                        }}
                      >
                        {cap.label}
                      </Typography>
                      <Checkbox
                        checked={isActive}
                        size="small"
                        sx={{
                          padding: 0,
                          color: '#D1D5DB',
                          '&.Mui-checked': { color: '#2F6FED' },
                        }}
                      />
                    </RowStack>
                  );
                })}
              </Box>
            </Stack>

            {/* ── Section 6: Account Settings ─────────────────────── */}
            <SectionHeader
              icon={
                <SettingsOutlinedIcon sx={{ fontSize: 16, color: '#2F6FED' }} />
              }
              title="Account Settings"
            />
            <Stack spacing="16px" sx={{ padding: '20px 24px' }}>
              {/* Driver Status Toggle */}
              <RowStack spacing="8px">
                {(['Active', 'Pending Verification', 'Suspended'] as const).map(
                  (status) => {
                    const isSelected = driverStatus === status;
                    return (
                      <Box
                        key={status}
                        onClick={() => setDriverStatus(status)}
                        sx={{
                          padding: '8px 16px',
                          background: '#FFFFFF',
                          border: `1px solid ${isSelected ? '#2563EB' : '#E8ECF0'}`,
                          borderRadius: '9px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': { borderColor: '#C7D7F9' },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (t) => t.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12.5),
                            color: isSelected ? '#2563EB' : '#6B7280',
                          }}
                        >
                          {status}
                        </Typography>
                      </Box>
                    );
                  }
                )}
              </RowStack>

              {/* Divider */}
              <Box sx={{ height: '1px', background: '#F3F4F6' }} />

              {/* App Login */}
              <Typography
                sx={{
                  fontFamily: (t) => t.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(12),
                  letterSpacing: '0.017em',
                  color: '#374151',
                }}
              >
                CREATE DRIVER APP LOGIN
              </Typography>
              <RowStack spacing="16px" alignItems="flex-start">
                <FormField label="App Username" sx={{ flex: 1 }}>
                  <Box sx={{ position: 'relative' }}>
                    <AccountCircleOutlinedIcon
                      sx={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 13,
                        color: '#9CA3AF',
                        zIndex: 1,
                      }}
                    />
                    <Box
                      component="input"
                      placeholder="auto-generated"
                      value={username}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUsername(e.target.value)
                      }
                      sx={inputWithIconSx}
                    />
                  </Box>
                </FormField>
                <FormField label="App Password" sx={{ flex: 1 }}>
                  <Box sx={{ position: 'relative' }}>
                    <LockOutlinedIcon
                      sx={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 13,
                        color: '#9CA3AF',
                        zIndex: 1,
                      }}
                    />
                    <Box
                      component="input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Set initial password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      sx={{ ...inputWithIconSx, paddingRight: '36px' }}
                    />
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{
                        position: 'absolute',
                        right: 4,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '4px',
                      }}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon
                          sx={{ fontSize: 14, color: '#9CA3AF' }}
                        />
                      ) : (
                        <VisibilityOutlinedIcon
                          sx={{ fontSize: 14, color: '#9CA3AF' }}
                        />
                      )}
                    </IconButton>
                  </Box>
                </FormField>
              </RowStack>
            </Stack>
          </Stack>

          {/* ─── Footer ──────────────────────────────────────────── */}
          <RowStack
            sx={{
              padding: '16px 24px 24px',
              borderTop: '1px solid #EAECF0',
              boxShadow: '0px -1px 8px rgba(0,0,0,0.06)',
              justifyContent: 'space-between',
            }}
          >
            {capabilities.length > 0 ? (
              <Typography
                sx={{
                  fontFamily: (t) => t.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  color: '#9CA3AF',
                }}
              >
                {capabilities.length} service capabilities selected
              </Typography>
            ) : (
              <Box />
            )}
            <RowStack spacing="12px">
              <Box
                onClick={onClose}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '41px',
                  padding: '0 24px',
                  background: '#F7F9FB',
                  border: '0.67px solid #E8ECF0',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  '&:hover': { background: '#F0F2F5' },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (t) => t.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    color: '#374151',
                  }}
                >
                  Cancel
                </Typography>
              </Box>
              <Box
                onClick={handleSubmit}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  height: '41px',
                  padding: '0 24px',
                  background: '#2F6FED',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                <PersonAddAltOutlinedIcon
                  sx={{ fontSize: 14, color: '#FFFFFF' }}
                />
                <Typography
                  sx={{
                    fontFamily: (t) => t.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(13),
                    color: '#FFFFFF',
                  }}
                >
                  Add Driver
                </Typography>
              </Box>
            </RowStack>
          </RowStack>
        </Stack>
      </Drawer>

      <AppNotificationSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const SectionHeader = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <RowStack
    spacing="8px"
    sx={{
      padding: '12px 24px',
      background: '#FAFBFF',
      borderBottom: '1px solid #F0F2F5',
      borderTop: '1px solid #F0F2F5',
    }}
  >
    {icon}
    <Typography
      sx={{
        fontFamily: (t) => t.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(13.5),
        color: '#111827',
      }}
    >
      {title}
    </Typography>
  </RowStack>
);

const FormField = ({
  label,
  children,
  sx,
}: {
  label: string;
  children: React.ReactNode;
  sx?: Record<string, unknown>;
}) => (
  <Stack spacing="6px" sx={sx}>
    <Typography
      sx={{
        fontFamily: (t) => t.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(12),
        letterSpacing: '0.017em',
        color: '#374151',
      }}
    >
      {label}
    </Typography>
    {children}
  </Stack>
);

const FileUploadField = ({
  label,
  file,
  inputRef,
  onFileChange,
}: {
  label: string;
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (file: File | null) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFileChange(f);
    e.target.value = '';
  };

  return (
    <Stack spacing="6px" sx={{ flex: 1 }}>
      <Typography
        sx={{
          fontFamily: (t) => t.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(12),
          color: '#374151',
        }}
      >
        {label}
      </Typography>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/*"
        hidden
        onChange={handleChange}
      />
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '16px',
          background: file ? '#EEF3FF' : '#F9FAFB',
          border: `1px dashed ${file ? '#2F6FED' : '#E5E7EB'}`,
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          '&:hover': {
            borderColor: '#2F6FED',
            background: '#F0F4FF',
          },
        }}
      >
        {file ? (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#2F6FED' }} />
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: '#2F6FED',
              }}
            >
              File selected
            </Typography>
            <RowStack spacing="4px">
              <AttachFileIcon sx={{ fontSize: 11, color: '#6B7280' }} />
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: pxToRem(11),
                  color: '#6B7280',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {file.name}
              </Typography>
            </RowStack>
          </>
        ) : (
          <>
            <FileUploadOutlinedIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: '#9CA3AF',
              }}
            >
              Click to upload PDF or image
            </Typography>
          </>
        )}
      </Box>
    </Stack>
  );
};
