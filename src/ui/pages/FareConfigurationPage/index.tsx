'use client';

import { useState } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { AppDropdownMenu } from '../../modules/components/AppDropdownMenu';
import { GridColSpec } from '../../modules/components/GridTable';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type TableRow = { id: string; [key: string]: string };

type FareTab = {
  label: string;
  title: string;
  desc: string;
  footnote?: string;
  vendorTerms?: string[];
  columnType: 'rate' | 'route' | 'commission';
  data: TableRow[];
};

type VehicleConfig = {
  tabs: FareTab[];
};

// ─── Vehicle Type Config ────────────────────────────────────────────────────

const vehicleTypes = ['Standard Vehicle', 'Wheelchair (WAV)', 'Stretcher'];

const vehicleTypeStyles: Record<string, { color: string; bg: string }> = {
  'Standard Vehicle': { color: '#2F6FED', bg: '#EBF2FF' },
  'Wheelchair (WAV)': { color: '#6366F1', bg: '#EEF2FF' },
  Stretcher: { color: '#DC2626', bg: '#FEF2F2' },
};

// ─── Standard Vehicle Data ──────────────────────────────────────────────────

const standardBasePricing: TableRow[] = [
  {
    id: '1',
    setting: 'Base Fare (≤10 km)',
    value: '12.00',
    unit: '$',
    description: 'Flat fee for trips up to 10 km',
  },
  {
    id: '2',
    setting: 'Base Fare (>10 km)',
    value: '12.00',
    unit: '$',
    description: 'Base fee before per km charges apply',
  },
  {
    id: '3',
    setting: 'Additional Distance Rate',
    value: '0.75',
    unit: '$/km',
    description: 'Charged per km after first 10 km',
  },
  {
    id: '4',
    setting: 'Surcharge Fee',
    value: '0.06',
    unit: '$',
    description: 'Fixed surcharge applied to every trip',
  },
  {
    id: '5',
    setting: 'Insurance & Payment Fee',
    value: '1.50',
    unit: '$',
    description: 'Covers insurance and payment processing',
  },
  {
    id: '6',
    setting: 'Free Wait Time',
    value: '10',
    unit: 'mins',
    description: 'Complimentary wait time per trip',
  },
  {
    id: '7',
    setting: 'Wait Time Rate (After Free)',
    value: '0.50',
    unit: '$/min',
    description: 'Charged after free wait time expires',
  },
  {
    id: '8',
    setting: 'Maximum Surcharge Cap',
    value: '18.00',
    unit: '$',
    description: 'Max total surcharge allowed per trip',
  },
];

// ─── Wheelchair (WAV) Data ──────────────────────────────────────────────────

const wavRateComponents: TableRow[] = [
  {
    id: '1',
    setting: 'Base Fare (under 10 km)',
    value: '22.00',
    unit: '$',
    description: 'Flat — WAV overhead vs $12 ambulatory',
  },
  {
    id: '2',
    setting: 'Per km (beyond 10 km)',
    value: '1.10',
    unit: '$/km',
    description: 'Higher — van fuel and maintenance',
  },
  {
    id: '3',
    setting: 'Accessibility Fee (every trip)',
    value: '15.00',
    unit: '$',
    description: 'Ramp/lift, securement, training',
  },
  {
    id: '4',
    setting: 'Minimum Fare Protection',
    value: '45.00',
    unit: '$',
    description: 'Base + access fee floor on every trip',
  },
  {
    id: '5',
    setting: 'Surcharge',
    value: '0.06',
    unit: '$',
    description: 'Same as all services',
  },
  {
    id: '6',
    setting: 'Insurance & Gateway',
    value: '1.50',
    unit: '$',
    description: 'Same as all services',
  },
  {
    id: '7',
    setting: 'Wait Time (first 10 min free)',
    value: '0.80',
    unit: '$/min',
    description: 'Higher — WAV loading takes longer',
  },
];

