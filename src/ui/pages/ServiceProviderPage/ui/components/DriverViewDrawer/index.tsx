'use client';

import { useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  MenuItem,
  Rating,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { pxToRem } from '../../../../../../common';
import { RowStack } from '../../../../../modules/components';

// ─── Types ──────────────────────────────────────────────────────────────────

export type DriverViewData = {
  name: string;
  avatar: string;
  driverId: string;
  joinedDate: string;
  fleet: string;
  vehicle: string;
  status: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  memberSince: string;
  license: string;
  bgCheck: string;
  licenseExpiry: string;
  docsStatus: string;
  capabilities: string[];
  rating: number;
  trips: number;
};

export type DriverViewDrawerProps = {
  open: boolean;
  onClose: () => void;
  driver: DriverViewData | null;
};

// ─── Status Badge Config ────────────────────────────────────────────────────

const statusBadgeConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Available: { color: '#166534', bg: '#EDFAF4', border: '#BBF7D0' },
  'On Trip': { color: '#3730A3', bg: '#EEF2FF', border: '#C7D2FE' },
  Suspended: { color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },
};

// ─── Document Data ──────────────────────────────────────────────────────────

const documentsData = [
  { name: "Driver's License", status: 'Verified' },
  { name: 'Background Check', status: 'Verified' },
  { name: 'Vehicle Insurance', status: 'Valid' },
  { name: 'Medical Transport Cert.', status: 'Verified' },
  { name: 'Platform Agreement', status: 'Signed' },
];

// ─── Trips Data ─────────────────────────────────────────────────────────────

const tripsData = [
  {
    id: 'TR-9201',
    fare: '$28.40',
    status: 'Completed',
    rider: 'Helen Moore',
    pickup: '742 Evergreen Terrace',
    dropoff: "St. Mary's Hospital",
    date: 'Mar 9',
  },
  {
    id: 'TR-9198',
    fare: '$19.80',
    status: 'Completed',
    rider: 'Robert Garcia',
    pickup: '1428 Elm Street',
    dropoff: 'Memorial Medical Center',
    date: 'Mar 8',
  },
  {
    id: 'TR-9190',
    fare: '$34.20',
    status: 'Completed',
    rider: 'Nancy White',
    pickup: '567 Maple Ave',
    dropoff: "St. Luke's Cardiology",
    date: 'Mar 7',
  },
  {
    id: 'TR-9181',
    fare: '$41.00',
    status: 'Completed',
    rider: 'Daniel Torres',
    pickup: '2890 Oak Lane',
    dropoff: 'Downtown Cancer Center',
    date: 'Mar 6',
  },
];

// ─── Rating Data ────────────────────────────────────────────────────────────

