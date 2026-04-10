'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  AppNotificationSnackbar,
  DashboardTitleAndDesc,
  RowStack,
  AppButton,
} from '../../modules/components';
import { EmptyState } from '../../modules/blocks';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  VehicleDetailDrawer,
  EditVehicleDrawer,
  AddVehicleDrawer,
  ScheduleServiceModal,
} from './ui/components';
import {
  pxToRem,
  useResolvedApiQuery,
  useGetFleetVehicleKpi,
  useGetFleetVehicles,
} from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

export type VehicleStatus = 'Active' | 'Maintenance' | 'Inactive';
export type DocValidity = 'Valid' | 'Expiring' | 'Expired';
export type VehicleCategory =
  | 'Standard Ride'
  | 'Wheelchair Accessible'
  | 'Assisted Ride'
  | 'Stretcher Transport';

export type VehicleRow = {
  id: string;
  vehicleId: string;
  vehicle: string;
  plate: string;
  category: VehicleCategory;
  fleet: string;
  driver: string;
  status: VehicleStatus;
  insurance: DocValidity;
  registration: DocValidity;
  mileage: string;
  vin: string;
  capacity: number;
  lastService: string;
  nextService: string;
  color: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
};

// ─── Status / Doc Validity Configs ──────────────────────────────────────────

const statusColors: Record<VehicleStatus, string> = {
  Active: '#059669',
  Maintenance: '#D97706',
  Inactive: '#EF4444',
};

const docValidityColors: Record<DocValidity, string> = {
  Valid: '#059669',
  Expiring: '#D97706',
  Expired: '#EF4444',
};

const categoryColors: Record<VehicleCategory, { color: string; bg: string }> = {
  'Wheelchair Accessible': { color: '#059669', bg: '#ECFDF5' },
  'Standard Ride': { color: '#2F6FED', bg: '#EBF2FF' },
  'Assisted Ride': { color: '#7C3AED', bg: '#F3EEFF' },
  'Stretcher Transport': { color: '#D97706', bg: '#FFFBEB' },
};

// ─── Category Filter Options ────────────────────────────────────────────────

const categoryFilters: string[] = [
  'All',
  'Standard Ride',
  'Wheelchair Accessible',
  'Assisted Ride',
  'Stretcher Transport',
];

// ─── Component ──────────────────────────────────────────────────────────────

