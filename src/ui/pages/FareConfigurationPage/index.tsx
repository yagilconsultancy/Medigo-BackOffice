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
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { AppDropdownMenu } from '../../modules/components/AppDropdownMenu';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  pxToRem,
  useListServiceTypes,
  useResolvedApiQuery,
} from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type TableRow = { id: string; [key: string]: string };

type SurchargeSection = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  columns: string[];
  rows: string[][];
};

type FareTab = {
  label: string;
  title: string;
  desc: string;
  footnote?: string;
  vendorTerms?: string[];
  vendorTermsTitle?: string;
  warningNote?: string;
  columnType:
    | 'rate'
    | 'route'
    | 'commission'
    | 'stdRoute'
    | 'toll'
    | 'discount'
    | 'rules'
    | 'stretcherRoute'
    | 'revenueSplit'
    | 'comparison';
  rateLabels?: { setting?: string; description?: string };
  data: TableRow[];
  sections?: SurchargeSection[];
  surchargesInfo?: { title: string; items: string[] };
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

const standardDistanceRules: TableRow[] = [
  {
    id: '1',
    setting: 'Base Distance Limit',
    value: '10',
    unit: 'km',
    description: 'Distance covered by base fare',
  },
  {
    id: '2',
    setting: 'Additional Distance Rate',
    value: '0.75',
    unit: '$/km',
    description: 'Applied after base distance',
  },
];

const standardRoutePricing: TableRow[] = [
  {
    id: '1',
    route: 'Milton Local',
    distance: 'Under 10 km',
    baseFare: '$12.00',
    avgWaitCharge: '$1.00 (2 min)',
    typicalTotal: '$14.56',
  },
  {
    id: '2',
    route: 'Milton to Georgetown',
    distance: '18 km',
    baseFare: '$18.00',
    avgWaitCharge: '$2.50 (5 min)',
    typicalTotal: '$22.06',
  },
  {
    id: '3',
    route: 'Milton to Oakville',
    distance: '26 km',
    baseFare: '$24.00',
    avgWaitCharge: '$10.00 (20 min)',
    typicalTotal: '$35.56',
  },
  {
    id: '4',
    route: 'Milton to Burlington',
    distance: '32 km',
    baseFare: '$28.50',
    avgWaitCharge: '$10.00 (20 min)',
    typicalTotal: '$40.06',
  },
  {
    id: '5',
    route: 'Milton to Brampton',
    distance: '38 km',
    baseFare: '$33.00',
    avgWaitCharge: '$10.00 (20 min)',
    typicalTotal: '$44.56',
  },
  {
    id: '6',
    route: 'Milton to Mississauga',
    distance: '45 km',
    baseFare: '$38.25',
    avgWaitCharge: '$17.50 (35 min)',
    typicalTotal: '$57.31',
  },
];

const standardSurcharges: SurchargeSection[] = [
  {
    id: 'weather',
    label: 'A',
    title: 'Weather',
    subtitle: 'Surcharges triggered by weather conditions',
    columns: ['Condition', 'Surcharge', 'Trigger'],
    rows: [
      ['Light snow / freezing rain', '$3.00', 'Advisory'],
      ['Heavy snow / storm', '$5.00', 'Storm warning'],
      ['Post-storm', '$3.00', 'Within 24 hrs'],
    ],
  },
  {
    id: 'rushHour',
    label: 'B',
    title: 'Rush Hour',
    subtitle: 'Peak demand periods on weekdays',
    columns: ['Period', 'Days', 'Surcharge'],
    rows: [
      ['7:00 am – 9:00 am', 'Mon–Fri', '$4.00'],
      ['4:00 pm – 6:30 pm', 'Mon–Thu', '$4.00'],
      ['Friday 4:00 pm – 7:00 pm', 'Friday', '$5.00'],
    ],
  },
  {
    id: 'weekendHolidays',
    label: 'C',
    title: 'Weekend & Holidays',
    subtitle: 'Statutory and weekend premiums',
    columns: ['Day', 'Surcharge'],
    rows: [
      ['Saturday', '$3.00'],
      ['Sunday', '$4.00'],
      ['Ontario Public Holidays', '$5.00'],
    ],
  },
  {
    id: 'timeBased',
    label: 'D',
    title: 'Time-Based',
    subtitle: 'Overnight and off-peak hour premiums',
    columns: ['Time Period', 'Surcharge'],
    rows: [
      ['Early Morning (5:00–6:59 am)', '$5.00'],
      ['Late Night (9:00–11:59 pm)', '$4.00'],
      ['Overnight (12:00–4:59 am)', '$8.00'],
    ],
  },
];

const standardTollCharges: TableRow[] = [
  {
    id: '1',
    route: 'Milton to Oakville',
    surcharge: '$8.00',
    estimatedToll: '$4.50–$7.00',
  },
  {
    id: '2',
    route: 'Milton to Brampton',
    surcharge: '$9.00',
    estimatedToll: '$5.00–$8.00',
  },
  {
    id: '3',
    route: 'Milton to Mississauga',
    surcharge: '$10.00',
    estimatedToll: '$6.00–$9.00',
  },
];

const standardDiscounts: TableRow[] = [
  {
    id: '1',
    route: 'Milton to Georgetown',
    standardRate: '$22.06',
    dialysisRate: '$18.00',
    monthlyPackage: '$195.00',
    savings: '21 trips saved',
  },
  {
    id: '2',
    route: 'Milton to Oakville',
    standardRate: '$35.56',
    dialysisRate: '$28.00',
    monthlyPackage: '$300.00',
    savings: '36 trips saved',
  },
  {
    id: '3',
    route: 'Milton to Burlington',
    standardRate: '$40.06',
    dialysisRate: '$32.00',
    monthlyPackage: '$345.00',
    savings: '39 trips saved',
  },
  {
    id: '4',
    route: 'Milton to Mississauga',
    standardRate: '$57.31',
    dialysisRate: '$45.00',
    monthlyPackage: '$490.00',
    savings: '50 trips saved',
  },
];

const standardRulesCaps: TableRow[] = [
  {
    id: '1',
    rule: 'Maximum Surcharge Cap',
    value: '$18.00',
    valueType: 'text',
  },
  {
    id: '2',
    rule: 'Surcharge Stacking',
    value: 'Enabled',
    valueType: 'greenBadge',
  },
  { id: '3', rule: 'Applies Per Trip', value: 'Yes', valueType: 'blueBadge' },
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

// ─── Stretcher Data ────────────────────────────────────────────────────────

const stretcherRateComponents: TableRow[] = [
  {
    id: '1',
    setting: 'Base Fare (under 10 km)',
    value: '85.00',
    unit: '$',
    description: 'Covers 2-person crew for short trips',
  },
  {
    id: '2',
    setting: 'Per km (beyond 10 km)',
    value: '2.25',
    unit: '$/km',
    description: 'Highest rate — specialized vehicle + 2 crew',
  },
  {
    id: '3',
    setting: 'Attendant Fee (every trip)',
    value: '35.00',
    unit: '$',
    description: 'Mandatory — second person required by law',
  },
  {
    id: '4',
    setting: 'Surcharge',
    value: '0.06',
    unit: '$',
    description: 'Same as all services',
  },
  {
    id: '5',
    setting: 'Insurance & Gateway',
    value: '1.50',
    unit: '$',
    description: 'Same as all services',
  },
  {
    id: '6',
    setting: 'Wait Time (first 10 min free)',
    value: '1.00',
    unit: '$/min',
    description: 'Premium — 2 crew sitting idle',
  },
];

const stretcherFaresByRoute: TableRow[] = [
  {
    id: '1',
    route: 'Milton Local (8 km)',
    baseFare: '$85.00',
    attendFee: '$35.00',
    wait: '$10.00',
    otherFees: '$1.56',
    total: '$131.56',
  },
  {
    id: '2',
    route: 'Milton to Georgetown (15 km)',
    baseFare: '$103.00',
    attendFee: '$35.00',
    wait: '$10.00',
    otherFees: '$1.56',
    total: '$149.56',
  },
  {
    id: '3',
    route: 'Milton to Oakville (29 km)',
    baseFare: '$121.00',
    attendFee: '$35.00',
    wait: '$20.00',
    otherFees: '$1.56',
    total: '$177.56',
  },
  {
    id: '4',
    route: 'Milton to Burlington (32 km)',
    baseFare: '$134.50',
    attendFee: '$35.00',
    wait: '$20.00',
    otherFees: '$1.56',
    total: '$192.06',
  },
  {
    id: '5',
    route: 'Milton to Brampton (38 km)',
    baseFare: '$148.00',
    attendFee: '$35.00',
    wait: '$20.00',
    otherFees: '$1.56',
    total: '$205.56',
  },
  {
    id: '6',
    route: 'Milton to Mississauga (45 km)',
    baseFare: '$163.75',
    attendFee: '$35.00',
    wait: '$35.00',
    otherFees: '$1.56',
    total: '$236.31',
  },
];

const stretcherRevenueSplit: TableRow[] = [
  {
    id: '1',
    route: 'Milton Local',
    totalFare: '$131.56',
    opCosts: '$55.00',
    net: '$76.56',
    your50: '$38.28',
    partner50: '$38.28',
  },
  {
    id: '2',
    route: 'Milton to Georgetown',
    totalFare: '$149.56',
    opCosts: '$62.00',
    net: '$87.56',
    your50: '$43.78',
    partner50: '$43.78',
  },
  {
    id: '3',
    route: 'Milton to Oakville',
    totalFare: '$177.56',
    opCosts: '$72.00',
    net: '$105.56',
    your50: '$52.78',
    partner50: '$52.78',
  },
  {
    id: '4',
    route: 'Milton to Burlington',
    totalFare: '$192.06',
    opCosts: '$78.00',
    net: '$114.06',
    your50: '$57.03',
    partner50: '$57.03',
  },
  {
    id: '5',
    route: 'Milton to Brampton',
    totalFare: '$205.56',
    opCosts: '$83.00',
    net: '$122.56',
    your50: '$61.28',
    partner50: '$61.28',
  },
  {
    id: '6',
    route: 'Milton to Mississauga',
    totalFare: '$236.31',
    opCosts: '$95.00',
    net: '$141.31',
    your50: '$70.66',
    partner50: '$70.66',
  },
];

const stretcherPartnershipTerms = [
  'All stretcher trips require a driver plus one trained attendant — no exceptions',
  'Attendant fee of $35.00 is disclosed to client at booking and collected on every trip',
  'All surcharges (snow, rush hour, 407, weekend, early/late) apply and are split 50/50',
  'Maximum surcharge cap of $18.00 per trip applies to stretcher trips',
  'Operating costs (fuel, insurance, maintenance) are deducted before the 50/50 split',
  'Both partners must agree in writing on what qualifies as an operating cost',
  '24-hour cancellation notice required from client to avoid trip charge',
  'Partnership agreement should be reviewed and signed before April 2026 launch',
];

const stretcherServiceComparison: TableRow[] = [
  {
    id: '1',
    route: 'Milton Local',
    ambulatory: '$14.56',
    wav: '$54.56',
    stretcher: '$131.56',
  },
  {
    id: '2',
    route: 'Milton to Georgetown',
    ambulatory: '$22.06',
    wav: '$55.36',
    stretcher: '$149.56',
  },
  {
    id: '3',
    route: 'Milton to Oakville',
    ambulatory: '$35.56',
    wav: '$72.16',
    stretcher: '$177.56',
  },
  {
    id: '4',
    route: 'Milton to Burlington',
    ambulatory: '$40.06',
    wav: '$78.76',
    stretcher: '$192.06',
  },
  {
    id: '5',
    route: 'Milton to Brampton',
    ambulatory: '$44.56',
    wav: '$85.36',
    stretcher: '$205.56',
  },
  {
    id: '6',
    route: 'Milton to Mississauga',
    ambulatory: '$57.31',
    wav: '$105.06',
    stretcher: '$236.31',
  },
];

const stretcherSurchargesInfo = {
  title: 'Surcharges — Apply to All Three Services Equally',
  items: [
    'Snow / winter weather: +$3.00 to +$5.00 depending on severity',
    'Rush hour (Mon–Fri morning and evening): +$4.00 | Friday evening: +$5.00',
    'Highway 407 toll surcharge: +$8.00 to +$10.00 depending on route',
    'Weekend: Saturday +$3.00 | Sunday +$4.00 | Public holidays +$5.00',
    'Early morning (5:00–6:59 am): +$5.00 | Late night (9:00–11:59 pm): +$4.00 | Overnight: +$8.00',
    'Maximum surcharge cap of $18.00 per trip applies to ALL service types',
  ],
};

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
        desc: 'Distance thresholds and per-km rates',
        columnType: 'rate',
        rateLabels: { setting: 'Rule' },
        data: standardDistanceRules,
      },
      {
        label: 'Route Pricing',
        title: 'Route Pricing',
        desc: 'Estimated fares for common Milton-area routes',
        columnType: 'stdRoute',
        data: standardRoutePricing,
      },
      {
        label: 'Surcharges',
        title: 'Surcharges',
        desc: 'Additional fees applied based on weather, time, and demand',
        columnType: 'rate',
        sections: standardSurcharges,
        data: [],
      },
      {
        label: 'Toll Charges',
        title: 'Toll Charges',
        desc: 'Surcharges applied to routes using tolled highways (Hwy 407)',
        columnType: 'toll',
        warningNote:
          'Note: Driver must confirm 407 usage before trip begins. Surcharge is automatically added when confirmed.',
        data: standardTollCharges,
      },
      {
        label: 'Discounts (Dialysis)',
        title: 'Discounts — Dialysis',
        desc: 'Reduced rates and monthly packages for dialysis patients',
        columnType: 'discount',
        data: standardDiscounts,
      },
      {
        label: 'Rules & Caps',
        title: 'Rules & Caps',
        desc: 'Global surcharge limits and stacking rules',
        columnType: 'rules',
        data: standardRulesCaps,
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
        desc: 'Stretcher transport requires a driver and a trained attendant on every trip. The attendant fee is mandatory on all stretcher bookings.',
        footnote:
          '* The $85.00 base fare reflects the cost of deploying a 2-person crew. The attendant fee of $35.00 is a separate mandatory flat charge disclosed upfront on every booking confirmation.',
        columnType: 'rate',
        data: stretcherRateComponents,
      },
      {
        label: 'Fares by Route',
        title: 'Stretcher Fares by Route',
        desc: 'Fares include the attendant fee and standard billable wait time after the free 10-minute window. Final fare varies with actual wait duration and applicable surcharges.',
        footnote:
          '* Other Fees column includes surcharge ($0.06) and insurance & gateway ($1.50) applied on every trip.',
        columnType: 'stretcherRoute',
        data: stretcherFaresByRoute,
      },
      {
        label: 'Revenue Split',
        title: '50/50 Partnership Revenue Split',
        desc: 'Net is calculated after estimated operating costs including fuel, driver pay, attendant pay, insurance allocation and vehicle wear. Both partners receive equal share of net on every completed trip.',
        vendorTerms: stretcherPartnershipTerms,
        vendorTermsTitle: 'Stretcher Partnership Terms',
        columnType: 'revenueSplit',
        data: stretcherRevenueSplit,
      },
      {
        label: 'Service Comparison',
        title: 'All Three Services — Side by Side',
        desc: 'Each tier reflects the equipment, staffing, and operational requirements of that service type across all Halton Region routes',
        columnType: 'comparison',
        data: stretcherServiceComparison,
        surchargesInfo: stretcherSurchargesInfo,
      },
    ],
  },
};