const wavFaresByRoute: TableRow[] = [
  {
    id: '1',
    route: 'Milton Local (8 km)',
    baseAccess: '$37.00',
    minProtected: '$45.80 applied',
    wait: '$8.00',
    otherFees: '$1.56',
    total: '$54.56',
  },
  {
    id: '2',
    route: 'Milton to Georgetown (15 km)',
    baseAccess: '$45.80',
    minProtected: '$45.80 (above min)',
    wait: '$8.00',
    otherFees: '$1.56',
    total: '$55.36',
  },
  {
    id: '3',
    route: 'Milton to Oakville (29 km)',
    baseAccess: '$54.60',
    minProtected: '$54.60 (above min)',
    wait: '$16.00',
    otherFees: '$1.56',
    total: '$72.16',
  },
  {
    id: '4',
    route: 'Milton to Burlington (32 km)',
    baseAccess: '$61.20',
    minProtected: '$61.20 (above min)',
    wait: '$16.00',
    otherFees: '$1.56',
    total: '$78.76',
  },
  {
    id: '5',
    route: 'Milton to Brampton (38 km)',
    baseAccess: '$67.80',
    minProtected: '$67.80 (above min)',
    wait: '$16.00',
    otherFees: '$1.56',
    total: '$85.36',
  },
  {
    id: '6',
    route: 'Milton to Mississauga (45 km)',
    baseAccess: '$75.50',
    minProtected: '$75.50 (above min)',
    wait: '$28.00',
    otherFees: '$1.56',
    total: '$105.06',
  },
];

const wavPlatformCommission: TableRow[] = [
  {
    id: '1',
    route: 'Milton Local',
    totalFare: '$54.56',
    medigo18: '$9.82',
    vendor82: '$44.74',
    vendorNetEst: '~$29.00',
  },
  {
    id: '2',
    route: 'Milton to Georgetown',
    totalFare: '$55.36',
    medigo18: '$9.96',
    vendor82: '$45.40',
    vendorNetEst: '~$29.00',
  },
  {
    id: '3',
    route: 'Milton to Oakville',
    totalFare: '$72.16',
    medigo18: '$12.99',
    vendor82: '$59.17',
    vendorNetEst: '~$38.00',
  },
  {
    id: '4',
    route: 'Milton to Burlington',
    totalFare: '$78.76',
    medigo18: '$14.18',
    vendor82: '$64.58',
    vendorNetEst: '~$42.00',
  },
  {
    id: '5',
    route: 'Milton to Brampton',
    totalFare: '$85.36',
    medigo18: '$15.36',
    vendor82: '$70.00',
    vendorNetEst: '~$46.00',
  },
  {
    id: '6',
    route: 'Milton to Mississauga',
    totalFare: '$105.06',
    medigo18: '$18.91',
    vendor82: '$86.15',
    vendorNetEst: '~$56.00',
  },
];

const wavVendorTerms = [
  '18% platform commission deducted automatically at time of payment',
  'Accessibility fee of $15.00 is collected by Medigo and passed to vendor in full',
  'Minimum fare protection of $45.00 applies to base fare + accessibility fee on every trip',
  'All WAV surcharges (snow, rush hour, 407, weekend, early/late) apply on top of base fare',
  'Maximum surcharge cap of $18.00 per trip applies to all WAV trips',
  'Vendor must maintain WAV certification, ramp/lift inspection records and accessible driver training',
  'Off-platform bookings of Medigo clients prohibited for 12 months from first trip',
  'One-time onboarding fee of $99 applies to all new WAV vendors',
];

// ─── Vehicle Configs ────────────────────────────────────────────────────────

