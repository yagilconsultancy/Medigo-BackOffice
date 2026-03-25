'use client';

import { useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Drawer,
  IconButton,
  LinearProgress,
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { toast } from 'sonner';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { AllDriverRow, DriverStatus } from '../../../index';

// ─── Status Config ──────────────────────────────────────────────────────────

const statusChipConfig: Record<
  DriverStatus,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  Available: {
    color: '#059669',
    bg: '#ECFDF5',
    icon: (
      <CheckCircleOutlineIcon
        sx={{ fontSize: pxToRem(11), color: '#059669 !important' }}
      />
    ),
  },
  'On Trip': {
    color: '#3730A3',
    bg: '#EEF2FF',
    icon: (
      <NearMeOutlinedIcon
        sx={{ fontSize: pxToRem(11), color: '#3730A3 !important' }}
      />
    ),
  },
  'Off Duty': {
    color: '#6B7280',
    bg: '#F3F4F6',
    icon: (
      <AccessTimeIcon
        sx={{ fontSize: pxToRem(11), color: '#6B7280 !important' }}
      />
    ),
  },
  Suspended: {
    color: '#EF4444',
    bg: '#FEF2F2',
    icon: (
      <AccessTimeIcon
        sx={{ fontSize: pxToRem(11), color: '#EF4444 !important' }}
      />
    ),
  },
};

// ─── Mock Trip Data ─────────────────────────────────────────────────────────

type TripRecord = {
  id: string;
  amount: string;
  status: string;
  rider: string;
  pickup: string;
  dropoff: string;
  date: string;
};

const mockTrips: TripRecord[] = [
  {
    id: 'TR-9201',
    amount: '$28.40',
    status: 'Completed',
    rider: 'Helen Moore',
    pickup: '456 Oak Avenue, Brooklyn, NY',
    dropoff: 'NYC Medical Center, Manhattan',
    date: 'Mar 9',
  },
  {
    id: 'TR-9198',
    amount: '$35.20',
    status: 'Completed',
    rider: 'Robert Davis',
    pickup: '789 Pine Street, Queens, NY',
    dropoff: 'St. Luke\'s Hospital, Manhattan',
    date: 'Mar 8',
  },
  {
    id: 'TR-9195',
    amount: '$22.80',
    status: 'Completed',
    rider: 'Maria Santos',
    pickup: '321 Elm Drive, Bronx, NY',
    dropoff: 'Bronx Care Health, Bronx',
    date: 'Mar 7',
  },
  {
    id: 'TR-9190',
    amount: '$41.60',
    status: 'Completed',
    rider: 'James Wilson',
    pickup: '654 Maple Road, Staten Island, NY',
    dropoff: 'Mount Sinai Hospital, Manhattan',
    date: 'Mar 6',
  },
];

// ─── Document Data ──────────────────────────────────────────────────────────

type DocRecord = {
  name: string;
  status: string;
  statusColor: string;
  statusBg: string;
  icon: React.ReactNode;
};

const mockDocs: DocRecord[] = [
  {
    name: "Driver's License",
    status: 'Verified',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    icon: (
      <DescriptionOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />
    ),
  },
  {
    name: 'Background Check',
    status: 'Verified',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    icon: (
      <VerifiedOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />
    ),
  },
  {
    name: 'Vehicle Insurance',
    status: 'Valid',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    icon: (
      <GppGoodOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />
    ),
  },
  {
    name: 'Medical Transport Cert.',
    status: 'Verified',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    icon: (
      <LocalHospitalOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />
    ),
  },
  {
    name: 'Platform Agreement',
    status: 'Signed',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    icon: (
      <HandshakeOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />
    ),
  },
];

// ─── Rating Data ────────────────────────────────────────────────────────────

