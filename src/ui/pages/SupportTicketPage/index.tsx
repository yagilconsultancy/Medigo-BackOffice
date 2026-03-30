'use client';

import { useState } from 'react';
import { alpha, Box, Chip, Grid, Stack, Typography } from '@mui/material';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { pxToRem } from '../../../common';
import { SupportStatCard, TicketDetailModal } from './ui/components';

// ─── Types ──────────────────────────────────────────────────────────────────

type TicketStatus = 'Open' | 'Under Review' | 'Resolved';
type TicketPriority = 'High' | 'Medium' | 'Low';
type TicketType = 'Rider Complaint' | 'Ride Dispute' | 'Driver Complaint';
type TabValue = 'All' | 'Open' | 'Under Review' | 'Resolved';

type TicketRow = {
  id: string;
  ticketId: string;
  type: TicketType;
  subject: string;
  rider: string;
  driver: string;
  priority: TicketPriority;
  date: string;
  status: TicketStatus;
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const statusColors: Record<TicketStatus, { bg: string; color: string }> = {
  Open: { bg: '#FFFBEB', color: '#D97706' },
  'Under Review': { bg: '#EEF2FF', color: '#6366F1' },
  Resolved: { bg: '#ECFDF5', color: '#059669' },
};

const priorityColors: Record<TicketPriority, { bg: string; color: string }> = {
  High: { bg: '#FEF2F2', color: '#EF4444' },
  Medium: { bg: '#FFFBEB', color: '#D97706' },
  Low: { bg: '#F0FDF4', color: '#059669' },
};

const typeColors: Record<TicketType, { bg: string; color: string }> = {
  'Rider Complaint': { bg: '#EBF2FF', color: '#2F6FED' },
  'Ride Dispute': { bg: '#FFF7ED', color: '#EA580C' },
  'Driver Complaint': { bg: '#EEF2FF', color: '#6366F1' },
};

// ─── Stat Cards ─────────────────────────────────────────────────────────────

const statCards = [
  {
    value: '184',
    label: 'Total Tickets',
    icon: (
      <ConfirmationNumberOutlinedIcon
        sx={{ fontSize: 18, color: '#2F6FED' }}
      />
    ),
    iconBg: '#EBF2FF',
  },
  {
    value: '42',
    label: 'Open',
    icon: (
      <ErrorOutlineOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />
    ),
    iconBg: '#FFFBEB',
  },
  {
    value: '128',
    label: 'Resolved',
    icon: (
      <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#10B981' }} />
    ),
    iconBg: '#ECFDF5',
  },
  {
    value: '14',
    label: 'Ride Disputes',
    icon: <GavelOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
    iconBg: '#EEF2FF',
  },
];

// ─── Table Data ─────────────────────────────────────────────────────────────

const ticketData: TicketRow[] = [
  {
    id: '1',
    ticketId: 'TKT-8801',
    type: 'Rider Complaint',
    subject: "Driver didn't show up",
    rider: 'Claire Beaumont',
    driver: "Ryan O'Brien",
    priority: 'High',
    date: 'Mar 9, 2026',
    status: 'Open',
  },
  {
    id: '2',
    ticketId: 'TKT-8800',
    type: 'Ride Dispute',
    subject: 'Incorrect fare charged',
    rider: 'Joseph Nguyen',
    driver: 'David Chen',
    priority: 'Medium',
    date: 'Mar 8, 2026',
    status: 'Under Review',
  },
  {
    id: '3',
    ticketId: 'TKT-8799',
    type: 'Driver Complaint',
    subject: 'Passenger was aggressive',
    rider: 'Gordon MacPherson',
    driver: 'Anna Kim',
    priority: 'High',
    date: 'Mar 8, 2026',
    status: 'Resolved',
  },
  {
    id: '4',
    ticketId: 'TKT-8798',
    type: 'Ride Dispute',
    subject: 'Refund request for cancelled trip',
    rider: "Margaret O'Brien",
    driver: 'Sophie Tremblay',
    priority: 'Medium',
    date: 'Mar 7, 2026',
    status: 'Open',
  },
  {
    id: '5',
    ticketId: 'TKT-8797',
    type: 'Rider Complaint',
    subject: 'Vehicle was not wheelchair accessible',
    rider: 'Dorothy MacLeod',
    driver: 'Liam MacDonald',
    priority: 'High',
    date: 'Mar 6, 2026',
    status: 'Resolved',
  },
  {
    id: '6',
    ticketId: 'TKT-8796',
    type: 'Rider Complaint',
    subject: 'App showing wrong pickup location',
    rider: 'Isabelle C\u00f4t\u00e9',
    driver: 'Aisha Mensah',
    priority: 'Low',
    date: 'Mar 5, 2026',
    status: 'Resolved',
  },
  {
    id: '7',
    ticketId: 'TKT-8795',
    type: 'Ride Dispute',
    subject: 'Driver marked trip complete prematurely',
    rider: 'Pierre Tremblay',
    driver: 'Marc Lefebvre',
    priority: 'Medium',
    date: 'Mar 4, 2026',
    status: 'Under Review',
  },
];

// ─── Tab Config ─────────────────────────────────────────────────────────────

const tabs: { label: string; value: TabValue }[] = [
  { label: 'All', value: 'All' },
  { label: 'Open', value: 'Open' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Resolved', value: 'Resolved' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const SupportTicketPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<TicketRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const tabCounts: Record<TabValue, number> = {
    All: ticketData.length,
    Open: ticketData.filter((t) => t.status === 'Open').length,
    'Under Review': ticketData.filter((t) => t.status === 'Under Review')
      .length,
    Resolved: ticketData.filter((t) => t.status === 'Resolved').length,
  };

  const filteredTickets = ticketData.filter((t) => {
    if (activeTab !== 'All' && t.status !== activeTab) return false;
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      t.ticketId.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.rider.toLowerCase().includes(q) ||
      t.driver.toLowerCase().includes(q)
    );
  });

  const columns: GridColSpec<TicketRow>[] = [
    {
      field: 'ticketId',
      headerName: 'Ticket ID',
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#2F6FED',
          }}
        >
          {params.row.ticketId}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const t = typeColors[params.row.type];
        return (
          <Chip
            label={params.row.type}
            size="small"
            sx={{
              background: t.bg,
              color: t.color,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: pxToRem(11),
              height: '24px',
              borderRadius: '100px',
            }}
          />
        );
      },
    },
    {
      field: 'subject',
      headerName: 'Subject',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row.subject}
        </Typography>
      ),
    },
    {
      field: 'rider',
      headerName: 'Rider',
      flex: 1,
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
          {params.row.rider}
        </Typography>
      ),
    },
    {
      field: 'driver',
      headerName: 'Driver',
      flex: 1,
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
          {params.row.driver}
        </Typography>
      ),
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 0.6,
      minWidth: 80,
      renderCell: (params) => {
        const p = priorityColors[params.row.priority];
        return (
          <Box
            sx={{
              padding: '3px 10px',
              borderRadius: '100px',
              background: p.bg,
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11.5),
                color: p.color,
              }}
            >
              {params.row.priority}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          {params.row.date}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => {
        const s = statusColors[params.row.status];
        return (
          <Box
            sx={{
              padding: '4px 12px',
              borderRadius: '100px',
              background: alpha(s.color, 0.1),
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11.5),
                color: s.color,
              }}
            >
              {params.row.status}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 140,
      sortable: false,
      renderCell: (params) => (
        <RowStack spacing={'6px'}>
          <AppButton
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTicket(params.row);
              setDetailOpen(true);
            }}
            sx={{
              background: '#EBF2FF',
              color: '#2F6FED',
              borderRadius: '10px',
              padding: '5px 14px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: pxToRem(12),
              fontFamily: (theme) => theme.typography.fontFamily,
              boxShadow: 'none',
              minWidth: 'auto',
              '&:hover': {
                background: '#DCE8FD',
                boxShadow: 'none',
              },
            }}
          >
            Open
          </AppButton>
          {params.row.status === 'Open' && (
            <AppButton
              sx={{
                background: '#ECFDF5',
                color: '#059669',
                borderRadius: '10px',
                padding: '5px 14px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: pxToRem(12),
                fontFamily: (theme) => theme.typography.fontFamily,
                boxShadow: 'none',
                minWidth: 'auto',
                '&:hover': {
                  background: '#D1FAE5',
                  boxShadow: 'none',
                },
              }}
            >
              Resolve
            </AppButton>
          )}
        </RowStack>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Support Center"
          desc="Manage support tickets, trip disputes, and contact logs"
        />

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <SupportStatCard
                icon={card.icon}
                iconBg={card.iconBg}
                value={card.value}
                label={card.label}
              />
            </Grid>
          ))}
        </Grid>

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={filteredTickets}
          initialPageSize={10}
          disableRowClick
          sx={{ height: 'auto', width: '100%' }}
        >
          <RowStack justifyContent={'space-between'} width={'100%'}>
            <RowStack spacing={'8px'}>
              <RowStack spacing={'8px'} sx={{ marginRight: '8px' }}>
                <SupportAgentOutlinedIcon
                  sx={{ fontSize: 20, color: '#111827' }}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(16),
                    color: '#111827',
                  }}
                >
                  Support Tickets
                </Typography>
              </RowStack>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <Box
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '10px',
                      background: isActive ? '#2F6FED' : 'transparent',
                      border: isActive
                        ? 'none'
                        : '0.67px solid #E5E7EB',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) =>
                          theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(13),
                        color: isActive ? '#FFFFFF' : '#6B7280',
                      }}
                    >
                      {tab.label}
                    </Typography>
                    <Box
                      sx={{
                        padding: '1px 7px',
                        borderRadius: '100px',
                        background: isActive
                          ? 'rgba(255,255,255,0.25)'
                          : '#F0F4F8',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) =>
                            theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(11),
                          color: isActive ? '#FFFFFF' : '#6B7280',
                        }}
                      >
                        {tabCounts[tab.value]}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </RowStack>

            <AppSearchField
              name="search"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              boxProps={{ sx: { width: '280px' } }}
            />
          </RowStack>
        </AppGridtable>
      </Stack>

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedTicket(null);
        }}
        data={selectedTicket}
      />
    </AppDashboardLayout>
  );
};
