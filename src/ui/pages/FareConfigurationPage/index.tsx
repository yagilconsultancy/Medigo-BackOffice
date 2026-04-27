'use client';

import { useMemo, useState } from 'react';
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
import { StandardServiceTypeEditModal } from './StandardServiceTypeEditModal';
import { StretcherServiceTypeEditModal } from './StretcherServiceTypeEditModal';
import { WheelchairWavServiceTypeEditModal } from './WheelchairWavServiceTypeEditModal';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  pxToRem,
  toSnakeCase,
  useGetServiceTypeConfig,
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
    | 'comparison'
    | 'genericTable';
  rateLabels?: { setting?: string; description?: string };
  data: TableRow[];
  sections?: SurchargeSection[];
  surchargesInfo?: { title: string; items: string[] };
};

const vehicleTypeStyles: Record<string, { color: string; bg: string }> = {
  'Standard Vehicle': { color: '#2F6FED', bg: '#EBF2FF' },
  'Wheelchair (WAV)': { color: '#6366F1', bg: '#EEF2FF' },
  'Stretcher Transport': { color: '#DC2626', bg: '#FEF2F2' },
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
  const [selectedServiceType, setSelectedServiceType] = useState('standard');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isStandardEditOpen, setIsStandardEditOpen] = useState(false);
  const [isWheelchairEditOpen, setIsWheelchairEditOpen] = useState(false);
  const [isStretcherEditOpen, setIsStretcherEditOpen] = useState(false);
  const { data: serviceTypesData } = useResolvedApiQuery(
    useListServiceTypes,
    null
  );

  // Create service types array and mapping
  const { serviceTypes, serviceTypeMap } = useMemo(() => {
    const types =
      serviceTypesData?.service_types?.filter((st) => st.is_active) || [];
    const displayNames = types.map((st) => st.display_name);
    const mapping = types.reduce(
      (acc, st) => {
        acc[st.display_name] = st.service_type;
        return acc;
      },
      {} as Record<string, string>
    );
    return { serviceTypes: displayNames, serviceTypeMap: mapping };
  }, [serviceTypesData]);

  const { data: serviceTypeConfigResponse, isFetching: serviceConfigLoading } =
    useGetServiceTypeConfig({ service_type: selectedServiceType });

  const serviceTypeConfigData = useMemo(() => {
    if (serviceTypeConfigResponse?.success && serviceTypeConfigResponse.data) {
      return serviceTypeConfigResponse.data;
    }
    return null;
  }, [serviceTypeConfigResponse]);

  const openStandardEditModal = () => {
    if (selectedServiceType === 'standard') {
      setIsStandardEditOpen(true);
    }
  };

  const openWheelchairEditModal = () => {
    if (selectedServiceType === 'wheelchair_wav') {
      setIsWheelchairEditOpen(true);
    }
  };

  const openStretcherEditModal = () => {
    if (selectedServiceType === 'stretcher') {
      setIsStretcherEditOpen(true);
    }
  };

  // Helper function to convert snake_case to Title Case
  const toTitleCase = (str: string) => {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to determine unit based on key name
  const getUnit = (key: string, value: any): string => {
    if (typeof value !== 'number') return '';
    if (
      key.includes('fare') ||
      key.includes('fee') ||
      key.includes('surcharge') ||
      key.includes('cap')
    )
      return '$';
    if (key.includes('km') || key.includes('distance')) return 'km';
    if (
      key.includes('minute') ||
      (key.includes('time') && !key.includes('rate'))
    )
      return 'mins';
    if (key.includes('per_min') || key.includes('rate')) return '$/min';
    if (key.includes('per_km')) return '$/km';
    return '';
  };

  // Transform API config data into tab structure dynamically
  const dynamicConfig = useMemo(() => {
    if (!serviceTypeConfigData?.config) return null;

    const config = serviceTypeConfigData.config;
    const tabs: FareTab[] = [];

    // Helper to format any object as rate-style rows
    const objectToRateRows = (obj: Record<string, any>) => {
      return Object.entries(obj).map(([key, value], index) => ({
        id: String(index + 1),
        setting: toTitleCase(key),
        value: typeof value === 'number' ? String(value) : String(value || ''),
        unit: getUnit(key, value),
        description: '',
      }));
    };

    // Helper to format nested route objects dynamically
    const routesToRows = (routes: Record<string, any>) => {
      return Object.values(routes).map((route: any, index) => {
        const row: any = { id: String(index + 1) };
        // Dynamically build columns from the actual keys in each route
        Object.entries(route).forEach(([key, value]) => {
          if (typeof value === 'number') {
            row[key] =
              key.includes('km') || key.includes('distance')
                ? `${value} km`
                : `$${value.toFixed(2)}`;
          } else {
            row[key] = value;
          }
        });
        return row;
      });
    };

    // Loop through all config keys dynamically
    Object.entries(config).forEach(([configKey, configValue]) => {
      if (!configValue || typeof configValue !== 'object') return;

      // Check if this is an object containing only arrays (like surcharges)
      const hasOnlyArrays =
        typeof configValue === 'object' &&
        !Array.isArray(configValue) &&
        Object.values(configValue).every((v) => Array.isArray(v));

      // Check if this is an object containing nested objects (like route_pricing, toll_charges)
      const hasNestedObjects =
        typeof configValue === 'object' &&
        !Array.isArray(configValue) &&
        Object.values(configValue).some(
          (v) => v && typeof v === 'object' && !Array.isArray(v)
        );

      // Handle array-based sections (like surcharges with multiple sub-arrays)
      if (hasOnlyArrays) {
        const sections: SurchargeSection[] = [];
        const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        Object.entries(configValue).forEach(([key, items], index) => {
          if (!Array.isArray(items) || items.length === 0) return;

          const firstItem = items[0];
          const columns = Object.keys(firstItem)
            .filter((k) => k !== 'id')
            .map((k) => toTitleCase(k));

          const rows = items.map((item: any) =>
            Object.entries(item)
              .filter(([k]) => k !== 'id')
              .map(([k, v]) => {
                if (typeof v === 'number') {
                  return k.includes('surcharge') || k.includes('fee')
                    ? `$${v.toFixed(2)}`
                    : String(v);
                }
                return String(v || '');
              })
          );

          sections.push({
            id: key,
            label: labels[index] || String.fromCharCode(65 + index),
            title: toTitleCase(key),
            subtitle: `${toTitleCase(key)} details`,
            columns,
            rows,
          });
        });

        if (sections.length > 0) {
          tabs.push({
            label: toTitleCase(configKey),
            title: toTitleCase(configKey),
            desc: '',
            columnType: 'rate',
            sections,
            data: [],
          });
        }
        return;
      }

      // Handle nested objects (route_pricing, toll_charges, commission_breakdown)
      if (hasNestedObjects) {
        const routes = routesToRows(configValue);
        tabs.push({
          label: toTitleCase(configKey),
          title: toTitleCase(configKey),
          desc: '',
          columnType: 'genericTable',
          data: routes,
        });
        return;
      }

      // Handle simple object configs (rate_components, vendor_terms, rules_and_caps, etc.)
      if (typeof configValue === 'object' && !Array.isArray(configValue)) {
        const data = objectToRateRows(configValue);
        tabs.push({
          label: toTitleCase(configKey),
          title: toTitleCase(configKey),
          desc: '',
          columnType: 'rate',
          data,
        });
      }
    });

    return { tabs };
  }, [serviceTypeConfigData]);

  // Get dynamic style from selected service type or fallback to default
  const currentStyle = useMemo(() => {
    if (vehicleType && vehicleTypeStyles[vehicleType]) {
      return vehicleTypeStyles[vehicleType];
    }
    return { color: '#2F6FED', bg: '#EBF2FF' }; // Default blue style
  }, [vehicleType]);

  // Use only dynamic config from API
  const config = dynamicConfig;
  const safeTab = config ? Math.min(activeTab, config.tabs.length - 1) : 0;
  const currentTab = config?.tabs[safeTab];
  const showStandardEditAction = selectedServiceType === 'standard';
  const showWheelchairEditAction = selectedServiceType === 'wheelchair_wav';
  const showStretcherEditAction = selectedServiceType === 'stretcher';
  const getEditActionHandler = () => {
    if (showWheelchairEditAction) return openWheelchairEditModal;
    if (showStretcherEditAction) return openStretcherEditModal;
    return openStandardEditModal;
  };
  const wheelchairEditActionColumn: GridColSpec<TableRow> = {
    field: 'actions' as string,
    headerName: '',
    flex: 0.3,
    minWidth: 50,
    sortable: false,
    renderCell: () =>
      showWheelchairEditAction ? (
        <IconButton
          onClick={openWheelchairEditModal}
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
      ) : null,
  };
  const standardEditActionColumn: GridColSpec<TableRow> = {
    field: 'actions' as string,
    headerName: '',
    flex: 0.3,
    minWidth: 50,
    sortable: false,
    renderCell: () =>
      showStandardEditAction ? (
        <IconButton
          onClick={openStandardEditModal}
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
      ) : null,
  };
  const stretcherEditActionColumn: GridColSpec<TableRow> = {
    field: 'actions' as string,
    headerName: '',
    flex: 0.3,
    minWidth: 50,
    sortable: false,
    renderCell: () =>
      showStretcherEditAction ? (
        <IconButton
          onClick={openStretcherEditModal}
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
      ) : null,
  };

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

  const settingLabel = currentTab?.rateLabels?.setting || 'Setting';
  const descLabel = currentTab?.rateLabels?.description || 'Description';

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
      renderCell: () =>
        showStandardEditAction ||
        showWheelchairEditAction ||
        showStretcherEditAction ? (
          <IconButton
            onClick={getEditActionHandler()}
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
        ) : null,
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

  // Generate columns dynamically for genericTable type
  const generateDynamicColumns = (
    data: TableRow[]
  ): GridColSpec<TableRow>[] => {
    if (!data || data.length === 0) return rateColumns;

    const firstRow = data[0];
    const keys = Object.keys(firstRow).filter((k) => k !== 'id');

    return keys.map((key) => ({
      field: key,
      headerName: toTitleCase(key),
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row[key]}
        </Typography>
      ),
    }));
  };

  const columns =
    currentTab?.columnType === 'genericTable'
      ? showWheelchairEditAction
        ? [
            ...generateDynamicColumns(currentTab?.data || []),
            wheelchairEditActionColumn,
          ]
        : showStandardEditAction
          ? [
              ...generateDynamicColumns(currentTab?.data || []),
              standardEditActionColumn,
            ]
          : showStretcherEditAction
            ? [
                ...generateDynamicColumns(currentTab?.data || []),
                stretcherEditActionColumn,
              ]
            : generateDynamicColumns(currentTab?.data || [])
      : currentTab?.columnType === 'rate'
        ? rateColumns
        : showStandardEditAction
          ? [
              ...(columnMap[currentTab?.columnType] || rateColumns),
              standardEditActionColumn,
            ]
          : showWheelchairEditAction
            ? [
                ...(columnMap[currentTab?.columnType] || rateColumns),
                wheelchairEditActionColumn,
              ]
            : showStretcherEditAction
              ? [
                  ...(columnMap[currentTab?.columnType] || rateColumns),
                  stretcherEditActionColumn,
                ]
              : (columnMap[currentTab?.columnType] || rateColumns).filter(
                  (column) => column.field !== 'actions'
                );
  const columnsWithActions = columns;
  const hasSections = !!currentTab?.sections;

  const renderSurchargeSections = () => (
    <Box sx={{ padding: '20px 24px' }}>
      <RowStack justifyContent="space-between" sx={{ mb: '20px' }}>
        <Stack spacing={'3px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(16),
              color: '#111827',
            }}
          >
            {currentTab?.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              color: '#6B7280',
            }}
          >
            {currentTab?.desc}
          </Typography>
        </Stack>
        {(showStandardEditAction ||
          showWheelchairEditAction ||
          showStretcherEditAction) && (
          <IconButton
            onClick={getEditActionHandler()}
            size="small"
            sx={{
              width: 34,
              height: 34,
              color: '#9CA3AF',
              border: '1px solid #E8ECF0',
              '&:hover': { color: '#374151', background: '#F3F4F6' },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </RowStack>

      <Stack spacing="16px">
        {currentTab?.sections?.map((section) => (
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
              options={serviceTypes}
              selectedOption={vehicleType}
              onOptionSelected={(option) => {
                setVehicleType(option);
                setSelectedServiceType(serviceTypeMap[option] || 'standard');
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
            position: 'relative',
          }}
        >
          {/* Loading Overlay */}
          {serviceConfigLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(2px)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Stack alignItems="center" spacing="12px">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    border: '3px solid #F3F4F6',
                    borderTop: `3px solid ${currentStyle.color}`,
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    color: '#6B7280',
                  }}
                >
                  Loading fare configuration...
                </Typography>
              </Stack>
            </Box>
          )}
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
              {config?.tabs?.map((tab) => (
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
                columns={columnsWithActions}
                data={currentTab?.data || []}
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
                    {currentTab?.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(13),
                      color: '#6B7280',
                    }}
                  >
                    {currentTab?.desc}
                  </Typography>
                </Stack>
              </AppGridtable>
            )}
          </Box>

          {/* Warning Note (Toll Charges) */}
          {currentTab?.warningNote && currentTab?.data?.length > 0 && (
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
                  {currentTab?.warningNote}
                </Typography>
              </RowStack>
            </Box>
          )}

          {/* Footnote */}
          {currentTab?.footnote && currentTab?.data?.length > 0 && (
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
                {currentTab?.footnote}
              </Typography>
            </Box>
          )}

          {/* Surcharges Info (Service Comparison) */}
          {currentTab?.surchargesInfo && currentTab?.data?.length > 0 && (
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
                {currentTab?.surchargesInfo.title}
              </Typography>
              <Stack spacing="8px">
                {currentTab?.surchargesInfo.items.map((item, i) => (
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
          {currentTab?.vendorTerms && currentTab?.data?.length > 0 && (
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
                {currentTab?.vendorTermsTitle || 'WAV Vendor Terms'}
              </Typography>
              <Stack spacing="8px">
                {currentTab?.vendorTerms?.map((term, i) => (
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

      <StandardServiceTypeEditModal
        open={isStandardEditOpen}
        setOpen={setIsStandardEditOpen}
        configData={serviceTypeConfigData}
      />
      <WheelchairWavServiceTypeEditModal
        open={isWheelchairEditOpen}
        setOpen={setIsWheelchairEditOpen}
        configData={serviceTypeConfigData}
      />
      <StretcherServiceTypeEditModal
        open={isStretcherEditOpen}
        setOpen={setIsStretcherEditOpen}
        configData={serviceTypeConfigData}
      />
    </AppDashboardLayout>
  );
};
