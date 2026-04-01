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

type FareRow = {
  id: string;
  setting: string;
  value: string;
  unit: string;
  description: string;
};

// ─── Vehicle Type Config ────────────────────────────────────────────────────

const vehicleTypes = ['Standard Vehicle', 'Wheelchair (WAV)', 'Stretcher'];

const vehicleTypeStyles: Record<string, { color: string; bg: string }> = {
  'Standard Vehicle': { color: '#2F6FED', bg: '#EBF2FF' },
  'Wheelchair (WAV)': { color: '#6366F1', bg: '#EEF2FF' },
  Stretcher: { color: '#DC2626', bg: '#FEF2F2' },
};

// ─── Tab Config ─────────────────────────────────────────────────────────────

const tabLabels = [
  'Base Pricing',
  'Distance Rules',
  'Route Pricing',
  'Surcharges',
  'Toll Charges',
  'Discounts (Dialysis)',
  'Rules & Caps',
];

// ─── Mock Data per Vehicle Type ─────────────────────────────────────────────

const basePricingData: Record<string, FareRow[]> = {
  'Standard Vehicle': [
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
  ],
  'Wheelchair (WAV)': [
    {
      id: '1',
      setting: 'Base Fare (≤10 km)',
      value: '45.00',
      unit: '$',
      description: 'Flat fee for WAV trips up to 10 km',
    },
    {
      id: '2',
      setting: 'Base Fare (>10 km)',
      value: '45.00',
      unit: '$',
      description: 'Base fee before per km charges apply',
    },
    {
      id: '3',
      setting: 'Additional Distance Rate',
      value: '1.20',
      unit: '$/km',
      description: 'Charged per km after first 10 km',
    },
    {
      id: '4',
      setting: 'Accessibility Fee',
      value: '15.00',
      unit: '$',
      description: 'Equipment and ramp operation fee',
    },
    {
      id: '5',
      setting: 'Insurance & Payment Fee',
      value: '2.00',
      unit: '$',
      description: 'Covers insurance and payment processing',
    },
    {
      id: '6',
      setting: 'Free Wait Time',
      value: '15',
      unit: 'mins',
      description: 'Extended wait time for loading assistance',
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
      setting: 'Minimum Fare',
      value: '45.00',
      unit: '$',
      description: 'Minimum fare protection for WAV trips',
    },
  ],
  Stretcher: [
    {
      id: '1',
      setting: 'Base Fare (≤10 km)',
      value: '120.00',
      unit: '$',
      description: 'Flat fee for stretcher trips up to 10 km',
    },
    {
      id: '2',
      setting: 'Base Fare (>10 km)',
      value: '120.00',
      unit: '$',
      description: 'Base fee before per km charges apply',
    },
    {
      id: '3',
      setting: 'Additional Distance Rate',
      value: '2.50',
      unit: '$/km',
      description: 'Charged per km after first 10 km',
    },
    {
      id: '4',
      setting: 'Stretcher Surcharge',
      value: '85.00',
      unit: '$',
      description: 'Equipment and crew surcharge',
    },
    {
      id: '5',
      setting: 'Attendant Fee',
      value: '35.00',
      unit: '$',
      description: 'Required two-person crew fee',
    },
    {
      id: '6',
      setting: 'Free Wait Time',
      value: '20',
      unit: 'mins',
      description: 'Extended wait time for patient loading',
    },
    {
      id: '7',
      setting: 'Wait Time Rate (After Free)',
      value: '0.75',
      unit: '$/min',
      description: 'Charged after free wait time expires',
    },
    {
      id: '8',
      setting: 'Minimum Fare',
      value: '120.00',
      unit: '$',
      description: 'Minimum fare protection for stretcher trips',
    },
  ],
};

// ─── Component ──────────────────────────────────────────────────────────────

export const FareConfigurationPage = () => {
  const [vehicleType, setVehicleType] = useState('Standard Vehicle');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const currentStyle = vehicleTypeStyles[vehicleType] || vehicleTypeStyles['Standard Vehicle'];
  const tableData = basePricingData[vehicleType] || basePricingData['Standard Vehicle'];

  // ─── Table Columns ──────────────────────────────────────────────────────

  const columns: GridColSpec<FareRow>[] = [
    {
      field: 'setting',
      headerName: 'Setting',
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
      headerName: 'Description',
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

  // ─── Table Title & Description per Tab ────────────────────────────────────

  const tabContent: Record<number, { title: string; desc: string }> = {
    0: {
      title: 'Base Pricing',
      desc: 'Core fare rates and fees applied to every trip',
    },
    1: {
      title: 'Distance Rules',
      desc: 'Tiered distance pricing and zone-based rate adjustments',
    },
    2: {
      title: 'Route Pricing',
      desc: 'Fixed pricing for predefined routes and corridors',
    },
    3: {
      title: 'Surcharges',
      desc: 'Additional fees for special conditions and peak hours',
    },
    4: {
      title: 'Toll Charges',
      desc: 'Highway toll fees and pass-through charges',
    },
    5: {
      title: 'Discounts (Dialysis)',
      desc: 'Recurring trip discount programs and special rates',
    },
    6: {
      title: 'Rules & Caps',
      desc: 'Maximum fare limits and pricing rule overrides',
    },
  };

  const currentTab = tabContent[activeTab] || tabContent[0];

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
              value={activeTab}
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
              {tabLabels.map((label) => (
                <Tab key={label} label={label} />
              ))}
            </Tabs>
          </Box>

          {/* Table Content */}
          <Box>
            <AppGridtable
              columns={columns}
              data={tableData}
              initialPageSize={10}
              hidePagination
              disableRowClick
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
        </Box>
      </Stack>
    </AppDashboardLayout>
  );
};