const ratingBreakdown = [
  { stars: 5, percent: 72 },
  { stars: 4, percent: 20 },
  { stars: 3, percent: 6 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

const categoryRatings = [
  { label: 'Punctuality', value: 4.8 },
  { label: 'Professionalism', value: 4.9 },
  { label: 'Driving Safety', value: 4.7 },
  { label: 'Vehicle Cleanliness', value: 4.6 },
  { label: 'Patient Care', value: 4.9 },
];

// ─── Fleet & Vehicle Options ────────────────────────────────────────────────

const fleetOptions = [
  'Independent (MediGo Direct)',
  'MediRide Express',
  'QuickHealth Transport',
  'SwiftCare Logistics',
  'RapidMed Transit',
  'HealthLink Services',
];

const vehicleOptions = [
  'Toyota Sienna · 2022',
  'Honda Odyssey · 2022',
  'Chrysler Pacifica · 2022',
  'Honda Odyssey · 2023',
  'Kia Carnival · 2022',
  'Wheelchair Van · 2022',
];

// ─── Reusable Section Label ─────────────────────────────────────────────────

const SectionLabel = ({ text }: { text: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: pxToRem(10),
      letterSpacing: '0.08em',
      color: '#9CA3AF',
      textTransform: 'uppercase',
    }}
  >
    {text}
  </Typography>
);

// ─── Reusable Read-Only Field ───────────────────────────────────────────────

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <Stack
    spacing={'6px'}
    sx={{
      background: '#F7F9FB',
      border: '0.67px solid #F0F2F5',
      borderRadius: '14px',
      padding: '12px 16px',
    }}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(10.5),
        letterSpacing: '0.04em',
        color: '#9CA3AF',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(13.5),
        color: '#111827',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

// ─── Reusable Document Row ──────────────────────────────────────────────────

const DocumentRow = ({ name, status }: { name: string; status: string }) => (
  <RowStack
    justifyContent={'space-between'}
    sx={{
      background: '#F7F9FB',
      border: '0.67px solid #F0F2F5',
      borderRadius: '14px',
      padding: '16px',
    }}
  >
    <RowStack spacing={'12px'}>
      <DescriptionOutlinedIcon sx={{ fontSize: 15, color: '#9CA3AF' }} />
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 500,
          fontSize: pxToRem(13),
          color: '#374151',
        }}
      >
        {name}
      </Typography>
    </RowStack>
    <Chip
      label={status}
      size="small"
      sx={{
        background: '#ECFDF5',
        color: '#059669',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        fontSize: pxToRem(11.5),
        height: '22px',
        borderRadius: '100px',
      }}
    />
  </RowStack>
);

// ─── Reusable Trip Card ─────────────────────────────────────────────────────

const TripCard = ({ trip }: { trip: (typeof tripsData)[number] }) => (
  <Stack
    spacing={'8px'}
    sx={{
      background: '#F7F9FB',
      border: '0.67px solid #F0F2F5',
      borderRadius: '14px',
      padding: '16px',
    }}
  >
    {/* Row 1: Trip ID + Fare + Status */}
    <RowStack justifyContent={'space-between'}>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(11.5),
          color: '#2F6FED',
        }}
      >
        {trip.id}
      </Typography>
      <RowStack spacing={'8px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(12.5),
            color: '#059669',
          }}
        >
          {trip.fare}
        </Typography>
        <Chip
          label={trip.status}
          size="small"
          sx={{
            background: '#ECFDF5',
            color: '#059669',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: pxToRem(10.5),
            height: '20px',
            borderRadius: '100px',
          }}
        />
      </RowStack>
    </RowStack>

    {/* Rider name */}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(12.5),
        color: '#111827',
      }}
    >
      {trip.rider}
    </Typography>

    {/* Pickup */}
    <RowStack spacing={'8px'}>
      <Box
        sx={{
          width: 5,
          height: 5,
          borderRadius: '2.5px',
          border: '1.33px solid #6B7280',
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(11.5),
          color: '#6B7280',
        }}
      >
        {trip.pickup}
      </Typography>
    </RowStack>

    {/* Dropoff */}
    <RowStack spacing={'8px'}>
      <Box
        sx={{
          width: 5,
          height: 5,
          borderRadius: '2.5px',
          background: '#2F6FED',
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(11.5),
          color: '#6B7280',
        }}
      >
        {trip.dropoff}
      </Typography>
    </RowStack>

    {/* Date */}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(11),
        color: '#9CA3AF',
      }}
    >
      {trip.date}
    </Typography>
  </Stack>
);

// ─── Main Component ─────────────────────────────────────────────────────────