const vehicleConfigs: Record<string, VehicleConfig> = {
  'Standard Vehicle': {
    tabs: [
      {
        label: 'Base Pricing',
        title: 'Base Pricing',
        desc: 'Core fare rates and fees applied to every trip',
        columnType: 'rate',
        data: standardBasePricing,
      },
      {
        label: 'Distance Rules',
        title: 'Distance Rules',
        desc: 'Distance-based fare calculation rules',
        columnType: 'rate',
        data: [],
      },
      {
        label: 'Route Pricing',
        title: 'Route Pricing',
        desc: 'Route-specific fare configurations',
        columnType: 'route',
        data: [],
      },
      {
        label: 'Surcharges',
        title: 'Surcharges',
        desc: 'Additional surcharge configurations',
        columnType: 'rate',
        data: [],
      },
      {
        label: 'Toll Charges',
        title: 'Toll Charges',
        desc: 'Toll charge configurations',
        columnType: 'rate',
        data: [],
      },
      {
        label: 'Discounts (Dialysis)',
        title: 'Discounts (Dialysis)',
        desc: 'Dialysis-related discount configurations',
        columnType: 'rate',
        data: [],
      },
      {
        label: 'Rules & Caps',
        title: 'Rules & Caps',
        desc: 'Fare rules and cap configurations',
        columnType: 'rate',
        data: [],
      },
    ],
  },
  'Wheelchair (WAV)': {
    tabs: [
      {
        label: 'Rate Components',
        title: 'WAV Rate Components',
        desc: 'Base rates applied to every Wheelchair Accessible Vehicle trip',
        footnote:
          '* Minimum fare protection of $45.00 applies to base fare + accessibility fee combined. For short local trips where the calculated amount falls below $45.00, the minimum is applied automatically.',
        columnType: 'rate',
        data: wavRateComponents,
      },
      {
        label: 'Fares by Route',
        title: 'WAV Fares by Route',
        desc: 'Includes accessibility fee, minimum fare protection, and standard billable wait time after the free 10-minute window',
        footnote:
          '* Other Fees column includes surcharge ($0.06) and insurance & gateway ($1.50) on every trip. Milton Local triggers minimum fare protection bringing base + access to $45.00.',
        columnType: 'route',
        data: wavFaresByRoute,
      },
      {
        label: 'Platform Commission',
        title: 'Medigo Platform Commission on WAV Trips',
        desc: 'Medigo charges an 18% platform commission on all WAV trips. Vendor net estimate reflects fare after commission minus estimated fuel and operating costs.',
        vendorTerms: wavVendorTerms,
        columnType: 'commission',
        data: wavPlatformCommission,
      },
    ],
  },
  Stretcher: {
    tabs: [
      {
        label: 'Rate Components',
        title: 'Stretcher Rate Components',
        desc: 'Base rates applied to every Stretcher transport trip',
        columnType: 'rate',
        data: [],
      },
      {
        label: 'Fares by Route',
        title: 'Stretcher Fares by Route',
        desc: 'Route-specific fare configurations for Stretcher transport',
        columnType: 'route',
        data: [],
      },
      {
        label: 'Platform Commission',
        title: 'Platform Commission on Stretcher Trips',
        desc: 'Platform commission details for Stretcher transport',
        columnType: 'commission',
        data: [],
      },
    ],
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

export const FareConfigurationPage = () => {
  const [vehicleType, setVehicleType] = useState('Standard Vehicle');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const currentStyle =
    vehicleTypeStyles[vehicleType] || vehicleTypeStyles['Standard Vehicle'];
  const config =
    vehicleConfigs[vehicleType] || vehicleConfigs['Standard Vehicle'];
  const safeTab = Math.min(activeTab, config.tabs.length - 1);
  const currentTab = config.tabs[safeTab];

  const emptyState = (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing="8px"
      sx={{ padding: '60px 24px' }}
    >
      <InfoOutlinedIcon sx={{ fontSize: 32, color: '#D1D5DB' }} />
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(14),
          color: '#9CA3AF',
        }}
      >
        No fare data configured
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(13),
          color: '#D1D5DB',
        }}
      >
        Fare configuration for this section will be available soon
      </Typography>
    </Stack>
  );

  // ─── Column Definitions ────────────────────────────────────────────────────

  const isStandard = vehicleType === 'Standard Vehicle';

  const rateColumns: GridColSpec<TableRow>[] = [
    {
      field: 'setting',
      headerName: isStandard ? 'Setting' : 'Rate Item',
      flex: 1.2,
      minWidth: 200,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: '#111827',
          }}
        >
          {params.row.setting}
        </Typography>
      ),
    },
    {
      field: 'value',
      headerName: 'Value',
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: currentStyle.color,
          }}
        >
          {params.row.value}
        </Typography>
      ),
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => (
        <Chip
          label={params.row.unit}
          size="small"
          sx={{
            background: currentStyle.bg,
            color: currentStyle.color,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: pxToRem(11),
            height: '22px',
            borderRadius: '100px',
          }}
        />
      ),
    },
    {
      field: 'description',
      headerName: isStandard ? 'Description' : 'Notes',
      flex: 1.8,
      minWidth: 260,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          {params.row.description}
        </Typography>
      ),
    },
    {
      field: 'actions' as string,
      headerName: '',
      flex: 0.3,
      minWidth: 50,
      sortable: false,
      renderCell: () => (
        <IconButton
          size="small"
          sx={{
            width: 30,
            height: 30,
            color: '#9CA3AF',
            '&:hover': { color: '#374151', background: '#F3F4F6' },
          }}
        >
          <EditOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      ),
    },
  ];

  const routeColumns: GridColSpec<TableRow>[] = [
    {
      field: 'route',
      headerName: 'Route',
      flex: 1.3,
      minWidth: 200,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: '#111827',
          }}
        >
          {params.row.route}
        </Typography>
      ),
    },
    {
      field: 'baseAccess',
      headerName: 'Base + Access',
      flex: 0.7,
      minWidth: 110,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: currentStyle.color,
          }}
        >
          {params.row.baseAccess}
        </Typography>
      ),
    },
    {
      field: 'minProtected',
      headerName: 'Min Protected',
      flex: 0.9,
      minWidth: 140,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.minProtected}
        </Typography>
      ),
    },
    {
      field: 'wait',
      headerName: 'Wait',
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.wait}
        </Typography>
      ),
    },
    {
      field: 'otherFees',
      headerName: 'Other Fees',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#9CA3AF',
          }}
        >
          {params.row.otherFees}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13.5),
            color: '#111827',
          }}
        >
          {params.row.total}
        </Typography>
      ),
    },
  ];

  const commissionColumns: GridColSpec<TableRow>[] = [
    {
      field: 'route',
      headerName: 'Route',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: '#111827',
          }}
        >
          {params.row.route}
        </Typography>
      ),
    },
    {
      field: 'totalFare',
      headerName: 'Total Fare',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: '#111827',
          }}
        >
          {params.row.totalFare}
        </Typography>
      ),
    },
    {
      field: 'medigo18',
      headerName: 'Medigo 18%',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: '#EF4444',
          }}
        >
          {params.row.medigo18}
        </Typography>
      ),
    },
    {
      field: 'vendor82',
      headerName: 'Vendor 82%',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: currentStyle.color,
          }}
        >
          {params.row.vendor82}
        </Typography>
      ),
    },
    {
      field: 'vendorNetEst',
      headerName: 'Vendor Net Est.',
      flex: 0.7,
      minWidth: 110,
      renderCell: (params) => (
        <Chip
          label={params.row.vendorNetEst}
          size="small"
          sx={{
            background: '#ECFDF5',
            color: '#059669',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: pxToRem(11.5),
            height: '24px',
            borderRadius: '100px',
          }}
        />
      ),
    },
  ];

  const columnMap: Record<string, GridColSpec<TableRow>[]> = {
    rate: rateColumns,
    route: routeColumns,
    commission: commissionColumns,
  };

  const columns = columnMap[currentTab.columnType] || rateColumns;

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header: Title + Vehicle Type Dropdown */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Fare Configuration"
            desc="Configure base fares, distance rules, route pricing, surcharges, and discounts"
          />
          <Box>
            <Box
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                setAnchorEl(e.currentTarget)
              }
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: '#FFFFFF',
                border: '0.67px solid #E8ECF0',
                borderRadius: '14px',
                cursor: 'pointer',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.06)',
                transition: 'border-color 0.2s ease',
                '&:hover': { borderColor: '#9CA3AF' },
              }}
            >
              <Box
                sx={{
                  background: currentStyle.bg,
                  borderRadius: '100px',
                  padding: '2px 10px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(11),
                    lineHeight: '1.5em',
                    color: currentStyle.color,
                  }}
                >
                  {vehicleType}
                </Typography>
              </Box>
              <KeyboardArrowDownIcon
                sx={{ fontSize: 14, color: currentStyle.color }}
              />
            </Box>
            <AppDropdownMenu
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              options={vehicleTypes}
              selectedOption={vehicleType}
              onOptionSelected={(option) => {
                setVehicleType(option);
                setActiveTab(0);
                setAnchorEl(null);
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            />
          </Box>
        </RowStack>

        {/* Table Card with Tabs + Data */}
        <Box
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Filter Tabs */}
          <Box
            sx={{
              borderBottom: '0.67px solid #F0F4F8',
            }}
          >
            <Tabs
              value={safeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 'unset',
                padding: '0 8px',
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTabs-flexContainer': { gap: '4px', padding: '8px 0' },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontSize: pxToRem(13),
                  fontWeight: 500,
                  color: '#6B7280',
                  minHeight: '36px',
                  padding: '6px 16px',
                  borderRadius: '16px',
                  background: 'transparent',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    fontWeight: 600,
                    color: '#FFFFFF',
                    background: currentStyle.color,
                  },
                },
              }}
            >
              {config.tabs.map((tab) => (
                <Tab key={tab.label} label={tab.label} />
              ))}
            </Tabs>
          </Box>

          {/* Table Content */}
          <Box>
            <AppGridtable
              columns={columns}
              data={currentTab.data}
              initialPageSize={10}
              hidePagination
              disableRowClick
              emptyState={emptyState}
              sx={{
                height: 'auto',
                width: '100%',
                border: 'none',
                boxShadow: 'none',
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
              }}
            >
              <Stack spacing={'3px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(16),
                    color: '#111827',
                  }}
                >
                  {currentTab.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(13),
                    color: '#6B7280',
                  }}
                >
                  {currentTab.desc}
                </Typography>
              </Stack>
            </AppGridtable>
          </Box>

          {/* Footnote */}
          {currentTab.footnote && currentTab.data.length > 0 && (
            <Box
              sx={{
                padding: '16px 24px',
                borderTop: '0.67px solid #F0F4F8',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  lineHeight: '1.6em',
                  color: '#9CA3AF',
                  fontStyle: 'italic',
                }}
              >
                {currentTab.footnote}
              </Typography>
            </Box>
          )}

          {/* Vendor Terms (Platform Commission) */}
          {currentTab.vendorTerms && currentTab.data.length > 0 && (
            <Box
              sx={{
                padding: '20px 24px',
                borderTop: '0.67px solid #F0F4F8',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(14),
                  color: currentStyle.color,
                  mb: '12px',
                }}
              >
                WAV Vendor Terms
              </Typography>
              <Stack spacing="8px">
                {currentTab.vendorTerms.map((term, i) => (
                  <RowStack key={i} spacing="10px" alignItems="flex-start">
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: currentStyle.color,
                        mt: '7px',
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(13),
                        lineHeight: '1.6em',
                        color: '#374151',
                      }}
                    >
                      {term}
                    </Typography>
                  </RowStack>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Stack>
    </AppDashboardLayout>
  );
};
