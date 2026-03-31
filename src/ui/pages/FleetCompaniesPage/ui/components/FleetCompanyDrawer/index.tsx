import { useRouter } from 'next/navigation';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { FleetCompanyStatus } from '../FleetStatusChip';

// ─── Types ──────────────────────────────────────────────────────────────────

export type FleetCompanyRow = {
  id: string;
  fleetId: string;
  companyName: string;
  initials: string;
  color: string;
  contactPerson: string;
  contactEmail: string;
  city: string;
  vehicles: number;
  drivers: number;
  revenue: string;
  status: FleetCompanyStatus;
  joinedDate: string;
};

// ─── Status Button Config ───────────────────────────────────────────────────

const statusButtonConfig: Record<
  FleetCompanyStatus,
  { activeBg: string; activeBorder: string; activeColor: string }
> = {
  Active: {
    activeBg: '#EAFFEA',
    activeBorder: '#1CB71C',
    activeColor: '#1CB71C',
  },
  Suspended: {
    activeBg: '#FEF2F2',
    activeBorder: '#EF4444',
    activeColor: '#EF4444',
  },
  Pending: {
    activeBg: '#FFFBEB',
    activeBorder: '#D97706',
    activeColor: '#D97706',
  },
};

const statusOptions: FleetCompanyStatus[] = ['Active', 'Suspended', 'Pending'];

// ─── Component ──────────────────────────────────────────────────────────────

type FleetCompanyDrawerProps = {
  open: boolean;
  onClose: () => void;
  company: FleetCompanyRow | null;
  onStatusChange?: (
    company: FleetCompanyRow,
    newStatus: FleetCompanyStatus
  ) => void;
};

export const FleetCompanyDrawer = ({
  open,
  onClose,
  company,
  onStatusChange,
}: FleetCompanyDrawerProps) => {
  const router = useRouter();

  if (!company) return null;

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="fleet-company-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: '520px',
          maxHeight: '90vh',
          borderRadius: '16px',
          boxShadow: '0px 24px 64px 0px rgba(0, 0, 0, 0.14)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack>
        {/* Header */}
        <RowStack
          justifyContent="space-between"
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F2F5',
          }}
        >
          <RowStack spacing={'14px'}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '10px',
                background: '#F8FAFC',
                border: '0.67px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: pxToRem(14),
                  letterSpacing: '-0.03em',
                  color: '#111827',
                }}
              >
                {company.initials}
              </Typography>
            </Box>
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  lineHeight: '1.3em',
                  color: '#0F172A',
                }}
              >
                {company.companyName}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  lineHeight: '1.5em',
                  color: '#94A3B8',
                }}
              >
                {company.fleetId}
              </Typography>
            </Stack>
          </RowStack>
          <IconButton
            onClick={onClose}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '7px',
              border: '0.67px solid #E5E7EB',
            }}
          >
            <CloseIcon sx={{ fontSize: 13, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* Stats Row */}
        <RowStack
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F2F5',
          }}
        >
          <StatColumn
            value={String(company.vehicles)}
            label="Vehicles"
            hasBorder
          />
          <StatColumn
            value={String(company.drivers)}
            label="Drivers"
            hasBorder
          />
          <StatColumn value={company.revenue} label="Revenue" />
        </RowStack>

        {/* Contact Section */}
        <Stack
          sx={{ padding: '24px 24px', borderBottom: '0.67px solid #F0F2F5' }}
        >
          <SectionLabel>CONTACT</SectionLabel>
          <Stack sx={{ marginTop: '14px' }}>
            <ContactRow label="Contact Person" value={company.contactPerson} />
            <ContactRow label="Email Address" value={company.contactEmail} />
            <ContactRow label="City" value={company.city} />
            <ContactRow
              label="Member Since"
              value={company.joinedDate}
              noBorder
            />
          </Stack>
        </Stack>

        {/* Status Section */}
        <Stack
          spacing={'14px'}
          sx={{ padding: '16px 24px', borderBottom: '0.67px solid #F0F2F5' }}
        >
          <SectionLabel>STATUS</SectionLabel>
          <RowStack spacing={'8px'}>
            {statusOptions.map((status) => {
              const isActive = company.status === status;
              const config = statusButtonConfig[status];
              return (
                <Box
                  key={status}
                  onClick={() => onStatusChange?.(company, status)}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '36px',
                    background: isActive ? config.activeBg : '#FFFFFF',
                    border: `0.67px solid ${isActive ? config.activeBorder : '#E5E7EB'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': { opacity: 0.85 },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(12.5),
                      lineHeight: '1.5em',
                      color: isActive ? config.activeColor : '#6B7280',
                      textAlign: 'center',
                    }}
                  >
                    {status}
                  </Typography>
                </Box>
              );
            })}
          </RowStack>
        </Stack>

        {/* Footer Buttons */}
        <Stack spacing={'8px'} sx={{ padding: '20px 24px' }}>
          <Box
            onClick={() => {
              onClose();
              router.push('/fleet/profiles');
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '41.5px',
              background: '#2F6FED',
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
                letterSpacing: '0.008em',
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              View Full Profile
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '42.83px',
              background: '#FFFFFF',
              border: '0.67px solid #E5E7EB',
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
                letterSpacing: '0.008em',
                color: '#374151',
                textAlign: 'center',
              }}
            >
              Fleet Earnings
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </AppModal>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: pxToRem(10),
      lineHeight: '1.5em',
      letterSpacing: '0.1em',
      color: '#94A3B8',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </Typography>
);

const StatColumn = ({
  value,
  label,
  hasBorder,
}: {
  value: string;
  label: string;
  hasBorder?: boolean;
}) => (
  <Stack
    spacing={'5px'}
    sx={{
      flex: 1,
      paddingRight: hasBorder ? '20px' : 0,
      borderRight: hasBorder ? '0.67px solid #F0F2F5' : 'none',
      paddingLeft: hasBorder ? 0 : '20px',
    }}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(22),
        lineHeight: '1em',
        letterSpacing: '-0.02em',
        color: '#0F172A',
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(11.5),
        lineHeight: '1.5em',
        color: '#94A3B8',
      }}
    >
      {label}
    </Typography>
  </Stack>
);

const ContactRow = ({
  label,
  value,
  noBorder,
}: {
  label: string;
  value: string;
  noBorder?: boolean;
}) => (
  <RowStack
    justifyContent="space-between"
    sx={{
      padding: '12px 0',
      borderBottom: noBorder ? 'none' : '0.67px solid #F8FAFC',
    }}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(12.5),
        lineHeight: '1.5em',
        color: '#94A3B8',
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(13),
        lineHeight: '1.5em',
        color: '#111827',
      }}
    >
      {value}
    </Typography>
  </RowStack>
);
