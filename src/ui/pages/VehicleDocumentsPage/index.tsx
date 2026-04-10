'use client';

import { useState, useMemo } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { EmptyState } from '../../modules/blocks';
import { DocumentViewModal } from './ui/components';
import {
  pxToRem,
  useResolvedApiQuery,
  useGetFleetVehicleDocumentOverview,
} from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type DocStatus = 'Valid' | 'Expiring' | 'Expired';

type DocumentInfo = {
  type: string;
  status: DocStatus;
  expiry: string;
  fileName: string;
  docId: string;
  issueDate: string;
  authority: string;
  subtitle: string;
};

type VehicleDocRow = {
  id: string;
  vehicle: string;
  plate: string;
  fleet: string;
  iconColor: string;
  iconBg: string;
  registration: DocumentInfo;
  insurance: DocumentInfo;
  inspection: DocumentInfo;
};

export type VehicleDocumentDetail = DocumentInfo & {
  vehicleName: string;
  vehiclePlate: string;
};

// ─── Status Config ──────────────────────────────────────────────────────────

const statusConfig: Record<
  DocStatus,
  {
    color: string;
    bg: string;
    borderColor: string;
    cellBg: string;
    cellBorder: string;
    icon: React.ReactNode;
  }
> = {
  Valid: {
    color: '#059669',
    bg: '#ECFDF5',
    borderColor: '#BBF7D0',
    cellBg: '#FFFFFF',
    cellBorder: 'rgba(0,0,0,0.05)',
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 12, color: '#059669' }} />,
  },
  Expiring: {
    color: '#D97706',
    bg: '#FFFBEB',
    borderColor: '#FDE68A',
    cellBg: '#FFFBEB',
    cellBorder: '#FDE68A',
    icon: <WarningAmberIcon sx={{ fontSize: 12, color: '#D97706' }} />,
  },
  Expired: {
    color: '#EF4444',
    bg: '#FEF2F2',
    borderColor: '#FECACA',
    cellBg: '#FEF2F2',
    cellBorder: '#FECACA',
    icon: <ErrorOutlineIcon sx={{ fontSize: 12, color: '#EF4444' }} />,
  },
};

// ─── Action Button Config ───────────────────────────────────────────────────

const getActionButtons = (status: DocStatus) => {
  switch (status) {
    case 'Valid':
      return [
        {
          label: 'View',
          bg: '#EEF3FF',
          border: '#C7D7F9',
          color: '#2F6FED',
          icon: (
            <VisibilityOutlinedIcon sx={{ fontSize: 10, color: '#2F6FED' }} />
          ),
          action: 'view' as const,
        },
        {
          label: 'Replace',
          bg: '#F7F9FB',
          border: '#E5E7EB',
          color: '#374151',
          icon: <SyncOutlinedIcon sx={{ fontSize: 10, color: '#374151' }} />,
          action: 'replace' as const,
        },
      ];
    case 'Expiring':
      return [
        {
          label: 'View',
          bg: '#F7F9FB',
          border: '#E5E7EB',
          color: '#374151',
          icon: (
            <VisibilityOutlinedIcon sx={{ fontSize: 10, color: '#374151' }} />
          ),
          action: 'view' as const,
        },
        {
          label: 'Upload New',
          bg: '#FFFBEB',
          border: '#FDE68A',
          color: '#D97706',
          icon: (
            <FileUploadOutlinedIcon sx={{ fontSize: 10, color: '#D97706' }} />
          ),
          action: 'upload' as const,
        },
      ];
    case 'Expired':
      return [
        {
          label: 'Upload Document',
          bg: '#FEF2F2',
          border: '#FECACA',
          color: '#EF4444',
          icon: (
            <FileUploadOutlinedIcon sx={{ fontSize: 10, color: '#EF4444' }} />
          ),
          action: 'upload' as const,
        },
      ];
  }
};

// ─── Component ──────────────────────────────────────────────────────────────

