'use client';

import { useState } from 'react';
import { alpha, Box, Chip, IconButton, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type TicketStatus = 'Open' | 'Under Review' | 'Resolved';
type TicketPriority = 'High' | 'Medium' | 'Low';
type TicketType = 'Rider Complaint' | 'Ride Dispute' | 'Driver Complaint';

type TicketDetailModalProps = {
  open: boolean;
  onClose: () => void;
  data: {
    ticketId: string;
    type: TicketType;
    subject: string;
    rider: string;
    driver: string;
    priority: TicketPriority;
    date: string;
    status: TicketStatus;
  } | null;
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const statusColors: Record<TicketStatus, string> = {
  Open: '#D97706',
  'Under Review': '#6366F1',
  Resolved: '#059669',
};

const priorityColors: Record<TicketPriority, string> = {
  High: '#EF4444',
  Medium: '#D97706',
  Low: '#059669',
};

const typeColors: Record<TicketType, { bg: string; color: string }> = {
  'Rider Complaint': { bg: '#EBF2FF', color: '#2F6FED' },
  'Ride Dispute': { bg: '#FFF7ED', color: '#EA580C' },
  'Driver Complaint': { bg: '#EEF2FF', color: '#6366F1' },
};

// ─── Info Row ───────────────────────────────────────────────────────────────

const InfoRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <RowStack
    justifyContent={'space-between'}
    sx={{
      padding: '10px 14px',
      borderRadius: '10px',
      background: '#F7F9FB',
    }}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(13),
        color: '#6B7280',
      }}
    >
      {label}
    </Typography>
    {children}
  </RowStack>
);

// ─── Component ──────────────────────────────────────────────────────────────

export const TicketDetailModal = ({
  open,
  onClose,
  data,
}: TicketDetailModalProps) => {
  const [adminResponse, setAdminResponse] = useState('');

  if (!data) return null;

  const sColor = statusColors[data.status];
  const pColor = priorityColors[data.priority];
  const tColor = typeColors[data.type];

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="ticket-detail-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: 480,
          maxWidth: 480,
          borderRadius: '20px',
          boxShadow: '0px 32px 80px 0px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
        },
      }}
    >
      <Stack>
        {/* ── Header ───────────────────────────────────────────────────── */}
        <RowStack
          justifyContent={'space-between'}
          sx={{
            padding: '20px 24px',
            background: '#2F6FED',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <RowStack spacing={'12px'}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: '#2F6FED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ConfirmationNumberOutlinedIcon
                sx={{ fontSize: 18, color: '#F0F4F8' }}
              />
            </Box>
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#FFFFFFB2',
                }}
              >
                {data.ticketId}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  color: '#ffffff',
                }}
              >
                {data.subject}
              </Typography>
            </Stack>
          </RowStack>

          <IconButton
            onClick={onClose}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <Stack spacing={'8px'} sx={{ padding: '20px 24px' }}>
          {/* Type */}
          <InfoRow label="Type">
            <Chip
              label={data.type}
              size="small"
              sx={{
                background: tColor.bg,
                color: tColor.color,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(11),
                height: '24px',
                borderRadius: '100px',
              }}
            />
          </InfoRow>

          {/* Category */}
          <InfoRow label="Category">
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#111827',
              }}
            >
              No-show
            </Typography>
          </InfoRow>

          {/* Rider */}
          <InfoRow label="Rider">
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#111827',
              }}
            >
              {data.rider}
            </Typography>
          </InfoRow>

          {/* Driver */}
          <InfoRow label="Driver">
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#111827',
              }}
            >
              {data.driver}
            </Typography>
          </InfoRow>

          {/* Priority */}
          <InfoRow label="Priority">
            <RowStack spacing={'6px'}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: pColor,
                }}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: pColor,
                }}
              >
                {data.priority}
              </Typography>
            </RowStack>
          </InfoRow>

          {/* Filed On */}
          <InfoRow label="Filed On">
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(13),
                color: '#374151',
              }}
            >
              {data.date}
            </Typography>
          </InfoRow>

          {/* Status */}
          <InfoRow label="Status">
            <RowStack
              spacing={'5px'}
              sx={{
                padding: '3px 10px',
                borderRadius: '100px',
                background: alpha(sColor, 0.1),
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '3px',
                  background: sColor,
                }}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(11),
                  color: sColor,
                }}
              >
                {data.status}
              </Typography>
            </RowStack>
          </InfoRow>
        </Stack>

        {/* ── Admin Response ───────────────────────────────────────────── */}
        <Stack spacing={'10px'} sx={{ padding: '0 24px 20px 24px' }}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(10),
              letterSpacing: '0.08em',
              color: '#9CA3AF',
              textTransform: 'uppercase',
            }}
          >
            Admin Response
          </Typography>
          <TextField
            multiline
            rows={3}
            placeholder="Write a response or resolution note..."
            value={adminResponse}
            onChange={(e) => setAdminResponse(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: pxToRem(13),
                background: '#F7F9FB',
                '& fieldset': {
                  borderColor: '#E8ECF0',
                  borderWidth: '0.67px',
                },
                '&:hover fieldset': {
                  borderColor: '#D1D5DB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2F6FED',
                  borderWidth: '1px',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#9CA3AF',
                opacity: 1,
              },
            }}
          />
        </Stack>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <RowStack
          spacing={'12px'}
          sx={{
            padding: '16px 24px',
            borderTop: '0.67px solid #F0F4F8',
          }}
        >
          <Box
            onClick={onClose}
            sx={{
              flex: 1,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              cursor: 'pointer',
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#374151',
              }}
            >
              Close
            </Typography>
          </Box>

          <Box
            onClick={() => {
              // Mark resolved action
              onClose();
            }}
            sx={{
              flex: 1,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              borderRadius: '10px',
              background: '#2F6FED',
              boxShadow: '0px 2px 8px 0px rgba(47, 111, 237, 0.25)',
              cursor: 'pointer',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 16, color: '#FFFFFF' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#FFFFFF',
              }}
            >
              Mark Resolved
            </Typography>
          </Box>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