const renderSurchargeCell = (
  colName: string,
  value: string,
  accentColor: string
) => {
  if (colName === 'Surcharge') {
    return (
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: pxToRem(13),
          color: '#10B981',
        }}
      >
        {value}
      </Typography>
    );
  }
  if (colName === 'Trigger') {
    return (
      <Chip
        label={value}
        size="small"
        sx={{
          background: '#F0FDF4',
          color: '#16A34A',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: pxToRem(11.5),
          height: '24px',
          borderRadius: '100px',
        }}
      />
    );
  }
  if (colName === 'Days') {
    return (
      <Chip
        label={value}
        size="small"
        sx={{
          background: '#EBF2FF',
          color: accentColor,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: pxToRem(11.5),
          height: '24px',
          borderRadius: '100px',
        }}
      />
    );
  }
  return (
    <Typography
      sx={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        fontSize: pxToRem(13),
        color: '#111827',
      }}
    >
      {value}
    </Typography>
  );
};

export const FareConfigurationPage = () => {
  const [vehicleType, setVehicleType] = useState('Standard Vehicle');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const { data: serviceTypes } = useResolvedApiQuery(useListServiceTypes, null);

  const currentStyle =
    vehicleTypeStyles[vehicleType] || vehicleTypeStyles['Standard Vehicle'];
  const config =
    vehicleConfigs[vehicleType] || vehicleConfigs['Standard Vehicle'];
  const safeTab = Math.min(activeTab, config.tabs.length - 1);
  const currentTab = config.tabs[safeTab];
  const isStandard = vehicleType === 'Standard Vehicle';

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

  console.log('serviceTypes', serviceTypes);

  const settingLabel =
    currentTab.rateLabels?.setting || (isStandard ? 'Setting' : 'Rate Item');
  const descLabel =
    currentTab.rateLabels?.description ||
    (isStandard ? 'Description' : 'Notes');

  const rateColumns: GridColSpec<TableRow>[] = [
    {
      field: 'setting',
      headerName: settingLabel,
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
      headerName: descLabel,
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

  const stdRouteColumns: GridColSpec<TableRow>[] = [
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
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row.route}
        </Typography>
      ),
    },
    {
      field: 'distance',
      headerName: 'Distance',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.distance}
          size="small"
          sx={{
            background: '#F1F5F9',
            color: '#475569',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: pxToRem(11.5),
            height: '24px',
            borderRadius: '100px',
          }}
        />
      ),
    },
    {
      field: 'baseFare',
      headerName: 'Base Fare',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#2F6FED',
          }}
        >
          {params.row.baseFare}
        </Typography>
      ),
    },
    {
      field: 'avgWaitCharge',
      headerName: 'Avg Wait Charge',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.avgWaitCharge}
        </Typography>
      ),
    },
    {
      field: 'typicalTotal',
      headerName: 'Typical Total',
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row.typicalTotal}
        </Typography>
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

  const tollColumns: GridColSpec<TableRow>[] = [
    {
      field: 'route',
      headerName: 'Route',
      flex: 1.2,
      minWidth: 200,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row.route}
        </Typography>
      ),
    },
    {
      field: 'surcharge',
      headerName: 'Surcharge',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#2F6FED',
          }}
        >
          {params.row.surcharge}
        </Typography>
      ),
    },
    {
      field: 'estimatedToll',
      headerName: 'Estimated Toll',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.estimatedToll}
        </Typography>
      ),
    },
  ];

  const discountColumns: GridColSpec<TableRow>[] = [
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
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row.route}
        </Typography>
      ),
    },
    {
      field: 'standardRate',
      headerName: 'Standard Rate',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(12),
            color: '#9CA3AF',
            textDecoration: 'line-through',
          }}
        >
          {params.row.standardRate}
        </Typography>
      ),
    },
    {
      field: 'dialysisRate',
      headerName: 'Dialysis Rate',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#2F6FED',
          }}
        >
          {params.row.dialysisRate}
        </Typography>
      ),
    },
    {
      field: 'monthlyPackage',
      headerName: 'Monthly Package',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row.monthlyPackage}
        </Typography>
      ),
    },
    {
      field: 'savings',
      headerName: 'Savings',
      flex: 0.7,
      minWidth: 110,
      renderCell: (params) => (
        <Chip
          label={params.row.savings}
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

  const rulesColumns: GridColSpec<TableRow>[] = [
    {
      field: 'rule',
      headerName: 'Rule',
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row.rule}
        </Typography>
      ),
    },
    {
      field: 'value',
      headerName: 'Value',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const vt = params.row.valueType;
        if (vt === 'greenBadge') {
          return (
            <Chip
              label={params.row.value}
              size="small"
              sx={{
                background: '#ECFDF5',
                color: '#059669',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: pxToRem(12),
                height: '26px',
                borderRadius: '100px',
              }}
            />
          );
        }
        if (vt === 'blueBadge') {
          return (
            <Chip
              label={params.row.value}
              size="small"
              sx={{
                background: '#EBF2FF',
                color: '#2F6FED',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: pxToRem(12),
                height: '26px',
                borderRadius: '100px',
              }}
            />
          );
        }
        return (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(13),
              color: '#111827',
            }}
          >
            {params.row.value}
          </Typography>
        );
      },
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

  const stretcherRouteColumns: GridColSpec<TableRow>[] = [
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
      field: 'baseFare',
      headerName: 'Base Fare',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: currentStyle.color,
          }}
        >
          {params.row.baseFare}
        </Typography>
      ),
    },
    {
      field: 'attendFee',
      headerName: 'Attend. Fee',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.attendFee}
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

  const revenueSplitColumns: GridColSpec<TableRow>[] = [
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
      field: 'opCosts',
      headerName: 'Op. Costs Est.',
      flex: 0.7,
      minWidth: 110,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: '#EF4444',
          }}
        >
          {params.row.opCosts}
        </Typography>
      ),
    },
    {
      field: 'net',
      headerName: 'Net',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: '#374151',
          }}
        >
          {params.row.net}
        </Typography>
      ),
    },
    {
      field: 'your50',
      headerName: 'Your 50%',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <Chip
          label={params.row.your50}
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
    {
      field: 'partner50',
      headerName: 'Partner 50%',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <Chip
          label={params.row.partner50}
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

  const comparisonColumns: GridColSpec<TableRow>[] = [
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
      field: 'ambulatory',
      headerName: 'Ambulatory',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: '#374151',
          }}
        >
          {params.row.ambulatory}
        </Typography>
      ),
    },
    {
      field: 'wav',
      headerName: 'Wheelchair (WAV)',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13.5),
            color: '#6366F1',
          }}
        >
          {params.row.wav}
        </Typography>
      ),
    },
    {
      field: 'stretcher',
      headerName: 'Stretcher',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13.5),
            color: '#DC2626',
          }}
        >
          {params.row.stretcher}
        </Typography>
      ),
    },
  ];

  const columnMap: Record<string, GridColSpec<TableRow>[]> = {
    rate: rateColumns,
    stdRoute: stdRouteColumns,
    route: routeColumns,
    toll: tollColumns,
    discount: discountColumns,
    rules: rulesColumns,
    commission: commissionColumns,
    stretcherRoute: stretcherRouteColumns,
    revenueSplit: revenueSplitColumns,
    comparison: comparisonColumns,
  };

  const columns = columnMap[currentTab.columnType] || rateColumns;
  const hasSections = !!currentTab.sections;

  // ─── Surcharges Sections Render ────────────────────────────────────────────

  const renderSurchargeSections = () => (
    <Box sx={{ padding: '20px 24px' }}>
      <Stack spacing={'3px'} sx={{ mb: '20px' }}>
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

      <Stack spacing="16px">
        {currentTab.sections!.map((section) => (
          <Box key={section.id}>
            {/* Section Header */}
            <Box
              sx={{
                background: '#F7F9FB',
                padding: '10px 16px',
                borderRadius: '8px 8px 0 0',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: pxToRem(12),
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {section.label} &middot; {section.title} &middot;{' '}
                {section.subtitle}
              </Typography>
            </Box>

            {/* Table Header */}
            <RowStack
              sx={{
                padding: '10px 16px',
                background: '#F7F9FB',
                borderBottom: '1px solid #F0F4F8',
              }}
            >
              {section.columns.map((col) => (
                <Box key={col} sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: pxToRem(12),
                      color: '#6B7280',
                    }}
                  >
                    {col}
                  </Typography>
                </Box>
              ))}
            </RowStack>

            {/* Data Rows */}
            {section.rows.map((row, ri) => (
              <RowStack
                key={ri}
                sx={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #F7F9FB',
                }}
              >
                {row.map((cellValue, ci) => (
                  <Box key={ci} sx={{ flex: 1 }}>
                    {renderSurchargeCell(
                      section.columns[ci],
                      cellValue,
                      currentStyle.color
                    )}
                  </Box>
                ))}
              </RowStack>
            ))}
          </Box>
        ))}
      </Stack>
    </Box>
  );

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
          <Box sx={{ borderBottom: '0.67px solid #F0F4F8' }}>
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
                  background: '#F3F4F6',
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
            {hasSections ? (
              renderSurchargeSections()
            ) : (
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
                  '& .MuiDataGrid-root': { border: 'none' },
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
            )}
          </Box>

          {/* Warning Note (Toll Charges) */}
          {currentTab.warningNote && currentTab.data.length > 0 && (
            <Box
              sx={{
                margin: '0 24px 20px',
                padding: '12px 16px',
                background: '#FFFBEB',
                border: '0.67px solid #FDE68A',
                borderRadius: '14px',
              }}
            >
              <RowStack spacing="10px" alignItems="flex-start">
                <WarningAmberRoundedIcon
                  sx={{ fontSize: 16, color: '#92400E', mt: '1px' }}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(12.5),
                    color: '#92400E',
                  }}
                >
                  {currentTab.warningNote}
                </Typography>
              </RowStack>
            </Box>
          )}

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

          {/* Surcharges Info (Service Comparison) */}
          {currentTab.surchargesInfo && currentTab.data.length > 0 && (
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
                  color: '#374151',
                  mb: '12px',
                }}
              >
                {currentTab.surchargesInfo.title}
              </Typography>
              <Stack spacing="8px">
                {currentTab.surchargesInfo.items.map((item, i) => (
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
                      {item}
                    </Typography>
                  </RowStack>
                ))}
              </Stack>
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
                {currentTab.vendorTermsTitle || 'WAV Vendor Terms'}
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
