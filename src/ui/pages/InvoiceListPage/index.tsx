'use client';

import { useState, useMemo } from 'react';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { ImagePdfViewer } from '../../modules/blocks/ImagePdfViewer';
import { ImageAttachment } from '../../modules/components/ImageAttachment';
import { GridColSpec } from '../../modules/components/GridTable';
import { GenerateInvoiceModal } from './ui/components';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';
type InvoiceType = 'Rider' | 'Fleet';

type InvoiceRow = {
  id: string;
  invoiceId: string;
  type: InvoiceType;
  recipientName: string;
  recipientEmail: string;
  trips: number;
  amount: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  fileUri: string;
};

// ─── Status Colors ──────────────────────────────────────────────────────────

const statusColors: Record<InvoiceStatus, string> = {
  Paid: '#059669',
  Pending: '#D97706',
  Overdue: '#EF4444',
};

const typeColors: Record<InvoiceType, { color: string; bg: string }> = {
  Rider: { color: '#2F6FED', bg: '#EBF2FF' },
  Fleet: { color: '#6366F1', bg: '#F3EEFF' },
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const invoicesData: InvoiceRow[] = [
  {
    id: '1',
    invoiceId: 'INV-9021',
    type: 'Rider',
    recipientName: 'Dorothy MacLeod',
    recipientEmail: 'd.macleod@email.com',
    trips: 4,
    amount: '$174.50',
    date: 'Mar 9, 2026',
    dueDate: 'Mar 16, 2026',
    status: 'Paid',
    fileUri: 'invoices/INV-9021.pdf',
  },
  {
    id: '2',
    invoiceId: 'INV-9020',
    type: 'Fleet',
    recipientName: 'MedRide Express',
    recipientEmail: 'billing@medride.ca',
    trips: 218,
    amount: '$9,840.00',
    date: 'Mar 1, 2026',
    dueDate: 'Mar 15, 2026',
    status: 'Pending',
    fileUri: 'invoices/INV-9020.pdf',
  },
  {
    id: '3',
    invoiceId: 'INV-9019',
    type: 'Rider',
    recipientName: 'Joseph Nguyen',
    recipientEmail: 'j.nguyen@email.com',
    trips: 6,
    amount: '$240.00',
    date: 'Mar 8, 2026',
    dueDate: 'Mar 15, 2026',
    status: 'Paid',
    fileUri: 'invoices/INV-9019.pdf',
  },
  {
    id: '4',
    invoiceId: 'INV-9018',
    type: 'Fleet',
    recipientName: 'CareTransit Co.',
    recipientEmail: 'billing@caretransit.ca',
    trips: 184,
    amount: '$8,280.00',
    date: 'Mar 1, 2026',
    dueDate: 'Mar 15, 2026',
    status: 'Paid',
    fileUri: 'invoices/INV-9018.pdf',
  },
  {
    id: '5',
    invoiceId: 'INV-9017',
    type: 'Rider',
    recipientName: 'Claire Beaumont',
    recipientEmail: 'claire.beaumont@email.com',
    trips: 8,
    amount: '$348.00',
    date: 'Mar 7, 2026',
    dueDate: 'Mar 14, 2026',
    status: 'Pending',
    fileUri: 'invoices/INV-9017.pdf',
  },
  {
    id: '6',
    invoiceId: 'INV-9016',
    type: 'Fleet',
    recipientName: 'HealthHaul LLC',
    recipientEmail: 'billing@healthhaul.ca',
    trips: 142,
    amount: '$6,390.00',
    date: 'Feb 28, 2026',
    dueDate: 'Mar 7, 2026',
    status: 'Overdue',
    fileUri: 'invoices/INV-9016.pdf',
  },
  {
    id: '7',
    invoiceId: 'INV-9015',
    type: 'Rider',
    recipientName: 'Pierre Tremblay',
    recipientEmail: 'p.tremblay@email.com',
    trips: 5,
    amount: '$198.75',
    date: 'Mar 6, 2026',
    dueDate: 'Mar 13, 2026',
    status: 'Paid',
    fileUri: 'invoices/INV-9015.pdf',
  },
  {
    id: '8',
    invoiceId: 'INV-9014',
    type: 'Fleet',
    recipientName: 'SafeRide Medical',
    recipientEmail: 'billing@saferidemd.ca',
    trips: 96,
    amount: '$4,320.00',
    date: 'Feb 28, 2026',
    dueDate: 'Mar 7, 2026',
    status: 'Overdue',
    fileUri: 'invoices/INV-9014.pdf',
  },
];

// ─── Tab Config ─────────────────────────────────────────────────────────────

const tabFilters = ['All', 'Rider', 'Fleet'] as const;

// ─── Component ──────────────────────────────────────────────────────────────

export const InvoiceListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  const filteredInvoices = useMemo(() => {
    let filtered = invoicesData;

    if (activeTab !== 'All') {
      filtered = filtered.filter((inv) => inv.type === activeTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.invoiceId.toLowerCase().includes(query) ||
          inv.recipientName.toLowerCase().includes(query) ||
          inv.recipientEmail.toLowerCase().includes(query) ||
          inv.amount.toLowerCase().includes(query) ||
          inv.type.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, activeTab]);

  const statusCounts = useMemo(() => {
    return {
      total: invoicesData.length,
      paid: invoicesData.filter((inv) => inv.status === 'Paid').length,
      pending: invoicesData.filter((inv) => inv.status === 'Pending').length,
      overdue: invoicesData.filter((inv) => inv.status === 'Overdue').length,
    };
  }, []);

  const tabCounts = useMemo(() => {
    return {
      All: invoicesData.length,
      Rider: invoicesData.filter((inv) => inv.type === 'Rider').length,
      Fleet: invoicesData.filter((inv) => inv.type === 'Fleet').length,
    };
  }, []);

  const statCards = [
    {
      value: '1,248',
      label: 'Total Invoices',
      valueColor: '#111827',
      icon: (
        <ReceiptOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
      ),
      iconBg: '#EBF2FF',
    },
    {
      value: '1,094',
      label: 'Paid',
      valueColor: '#111827',
      icon: (
        <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />
      ),
      iconBg: '#ECFDF5',
    },
    {
      value: '118',
      label: 'Pending',
      valueColor: '#111827',
      icon: (
        <ScheduleOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />
      ),
      iconBg: '#FFFBEB',
    },
    {
      value: '36',
      label: 'Overdue',
      valueColor: '#111827',
      icon: (
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
      ),
      iconBg: '#FEF2F2',
    },
  ];

  const columns: GridColSpec<InvoiceRow>[] = [
    {
      field: 'invoiceId',
      headerName: 'Invoice ID',
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#2F6FED',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => {
        const type = params.value as InvoiceType;
        const config = typeColors[type];
        return (
          <Chip
            variant="filled"
            label={type}
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
      field: 'recipientName',
      headerName: 'Recipient',
      flex: 1.4,
      minWidth: 200,
      renderCell: (params) => (
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
            {params.row.recipientName}
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
            {params.row.recipientEmail}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'trips',
      headerName: 'Trips',
      flex: 0.4,
      minWidth: 60,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.7,
      minWidth: 100,
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      flex: 0.7,
      minWidth: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => {
        const status = params.value as InvoiceStatus;
        const color = statusColors[status];
        return (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12),
              color: color,
            }}
          >
            {status}
          </Typography>
        );
      },
    },
    {
      field: 'actions' as string,
      headerName: 'Actions',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <RowStack spacing={'8px'}>
          <ImagePdfViewer
            imageFileName={params.row.invoiceId}
            fileUri={params.row.fileUri}
          >
            <RowStack
              spacing={'4px'}
              sx={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: '0.67px solid #E5E7EB',
                background: '#FFFFFF',
                '&:hover': { background: '#F7F9FB' },
              }}
            >
              <VisibilityOutlinedIcon
                sx={{ fontSize: 14, color: '#374151' }}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(12),
                  color: '#374151',
                  lineHeight: '18px',
                }}
              >
                Preview
              </Typography>
            </RowStack>
          </ImagePdfViewer>
          <ImageAttachment
            text="PDF"
            imageUrl={params.row.fileUri}
          >
            <RowStack
              spacing={'4px'}
              sx={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: '0.67px solid #BFDBFE',
                background: '#EFF6FF',
                cursor: 'pointer',
                '&:hover': { background: '#DBEAFE' },
              }}
            >
              <FileDownloadOutlinedIcon
                sx={{ fontSize: 14, color: '#2F6FED' }}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(12),
                  color: '#2F6FED',
                  lineHeight: '18px',
                }}
              >
                PDF
              </Typography>
            </RowStack>
          </ImageAttachment>
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
            title="Invoice Generation"
            desc="Create and manage invoices for riders, fleet, and caregiver partners"
          />
          <AppButton
            variant="contained"
            color="primary"
            onClick={() => setGenerateModalOpen(true)}
            startIcon={
              <AddOutlinedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
            }
            sx={{
              background: '#2F6FED',
              borderRadius: '14px',
              padding: '0 18px',
              height: '40px',
              boxShadow: '0px 4px 12px 0px rgba(47, 111, 237, 0.27)',
              textTransform: 'none',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              whiteSpace: 'nowrap',
              '&:hover': { opacity: 0.9, background: '#2F6FED' },
            }}
          >
            Generate Invoice
          </AppButton>
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
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
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(16),
            color: (theme) => theme.color.deepBlue,
            lineHeight: '27px'
          }}
        >
          Generated Invoices
        </Typography>
        {/* Table */}
        <AppGridtable
          columns={columns}
          data={filteredInvoices}
          initialPageSize={10}
          disableRowClick
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <Stack spacing={'16px'} width={'100%'}>
            {/* Table Title + Search */}
            <RowStack justifyContent={'space-between'} width={'100%'}>
              <RowStack spacing={'8px'}>
              {tabFilters.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <Box
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '16px',
                      border: `0.67px solid ${isActive ? '#2F6FED' : '#E5E7EB'}`,
                      background: isActive ? '#2F6FED' : 'transparent',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        background: isActive ? '#2F6FED' : '#F7F9FB',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12),
                        color: isActive ? '#FFFFFF' : '#6B7280',
                        lineHeight: '18px',
                      }}
                    >
                      {tab}
                    </Typography>
                    <Box
                      sx={{
                        background: isActive
                          ? 'rgba(255, 255, 255, 0.26)'
                          : 'rgba(204, 194, 194, 0.26)',
                        borderRadius: '10px',
                        padding: '1px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(11),
                          color: isActive ? '#FFFFFF' : '#6B7280',
                          lineHeight: '16px',
                        }}
                      >
                        {tabCounts[tab as keyof typeof tabCounts]}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </RowStack>
              <AppSearchField
                name="search"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                boxProps={{
                  sx: { width: '240px' },
                }}
              />
            </RowStack>
          </Stack>
        </AppGridtable>
      </Stack>

      {/* Generate Invoice Modal */}
      <GenerateInvoiceModal
        open={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onSubmit={(values) => {
          console.log('Generate invoice:', values);
          setGenerateModalOpen(false);
        }}
      />
    </AppDashboardLayout>
  );
};