const starDistribution = [
  { stars: 5, percent: 72 },
  { stars: 4, percent: 20 },
  { stars: 3, percent: 6 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

const categoryRatings = [
  { label: 'Punctuality', score: 4.8 },
  { label: 'Professionalism', score: 4.9 },
  { label: 'Driving Safety', score: 4.7 },
  { label: 'Vehicle Cleanliness', score: 4.6 },
  { label: 'Patient Care', score: 4.9 },
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
  'Honda Odyssey · 2021',
  'Ford Escape · 2023',
  'Chrysler Pacifica · 2020',
  'Dodge Caravan · 2021',
  'Toyota Camry · 2022',
  'Kia Sedona · 2020',
  'Buick Enclave · 2021',
];

// ─── Component ──────────────────────────────────────────────────────────────

type DriverDetailDrawerProps = {
  open: boolean;
  onClose: () => void;
  driver: AllDriverRow | null;
};

export const DriverDetailDrawer = ({
  open,
  onClose,
  driver,
}: DriverDetailDrawerProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showFleetForm, setShowFleetForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');

  if (!driver) return null;

  const nameParts = driver.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  const statusConfig = statusChipConfig[driver.status];

  const handleSuspend = () => {
    toast.success(`${driver.name} suspended`);
  };

  const handleSaveFleet = () => {
    toast.success(`Fleet assignment updated for ${driver.name}`);
    setShowFleetForm(false);
    setSelectedFleet('');
  };

  const handleReassignVehicle = () => {
    toast.success(`Vehicle reassigned for ${driver.name}`);
    setShowVehicleForm(false);
    setSelectedVehicle('');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '500px',
          boxShadow: '-4px 0px 48px rgba(0, 0, 0, 0.14)',
          border: 'none',
        },
      }}
    >
      <Stack sx={{ height: '100%', overflow: 'auto' }}>
        {/* ─── Header Section ──────────────────────────────────────── */}
        <Stack
          sx={{
            padding: '24px',
            borderBottom: '1px solid #E8ECF0',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: '#F3F4F6',
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <CloseIcon sx={{ fontSize: 16, color: '#6B7280' }} />
          </IconButton>

          {/* Avatar + Name + ID */}
          <RowStack spacing={'16px'}>
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
            <Stack spacing={0}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(17),
                  lineHeight: '1.4em',
                  color: '#111827',
                }}
              >
                {driver.name}
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
                {driver.driverId} · Joined {driver.joinedDate}
              </Typography>
            </Stack>
          </RowStack>

          {/* Summary Bar */}
          <RowStack
            sx={{
              marginTop: '16px',
              background: '#F7F9FB',
              borderRadius: '14px',
              padding: '12px 16px',
              justifyContent: 'space-between',
            }}
          >
            <Stack spacing={0} alignItems={'center'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(9),
                  letterSpacing: '0.08em',
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
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
            <Box
              sx={{
                width: '1px',
                height: '28px',
                background: '#E8ECF0',
              }}
            />
            <Stack spacing={0} alignItems={'center'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(9),
                  letterSpacing: '0.08em',
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
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
            <Box
              sx={{
                width: '1px',
                height: '28px',
                background: '#E8ECF0',
              }}
            />
            <Chip
              icon={statusConfig.icon as React.ReactElement}
              label={driver.status}
              size="small"
              sx={{
                background: statusConfig.bg,
                color: statusConfig.color,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(11.5),
                height: '26px',
                borderRadius: '100px',
                '& .MuiChip-icon': { marginLeft: '6px' },
              }}
            />
          </RowStack>
        </Stack>

        {/* ─── Tab Bar ─────────────────────────────────────────────── */}
        <Box sx={{ borderBottom: '1px solid #E8ECF0' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              minHeight: '44px',
              '& .MuiTabs-indicator': {
                backgroundColor: '#2F6FED',
                height: '2px',
              },
              '& .MuiTab-root': {
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(13),
                textTransform: 'none',
                color: '#9CA3AF',
                minHeight: '44px',
                padding: '12px 16px',
                '&.Mui-selected': {
                  color: '#2F6FED',
                },
              },
            }}
          >
            <Tab label="Driver Info" />
            <Tab label="Documents" />
            <Tab label="Trips" />
            <Tab label="Ratings" />
          </Tabs>
        </Box>

        {/* ─── Tab Panels ──────────────────────────────────────────── */}
        <Box sx={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {/* Tab 0: Driver Info */}
          {activeTab === 0 && (
            <DriverInfoTab
              driver={driver}
              showFleetForm={showFleetForm}
              showVehicleForm={showVehicleForm}
              selectedFleet={selectedFleet}
              selectedVehicle={selectedVehicle}
              onToggleFleetForm={() => {
                setShowFleetForm(!showFleetForm);
                setShowVehicleForm(false);
              }}
              onToggleVehicleForm={() => {
                setShowVehicleForm(!showVehicleForm);
                setShowFleetForm(false);
              }}
              onFleetChange={setSelectedFleet}
              onVehicleChange={setSelectedVehicle}
              onSaveFleet={handleSaveFleet}
              onReassignVehicle={handleReassignVehicle}
              onSuspend={handleSuspend}
            />
          )}

          {/* Tab 1: Documents */}
          {activeTab === 1 && <DocumentsTab />}

          {/* Tab 2: Trips */}
          {activeTab === 2 && <TripsTab driver={driver} />}

          {/* Tab 3: Ratings */}
          {activeTab === 3 && <RatingsTab driver={driver} />}
        </Box>
      </Stack>
    </Drawer>
  );
};

// ─── Tab 0: Driver Info ─────────────────────────────────────────────────────

type DriverInfoTabProps = {
  driver: AllDriverRow;
  showFleetForm: boolean;
  showVehicleForm: boolean;
  selectedFleet: string;
  selectedVehicle: string;
  onToggleFleetForm: () => void;
  onToggleVehicleForm: () => void;
  onFleetChange: (value: string) => void;
  onVehicleChange: (value: string) => void;
  onSaveFleet: () => void;
  onReassignVehicle: () => void;
  onSuspend: () => void;
};

const DriverInfoTab = ({
  driver,
  showFleetForm,
  showVehicleForm,
  selectedFleet,
  selectedVehicle,
  onToggleFleetForm,
  onToggleVehicleForm,
  onFleetChange,
  onVehicleChange,
  onSaveFleet,
  onReassignVehicle,
  onSuspend,
}: DriverInfoTabProps) => (
  <Stack spacing={'24px'}>
    {/* Personal Information */}
    <Stack spacing={'12px'}>
      <SectionLabel>PERSONAL INFORMATION</SectionLabel>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}
      >
        <InfoCard label="PHONE" value={driver.phone} />
        <InfoCard label="EMAIL" value={driver.email} />
        <InfoCard label="DATE OF BIRTH" value={driver.dateOfBirth} />
        <InfoCard label="MEMBER SINCE" value={driver.memberSince} />
      </Box>
    </Stack>

    {/* Driver Credentials */}
    <Stack spacing={'12px'}>
      <SectionLabel>DRIVER CREDENTIALS</SectionLabel>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}
      >
        <InfoCard label="LICENSE" value={driver.license} />
        <InfoCard
          label="BG CHECK"
          value={driver.bgCheck}
          valueColor={driver.bgCheck === 'Verified' ? '#059669' : '#D97706'}
        />
        <InfoCard label="LICENSE EXPIRY" value={driver.licenseExpiry} />
        <InfoCard
          label="DOCS STATUS"
          value={driver.docsStatus}
          valueColor={
            driver.docsStatus === 'Complete' ? '#059669' : '#D97706'
          }
        />
      </Box>
    </Stack>

    {/* Service Capabilities */}
    {driver.capabilities.length > 0 && (
      <Stack spacing={'12px'}>
        <SectionLabel>SERVICE CAPABILITIES</SectionLabel>
        <RowStack spacing={'8px'} sx={{ flexWrap: 'wrap' }}>
          {driver.capabilities.map((cap) => (
            <Chip
              key={cap}
              label={cap}
              size="small"
              sx={{
                background: '#EEF3FF',
                border: '1px solid #C7D7F9',
                color: '#2F6FED',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(12),
                height: '30px',
                borderRadius: '100px',
              }}
            />
          ))}
        </RowStack>
      </Stack>
    )}

    {/* Admin Actions */}
    <Stack spacing={'10px'}>
      <SectionLabel>ADMIN ACTIONS</SectionLabel>

      {/* Change Fleet Assignment */}
      <ActionButton
        icon={
          <SwapHorizIcon sx={{ fontSize: 16, color: '#6B7280' }} />
        }
        label="Change Fleet Assignment"
        onClick={onToggleFleetForm}
        variant="default"
      />
      {showFleetForm && (
        <InlineForm
          title="Change Fleet Assignment"
          value={selectedFleet}
          onChange={onFleetChange}
          options={fleetOptions}
          onCancel={onToggleFleetForm}
          onSave={onSaveFleet}
          saveLabel="Save Fleet"
          placeholder="Select fleet..."
        />
      )}

      {/* Reassign Vehicle */}
      <ActionButton
        icon={
          <DirectionsCarOutlinedIcon
            sx={{ fontSize: 16, color: '#6B7280' }}
          />
        }
        label="Reassign Vehicle"
        onClick={onToggleVehicleForm}
        variant="default"
      />
      {showVehicleForm && (
        <InlineForm
          title="Reassign Vehicle"
          value={selectedVehicle}
          onChange={onVehicleChange}
          options={vehicleOptions}
          onCancel={onToggleVehicleForm}
          onSave={onReassignVehicle}
          saveLabel="Reassign"
          placeholder="Select vehicle..."
        />
      )}

      {/* Suspend Driver */}
      <ActionButton
        icon={
          <BlockOutlinedIcon sx={{ fontSize: 16, color: '#EF4444' }} />
        }
        label="Suspend Driver"
        onClick={onSuspend}
        variant="danger"
      />
    </Stack>
  </Stack>
);

