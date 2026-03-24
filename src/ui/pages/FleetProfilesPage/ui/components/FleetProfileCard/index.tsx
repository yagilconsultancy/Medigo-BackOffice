import { Box, Stack, Typography } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

export type FleetProfileData = {
  id: string;
  fleetId: string;
  companyName: string;
  initials: string;
  color: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  vehicles: number;
  drivers: number;
  revenue: string;
  rating: string;
  status: 'Active' | 'Suspended' | 'Pending';
  joinedDate: string;
  documents: {
    businessLicense: boolean;
    insuranceCertificate: boolean;
    vehicleFleetList: boolean;
    driverCertifications: boolean;
  };
};

// ─── Status Badge Config ────────────────────────────────────────────────────

const statusConfig: Record<
  FleetProfileData['status'],
  { color: string; bg: string; dotColor: string }
> = {
  Active: { color: '#059669', bg: '#ECFDF5', dotColor: '#10B981' },
  Suspended: { color: '#EF4444', bg: '#FEF2F2', dotColor: '#EF4444' },
  Pending: { color: '#D97706', bg: '#FFFBEB', dotColor: '#F59E0B' },
};

// ─── Component ──────────────────────────────────────────────────────────────

type FleetProfileCardProps = {
  profile: FleetProfileData;
  onEdit: () => void;
};

