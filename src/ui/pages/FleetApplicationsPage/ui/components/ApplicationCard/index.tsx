import { Box, IconButton, Stack, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'More Info Required';

export type FleetApplicationRow = {
  id: string;
  appId: string;
  companyName: string;
  fleetSize: number;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  submittedDate: string;
  status: ApplicationStatus;
  message: string;
  documents: string[];
};

// ─── Status Badge Config ────────────────────────────────────────────────────

const statusConfig: Record<
  ApplicationStatus,
  { color: string; bg: string; dotColor: string }
> = {
  Pending: { color: '#D97706', bg: '#FFFBEB', dotColor: '#F59E0B' },
  Approved: { color: '#059669', bg: '#ECFDF5', dotColor: '#10B981' },
  Rejected: { color: '#EF4444', bg: '#FEF2F2', dotColor: '#EF4444' },
  'More Info Required': {
    color: '#2F6FED',
    bg: '#EBF2FF',
    dotColor: '#2F6FED',
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

type ApplicationCardProps = {
  application: FleetApplicationRow;
  onClick: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRequestDocs: () => void;
};

export const ApplicationCard = ({
  application,
  onClick,
  onApprove,
  onReject,
  onRequestDocs,
}: ApplicationCardProps) => {
  const badge = statusConfig[application.status];

  return (
    <Stack
      spacing={'14px'}
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px',
        border: '0.67px solid #F0F4F8',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: '#E2E8F0',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        },
      }}
    >
      {/* Header: Icon + Name + App ID + Status Badge + Action Icons */}
      <RowStack justifyContent="space-between">
        <RowStack spacing={'12px'}>
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
            <DescriptionOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
          </Box>
          <Stack spacing={'2px'}>
            <RowStack spacing={'10px'} alignItems="center">
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(14),
                  lineHeight: '1.3em',
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
                  background: badge.bg,
                  borderRadius: '100px',
                  padding: '2px 10px',
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: badge.dotColor,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(11),
                    lineHeight: '1.5em',
                    color: badge.color,
                  }}
                >
                  {application.status}
                </Typography>
              </Box>
            </RowStack>
            {/* Contact Info Line */}
            <RowStack spacing={'6px'} sx={{ flexWrap: 'wrap' }}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                {application.contactPerson}
              </Typography>
              <Dot />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                {application.contactEmail}
              </Typography>
              <Box sx={{ width: '16px' }} />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                {application.city}
              </Typography>
              <Box sx={{ width: '16px' }} />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                {application.fleetSize} vehicles
              </Typography>
              <Box sx={{ width: '16px' }} />
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
          </Stack>
        </RowStack>

        {/* Action Icons */}
        <RowStack spacing={'4px'}>
          <ActionIcon
            icon={
              <VisibilityOutlinedIcon sx={{ fontSize: 15, color: '#9CA3AF' }} />
            }
            onClick={onClick}
          />
          {application.status !== 'Approved' && (
            <ActionIcon
              icon={
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 15, color: '#9CA3AF' }}
                />
              }
              onClick={(e) => {
                e.stopPropagation();
                onApprove();
              }}
            />
          )}
          {application.status !== 'Rejected' && (
            <ActionIcon
              icon={
                <CancelOutlinedIcon sx={{ fontSize: 15, color: '#9CA3AF' }} />
              }
              onClick={(e) => {
                e.stopPropagation();
                onReject();
              }}
            />
          )}
          {application.status === 'Pending' && (
            <ActionIcon
              icon={
                <FolderOpenOutlinedIcon
                  sx={{ fontSize: 15, color: '#9CA3AF' }}
                />
              }
              onClick={(e) => {
                e.stopPropagation();
                onRequestDocs();
              }}
            />
          )}
        </RowStack>
      </RowStack>

      {/* Application Message */}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(13),
          lineHeight: '1.65em',
          color: '#4B5563',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {application.message}
      </Typography>

      {/* Document Chips */}
      <RowStack spacing={'8px'} alignItems="center">
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(11),
            color: '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Docs:
        </Typography>
        {application.documents.map((doc) => (
          <RowStack
            key={doc}
            spacing={'6px'}
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              borderRadius: '10px',
              padding: '5px 10px',
            }}
          >
            <DescriptionOutlinedIcon sx={{ fontSize: 12, color: '#2F6FED' }} />
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
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const Dot = () => (
  <Box
    sx={{
      width: 3,
      height: 3,
      borderRadius: '50%',
      background: '#D1D5DB',
      flexShrink: 0,
    }}
  />
);

const ActionIcon = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <IconButton
    onClick={onClick}
    sx={{
      width: 30,
      height: 30,
      borderRadius: '8px',
      border: '0.67px solid #E8ECF0',
      background: '#FFFFFF',
      '&:hover': {
        background: '#F7F9FB',
      },
    }}
  >
    {icon}
  </IconButton>
);
