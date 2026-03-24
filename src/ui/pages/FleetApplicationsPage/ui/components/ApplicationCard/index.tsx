'use client';

import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | 'Pending'
  | 'Approved'
  | 'More Info Required'
  | 'Rejected';

export type FleetApplication = {
  id: string;
  appId: string;
  companyName: string;
  status: ApplicationStatus;
  contactName: string;
  contactEmail: string;
  location: string;
  vehicleCount: number;
  submittedDate: string;
  description: string;
  documents: string[];
};

// ─── Status Config ──────────────────────────────────────────────────────────

const statusConfig: Record<ApplicationStatus, { color: string; bg: string }> = {
  Pending: { color: '#D97706', bg: '#FFFBEB' },
  Approved: { color: '#059669', bg: '#ECFDF5' },
  'More Info Required': { color: '#6366F1', bg: '#EEF2FF' },
  Rejected: { color: '#EF4444', bg: '#FEF2F2' },
};

// ─── Component ──────────────────────────────────────────────────────────────

type ApplicationCardProps = {
  application: FleetApplication;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRequestDocs?: (id: string) => void;
  onView?: (id: string) => void;
};

export const ApplicationCard = ({
  application,
  onApprove,
  onReject,
  onRequestDocs,
  onView,
}: ApplicationCardProps) => {
  const status = statusConfig[application.status];
  const isPending = application.status === 'Pending';

  return (
    <Stack
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '0.67px solid #F0F4F8',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        padding: '18px 20px',
      }}
    >
      <RowStack justifyContent="space-between" alignItems="flex-start">
        {/* Left: Icon + Content */}
        <RowStack spacing={'14px'} alignItems="flex-start" sx={{ flex: 1 }}>
          {/* Building Icon */}
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              background: '#EBF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BusinessOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
          </Box>

          {/* Content */}
          <Stack spacing={'6px'} sx={{ flex: 1 }}>
            {/* Row 1: Name + App ID + Status */}
            <RowStack spacing={'10px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(14),
                  color: '#111827',
                }}
              >
                {application.companyName}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(11),
                  color: '#9CA3AF',
                }}
              >
                {application.appId}
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: status.bg,
                  borderRadius: '100px',
                  padding: '2px 10px 2px 7px',
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    border: `1.5px solid ${status.color}`,
                    background: 'transparent',
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(11),
                    color: status.color,
                  }}
                >
                  {application.status}
                </Typography>
              </Box>
            </RowStack>

            {/* Row 2: Contact · Location · Vehicles · Date */}
            <RowStack spacing={'16px'} flexWrap="wrap">
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                {application.contactName} · {application.contactEmail}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                {application.location}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                {application.vehicleCount} vehicles
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#9CA3AF',
                }}
              >
                Submitted {application.submittedDate}
              </Typography>
            </RowStack>

            {/* Row 3: Description */}
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#4B5563',
                lineHeight: 1.5,
              }}
            >
              {application.description}
            </Typography>

            {/* Row 4: Documents */}
            <RowStack spacing={'8px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(10.5),
                  color: '#9CA3AF',
                }}
              >
                DOCS:
              </Typography>
              {application.documents.map((doc) => (
                <RowStack
                  key={doc}
                  spacing={'4px'}
                  sx={{
                    background: '#F7F9FB',
                    border: '0.67px solid #E8ECF0',
                    borderRadius: '100px',
                    padding: '2px 10px 2px 7px',
                  }}
                >
                  <LockOutlinedIcon
                    sx={{ fontSize: 10, color: '#6B7280' }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 500,
                      fontSize: pxToRem(11),
                      color: '#374151',
                    }}
                  >
                    {doc}
                  </Typography>
                </RowStack>
              ))}
            </RowStack>
          </Stack>
        </RowStack>

        {/* Right: Action Buttons */}
        <RowStack spacing={'2px'}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => onView?.(application.id)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '7px',
                '&:hover': { background: '#F7F9FB' },
              }}
            >
              <VisibilityOutlinedIcon
                sx={{ fontSize: 15, color: '#6B7280' }}
              />
            </IconButton>
          </Tooltip>
          {isPending && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  size="small"
                  onClick={() => onApprove?.(application.id)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '7px',
                    '&:hover': { background: '#ECFDF5' },
                  }}
                >
                  <CheckCircleOutlinedIcon
                    sx={{ fontSize: 15, color: '#059669' }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  size="small"
                  onClick={() => onReject?.(application.id)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '7px',
                    '&:hover': { background: '#FEF2F2' },
                  }}
                >
                  <CancelOutlinedIcon
                    sx={{ fontSize: 15, color: '#EF4444' }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Request Documents">
                <IconButton
                  size="small"
                  onClick={() => onRequestDocs?.(application.id)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '7px',
                    '&:hover': { background: '#F7F9FB' },
                  }}
                >
                  <DescriptionOutlinedIcon
                    sx={{ fontSize: 15, color: '#6B7280' }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Files">
                <IconButton
                  size="small"
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '7px',
                    '&:hover': { background: '#F7F9FB' },
                  }}
                >
                  <FolderOutlinedIcon
                    sx={{ fontSize: 15, color: '#6B7280' }}
                  />
                </IconButton>
              </Tooltip>
            </>
          )}
        </RowStack>
      </RowStack>
    </Stack>
  );
};