// ─── Tab 1: Documents ───────────────────────────────────────────────────────

const DocumentsTab = () => (
  <Stack spacing={'12px'}>
    <SectionLabel>DOCUMENT STATUS</SectionLabel>
    {mockDocs.map((doc) => (
      <RowStack
        key={doc.name}
        sx={{
          background: '#F7F9FB',
          border: '1px solid #E8ECF0',
          borderRadius: '14px',
          padding: '14px 16px',
          justifyContent: 'space-between',
        }}
      >
        <RowStack spacing={'12px'}>
          {doc.icon}
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(13),
              color: '#374151',
            }}
          >
            {doc.name}
          </Typography>
        </RowStack>
        <Chip
          label={doc.status}
          size="small"
          sx={{
            background: doc.statusBg,
            color: doc.statusColor,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: pxToRem(11),
            height: '24px',
            borderRadius: '100px',
          }}
        />
      </RowStack>
    ))}
  </Stack>
);

// ─── Tab 2: Trips ───────────────────────────────────────────────────────────

const TripsTab = ({ driver }: { driver: AllDriverRow }) => (
  <Stack spacing={'12px'}>
    <RowStack spacing={'10px'}>
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
        RECENT TRIPS
      </Typography>
      <Chip
        label={`${driver.trips} total`}
        size="small"
        sx={{
          background: '#EEF3FF',
          color: '#2F6FED',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: pxToRem(11),
          height: '22px',
          borderRadius: '100px',
        }}
      />
    </RowStack>

    {mockTrips.map((trip) => (
      <Stack
        key={trip.id}
        sx={{
          background: '#F7F9FB',
          borderRadius: '14px',
          padding: '16px',
        }}
        spacing={'10px'}
      >
        {/* Trip Header */}
        <RowStack justifyContent={'space-between'}>
          <RowStack spacing={'10px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(13),
                color: '#2F6FED',
              }}
            >
              {trip.id}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(13),
                color: '#059669',
              }}
            >
              {trip.amount}
            </Typography>
          </RowStack>
          <Chip
            label={trip.status}
            size="small"
            sx={{
              background: '#ECFDF5',
              color: '#059669',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: pxToRem(10.5),
              height: '22px',
              borderRadius: '100px',
            }}
          />
        </RowStack>

        {/* Rider Name */}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {trip.rider}
        </Typography>

        {/* Pickup */}
        <RowStack spacing={'8px'}>
          <FiberManualRecordIcon
            sx={{ fontSize: 8, color: '#9CA3AF' }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: '#6B7280',
            }}
          >
            {trip.pickup}
          </Typography>
        </RowStack>

        {/* Dropoff */}
        <RowStack spacing={'8px'}>
          <FiberManualRecordIcon
            sx={{ fontSize: 8, color: '#2F6FED' }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
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
    ))}
  </Stack>
);

