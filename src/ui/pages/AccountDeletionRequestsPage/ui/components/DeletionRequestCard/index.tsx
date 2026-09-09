import { Box, IconButton, Stack, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { AccountDeletionStatus } from '../../../../../../common/types';

// ─── Types ──────────────────────────────────────────────────────────────────

export type DeletionRequestRow = {
  id: string;
  reference: string;
  status: AccountDeletionStatus;
  /** What the requester typed into the public form. */
  submittedName: string;
  submittedEmail: string;
  submittedPhone: string;
  reason: string;
  submittedDate: string;
  verifiedDate: string;
  /** What the linked MediGo account actually holds. */
  accountName: string;
  accountEmail: string;
  accountPhone: string;
  accountRole: string;
  accountCreated: string;
  accountDeleted: string;
  reviewerName: string;
  reviewedDate: string;
  rejectionReason: string;
};

// ─── Status Badge Config ────────────────────────────────────────────────────

const statusConfig: Record<
  AccountDeletionStatus,
  { label: string; color: string; bg: string; dotColor: string }
> = {
  pending_verification: {
    label: 'Awaiting Email Verification',
    color: '#9CA3AF',
    bg: '#F7F9FB',
    dotColor: '#9CA3AF',
  },
  pending_review: {
    label: 'Verified · Pending Review',
    color: '#D97706',
    bg: '#FFFBEB',
    dotColor: '#F59E0B',
  },
  approved: {
    label: 'Approved · Account Deleted',
    color: '#059669',
    bg: '#ECFDF5',
    dotColor: '#10B981',
  },
  rejected: {
    label: 'Rejected',
    color: '#EF4444',
    bg: '#FEF2F2',
    dotColor: '#EF4444',
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

type DeletionRequestCardProps = {
  request: DeletionRequestRow;
  onApprove: () => void;
  onReject: () => void;
};

export const DeletionRequestCard = ({
  request,
  onApprove,
  onReject,
}: DeletionRequestCardProps) => {
  const badge = statusConfig[request.status];
  const canAction = request.status === 'pending_review';

  // The admin's actual job: confirm the person who filled the form is the
  // person who owns the account. Anything that disagrees gets flagged.
  const emailMismatch =
    Boolean(request.accountEmail) &&
    request.submittedEmail.toLowerCase() !== request.accountEmail.toLowerCase();
  const phoneMismatch =
    Boolean(request.submittedPhone) &&
    Boolean(request.accountPhone) &&
    normalisePhone(request.submittedPhone) !==
      normalisePhone(request.accountPhone);
  const nameMismatch =
    Boolean(request.accountName) &&
    request.submittedName.trim().toLowerCase() !==
      request.accountName.trim().toLowerCase();

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
      {/* Header */}
      <RowStack justifyContent="space-between" alignItems="flex-start">
        <RowStack spacing={'12px'} alignItems="flex-start">
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              background: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: 18, color: '#EF4444' }} />
          </Box>

          <Stack spacing={'4px'}>
            <RowStack spacing={'10px'} alignItems="center" flexWrap="wrap">
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(14),
                  lineHeight: '1.3em',
                  color: '#111827',
                }}
              >
                {request.submittedName}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(11),
                  color: '#9CA3AF',
                }}
              >
                {request.reference}
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
                  {badge.label}
                </Typography>
              </Box>
            </RowStack>

            <RowStack spacing={'6px'} sx={{ flexWrap: 'wrap' }}>
              <MetaText>{request.submittedEmail}</MetaText>
              {request.submittedPhone ? (
                <>
                  <Dot />
                  <MetaText>{request.submittedPhone}</MetaText>
                </>
              ) : null}
              <Dot />
              <MetaText muted>Submitted {request.submittedDate}</MetaText>
              {request.verifiedDate ? (
                <>
                  <Dot />
                  <RowStack spacing={'4px'}>
                    <VerifiedOutlinedIcon
                      sx={{ fontSize: 13, color: '#10B981' }}
                    />
                    <MetaText muted>
                      Email verified {request.verifiedDate}
                    </MetaText>
                  </RowStack>
                </>
              ) : null}
            </RowStack>
          </Stack>
        </RowStack>

        {canAction ? (
          <RowStack spacing={'4px'}>
            <ActionIcon
              title="Approve and delete this account"
              icon={
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 15, color: '#059669' }}
                />
              }
              onClick={(e) => {
                e.stopPropagation();
                onApprove();
              }}
            />
            <ActionIcon
              title="Reject this request"
              icon={
                <CancelOutlinedIcon sx={{ fontSize: 15, color: '#EF4444' }} />
              }
              onClick={(e) => {
                e.stopPropagation();
                onReject();
              }}
            />
          </RowStack>
        ) : null}
      </RowStack>

      {/* Account being deleted — the details to verify against */}
      <Box
        sx={{
          background: '#F7F9FB',
          border: '0.67px solid #E8ECF0',
          borderRadius: '12px',
          padding: '14px 16px',
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(10.5),
            color: '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            mb: '10px',
          }}
        >
          Matched MediGo Account
        </Typography>

        <RowStack spacing={'28px'} sx={{ flexWrap: 'wrap', rowGap: '10px' }}>
          <Field label="Name" value={request.accountName} flag={nameMismatch} />
          <Field
            label="Email"
            value={request.accountEmail}
            flag={emailMismatch}
          />
          <Field
            label="Phone"
            value={request.accountPhone || '—'}
            flag={phoneMismatch}
          />
          <Field label="Role" value={request.accountRole} />
          <Field label="Member since" value={request.accountCreated} />
          {request.accountDeleted ? (
            <Field label="Deleted" value={request.accountDeleted} />
          ) : null}
        </RowStack>

        {(nameMismatch || emailMismatch || phoneMismatch) && canAction ? (
          <RowStack
            spacing={'6px'}
            alignItems="flex-start"
            sx={{ mt: '12px' }}
          >
            <WarningAmberRoundedIcon
              sx={{ fontSize: 14, color: '#D97706', mt: '1px' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(11.5),
                lineHeight: '1.5em',
                color: '#B45309',
              }}
            >
              Details entered on the form do not match the account exactly.
              Confirm the requester&apos;s identity before approving.
            </Typography>
          </RowStack>
        ) : null}
      </Box>

      {request.reason ? (
        <Stack spacing={'4px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(10.5),
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Reason given
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              lineHeight: '1.65em',
              color: '#4B5563',
            }}
          >
            {request.reason}
          </Typography>
        </Stack>
      ) : null}

      {request.status === 'rejected' && request.rejectionReason ? (
        <Stack spacing={'4px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(10.5),
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Rejected reason
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              lineHeight: '1.65em',
              color: '#4B5563',
            }}
          >
            {request.rejectionReason}
          </Typography>
        </Stack>
      ) : null}

      {request.reviewedDate ? (
        <MetaText muted>
          Reviewed {request.reviewedDate}
          {request.reviewerName ? ` by ${request.reviewerName}` : ''}
        </MetaText>
      ) : null}
    </Stack>
  );
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Compare digits only — formatting differences are not real mismatches. */
const normalisePhone = (value: string) => value.replace(/\D/g, '');

const MetaText = ({
  children,
  muted,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 400,
      fontSize: pxToRem(12),
      color: muted ? '#9CA3AF' : '#6B7280',
    }}
  >
    {children}
  </Typography>
);

const Field = ({
  label,
  value,
  flag,
}: {
  label: string;
  value: string;
  flag?: boolean;
}) => (
  <Stack spacing={'2px'}>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(10.5),
        color: '#9CA3AF',
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(12.5),
        color: flag ? '#B45309' : '#374151',
      }}
    >
      {value || '—'}
    </Typography>
  </Stack>
);

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
  title,
}: {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title: string;
}) => (
  <IconButton
    onClick={onClick}
    title={title}
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
