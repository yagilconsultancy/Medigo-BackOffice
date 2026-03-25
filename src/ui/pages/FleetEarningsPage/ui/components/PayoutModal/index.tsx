import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

export type EarningsRow = {
  id: string;
  fleet: string;
  initials: string;
  color: string;
  drivers: number;
  trips: string;
  grossRevenue: string;
  commission: string;
  netPayout: string;
  share: number;
};

type PayoutModalProps = {
  open: boolean;
  onClose: () => void;
  fleet: EarningsRow | null;
  onConfirm: (fleet: EarningsRow) => void;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const PayoutModal = ({
  open,
  onClose,
  fleet,
  onConfirm,
}: PayoutModalProps) => {
  if (!fleet) return null;

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="payout-modal"
      sx={{
        '& .MuiDialog-paper': {
          width: '440px',
          maxWidth: '440px',
          borderRadius: '16px',
          boxShadow: '0px 24px 64px 0px rgba(0, 0, 0, 0.18)',
          overflow: 'visible',
        },
      }}
    >
      <Stack>
        {/* Blue Header */}
        <Stack
          sx={{
            background:
              'linear-gradient(135deg, rgba(47, 111, 237, 1) 0%, rgba(47, 111, 237, 0.8) 100%)',
            // padding: '20px 24px',
            position: 'relative',
          }}
        >
          <RowStack spacing={'12px'}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 800,
                  fontSize: pxToRem(15),
                  color: '#FFFFFF',
                }}
              >
                {fleet.initials}
              </Typography>
            </Box>
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  lineHeight: '1.5em',
                  color: '#FFFFFF',
                }}
              >
                {fleet.fleet}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  lineHeight: '1.5em',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                March 2026 Payout
              </Typography>
            </Stack>
          </RowStack>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 28,
              height: 28,
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <CloseIcon sx={{ fontSize: 13, color: '#FFFFFF' }} />
          </IconButton>
        </Stack>

        {/* Content */}
        <Stack spacing={'16px'} sx={{ padding: '20px 24px' }}>
          {/* Breakdown Table */}
          <Stack
            sx={{
              border: '0.67px solid #EAECF0',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <BreakdownRow
              label="Gross Revenue"
              value={fleet.grossRevenue}
              valueColor="#111827"
              bg="#FAFAFA"
            />
            <BreakdownRow
              label="MediGo Commission"
              value={fleet.commission}
              valueColor="#EF4444"
              bg="#FFFFFF"
            />
            <BreakdownRow
              label="Net Payout Amount"
              value={fleet.netPayout}
              valueColor="#10B981"
              valueBold
              bg="#F0FDF4"
            />
          </Stack>

          {/* Confirmation Text */}
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              lineHeight: '1.6em',
              color: '#6B7280',
            }}
          >
            Confirm the net payout of {fleet.netPayout} to {fleet.fleet} for
            March 2026. This will be recorded as a completed transaction.
          </Typography>

          {/* Footer Buttons */}
          <RowStack spacing={'12px'}>
            <Box
              onClick={onClose}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '41px',
                background: '#F7F9FB',
                border: '0.67px solid #E8ECF0',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
                '&:hover': { opacity: 0.85 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: '#374151',
                }}
              >
                Cancel
              </Typography>
            </Box>
            <Box
              onClick={() => onConfirm(fleet)}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                height: '41px',
                background: '#10B981',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
                '&:hover': { opacity: 0.9 },
              }}
            >
              <CheckOutlinedIcon
                sx={{ fontSize: 14, color: '#FFFFFF' }}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: '#FFFFFF',
                }}
              >
                Confirm Payout {fleet.netPayout}
              </Typography>
            </Box>
          </RowStack>
        </Stack>
      </Stack>
    </AppModal>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const BreakdownRow = ({
  label,
  value,
  valueColor,
  valueBold,
  bg,
}: {
  label: string;
  value: string;
  valueColor: string;
  valueBold?: boolean;
  bg: string;
}) => (
  <RowStack
    sx={{
      justifyContent: 'space-between',
      padding: '0 16px',
      height: '45px',
      background: bg,
      borderBottom: '0.67px solid #F3F4F6',
      '&:last-child': { borderBottom: 'none' },
    }}
  >
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
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: valueBold ? 700 : 500,
        fontSize: valueBold ? pxToRem(15) : pxToRem(13),
        color: valueColor,
      }}
    >
      {value}
    </Typography>
  </RowStack>
);