export const AllVehiclesPage = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(
    null
  );
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch data from API
  const { data: kpiData } = useResolvedApiQuery(useGetFleetVehicleKpi, null);

  const { data: vehiclesResponse } = useResolvedApiQuery(
    useGetFleetVehicles,
    null,
    {
      page,
      limit: pageSize,
      category: activeCategoryFilter !== 'All' ? activeCategoryFilter : '',
      search: searchQuery.trim() || '',
    }
  );

  // Map API response to UI format
  const vehiclesData = useMemo(() => {
    return (
      vehiclesResponse?.map((vehicle): VehicleRow => {
        // Helper to determine document validity
        const getDocValidity = (expiryDate?: string | null): DocValidity => {
          if (!expiryDate) return 'Valid';
          const expiry = new Date(expiryDate);
          const now = new Date();
          const daysUntilExpiry = Math.ceil(
            (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysUntilExpiry < 0) return 'Expired';
          if (daysUntilExpiry <= 30) return 'Expiring';
          return 'Valid';
        };

        return {
          id: vehicle.id,
          vehicleId: vehicle.id.substring(0, 8).toUpperCase(),
          vehicle:
            vehicle.vehicle_name ||
            `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          plate: vehicle.plate_number,
          category: vehicle.category as VehicleCategory,
          fleet: vehicle.fleet_name || 'Unknown Fleet',
          driver: vehicle.driver_name || 'Unassigned',
          status: vehicle.status as VehicleStatus,
          insurance: getDocValidity(vehicle.insurance_expiry),
          registration: getDocValidity(vehicle.registration_expiry),
          mileage: vehicle.mileage
            ? `${vehicle.mileage.toLocaleString()} mi`
            : 'N/A',
          vin: vehicle.vin || 'N/A',
          capacity: vehicle.passenger_capacity || 0,
          lastService: vehicle.last_inspection_date || 'N/A',
          nextService: 'N/A', // TODO: Calculate from maintenance schedule
          color: vehicle.color || 'Unknown',
          insuranceExpiry: vehicle.insurance_expiry || undefined,
          registrationExpiry: vehicle.registration_expiry || undefined,
        };
      }) || []
    );
  }, [vehiclesResponse]);

  const filteredVehicles = useMemo(() => {
    // Filtering is handled by API params, return mapped data
    return vehiclesData;
  }, [vehiclesData]);

  const statusCounts = useMemo(() => {
    return {
      total: kpiData?.total_vehicles || 0,
      active: kpiData?.active || 0,
      maintenance: kpiData?.maintenance || 0,
      inactive: kpiData?.inactive || 0,
    };
  }, [kpiData]);

  const statCards = [
    {
      value: String(statusCounts.total),
      label: 'Total Vehicles',
      valueColor: '#2F6FED',
      icon: (
        <DirectionsCarOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
      ),
      iconBg: '#EBF2FF',
    },
    {
      value: String(statusCounts.active),
      label: 'Active',
      valueColor: '#10B981',
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: '#10B981' }} />,
      iconBg: '#ECFDF5',
    },
    {
      value: String(statusCounts.maintenance),
      label: 'Maintenance',
      valueColor: '#D97706',
      icon: (
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />
      ),
      iconBg: '#FFFBEB',
    },
    {
      value: String(statusCounts.inactive),
      label: 'Inactive',
      valueColor: '#6B7280',
      icon: <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />,
      iconBg: '#F3F4F6',
    },
  ];

  const handleRowClick = useCallback((row: VehicleRow) => {
    setSelectedVehicle(row);
    setSelectedVehicleId(row.vehicleId);
    setDetailDrawerOpen(true);
  }, []);

  const handleEditVehicle = useCallback(() => {
    setDetailDrawerOpen(false);
    setEditDrawerOpen(true);
  }, []);

  const handleScheduleService = useCallback(() => {
    setDetailDrawerOpen(false);
    setServiceModalOpen(true);
  }, []);

  const handleAddVehicle = useCallback(() => {
    setAddDrawerOpen(false);
    setSnackbarMessage('New vehicle added successfully');
    setSnackbarOpen(true);
  }, []);

  const handleSaveVehicle = useCallback(() => {
    setEditDrawerOpen(false);
    setSnackbarMessage(
      `${selectedVehicle?.vehicle ?? 'Vehicle'} updated successfully`
    );
    setSnackbarOpen(true);
  }, [selectedVehicle]);

  const handleConfirmService = useCallback(
    (serviceType: string, date: string) => {
      setServiceModalOpen(false);
      setSnackbarMessage(
        `${serviceType} scheduled for ${selectedVehicle?.vehicle ?? 'vehicle'} on ${date}`
      );
      setSnackbarOpen(true);
    },
    [selectedVehicle]
  );

  const columns: GridColSpec<VehicleRow>[] = [
    {
      field: 'vehicle',
      headerName: 'Vehicle',
      flex: 1.4,
      minWidth: 210,
      renderCell: (params) => (
        <RowStack spacing={'10px'}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '10px',
              background: '#EBF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DirectionsCarOutlinedIcon
              sx={{ fontSize: 16, color: '#2F6FED' }}
            />
          </Box>
          <Stack spacing={'2px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#111827',
                lineHeight: '18px',
              }}
            >
              {params.row.vehicle}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(11),
                color: '#9CA3AF',
                lineHeight: '16px',
              }}
            >
              {params.row.vehicleId}
            </Typography>
          </Stack>
        </RowStack>
      ),
    },
    {
      field: 'plate',
      headerName: 'Plate',
      flex: 0.6,
      minWidth: 90,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1.1,
      minWidth: 175,
      renderCell: (params) => {
        const cat = params.value as VehicleCategory;
        const config = categoryColors[cat];
        return (
          <Chip
            variant="filled"
            label={cat}
            sx={{
              background: config.bg,
              color: config.color,
              fontSize: pxToRem(12),
              lineHeight: '18px',
              fontWeight: 600,
              fontFamily: (theme) => theme.typography.fontFamily,
              borderRadius: '16px',
              height: '28px',
            }}
          />
        );
      },
    },
    {
      field: 'driver',
      headerName: 'Driver',
      flex: 0.9,
      minWidth: 130,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: params.row.driver === 'Unassigned' ? '#D97706' : '#111827',
          }}
        >
          {params.row.driver}
        </Typography>
      ),
    },
    {
      field: 'fleet',
      headerName: 'Fleet',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => {
        const status = params.value as VehicleStatus;
        const color = statusColors[status];
        return (
          <Chip
            variant="filled"
            label={status}
            sx={{
              background: alpha(color, 0.1),
              color: color,
              fontSize: pxToRem(12),
              lineHeight: '18px',
              fontWeight: 600,
              fontFamily: (theme) => theme.typography.fontFamily,
              borderRadius: '16px',
              height: '28px',
            }}
          />
        );
      },
    },
    {
      field: 'mileage',
      headerName: 'Mileage',
      flex: 0.6,
      minWidth: 90,
    },
    {
      field: 'insurance',
      headerName: 'Insurance',
      flex: 0.6,
      minWidth: 80,
      renderCell: (params) => {
        const validity = params.value as DocValidity;
        return (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12),
              color: docValidityColors[validity],
            }}
          >
            {validity}
          </Typography>
        );
      },
    },
    {
      field: 'registration',
      headerName: 'Registration',
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => {
        const validity = params.value as DocValidity;
        return (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12),
              color: docValidityColors[validity],
            }}
          >
            {validity}
          </Typography>
        );
      },
    },
    {
      field: 'actions' as string,
      headerName: '',
      flex: 0.7,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <RowStack spacing={'4px'}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(params.row);
            }}
            sx={{ color: '#9CA3AF', '&:hover': { color: '#2F6FED' } }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedVehicle(params.row);
              setEditDrawerOpen(true);
            }}
            sx={{ color: '#9CA3AF', '&:hover': { color: '#D97706' } }}
          >
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSnackbarMessage(`${params.row.vehicle} removed`);
              setSnackbarOpen(true);
            }}
            sx={{ color: '#9CA3AF', '&:hover': { color: '#EF4444' } }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </RowStack>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Vehicle Management"
            desc="Manage vehicles, categories, documents, and assignments"
          />
          <AppButton
            onClick={() => setAddDrawerOpen(true)}
            startIcon={
              <AddOutlinedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
            }
          >
            Add Vehicle
          </AppButton>
          {/* <Box
            onClick={() => setAddDrawerOpen(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '39px',
              padding: '0 18px',
              background: '#2F6FED',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <AddOutlinedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              Add Vehicle
            </Typography>
          </Box> */}
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #E8ECF0',
                  borderRadius: '14px',
                  padding: '16px 20px',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}
                >
                  {card.icon}
                </Box>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(24),
                    lineHeight: '1.3em',
                    color: card.valueColor,
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12.5),
                    lineHeight: '1.5em',
                    color: '#6B7280',
                    marginTop: '2px',
                  }}
                >
                  {card.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Category Filter Tabs */}
        <RowStack spacing={'0px'}>
          {categoryFilters.map((filter) => (
            <Typography
              key={filter}
              onClick={() => setActiveCategoryFilter(filter)}
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: activeCategoryFilter === filter ? '#FFFFFF' : '#6B7280',
                background:
                  activeCategoryFilter === filter ? '#2F6FED' : 'transparent',
                border: `0.67px solid ${activeCategoryFilter === filter ? '#2F6FED' : '#E8ECF0'}`,
                borderRadius: '20px',
                padding: '6px 14px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                '&:hover': {
                  background:
                    activeCategoryFilter === filter ? '#2F6FED' : '#F7F9FB',
                },
              }}
            >
              {filter}
            </Typography>
          ))}
        </RowStack>

        {/* Table or Empty State */}
        {filteredVehicles.length === 0 ? (
          <EmptyState animationSrc="/empty.json" />
        ) : (
          <AppGridtable
            columns={columns}
            data={filteredVehicles}
            initialPageSize={10}
            onRowClick={(row) => handleRowClick(row)}
            sx={{
              height: 'auto',
              width: '100%',
            }}
          >
            <RowStack justifyContent={'space-between'} width={'100%'}>
              <RowStack spacing={'8px'}>
                <DirectionsCarOutlinedIcon
                  sx={{
                    fontSize: 20,
                    color: (theme) => theme.palette.primary.main,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(16),
                    color: '#111827',
                  }}
                >
                  Vehicle Fleet
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(13),
                    color: '#9CA3AF',
                  }}
                >
                  {filteredVehicles.length} vehicles
                </Typography>
              </RowStack>
              <AppSearchField
                name="search"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                boxProps={{
                  sx: { width: '240px' },
                }}
              />
            </RowStack>
          </AppGridtable>
        )}
      </Stack>

      {/* Vehicle Detail Drawer */}
      <VehicleDetailDrawer
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        vehicleId={selectedVehicleId}
        onEditVehicle={handleEditVehicle}
        onScheduleService={handleScheduleService}
      />

      {/* Add Vehicle Drawer */}
      <AddVehicleDrawer
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        onAdd={handleAddVehicle}
      />

      {/* Edit Vehicle Drawer */}
      <EditVehicleDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        vehicleId={selectedVehicleId}
        onSave={handleSaveVehicle}
      />

      {/* Schedule Service Modal */}
      <ScheduleServiceModal
        open={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        vehicle={selectedVehicle}
        onConfirm={handleConfirmService}
      />

      {/* Notification Snackbar */}
      <AppNotificationSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </AppDashboardLayout>
  );
};