export const DriverViewDrawer = ({
  open,
  onClose,
  driver,
}: DriverViewDrawerProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedAction, setExpandedAction] = useState<
    'fleet' | 'vehicle' | null
  >(null);
  const [selectedFleet, setSelectedFleet] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [isSuspended, setIsSuspended] = useState(false);

  if (!driver) return null;

  const nameParts = driver.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  const badge =
    statusBadgeConfig[driver.status] || statusBadgeConfig['Available'];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 500,
          boxShadow: '-4px 0px 48px rgba(0, 0, 0, 0.14)',
        },
      }}
    >
      {/* ─── Sticky Header ──────────────────────────────────────────── */}
      <Stack
        sx={{
          padding: '20px 24px 0',
          borderBottom: '0.67px solid #F0F4F8',
        }}
        spacing={'16px'}
      >
        {/* Avatar + Name + Close */}
        <RowStack justifyContent={'space-between'}>
          <RowStack spacing={'12px'}>
            <Avatar
              src={driver.avatar || undefined}
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
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(17),
                  color: '#111827',
                  lineHeight: '1.5em',
                }}
              >
                {driver.name}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#9CA3AF',
                  lineHeight: '1.5em',
                }}
              >
                {driver.driverId} · Joined {driver.joinedDate}
              </Typography>
            </Stack>
          </RowStack>
          <IconButton
            onClick={onClose}
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

        {/* Fleet / Vehicle Card */}
        <Box
          sx={{
            background: '#F7F9FB',
            border: '0.67px solid #F0F2F5',
            borderRadius: '14px',
            padding: '12px 16px',
            position: 'relative',
          }}
        >
          <RowStack spacing={'16px'}>
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(10),
                  letterSpacing: '0.04em',
                  color: '#9CA3AF',
                }}
              >
                FLEET
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(12.5),
                  color: '#374151',
                }}
              >
                {driver.fleet}
              </Typography>
            </Stack>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: '#E5E7EB' }}
            />
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(10),
                  letterSpacing: '0.04em',
                  color: '#9CA3AF',
                }}
              >
                VEHICLE
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(12.5),
                  color: '#374151',
                }}
              >
                {driver.vehicle}
              </Typography>
            </Stack>
          </RowStack>
          <Chip
            label={driver.status}
            size="small"
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: badge.bg,
              color: badge.color,
              border: `0.67px solid ${badge.border}`,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: pxToRem(11.5),
              height: '24px',
              borderRadius: '100px',
            }}
          />
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="fullWidth"
          sx={{
            minHeight: 'unset',
            '& .MuiTabs-indicator': {
              height: 2,
              backgroundColor: '#2F6FED',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: pxToRem(12.5),
              fontWeight: 600,
              color: '#9CA3AF',
              minHeight: '41px',
              padding: '10px 0',
              '&.Mui-selected': { color: '#2F6FED' },
            },
          }}
        >
          <Tab label="Driver Info" />
          <Tab label="Documents" />
          <Tab label="Trips" />
          <Tab label="Ratings" />
        </Tabs>
      </Stack>

      {/* ─── Scrollable Content ─────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          '::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {/* ═══ Tab 0: Driver Info ════════════════════════════════════ */}
        {activeTab === 0 && (
          <Stack spacing={'20px'}>
            {/* Personal Information */}
            <Stack spacing={'10px'}>
              <SectionLabel text="Personal Information" />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                <ReadOnlyField label="Phone" value={driver.phone} />
                <ReadOnlyField label="Email" value={driver.email} />
                <ReadOnlyField
                  label="Date of Birth"
                  value={driver.dateOfBirth}
                />
                <ReadOnlyField
                  label="Member Since"
                  value={driver.memberSince}
                />
              </Box>
            </Stack>

            {/* Driver Credentials */}
            <Stack spacing={'10px'}>
              <SectionLabel text="Driver Credentials" />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                <ReadOnlyField label="License" value={driver.license} />
                <ReadOnlyField label="BG Check" value={driver.bgCheck} />
                <ReadOnlyField
                  label="License Expiry"
                  value={driver.licenseExpiry}
                />
                <ReadOnlyField label="Docs Status" value={driver.docsStatus} />
              </Box>
            </Stack>

            {/* Service Capabilities */}
            <Stack spacing={'10px'}>
              <SectionLabel text="Service Capabilities" />
              <RowStack spacing={'8px'} flexWrap="wrap">
                {driver.capabilities.map((cap) => (
                  <Chip
                    key={cap}
                    icon={
                      <CheckCircleOutlinedIcon
                        sx={{
                          fontSize: 11,
                          color: '#2F6FED !important',
                        }}
                      />
                    }
                    label={cap}
                    size="small"
                    sx={{
                      background: '#EEF3FF',
                      color: '#2F6FED',
                      border: '0.67px solid #C7D7F9',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: pxToRem(12),
                      height: '28px',
                      borderRadius: '100px',
                      '& .MuiChip-icon': { marginLeft: '8px' },
                    }}
                  />
                ))}
              </RowStack>
            </Stack>

            {/* Admin Actions */}
            <Stack spacing={'10px'}>
              <SectionLabel text="Admin Actions" />
              <Stack spacing={'8px'}>
                {/* Change Fleet Assignment */}
                {expandedAction === 'fleet' ? (
                  <Stack
                    spacing={'16px'}
                    sx={{
                      background: '#F7F9FB',
                      border: '0.67px solid #E8ECF0',
                      borderRadius: '14px',
                      padding: '16px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12),
                        color: '#374151',
                      }}
                    >
                      Change Fleet Assignment
                    </Typography>
                    <Select
                      value={selectedFleet}
                      onChange={(e) => setSelectedFleet(e.target.value)}
                      displayEmpty
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{
                        background: '#F9FAFB',
                        border: '0.67px solid #E8ECF0',
                        borderRadius: '10px',
                        height: '39px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: pxToRem(13),
                        color: '#374151',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiSelect-icon': { color: '#9CA3AF', fontSize: 18 },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            borderRadius: '10px',
                            border: '0.67px solid #E8ECF0',
                            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
                            mt: '4px',
                          },
                        },
                      }}
                      renderValue={(value) => value || driver.fleet}
                    >
                      {fleetOptions.map((fleet) => (
                        <MenuItem
                          key={fleet}
                          value={fleet}
                          sx={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: pxToRem(14),
                            color: '#374151',
                            padding: '10px 17px',
                            '&.Mui-selected': { background: '#F0F4F8' },
                            '&:hover': { background: '#F7F9FB' },
                          }}
                        >
                          {fleet}
                        </MenuItem>
                      ))}
                    </Select>
                    <RowStack spacing={'8px'}>
                      <Box
                        onClick={() => {
                          setExpandedAction(null);
                          setSelectedFleet('');
                        }}
                        sx={{
                          flex: 1,
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                          background: '#FFFFFF',
                          border: '0.67px solid #E5E7EB',
                          cursor: 'pointer',
                          '&:hover': { background: '#F9FAFB' },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12),
                            color: '#374151',
                          }}
                        >
                          Cancel
                        </Typography>
                      </Box>
                      <Box
                        onClick={() => {
                          setExpandedAction(null);
                          setSelectedFleet('');
                        }}
                        sx={{
                          flex: 1,
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                          background: '#2F6FED',
                          cursor: 'pointer',
                          '&:hover': { background: '#2760D4' },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12),
                            color: '#FFFFFF',
                          }}
                        >
                          Save Fleet
                        </Typography>
                      </Box>
                    </RowStack>
                  </Stack>
                ) : (
                  <ActionButton
                    icon={
                      <SwapHorizOutlinedIcon
                        sx={{ fontSize: 13, color: '#374151' }}
                      />
                    }
                    label="Change Fleet Assignment"
                    variant="default"
                    onClick={() => {
                      setExpandedAction('fleet');
                      setSelectedFleet('');
                    }}
                  />
                )}

                {/* Reassign Vehicle */}
                {expandedAction === 'vehicle' ? (
                  <Stack
                    spacing={'16px'}
                    sx={{
                      background: '#F7F9FB',
                      border: '0.67px solid #E8ECF0',
                      borderRadius: '14px',
                      padding: '16px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12),
                        color: '#374151',
                      }}
                    >
                      Reassign Vehicle
                    </Typography>
                    <Select
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      displayEmpty
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{
                        background: '#F9FAFB',
                        border: '0.67px solid #E8ECF0',
                        borderRadius: '10px',
                        height: '39px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: pxToRem(13),
                        color: '#374151',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiSelect-icon': { color: '#9CA3AF', fontSize: 18 },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            borderRadius: '10px',
                            border: '0.67px solid #E8ECF0',
                            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
                            mt: '4px',
                          },
                        },
                      }}
                      renderValue={(value) => value || driver.vehicle}
                    >
                      {vehicleOptions.map((vehicle) => (
                        <MenuItem
                          key={vehicle}
                          value={vehicle}
                          sx={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: pxToRem(14),
                            color: '#374151',
                            padding: '10px 17px',
                            '&.Mui-selected': { background: '#F0F4F8' },
                            '&:hover': { background: '#F7F9FB' },
                          }}
                        >
                          {vehicle}
                        </MenuItem>
                      ))}
                    </Select>
                    <RowStack spacing={'8px'}>
                      <Box
                        onClick={() => {
                          setExpandedAction(null);
                          setSelectedVehicle('');
                        }}
                        sx={{
                          flex: 1,
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                          background: '#FFFFFF',
                          border: '0.67px solid #E5E7EB',
                          cursor: 'pointer',
                          '&:hover': { background: '#F9FAFB' },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12),
                            color: '#374151',
                          }}
                        >
                          Cancel
                        </Typography>
                      </Box>
                      <Box
                        onClick={() => {
                          setExpandedAction(null);
                          setSelectedVehicle('');
                        }}
                        sx={{
                          flex: 1,
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                          background: '#2F6FED',
                          cursor: 'pointer',
                          '&:hover': { background: '#2760D4' },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12),
                            color: '#FFFFFF',
                          }}
                        >
                          Reassign
                        </Typography>
                      </Box>
                    </RowStack>
                  </Stack>
                ) : (
                  <ActionButton
                    icon={
                      <DirectionsCarOutlinedIcon
                        sx={{ fontSize: 13, color: '#374151' }}
                      />
                    }
                    label="Reassign Vehicle"
                    variant="default"
                    onClick={() => {
                      setExpandedAction('vehicle');
                      setSelectedVehicle('');
                    }}
                  />
                )}

                {/* Suspend / Reactivate Driver */}
                {isSuspended || driver.status === 'Suspended' ? (
                  <ActionButton
                    icon={
                      <CheckCircleOutlineIcon
                        sx={{ fontSize: 13, color: '#059669' }}
                      />
                    }
                    label="Reactivate Driver"
                    variant="success"
                    onClick={() => setIsSuspended(false)}
                  />
                ) : (
                  <ActionButton
                    icon={
                      <BlockOutlinedIcon
                        sx={{ fontSize: 13, color: '#DC2626' }}
                      />
                    }
                    label="Suspend Driver"
                    variant="danger"
                    onClick={() => setIsSuspended(true)}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        )}

        {/* ═══ Tab 1: Documents ══════════════════════════════════════ */}
        {activeTab === 1 && (
          <Stack spacing={'10px'}>
            <SectionLabel text="Document Status" />
            <Stack spacing={'10px'}>
              {documentsData.map((doc) => (
                <DocumentRow
                  key={doc.name}
                  name={doc.name}
                  status={doc.status}
                />
              ))}
            </Stack>
          </Stack>
        )}

        {/* ═══ Tab 2: Trips ══════════════════════════════════════════ */}
        {activeTab === 2 && (
          <Stack spacing={'16px'}>
            <RowStack justifyContent={'space-between'}>
              <SectionLabel text="Recent Trips" />
              <Chip
                label={`${driver.trips} total`}
                size="small"
                sx={{
                  background: '#EEF3FF',
                  color: '#2F6FED',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: pxToRem(11.5),
                  height: '22px',
                  borderRadius: '100px',
                }}
              />
            </RowStack>
            <Stack spacing={'12px'}>
              {tripsData.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </Stack>
          </Stack>
        )}

        {/* ═══ Tab 3: Ratings ════════════════════════════════════════ */}
        {activeTab === 3 && (
          <Stack spacing={'16px'}>
            <SectionLabel text="Rating Breakdown" />

            {/* Overall Rating Card */}
            <Stack
              sx={{
                background: '#F7F9FB',
                border: '0.67px solid #EAECF0',
                borderRadius: '16px',
                padding: '20px',
              }}
              spacing={'20px'}
            >
              {/* Top: Big number + stars + count | bars */}
              <RowStack spacing={'20px'} alignItems="flex-start">
                {/* Left: Big rating */}
                <Stack spacing={'4px'} alignItems={'center'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 800,
                      fontSize: pxToRem(44),
                      lineHeight: '1em',
                      color: '#111827',
                    }}
                  >
                    {driver.rating.toFixed(1)}
                  </Typography>
                  <Rating
                    value={driver.rating}
                    readOnly
                    precision={0.1}
                    size="small"
                    icon={<StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />}
                    emptyIcon={
                      <StarIcon sx={{ fontSize: 14, color: '#E5E7EB' }} />
                    }
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12),
                      color: '#9CA3AF',
                    }}
                  >
                    {driver.trips} ratings
                  </Typography>
                </Stack>

                {/* Right: Bar breakdown */}
                <Stack spacing={'6px'} sx={{ flex: 1 }}>
                  {ratingBreakdown.map((item) => (
                    <RowStack
                      key={item.stars}
                      spacing={'8px'}
                      sx={{ width: '100%' }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: '#6B7280',
                          width: '8px',
                          flexShrink: 0,
                        }}
                      >
                        {item.stars}
                      </Typography>
                      <StarIcon sx={{ fontSize: 10, color: '#F59E0B' }} />
                      <LinearProgress
                        variant="determinate"
                        value={item.percent}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: '3px',
                          [`& .${linearProgressClasses.bar}`]: {
                            borderRadius: '3px',
                            backgroundColor: '#F59E0B',
                          },
                          [`&.${linearProgressClasses.root}`]: {
                            backgroundColor: '#E5E7EB',
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(11),
                          color: '#9CA3AF',
                          width: '28px',
                          textAlign: 'right',
                          flexShrink: 0,
                        }}
                      >
                        {item.percent}%
                      </Typography>
                    </RowStack>
                  ))}
                </Stack>
              </RowStack>
            </Stack>

            {/* Category Ratings */}
            <Stack spacing={'12px'}>
              {categoryRatings.map((cat) => (
                <RowStack key={cat.label} spacing={'12px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      color: '#374151',
                      width: '160px',
                      flexShrink: 0,
                    }}
                  >
                    {cat.label}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(cat.value / 5) * 100}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: '3px',
                      [`& .${linearProgressClasses.bar}`]: {
                        borderRadius: '3px',
                        backgroundColor: '#2F6FED',
                      },
                      [`&.${linearProgressClasses.root}`]: {
                        backgroundColor: '#F0F2F5',
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(12.5),
                      color: '#111827',
                      width: '30px',
                      textAlign: 'right',
                      flexShrink: 0,
                    }}
                  >
                    {cat.value.toFixed(1)}
                  </Typography>
                </RowStack>
              ))}
            </Stack>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
};

// ─── Action Button ──────────────────────────────────────────────────────────

const ActionButton = ({
  icon,
  label,
  variant,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  variant: 'default' | 'danger' | 'success';
  onClick?: () => void;
}) => (
  <RowStack
    justifyContent={'center'}
    spacing={'8px'}
    onClick={onClick}
    sx={{
      height: '41px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'opacity 0.15s ease',
      '&:hover': { opacity: 0.8 },
      ...(variant === 'default' && {
        background: '#F7F9FB',
        border: '0.67px solid #E5E7EB',
      }),
      ...(variant === 'danger' && {
        background: '#FEF2F2',
        border: '0.67px solid #FECACA',
      }),
      ...(variant === 'success' && {
        background: '#ECFDF5',
        border: '0.67px solid #BBF7D0',
      }),
    }}
  >
    {icon}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(13),
        color:
          variant === 'danger'
            ? '#DC2626'
            : variant === 'success'
              ? '#059669'
              : '#374151',
      }}
    >
      {label}
    </Typography>
  </RowStack>
);