export const VehicleDocumentsPage = () => {
  const [activeFilter, setActiveFilter] = useState<DocStatus | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<VehicleDocumentDetail | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch vehicle documents data from API
  const { data: documentsResponse } = useResolvedApiQuery(
    useGetFleetVehicleDocumentOverview,
    null,
    {
      page,
      limit: pageSize,
    }
  );

  // Map API response to UI format
  const vehiclesData = useMemo<VehicleDocRow[]>(() => {
    if (!documentsResponse?.vehicles) return [];

    return documentsResponse.vehicles.map((vehicle) => {
      // Helper to get document info by type
      const getDocInfo = (docType: string): DocumentInfo => {
        const doc = vehicle.documents.find((d) => d.document_type === docType);

        // Map status from API to UI
        const mapStatus = (apiStatus?: string): DocStatus => {
          if (!apiStatus) return 'Expired';
          if (apiStatus.toLowerCase() === 'valid') return 'Valid';
          if (apiStatus.toLowerCase() === 'expiring_soon') return 'Expiring';
          return 'Expired';
        };

        // Format expiry date
        const formatExpiry = (expiresAt?: string | null): string => {
          if (!expiresAt) return 'N/A';
          const date = new Date(expiresAt);
          return date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          });
        };

        const status = mapStatus(doc?.status);

        return {
          type:
            docType === 'registration'
              ? 'Registration'
              : docType === 'insurance'
                ? 'Insurance'
                : 'Safety Inspection',
          status,
          expiry: formatExpiry(doc?.expires_at),
          fileName: doc?.file_name || 'N/A',
          docId: doc?.doc_id || 'N/A',
          issueDate: 'N/A', // Not provided by API
          authority: 'N/A', // Not provided by API
          subtitle:
            docType === 'registration'
              ? 'VEHICLE REGISTRATION'
              : docType === 'insurance'
                ? 'COMMERCIAL AUTO POLICY'
                : 'SAFETY INSPECTION CERTIFICATE',
        };
      };

      // Generate consistent colors based on vehicle_id hash
      const colors = [
        { color: '#2F6FED', bg: 'rgba(47, 111, 237, 0.09)' },
        { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.09)' },
        { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.09)' },
        { color: '#EC4899', bg: 'rgba(236, 72, 153, 0.09)' },
        { color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.09)' },
      ];
      const colorIndex =
        parseInt(vehicle.vehicle_id.substring(0, 2), 16) % colors.length;
      const vehicleColor = colors[colorIndex];

      return {
        id: vehicle.vehicle_id,
        vehicle: vehicle.vehicle_name || `${vehicle.make} ${vehicle.model}`,
        plate: vehicle.plate_number,
        fleet: vehicle.fleet_name || 'Unknown Fleet',
        iconColor: vehicleColor.color,
        iconBg: vehicleColor.bg,
        registration: getDocInfo('registration'),
        insurance: getDocInfo('insurance'),
        inspection: getDocInfo('inspection'),
      };
    });
  }, [documentsResponse]);

  const filterCounts = useMemo(() => {
    if (!documentsResponse?.kpis) {
      return { valid: 0, expiring: 0, expired: 0 };
    }

    return {
      valid: documentsResponse.kpis.valid_count || 0,
      expiring: documentsResponse.kpis.expiring_soon_count || 0,
      expired: documentsResponse.kpis.expired_count || 0,
    };
  }, [documentsResponse]);

  const statCards = useMemo(() => {
    const kpis = documentsResponse?.kpis || {
      total_documents: 0,
      valid_count: 0,
      expiring_soon_count: 0,
      expired_count: 0,
    };

    return [
      {
        value: String(kpis.total_documents),
        label: 'Total Documents',
        valueColor: '#2F6FED',
        icon: (
          <DescriptionOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
        ),
        iconBg: '#EBF2FF',
      },
      {
        value: String(kpis.valid_count),
        label: 'Valid',
        valueColor: '#10B981',
        icon: (
          <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#10B981' }} />
        ),
        iconBg: '#ECFDF5',
      },
      {
        value: String(kpis.expiring_soon_count),
        label: 'Expiring Soon',
        valueColor: '#D97706',
        icon: <WarningAmberIcon sx={{ fontSize: 18, color: '#D97706' }} />,
        iconBg: '#FFFBEB',
      },
      {
        value: String(kpis.expired_count),
        label: 'Expired',
        valueColor: '#EF4444',
        icon: <ErrorOutlineIcon sx={{ fontSize: 18, color: '#EF4444' }} />,
        iconBg: '#FEF2F2',
      },
    ];
  }, [documentsResponse]);

  const attentionCount = useMemo(() => {
    return vehiclesData.filter((v) => {
      const statuses = [
        v.registration.status,
        v.insurance.status,
        v.inspection.status,
      ];
      return statuses.some((s) => s !== 'Valid');
    }).length;
  }, []);

  const filteredVehicles = useMemo(() => {
    if (!activeFilter) return vehiclesData;
    return vehiclesData.filter((v) =>
      [v.registration, v.insurance, v.inspection].some(
        (doc) => doc.status === activeFilter
      )
    );
  }, [activeFilter]);

  const handleViewDoc = (vehicle: VehicleDocRow, doc: DocumentInfo) => {
    setSelectedDoc({
      ...doc,
      vehicleName: vehicle.vehicle,
      vehiclePlate: vehicle.plate,
    });
    setModalOpen(true);
  };

  const filterChips: {
    label: string;
    count: number;
    status: DocStatus;
  }[] = [
    { label: 'All Valid', count: filterCounts.valid, status: 'Valid' },
    { label: 'Expiring', count: filterCounts.expiring, status: 'Expiring' },
    { label: 'Expired', count: filterCounts.expired, status: 'Expired' },
  ];

  const columnHeaders = ['VEHICLE', 'REGISTRATION', 'INSURANCE', 'INSPECTION'];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Page Title + Filter Chips */}
        <RowStack justifyContent={'space-between'} alignItems={'flex-start'}>
          <DashboardTitleAndDesc
            title="Vehicle Documents"
            desc="Registration, insurance, and inspection records — manage and take action per document"
          />

          <RowStack spacing={'8px'}>
            {filterChips.map((chip) => {
              const config = statusConfig[chip.status];
              const isActive = activeFilter === chip.status;
              return (
                <Box
                  key={chip.status}
                  onClick={() => setActiveFilter(isActive ? null : chip.status)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '14px',
                    background: config.bg,
                    border: `0.67px solid ${config.borderColor}`,
                    cursor: 'pointer',
                    opacity: isActive ? 1 : 0.85,
                    outline: isActive ? `2px solid ${config.color}` : 'none',
                    outlineOffset: '1px',
                    transition: 'all 0.15s ease',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(12.5),
                      color: config.color,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chip.count} {chip.label}
                  </Typography>
                </Box>
              );
            })}
          </RowStack>
        </RowStack>

        {/* KPI Cards */}
        <Grid container spacing={'16px'}>
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

        {/* Alert Banner */}
        {attentionCount > 0 && (
          <RowStack
            spacing={'8px'}
            sx={{
              background: '#FEF2F2',
              border: '0.67px solid #FECACA',
              borderRadius: '14px',
              padding: '12px 16px',
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 14, color: '#EF4444' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#EF4444',
              }}
            >
              {attentionCount} vehicle{attentionCount !== 1 ? 's' : ''} need
              document attention
            </Typography>
          </RowStack>
        )}

        {/* Documents Table */}
        <Box
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Table Header */}
          <RowStack
            sx={{
              background: '#FAFBFF',
              borderBottom: '0.67px solid #F0F4F8',
              padding: '12px 24px',
            }}
          >
            {columnHeaders.map((header, i) => (
              <Typography
                key={header}
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(11),
                  letterSpacing: '0.055em',
                  color: '#9CA3AF',
                  width: i === 0 ? '240px' : undefined,
                  flex: i === 0 ? 'none' : 1,
                  minWidth: i === 0 ? '240px' : '240px',
                }}
              >
                {header}
              </Typography>
            ))}
          </RowStack>

          {/* Table Rows */}
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <RowStack
                key={vehicle.id}
                sx={{
                  padding: '16px 24px',
                  borderBottom: '0.67px solid rgba(0,0,0,0.05)',
                  alignItems: 'flex-start',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                {/* Vehicle column */}
                <RowStack
                  spacing={'12px'}
                  sx={{ width: '240px', minWidth: '240px', pt: '8px' }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      background: vehicle.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <DirectionsCarOutlinedIcon
                      sx={{ fontSize: 18, color: vehicle.iconColor }}
                    />
                  </Box>
                  <Stack spacing={'2px'}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(13),
                        color: '#111827',
                        lineHeight: '1.5em',
                      }}
                    >
                      {vehicle.vehicle}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(11),
                        color: '#9CA3AF',
                        lineHeight: '1.5em',
                      }}
                    >
                      {vehicle.plate} · {vehicle.fleet}
                    </Typography>
                  </Stack>
                </RowStack>

                {/* Doc Cards */}
                {[
                  vehicle.registration,
                  vehicle.insurance,
                  vehicle.inspection,
                ].map((doc, idx) => (
                  <Box key={idx} sx={{ flex: 1, minWidth: '240px', px: '6px' }}>
                    <DocCard
                      doc={doc}
                      onView={() => handleViewDoc(vehicle, doc)}
                    />
                  </Box>
                ))}
              </RowStack>
            ))
          ) : (
            <Box sx={{ py: 6 }}>
              <EmptyState
                emptyState={
                  <Typography
                    sx={{
                      fontSize: pxToRem(16),
                      fontWeight: 400,
                      textAlign: 'center',
                    }}
                  >
                    No vehicle documents found
                  </Typography>
                }
              />
            </Box>
          )}
        </Box>
      </Stack>

      {/* Document View Modal */}
      <DocumentViewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        document={selectedDoc}
      />
    </AppDashboardLayout>
  );
};