// ─── Tab 3: Ratings ─────────────────────────────────────────────────────────

const RatingsTab = ({ driver }: { driver: AllDriverRow }) => (
  <Stack spacing={'24px'}>
    {/* Rating Breakdown */}
    <Stack spacing={'12px'}>
      <SectionLabel>RATING BREAKDOWN</SectionLabel>

      {/* Overall Rating Card */}
      <Stack
        sx={{
          background: '#F7F9FB',
          border: '1px solid #EAECF0',
          borderRadius: '16px',
          padding: '20px',
          alignItems: 'center',
        }}
        spacing={'8px'}
      >
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
          icon={<StarIcon sx={{ fontSize: 22, color: '#F59E0B' }} />}
          emptyIcon={<StarIcon sx={{ fontSize: 22, color: '#E5E7EB' }} />}
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

      {/* Star Distribution */}
      <Stack spacing={'6px'} sx={{ marginTop: '4px' }}>
        {starDistribution.map((row) => (
          <RowStack key={row.stars} spacing={'10px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: '#6B7280',
                width: '12px',
                textAlign: 'right',
              }}
            >
              {row.stars}
            </Typography>
            <StarIcon sx={{ fontSize: 13, color: '#F59E0B' }} />
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={row.percent}
                sx={{
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: '#F0F2F5',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#F59E0B',
                    borderRadius: '4px',
                  },
                }}
              />
            </Box>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: '#6B7280',
                width: '32px',
                textAlign: 'right',
              }}
            >
              {row.percent}%
            </Typography>
          </RowStack>
        ))}
      </Stack>
    </Stack>

    {/* Category Ratings */}
    <Stack spacing={'12px'}>
      <SectionLabel>CATEGORY RATINGS</SectionLabel>
      {categoryRatings.map((cat) => (
        <RowStack key={cat.label} spacing={'12px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(13),
              color: '#374151',
              width: '140px',
              flexShrink: 0,
            }}
          >
            {cat.label}
          </Typography>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={(cat.score / 5) * 100}
              sx={{
                height: '8px',
                borderRadius: '4px',
                backgroundColor: '#F0F2F5',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#2F6FED',
                  borderRadius: '4px',
                },
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(13),
              color: '#111827',
              width: '28px',
              textAlign: 'right',
            }}
          >
            {cat.score.toFixed(1)}
          </Typography>
        </RowStack>
      ))}
    </Stack>
  </Stack>
);

