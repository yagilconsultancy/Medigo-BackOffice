'use client';

import { useState, useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { DocumentViewModal } from './ui/components';
import { pxToRem } from '../../../common';

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

// ─── Sample Data ────────────────────────────────────────────────────────────

const vehiclesData: VehicleDocRow[] = [
  {
    id: '1',
    vehicle: '2022 Toyota Sienna',
    plate: 'ABC-1234',
    fleet: 'MediGo',
    iconColor: '#2F6FED',
    iconBg: 'rgba(47, 111, 237, 0.09)',
    registration: {
      type: 'Registration',
      status: 'Valid',
      expiry: 'Nov 2026',
      fileName: 'reg_toyota_sienna.pdf',
      docId: 'REG-NY-448821',
      issueDate: 'Nov 15, 2024',
      authority: 'NY DMV',
      subtitle: 'VEHICLE REGISTRATION',
    },
    insurance: {
      type: 'Insurance',
      status: 'Valid',
      expiry: 'Dec 2026',
      fileName: 'ins_toyota_sienna.pdf',
      docId: 'INS-SF-88421',
      issueDate: 'Dec 10, 2024',
      authority: 'State Farm',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    inspection: {
      type: 'Safety Inspection',
      status: 'Valid',
      expiry: 'Sep 2026',
      fileName: 'insp_toyota_sienna.pdf',
      docId: 'INSP-NY-7741',
      issueDate: 'Sep 5, 2025',
      authority: 'NY STATE INSPECTION',
      subtitle: 'SAFETY INSPECTION CERTIFICATE',
    },
  },
  {
    id: '2',
    vehicle: '2021 Honda Odyssey',
    plate: 'DEF-5678',
    fleet: 'MedRide Express',
    iconColor: '#6366F1',
    iconBg: 'rgba(99, 102, 241, 0.09)',
    registration: {
      type: 'Registration',
      status: 'Valid',
      expiry: 'Jun 2026',
      fileName: 'reg_honda_odyssey.pdf',
      docId: 'REG-NY-557732',
      issueDate: 'Jun 20, 2024',
      authority: 'NY DMV',
      subtitle: 'VEHICLE REGISTRATION',
    },
    insurance: {
      type: 'Insurance',
      status: 'Valid',
      expiry: 'Mar 2027',
      fileName: 'ins_honda_odyssey.pdf',
      docId: 'INS-AL-66130',
      issueDate: 'Mar 15, 2025',
      authority: 'Allstate',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    inspection: {
      type: 'Safety Inspection',
      status: 'Expiring',
      expiry: 'Apr 2026',
      fileName: 'insp_honda_odyssey.pdf',
      docId: 'INSP-NY-5529',
      issueDate: 'Apr 10, 2024',
      authority: 'NY STATE INSPECTION',
      subtitle: 'SAFETY INSPECTION CERTIFICATE',
    },
  },
  {
    id: '3',
    vehicle: '2023 Ford Escape',
    plate: 'GHI-9012',
    fleet: 'MediGo',
    iconColor: '#F59E0B',
    iconBg: 'rgba(245, 158, 11, 0.09)',
    registration: {
      type: 'Registration',
      status: 'Valid',
      expiry: 'Aug 2026',
      fileName: 'reg_ford_escape.pdf',
      docId: 'REG-NJ-339941',
      issueDate: 'Aug 1, 2024',
      authority: 'NJ DMV',
      subtitle: 'VEHICLE REGISTRATION',
    },
    insurance: {
      type: 'Insurance',
      status: 'Valid',
      expiry: 'Sep 2026',
      fileName: 'ins_ford_escape.pdf',
      docId: 'INS-PG-44520',
      issueDate: 'Sep 20, 2024',
      authority: 'Progressive',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    inspection: {
      type: 'Safety Inspection',
      status: 'Valid',
      expiry: 'Oct 2026',
      fileName: 'insp_ford_escape.pdf',
      docId: 'INSP-NJ-3318',
      issueDate: 'Oct 15, 2024',
      authority: 'NJ STATE INSPECTION',
      subtitle: 'SAFETY INSPECTION CERTIFICATE',
    },
  },
  {
    id: '4',
    vehicle: '2020 Chrysler Pacifica',
    plate: 'JKL-3456',
    fleet: 'CareTransit Co.',
    iconColor: '#EC4899',
    iconBg: 'rgba(236, 72, 153, 0.09)',
    registration: {
      type: 'Registration',
      status: 'Expiring',
      expiry: 'Apr 2026',
      fileName: 'reg_chrysler_pacifica.pdf',
      docId: 'REG-CT-228830',
      issueDate: 'Apr 5, 2024',
      authority: 'CT DMV',
      subtitle: 'VEHICLE REGISTRATION',
    },
    insurance: {
      type: 'Insurance',
      status: 'Valid',
      expiry: 'Dec 2026',
      fileName: 'ins_chrysler_pacifica.pdf',
      docId: 'INS-NW-77219',
      issueDate: 'Dec 1, 2024',
      authority: 'Nationwide',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    inspection: {
      type: 'Safety Inspection',
      status: 'Valid',
      expiry: 'Jul 2026',
      fileName: 'insp_chrysler_pacifica.pdf',
      docId: 'INSP-CT-2207',
      issueDate: 'Jul 20, 2024',
      authority: 'CT STATE INSPECTION',
      subtitle: 'SAFETY INSPECTION CERTIFICATE',
    },
  },
  {
    id: '5',
    vehicle: '2020 Kia Sedona',
    plate: 'STU-5678',
    fleet: 'SafeRide Medical',
    iconColor: '#0EA5E9',
    iconBg: 'rgba(14, 165, 233, 0.09)',
    registration: {
      type: 'Registration',
      status: 'Valid',
      expiry: 'Jan 2027',
      fileName: 'reg_kia_sedona.pdf',
      docId: 'REG-MA-117729',
      issueDate: 'Jan 10, 2025',
      authority: 'MA DMV',
      subtitle: 'VEHICLE REGISTRATION',
    },
    insurance: {
      type: 'Insurance',
      status: 'Expired',
      expiry: 'Jan 2026',
      fileName: 'ins_kia_sedona.pdf',
      docId: 'INS-LM-55318',
      issueDate: 'Jan 15, 2024',
      authority: 'Liberty Mutual',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    inspection: {
      type: 'Safety Inspection',
      status: 'Expired',
      expiry: 'Dec 2025',
      fileName: 'insp_kia_sedona.pdf',
      docId: 'INSP-MA-8805',
      issueDate: 'Dec 1, 2023',
      authority: 'MA STATE INSPECTION',
      subtitle: 'SAFETY INSPECTION CERTIFICATE',
    },
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const VehicleDocumentsPage = () => {
  const [activeFilter, setActiveFilter] = useState<DocStatus | null>(null);
  const [selectedDoc, setSelectedDoc] =
    useState<VehicleDocumentDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filterCounts = useMemo(() => {
    let valid = 0;
    let expiring = 0;
    let expired = 0;
    vehiclesData.forEach((v) => {
      const statuses = [
        v.registration.status,
        v.insurance.status,
        v.inspection.status,
      ];
      if (statuses.every((s) => s === 'Valid')) valid++;
      if (statuses.includes('Expiring')) expiring++;
      if (statuses.includes('Expired')) expired++;
    });
    return { valid, expiring, expired };
  }, []);

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
                  onClick={() =>
                    setActiveFilter(isActive ? null : chip.status)
                  }
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
                    outline: isActive
                      ? `2px solid ${config.color}`
                      : 'none',
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
          {filteredVehicles.map((vehicle) => (
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
              {[vehicle.registration, vehicle.insurance, vehicle.inspection].map(
                (doc, idx) => (
                  <Box key={idx} sx={{ flex: 1, minWidth: '240px', px: '6px' }}>
                    <DocCard
                      doc={doc}
                      onView={() => handleViewDoc(vehicle, doc)}
                    />
                  </Box>
                )
              )}
            </RowStack>
          ))}
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