// ─── DocCard Sub-Component ──────────────────────────────────────────────────

const DocCard = ({
  doc,
  onView,
}: {
  doc: DocumentInfo;
  onView: () => void;
}) => {
  const config = statusConfig[doc.status];
  const actions = getActionButtons(doc.status);

  return (
    <Stack
      sx={{
        background: config.cellBg,
        border: `0.67px solid ${config.cellBorder}`,
        borderRadius: '14px',
        padding: '14px 16px',
        gap: '10px',
      }}
    >
      {/* Doc Type Label */}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(10),
          letterSpacing: '0.05em',
          color: '#9CA3AF',
        }}
      >
        {doc.type.toUpperCase()}
      </Typography>

      {/* Status + Expiry + Authority */}
      <Stack spacing={'4px'}>
        <RowStack spacing={'6px'}>
          {config.icon}
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(12),
              color: config.color,
            }}
          >
            {doc.status}
          </Typography>
        </RowStack>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11),
            color: '#9CA3AF',
            lineHeight: '1.5em',
          }}
        >
          Expires {doc.expiry}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11),
            color: '#9CA3AF',
            lineHeight: '1.5em',
          }}
        >
          {doc.authority}
        </Typography>
      </Stack>

      {/* Action Buttons */}
      <RowStack spacing={'6px'}>
        {actions.map((btn) => (
          <Box
            key={btn.label}
            onClick={btn.action === 'view' ? onView : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '7px',
              background: btn.bg,
              border: `0.67px solid ${btn.border}`,
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.8 },
            }}
          >
            {btn.icon}
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11),
                color: btn.color,
                whiteSpace: 'nowrap',
              }}
            >
              {btn.label}
            </Typography>
          </Box>
        ))}
      </RowStack>
    </Stack>
  );
};
