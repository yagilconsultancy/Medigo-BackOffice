'use client';

import { alpha, Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type DisputeStatus = 'Under Review' | 'Approved' | 'Rejected';
type IssueType = 'Fare Dispute' | 'Refund Request' | 'Trip Fraud';

type DisputeViewModalProps = {
  open: boolean;
  onClose: () => void;
  data: {
    disputeId: string;
    issueType: IssueType;
    status: DisputeStatus;
    userName: string;
    driver: string;
    tripId: string;
    billed: string;
    claimed: string;
    date: string;
    description: string;
  } | null;
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const statusColors: Record<DisputeStatus, string> = {
  'Under Review': '#D97706',
  Approved: '#059669',
  Rejected: '#EF4444',
};

const statusIcons: Record<DisputeStatus, React.ReactNode> = {
  'Under Review': (
    <ErrorOutlineOutlinedIcon sx={{ fontSize: 13, color: '#D97706' }} />
  ),
  Approved: (
    <CheckCircleOutlineIcon sx={{ fontSize: 13, color: '#059669' }} />
  ),
  Rejected: (
    <CancelOutlinedIcon sx={{ fontSize: 13, color: '#EF4444' }} />
  ),
};

const issueTypeColors: Record<IssueType, { bg: string; color: string }> = {
  'Fare Dispute': { bg: '#FFFBEB', color: '#D97706' },
  'Refund Request': { bg: '#EBF2FF', color: '#2F6FED' },
  'Trip Fraud': { bg: '#FEF2F2', color: '#EF4444' },
};

// ─── Info Row ───────────────────────────────────────────────────────────────

const InfoRow = ({
  icon,
  label,
  value,
  valueBold,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueBold?: boolean;
}) => (
  <RowStack
    justifyContent={'space-between'}
    sx={{
      padding: '10px 14px',
      borderBottom: '0.67px solid #F0F4F8',
    }}
  >
    <RowStack spacing={'8px'}>
      {icon}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(13),
          color: '#6B7280',
        }}
      >
        {label}
      </Typography>
    </RowStack>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: valueBold ? 700 : 500,
        fontSize: pxToRem(13),
        color: '#111827',
      }}
    >
      {value}
    </Typography>
  </RowStack>
);

// ─── Component ──────────────────────────────────────────────────────────────

export const DisputeViewModal = ({
  open,
  onClose,
  data,
}: DisputeViewModalProps) => {
  if (!data) return null;

  const sColor = statusColors[data.status];
  const tColor = issueTypeColors[data.issueType];

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="dispute-view-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: 420,
          maxWidth: 420,
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
            padding: '16px 20px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <RowStack spacing={'10px'}>
            {/* Dollar Icon */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AttachMoneyOutlinedIcon
                sx={{ fontSize: 18, color: '#059669' }}
              />
            </Box>

            <Stack spacing={'4px'}>
              {/* Row 1: ID + Issue Type Chip */}
              <RowStack spacing={'8px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(14),
                    color: '#111827',
                  }}
                >
                  {data.disputeId}
                </Typography>
                <Chip
                  label={data.issueType}
                  size="small"
                  sx={{
                    background: tColor.bg,
                    color: tColor.color,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: pxToRem(10.5),
                    height: '20px',
                    borderRadius: '100px',
                  }}
                />
              </RowStack>

              {/* Row 2: Status Chip */}
              <Chip
                icon={statusIcons[data.status] as React.ReactElement}
                label={data.status}
                size="small"
                sx={{
                  background: alpha(sColor, 0.1),
                  color: sColor,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: pxToRem(10.5),
                  height: '20px',
                  borderRadius: '100px',
                  width: 'fit-content',
                  '& .MuiChip-icon': {
                    color: sColor,
                    marginLeft: '6px',
                    marginRight: '-2px',
                  },
                }}
              />
            </Stack>
          </RowStack>

          <IconButton
            onClick={onClose}
            sx={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              flexShrink: 0,
              alignSelf: 'flex-start',
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* ── Info Rows ────────────────────────────────────────────────── */}
        <Stack sx={{ padding: '8px 0' }}>
          <InfoRow
            icon={
              <PersonOutlineOutlinedIcon
                sx={{ fontSize: 16, color: '#9CA3AF' }}
              />
            }
            label="Rider"
            value={data.userName}
            valueBold
          />
          <InfoRow
            icon={
              <DirectionsCarOutlinedIcon
                sx={{ fontSize: 16, color: '#9CA3AF' }}
              />
            }
            label="Driver"
            value={data.driver}
            valueBold
          />
          <InfoRow
            icon={
              <ConfirmationNumberOutlinedIcon
                sx={{ fontSize: 16, color: '#9CA3AF' }}
              />
            }
            label="Trip ID"
            value={data.tripId}
            valueBold
          />
          <InfoRow
            icon={
              <AttachMoneyOutlinedIcon
                sx={{ fontSize: 16, color: '#9CA3AF' }}
              />
            }
            label="Billed Amount"
            value={data.billed}
            valueBold
          />
          <InfoRow
            icon={
              <AttachMoneyOutlinedIcon
                sx={{ fontSize: 16, color: '#9CA3AF' }}
              />
            }
            label="Claimed Amount"
            value={data.claimed}
            valueBold
          />
          <InfoRow
            icon={
              <CalendarTodayOutlinedIcon
                sx={{ fontSize: 16, color: '#9CA3AF' }}
              />
            }
            label="Date"
            value={data.date}
          />
        </Stack>

        {/* ── Issue Description ────────────────────────────────────────── */}
        <Stack spacing={'8px'} sx={{ padding: '12px 20px 20px 20px' }}>
          <RowStack spacing={'6px'}>
            <DescriptionOutlinedIcon
              sx={{ fontSize: 15, color: '#9CA3AF' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: '#6B7280',
              }}
            >
              Issue Description
            </Typography>
          </RowStack>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              color: '#374151',
              lineHeight: '1.6em',
            }}
          >
            {data.description}
          </Typography>
        </Stack>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <RowStack
          justifyContent={'flex-end'}
          sx={{
            padding: '12px 20px',
            borderTop: '0.67px solid #F0F4F8',
          }}
        >
          <Box
            onClick={onClose}
            sx={{
              height: 36,
              padding: '0 20px',
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
        </RowStack>
      </Stack>
    </AppModal>
  );
};
