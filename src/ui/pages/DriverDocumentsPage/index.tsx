'use client';

import { useState, useMemo } from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { RowStack, CustomBreadCrumbs } from '../../modules/components';
import { DocumentViewModal } from './ui/components';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type DocStatus = 'Valid' | 'Expiring Soon' | 'Expired' | 'Missing';

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

type DriverDocRow = {
  id: string;
  name: string;
  avatar: string;
  license: DocumentInfo;
  insurance: DocumentInfo;
  certification: DocumentInfo;
};

export type DocumentDetail = DocumentInfo & {
  driverName: string;
  driverAvatar: string;
};

// ─── Status Config ──────────────────────────────────────────────────────────

const statusConfig: Record<
  DocStatus,
  {
    color: string;
    bg: string;
    borderColor: string;
    icon: React.ReactNode;
  }
> = {
  Valid: {
    color: '#059669',
    bg: '#ECFDF5',
    borderColor: '#BBF7D0',
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 12, color: '#059669' }} />,
  },
  'Expiring Soon': {
    color: '#D97706',
    bg: '#FFFBEB',
    borderColor: '#FDE68A',
    icon: <WarningAmberIcon sx={{ fontSize: 12, color: '#D97706' }} />,
  },
  Expired: {
    color: '#EF4444',
    bg: '#FEF2F2',
    borderColor: '#FECACA',
    icon: <ErrorOutlineIcon sx={{ fontSize: 12, color: '#EF4444' }} />,
  },
  Missing: {
    color: '#6B7280',
    bg: '#F3F4F6',
    borderColor: '#E5E7EB',
    icon: <HelpOutlineIcon sx={{ fontSize: 12, color: '#6B7280' }} />,
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
            <VisibilityOutlinedIcon sx={{ fontSize: 11, color: '#2F6FED' }} />
          ),
          action: 'view' as const,
        },
        {
          label: 'Replace',
          bg: '#F7F9FB',
          border: '#E5E7EB',
          color: '#374151',
          icon: <SyncOutlinedIcon sx={{ fontSize: 11, color: '#374151' }} />,
          action: 'replace' as const,
        },
      ];
    case 'Expiring Soon':
      return [
        {
          label: 'Upload New',
          bg: '#FFFBEB',
          border: '#FDE68A',
          color: '#D97706',
          icon: (
            <FileUploadOutlinedIcon sx={{ fontSize: 11, color: '#D97706' }} />
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
            <FileUploadOutlinedIcon sx={{ fontSize: 11, color: '#EF4444' }} />
          ),
          action: 'upload' as const,
        },
      ];
    case 'Missing':
      return [
        {
          label: 'Upload Document',
          bg: '#F3F4F6',
          border: '#E5E7EB',
          color: '#6B7280',
          icon: (
            <FileUploadOutlinedIcon sx={{ fontSize: 11, color: '#6B7280' }} />
          ),
          action: 'upload' as const,
        },
      ];
  }
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const driversData: DriverDocRow[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    avatar: '',
    license: {
      type: "Driver's License",
      status: 'Valid',
      expiry: 'Dec 2027',
      fileName: 'dl_marcus_johnson.pdf',
      docId: 'DL-NY-448821',
      issueDate: 'Mar 15, 2023',
      authority: 'STATE MOTOR VEHICLES',
      subtitle: 'DRIVER LICENSE — CLASS C',
    },
    insurance: {
      type: 'Vehicle Insurance',
      status: 'Valid',
      expiry: 'Mar 2027',
      fileName: 'insurance_marcus.pdf',
      docId: 'POL-2023-88421',
      issueDate: 'Mar 15, 2023',
      authority: 'INSURANCE CERTIFICATE',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    certification: {
      type: 'Med. Transport Cert.',
      status: 'Valid',
      expiry: 'Jun 2026',
      fileName: 'cert_marcus.pdf',
      docId: 'CERT-MTO-7741',
      issueDate: 'Mar 15, 2023',
      authority: 'CERTIFICATION AUTHORITY',
      subtitle: 'MEDICAL TRANSPORT OPERATOR',
    },
  },
  {
    id: '2',
    name: 'Sarah Williams',
    avatar: '',
    license: {
      type: "Driver's License",
      status: 'Valid',
      expiry: 'Aug 2026',
      fileName: 'dl_sarah_williams.pdf',
      docId: 'DL-CA-557732',
      issueDate: 'Aug 10, 2022',
      authority: 'STATE MOTOR VEHICLES',
      subtitle: 'DRIVER LICENSE — CLASS C',
    },
    insurance: {
      type: 'Vehicle Insurance',
      status: 'Valid',
      expiry: 'Mar 2027',
      fileName: 'insurance_sarah.pdf',
      docId: 'POL-2022-66130',
      issueDate: 'Mar 22, 2022',
      authority: 'INSURANCE CERTIFICATE',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    certification: {
      type: 'Med. Transport Cert.',
      status: 'Expiring Soon',
      expiry: 'Apr 2026',
      fileName: 'cert_sarah.pdf',
      docId: 'CERT-MTO-5529',
      issueDate: 'Apr 5, 2022',
      authority: 'CERTIFICATION AUTHORITY',
      subtitle: 'MEDICAL TRANSPORT OPERATOR',
    },
  },
  {
    id: '3',
    name: 'David Chen',
    avatar: '',
    license: {
      type: "Driver's License",
      status: 'Valid',
      expiry: 'Nov 2028',
      fileName: 'dl_david_chen.pdf',
      docId: 'DL-TX-339941',
      issueDate: 'Nov 1, 2023',
      authority: 'STATE MOTOR VEHICLES',
      subtitle: 'DRIVER LICENSE — CLASS C',
    },
    insurance: {
      type: 'Vehicle Insurance',
      status: 'Valid',
      expiry: 'Dec 2026',
      fileName: 'insurance_david.pdf',
      docId: 'POL-2023-44520',
      issueDate: 'Dec 15, 2023',
      authority: 'INSURANCE CERTIFICATE',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    certification: {
      type: 'Med. Transport Cert.',
      status: 'Valid',
      expiry: 'Sep 2026',
      fileName: 'cert_david.pdf',
      docId: 'CERT-MTO-3318',
      issueDate: 'Sep 20, 2022',
      authority: 'CERTIFICATION AUTHORITY',
      subtitle: 'MEDICAL TRANSPORT OPERATOR',
    },
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    avatar: '',
    license: {
      type: "Driver's License",
      status: 'Valid',
      expiry: 'May 2027',
      fileName: 'dl_emily_rodriguez.pdf',
      docId: 'DL-FL-228830',
      issueDate: 'May 8, 2023',
      authority: 'STATE MOTOR VEHICLES',
      subtitle: 'DRIVER LICENSE — CLASS C',
    },
    insurance: {
      type: 'Vehicle Insurance',
      status: 'Expiring Soon',
      expiry: 'Apr 2026',
      fileName: 'insurance_emily.pdf',
      docId: 'POL-2023-77219',
      issueDate: 'Apr 1, 2023',
      authority: 'INSURANCE CERTIFICATE',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    certification: {
      type: 'Med. Transport Cert.',
      status: 'Missing',
      expiry: '',
      fileName: '',
      docId: '',
      issueDate: '',
      authority: 'CERTIFICATION AUTHORITY',
      subtitle: 'MEDICAL TRANSPORT OPERATOR',
    },
  },
  {
    id: '5',
    name: 'James Thompson',
    avatar: '',
    license: {
      type: "Driver's License",
      status: 'Valid',
      expiry: 'Feb 2029',
      fileName: 'dl_james_thompson.pdf',
      docId: 'DL-OH-117729',
      issueDate: 'Feb 14, 2024',
      authority: 'STATE MOTOR VEHICLES',
      subtitle: 'DRIVER LICENSE — CLASS C',
    },
    insurance: {
      type: 'Vehicle Insurance',
      status: 'Valid',
      expiry: 'Jun 2027',
      fileName: 'insurance_james.pdf',
      docId: 'POL-2024-55318',
      issueDate: 'Jun 10, 2024',
      authority: 'INSURANCE CERTIFICATE',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    certification: {
      type: 'Med. Transport Cert.',
      status: 'Valid',
      expiry: 'Nov 2026',
      fileName: 'cert_james.pdf',
      docId: 'CERT-MTO-2207',
      issueDate: 'Nov 3, 2022',
      authority: 'CERTIFICATION AUTHORITY',
      subtitle: 'MEDICAL TRANSPORT OPERATOR',
    },
  },
  {
    id: '6',
    name: 'Anna Kim',
    avatar: '',
    license: {
      type: "Driver's License",
      status: 'Valid',
      expiry: 'Jul 2027',
      fileName: 'dl_anna_kim.pdf',
      docId: 'DL-WA-006618',
      issueDate: 'Jul 20, 2023',
      authority: 'STATE MOTOR VEHICLES',
      subtitle: 'DRIVER LICENSE — CLASS C',
    },
    insurance: {
      type: 'Vehicle Insurance',
      status: 'Valid',
      expiry: 'Feb 2027',
      fileName: 'insurance_anna.pdf',
      docId: 'POL-2023-33417',
      issueDate: 'Feb 28, 2023',
      authority: 'INSURANCE CERTIFICATE',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    certification: {
      type: 'Med. Transport Cert.',
      status: 'Valid',
      expiry: 'Aug 2026',
      fileName: 'cert_anna.pdf',
      docId: 'CERT-MTO-1106',
      issueDate: 'Aug 15, 2022',
      authority: 'CERTIFICATION AUTHORITY',
      subtitle: 'MEDICAL TRANSPORT OPERATOR',
    },
  },
  {
    id: '7',
    name: 'Tom Roberts',
    avatar: '',
    license: {
      type: "Driver's License",
      status: 'Valid',
      expiry: 'Mar 2026',
      fileName: 'dl_tom_roberts.pdf',
      docId: 'DL-PA-995507',
      issueDate: 'Mar 5, 2022',
      authority: 'STATE MOTOR VEHICLES',
      subtitle: 'DRIVER LICENSE — CLASS C',
    },
    insurance: {
      type: 'Vehicle Insurance',
      status: 'Expired',
      expiry: 'Jan 2026',
      fileName: 'insurance_tom.pdf',
      docId: 'POL-2022-11116',
      issueDate: 'Jan 12, 2022',
      authority: 'INSURANCE CERTIFICATE',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    certification: {
      type: 'Med. Transport Cert.',
      status: 'Expired',
      expiry: 'Dec 2025',
      fileName: 'cert_tom.pdf',
      docId: 'CERT-MTO-8805',
      issueDate: 'Dec 1, 2021',
      authority: 'CERTIFICATION AUTHORITY',
      subtitle: 'MEDICAL TRANSPORT OPERATOR',
    },
  },
  {
    id: '8',
    name: 'Grace Miller',
    avatar: '',
    license: {
      type: "Driver's License",
      status: 'Valid',
      expiry: 'Oct 2027',
      fileName: 'dl_grace_miller.pdf',
      docId: 'DL-IL-884406',
      issueDate: 'Oct 18, 2023',
      authority: 'STATE MOTOR VEHICLES',
      subtitle: 'DRIVER LICENSE — CLASS C',
    },
    insurance: {
      type: 'Vehicle Insurance',
      status: 'Valid',
      expiry: 'Aug 2027',
      fileName: 'insurance_grace.pdf',
      docId: 'POL-2023-99815',
      issueDate: 'Aug 5, 2023',
      authority: 'INSURANCE CERTIFICATE',
      subtitle: 'COMMERCIAL AUTO POLICY',
    },
    certification: {
      type: 'Med. Transport Cert.',
      status: 'Valid',
      expiry: 'Mar 2027',
      fileName: 'cert_grace.pdf',
      docId: 'CERT-MTO-6604',
      issueDate: 'Mar 10, 2023',
      authority: 'CERTIFICATION AUTHORITY',
      subtitle: 'MEDICAL TRANSPORT OPERATOR',
    },
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const DriverDocumentsPage = () => {
  const [activeFilter, setActiveFilter] = useState<DocStatus | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filterCounts = useMemo(() => {
    let valid = 0;
    let expiring = 0;
    let expired = 0;
    let missing = 0;
    driversData.forEach((d) => {
      const statuses = [
        d.license.status,
        d.insurance.status,
        d.certification.status,
      ];
      const allValid = statuses.every((s) => s === 'Valid');
      if (allValid) valid++;
      if (statuses.includes('Expiring Soon')) expiring++;
      if (statuses.includes('Expired')) expired++;
      if (statuses.includes('Missing')) missing++;
    });
    return { valid, expiring, expired, missing };
  }, []);

  const filteredDrivers = useMemo(() => {
    if (!activeFilter) return driversData;
    return driversData.filter((d) =>
      [d.license, d.insurance, d.certification].some(
        (doc) => doc.status === activeFilter
      )
    );
  }, [activeFilter]);

  const handleViewDoc = (driver: DriverDocRow, doc: DocumentInfo) => {
    setSelectedDoc({
      ...doc,
      driverName: driver.name,
      driverAvatar: driver.avatar,
    });
    setModalOpen(true);
  };

  const filterChips: {
    label: string;
    count: number;
    status: DocStatus;
  }[] = [
    { label: 'All Valid', count: filterCounts.valid, status: 'Valid' },
    {
      label: 'Expiring Soon',
      count: filterCounts.expiring,
      status: 'Expiring Soon',
    },
    { label: 'Expired', count: filterCounts.expired, status: 'Expired' },
    { label: 'Missing', count: filterCounts.missing, status: 'Missing' },
  ];

  const columnHeaders = [
    'DRIVER',
    'DRIVER LICENSE',
    'INSURANCE',
    'CERTIFICATION',
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Breadcrumb */}
        <CustomBreadCrumbs
          breadcrumbsData={[
            { text: 'Driver Profiles', href: '/drivers/profiles' },
            { text: 'Driver Documents', href: '/drivers/documents' },
          ]}
        />

        {/* Page Title + Filter Chips */}
        <RowStack justifyContent={'space-between'} alignItems={'flex-start'}>
          <Stack spacing={'4px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(24),
                color: '#111827',
              }}
            >
              Driver Documents
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(14),
                color: '#6B7280',
              }}
            >
              Driver license, insurance, and certifications — manage and take
              action per document
            </Typography>
          </Stack>

          <RowStack spacing={'10px'}>
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
                    padding: '6px 14px',
                    borderRadius: '14px',
                    background: config.bg,
                    border: `1px solid ${config.borderColor}`,
                    cursor: 'pointer',
                    opacity: isActive ? 1 : 0.85,
                    outline: isActive ? `2px solid ${config.color}` : 'none',
                    outlineOffset: '1px',
                    transition: 'all 0.15s ease',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  {config.icon}
                  <Typography
                    sx={{
                      fontFamily: 'Inter, sans-serif',
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

        {/* Documents Table */}
        <Box
          sx={{
            background: '#FFFFFF',
            border: '1px solid #F0F4F8',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Table Header */}
          <RowStack
            sx={{
              background: '#FAFBFF',
              borderBottom: '1px solid #F0F4F8',
              padding: '14px 24px',
            }}
          >
            {columnHeaders.map((header, i) => (
              <Typography
                key={header}
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: pxToRem(11),
                  letterSpacing: '0.05em',
                  color: '#9CA3AF',
                  width: i === 0 ? '200px' : undefined,
                  flex: i === 0 ? 'none' : 1,
                  minWidth: i === 0 ? '200px' : '240px',
                }}
              >
                {header}
              </Typography>
            ))}
          </RowStack>

          {/* Table Rows */}
          {filteredDrivers.map((driver) => {
            const nameParts = driver.name.split(' ');
            const initials =
              nameParts.length > 1
                ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
                : nameParts[0].charAt(0);

            return (
              <RowStack
                key={driver.id}
                sx={{
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  alignItems: 'flex-start',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                {/* Driver column */}
                <RowStack
                  spacing={'10px'}
                  sx={{ width: '200px', minWidth: '200px', pt: '8px' }}
                >
                  <Avatar
                    src={driver.avatar || undefined}
                    alt={driver.name}
                    sx={{
                      width: 36,
                      height: 36,
                      fontSize: pxToRem(12),
                      fontWeight: 600,
                      background: '#EBF2FF',
                      color: '#2F6FED',
                    }}
                  >
                    {initials}
                  </Avatar>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      color: '#111827',
                    }}
                  >
                    {driver.name}
                  </Typography>
                </RowStack>

                {/* Doc Cards */}
                {[driver.license, driver.insurance, driver.certification].map(
                  (doc, idx) => (
                    <Box
                      key={idx}
                      sx={{ flex: 1, minWidth: '240px', px: '6px' }}
                    >
                      <DocCard
                        doc={doc}
                        onView={() => handleViewDoc(driver, doc)}
                      />
                    </Box>
                  )
                )}
              </RowStack>
            );
          })}
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
  const isMissing = doc.status === 'Missing';

  return (
    <Stack
      spacing={'10px'}
      sx={{
        background: isMissing ? '#F3F4F6' : '#FFFFFF',
        border: `1px solid ${isMissing ? '#E5E7EB' : 'rgba(0,0,0,0.05)'}`,
        borderRadius: '14px',
        padding: '14px 16px',
      }}
    >
      {/* Doc Type Label */}
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: pxToRem(10),
          letterSpacing: '0.05em',
          color: '#9CA3AF',
        }}
      >
        {doc.type}
      </Typography>

      {/* Status + Expiry */}
      <Stack spacing={'4px'}>
        <RowStack spacing={'6px'}>
          {config.icon}
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
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
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: pxToRem(11),
            color: '#9CA3AF',
          }}
        >
          {isMissing ? 'No document on file' : `Expires ${doc.expiry}`}
        </Typography>
      </Stack>

      {/* Action Buttons */}
      <RowStack spacing={'8px'}>
        {actions.map((btn) => (
          <Box
            key={btn.label}
            onClick={btn.action === 'view' ? onView : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '7px',
              background: btn.bg,
              border: `1px solid ${btn.border}`,
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.8 },
            }}
          >
            {btn.icon}
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(11),
                color: btn.color,
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