// ─── Sub-Components ─────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: pxToRem(10),
      lineHeight: '1.5em',
      letterSpacing: '0.08em',
      color: '#9CA3AF',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </Typography>
);

const InfoCard = ({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <Stack
    sx={{
      background: '#F7F9FB',
      borderRadius: '14px',
      padding: '12px 14px',
    }}
    spacing={'2px'}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(9),
        letterSpacing: '0.08em',
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
        fontSize: pxToRem(13),
        color: valueColor || '#374151',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

const ActionButton = ({
  icon,
  label,
  onClick,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant: 'default' | 'danger';
}) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      background: variant === 'danger' ? '#FEF2F2' : '#FFFFFF',
      border: `1px solid ${variant === 'danger' ? '#FECACA' : '#E8ECF0'}`,
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      '&:hover': {
        background: variant === 'danger' ? '#FEE2E2' : '#F9FAFB',
      },
    }}
  >
    {icon}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(13),
        color: variant === 'danger' ? '#EF4444' : '#374151',
      }}
    >
      {label}
    </Typography>
  </Box>
);

const InlineForm = ({
  title,
  value,
  onChange,
  options,
  onCancel,
  onSave,
  saveLabel,
  placeholder,
}: {
  title: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
  placeholder: string;
}) => (
  <Stack
    sx={{
      background: '#F7F9FB',
      border: '1px solid #E8ECF0',
      borderRadius: '14px',
      padding: '16px',
    }}
    spacing={'12px'}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(13),
        color: '#374151',
      }}
    >
      {title}
    </Typography>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      displayEmpty
      size="small"
      sx={{
        background: '#FFFFFF',
        borderRadius: '10px',
        fontFamily: 'Inter, sans-serif',
        fontSize: pxToRem(13),
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E8ECF0',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#C7D7F9',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#2F6FED',
        },
      }}
    >
      <MenuItem value="" disabled>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: pxToRem(13),
            color: '#9CA3AF',
          }}
        >
          {placeholder}
        </Typography>
      </MenuItem>
      {options.map((opt) => (
        <MenuItem
          key={opt}
          value={opt}
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: pxToRem(13),
          }}
        >
          {opt}
        </MenuItem>
      ))}
    </Select>
    <RowStack spacing={'8px'} justifyContent={'flex-end'}>
      <Box
        onClick={onCancel}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '36px',
          padding: '0 16px',
          background: '#FFFFFF',
          border: '1px solid #E8ECF0',
          borderRadius: '8px',
          cursor: 'pointer',
          '&:hover': { background: '#F9FAFB' },
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            color: '#6B7280',
          }}
        >
          Cancel
        </Typography>
      </Box>
      <Box
        onClick={onSave}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '36px',
          padding: '0 16px',
          background: '#2F6FED',
          borderRadius: '8px',
          cursor: 'pointer',
          '&:hover': { opacity: 0.9 },
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            color: '#FFFFFF',
          }}
        >
          {saveLabel}
        </Typography>
      </Box>
    </RowStack>
  </Stack>
);