export const FleetProfileCard = ({
  profile,
  onEdit,
}: FleetProfileCardProps) => {
  const badge = statusConfig[profile.status];

  const metrics = [
    {
      icon: (
        <DirectionsCarOutlinedIcon
          sx={{ fontSize: 14, color: '#6366F1' }}
        />
      ),
      iconBg: '#EEF2FF',
      label: 'Fleet Vehicles',
      value: String(profile.vehicles),
    },
    {
      icon: <GroupOutlinedIcon sx={{ fontSize: 14, color: '#10B981' }} />,
      iconBg: '#ECFDF5',
      label: 'Active Drivers',
      value: String(profile.drivers),
    },
    {
      icon: (
        <AttachMoneyOutlinedIcon sx={{ fontSize: 14, color: '#2F6FED' }} />
      ),
      iconBg: '#EBF2FF',
      label: 'Total Revenue',
      value: profile.revenue,
    },
    {
      icon: <StarOutlineIcon sx={{ fontSize: 14, color: '#F59E0B' }} />,
      iconBg: '#FFFBEB',
      label: 'Avg. Rating',
      value: profile.rating,
    },
  ];

  const documents: { label: string; checked: boolean }[] = [
    { label: 'Business License', checked: profile.documents.businessLicense },
    {
      label: 'Insurance Certificate',
      checked: profile.documents.insuranceCertificate,
    },
    {
      label: 'Vehicle Fleet List',
      checked: profile.documents.vehicleFleetList,
    },
    {
      label: 'Driver Certifications',
      checked: profile.documents.driverCertifications,
    },
  ];

  return (
    <Stack
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '0.67px solid #F0F4F8',
        overflow: 'hidden',
      }}
    >
      {/* Card Header */}
      <RowStack
        justifyContent="space-between"
        sx={{
          padding: '20px 24px',
          borderBottom: '0.67px solid #F0F4F8',
        }}
      >
        <RowStack spacing={'14px'}>
          {/* Initials Avatar */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: `${profile.color}1A`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: pxToRem(15),
                color: profile.color,
              }}
            >
              {profile.initials}
            </Typography>
          </Box>

          {/* Company Info */}
          <Stack spacing={'4px'}>
            <RowStack spacing={'10px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  lineHeight: '1.3em',
                  color: '#111827',
                }}
              >
                {profile.companyName}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#9CA3AF',
                }}
              >
                {profile.fleetId}
              </Typography>
            </RowStack>
            <RowStack spacing={'12px'}>
              <RowStack spacing={'4px'}>
                <LocationOnOutlinedIcon
                  sx={{ fontSize: 12, color: '#9CA3AF' }}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: '#6B7280',
                  }}
                >
                  {profile.city}
                </Typography>
              </RowStack>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#9CA3AF',
                }}
              >
                Since {profile.joinedDate}
              </Typography>
              {/* Status Badge */}
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
                  {profile.status}
                </Typography>
              </Box>
            </RowStack>
          </Stack>
        </RowStack>

        {/* Edit Button */}
        <Box
          onClick={onEdit}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            border: '0.67px solid #E8ECF0',
            borderRadius: '10px',
            cursor: 'pointer',
            background: '#FFFFFF',
            transition: 'all 0.15s ease',
            '&:hover': { background: '#F7F9FB' },
          }}
        >
          <EditOutlinedIcon sx={{ fontSize: 13, color: '#6B7280' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12),
              color: '#374151',
            }}
          >
            Edit
          </Typography>
        </Box>
      </RowStack>

      {/* Content Sections */}
      <Stack direction="row" sx={{ minHeight: 0 }}>
        {/* Performance Metrics */}
        <Stack
          sx={{
            flex: 1,
            padding: '20px 24px',
            borderRight: '0.67px solid #F0F4F8',
          }}
        >
          <SectionLabel>PERFORMANCE METRICS</SectionLabel>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
              marginTop: '14px',
            }}
          >
            {metrics.map((metric) => (
              <RowStack key={metric.label} spacing={'10px'}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '10px',
                    background: metric.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {metric.icon}
                </Box>
                <Stack spacing={'2px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(14),
                      lineHeight: '1.2em',
                      color: '#111827',
                    }}
                  >
                    {metric.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(11),
                      color: '#9CA3AF',
                    }}
                  >
                    {metric.label}
                  </Typography>
                </Stack>
              </RowStack>
            ))}
          </Box>
        </Stack>

        {/* Contact Information */}
        <Stack
          sx={{
            flex: 1,
            padding: '20px 24px',
            borderRight: '0.67px solid #F0F4F8',
          }}
        >
          <SectionLabel>CONTACT INFORMATION</SectionLabel>
          <Stack spacing={'12px'} sx={{ marginTop: '14px' }}>
            <ContactRow
              icon={
                <PersonOutlineIcon
                  sx={{ fontSize: 13, color: '#9CA3AF' }}
                />
              }
              label="Contact Person"
              value={profile.contactPerson}
            />
            <ContactRow
              icon={
                <EmailOutlinedIcon
                  sx={{ fontSize: 13, color: '#9CA3AF' }}
                />
              }
              label="Email"
              value={profile.contactEmail}
            />
            <ContactRow
              icon={
                <PhoneOutlinedIcon
                  sx={{ fontSize: 13, color: '#9CA3AF' }}
                />
              }
              label="Phone"
              value={profile.contactPhone}
            />
            <ContactRow
              icon={
                <LocationOnOutlinedIcon
                  sx={{ fontSize: 13, color: '#9CA3AF' }}
                />
              }
              label="City"
              value={profile.city}
            />
          </Stack>
        </Stack>

        {/* Documents on File */}
        <Stack
          sx={{
            flex: 1,
            padding: '20px 24px',
          }}
        >
          <SectionLabel>DOCUMENTS ON FILE</SectionLabel>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginTop: '14px',
            }}
          >
            {documents.map((doc) => (
              <DocumentChip
                key={doc.label}
                label={doc.label}
                checked={doc.checked}
              />
            ))}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: string }) => (
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
    {children}
  </Typography>
);

const ContactRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <RowStack justifyContent="space-between">
    <RowStack spacing={'6px'}>
      {icon}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12),
          color: '#6B7280',
        }}
      >
        {label}
      </Typography>
    </RowStack>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(12.5),
        color: '#111827',
      }}
    >
      {value}
    </Typography>
  </RowStack>
);

const DocumentChip = ({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) => (
  <RowStack
    spacing={'8px'}
    sx={{
      background: checked ? '#F0FDF4' : '#F7F9FB',
      border: `0.67px solid ${checked ? '#BBF7D0' : '#E8ECF0'}`,
      borderRadius: '14px',
      padding: '10px 12px',
    }}
  >
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: '4px',
        background: checked ? '#059669' : '#E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {checked && (
        <CheckIcon sx={{ fontSize: 10, color: '#FFFFFF' }} />
      )}
    </Box>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(12),
        lineHeight: '1.5em',
        color: checked ? '#374151' : '#9CA3AF',
      }}
    >
      {label}
    </Typography>
  </RowStack>
);
