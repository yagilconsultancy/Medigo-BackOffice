'use client';

import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccessibleOutlinedIcon from '@mui/icons-material/AccessibleOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import ElderlyOutlinedIcon from '@mui/icons-material/ElderlyOutlined';
import { pxToRem } from '../../../../../../common';
import { RowStack } from '../../../../../modules/components';

// ─── Types ──────────────────────────────────────────────────────────────────

export type CaregiverProfileCardData = {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  status: string;
  specialty: string;
  certifications: string;
  phone: string;
  location: string;
  capabilities: string[];
  rating: number;
  assignments: number;
};

type CaregiverProfileCardProps = {
  caregiver: CaregiverProfileCardData;
  colorIndex?: number;
  onEdit?: (caregiver: CaregiverProfileCardData) => void;
  onDocuments?: (caregiver: CaregiverProfileCardData) => void;
  onViewDetails?: (caregiver: CaregiverProfileCardData) => void;
};

// ─── Color Themes ───────────────────────────────────────────────────────────

type ColorTheme = {
  headerBg: string;
  avatarBg: string;
  avatarColor: string;
  badgeBg: string;
  badgeColor: string;
  specialtyColor: string;
  chipBg: string;
  chipColor: string;
  chipBorder: string;
};

const colorThemes: ColorTheme[] = [
  {
    headerBg: 'rgba(47, 111, 237, 0.09)',
    avatarBg: '#EBF2FF',
    avatarColor: '#2F6FED',
    badgeBg: 'rgba(47, 111, 237, 0.09)',
    badgeColor: '#2F6FED',
    specialtyColor: '#2F6FED',
    chipBg: '#EEF3FF',
    chipColor: '#2F6FED',
    chipBorder: '#C7D7F9',
  },
  {
    headerBg: 'rgba(99, 102, 241, 0.05)',
    avatarBg: '#EEF2FF',
    avatarColor: '#6366F1',
    badgeBg: 'rgba(99, 102, 241, 0.09)',
    badgeColor: '#6366F1',
    specialtyColor: '#6366F1',
    chipBg: '#EEF2FF',
    chipColor: '#6366F1',
    chipBorder: '#C7D2FE',
  },
  {
    headerBg: 'rgba(16, 185, 129, 0.05)',
    avatarBg: '#ECFDF5',
    avatarColor: '#059669',
    badgeBg: 'rgba(5, 150, 105, 0.09)',
    badgeColor: '#059669',
    specialtyColor: '#059669',
    chipBg: '#ECFDF5',
    chipColor: '#059669',
    chipBorder: '#A7F3D0',
  },
  {
    headerBg: 'rgba(245, 158, 11, 0.05)',
    avatarBg: '#FFFBEB',
    avatarColor: '#D97706',
    badgeBg: 'rgba(245, 158, 11, 0.09)',
    badgeColor: '#D97706',
    specialtyColor: '#D97706',
    chipBg: '#FFFBEB',
    chipColor: '#D97706',
    chipBorder: '#FDE68A',
  },
  {
    headerBg: 'rgba(236, 72, 153, 0.05)',
    avatarBg: '#FDF2F8',
    avatarColor: '#EC4899',
    badgeBg: 'rgba(236, 72, 153, 0.09)',
    badgeColor: '#EC4899',
    specialtyColor: '#EC4899',
    chipBg: '#FDF2F8',
    chipColor: '#EC4899',
    chipBorder: '#FBCFE8',
  },
  {
    headerBg: 'rgba(139, 92, 246, 0.05)',
    avatarBg: '#F5F3FF',
    avatarColor: '#8B5CF6',
    badgeBg: 'rgba(139, 92, 246, 0.09)',
    badgeColor: '#8B5CF6',
    specialtyColor: '#8B5CF6',
    chipBg: '#F5F3FF',
    chipColor: '#8B5CF6',
    chipBorder: '#DDD6FE',
  },
];

// ─── Status Config ──────────────────────────────────────────────────────────

const statusStyles: Record<string, { color: string; bg: string }> = {
  Available: { color: '#166534', bg: 'rgba(22, 101, 52, 0.08)' },
  'On Assignment': { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.08)' },
  Suspended: { color: '#991B1B', bg: 'rgba(153, 27, 27, 0.08)' },
};

// ─── Capability Icons (color applied dynamically) ───────────────────────────

const getCapabilityIcons = (
  color: string
): Record<string, React.ReactNode> => ({
  'Dementia Care': <ElderlyOutlinedIcon sx={{ fontSize: 10, color }} />,
  'Mobility Assistance': (
    <AccessibleOutlinedIcon sx={{ fontSize: 10, color }} />
  ),
  'Palliative Care': (
    <FavoriteBorderOutlinedIcon sx={{ fontSize: 10, color }} />
  ),
  'Medical Escort': (
    <MedicalServicesOutlinedIcon sx={{ fontSize: 10, color }} />
  ),
});

// ─── Component ──────────────────────────────────────────────────────────────

export const CaregiverProfileCard = ({
  caregiver,
  colorIndex = 0,
  onEdit,
  onDocuments,
  onViewDetails,
}: CaregiverProfileCardProps) => {
  const status = statusStyles[caregiver.status] || statusStyles['Available'];
  const theme = colorThemes[colorIndex % colorThemes.length];
  const capabilityIcons = getCapabilityIcons(theme.chipColor);

  const nameParts = caregiver.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  return (
    <Box
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Section 1: Header ────────────────────────────────────────── */}
      <Box
        sx={{
          background: theme.headerBg,
          borderBottom: '0.67px solid #F0F4F8',
          padding: '16px 20px',
        }}
      >
        <RowStack justifyContent={'space-between'}>
          {/* Left: Avatar + Name */}
          <RowStack spacing={'10px'}>
            <Avatar
              src={caregiver.avatar || undefined}
              alt={caregiver.name}
              sx={{
                width: 46,
                height: 46,
                fontSize: pxToRem(14),
                fontWeight: 600,
                background: theme.avatarBg,
                color: theme.avatarColor,
              }}
            >
              {initials}
            </Avatar>
            <Stack spacing={0}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  lineHeight: '1.5em',
                  color: '#111827',
                }}
              >
                {caregiver.name}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  lineHeight: '1.5em',
                  color: '#9CA3AF',
                }}
              >
                Joined {caregiver.joinedDate}
              </Typography>
            </Stack>
          </RowStack>

          {/* Right: Status + Specialty badge */}
          <Stack spacing={'4px'} alignItems={'flex-end'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11.5),
                lineHeight: '1.5em',
                color: status.color,
              }}
            >
              {caregiver.status}
            </Typography>
            <Box
              sx={{
                background: theme.badgeBg,
                borderRadius: '100px',
                padding: '1px 10px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (t) => t.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(11.5),
                  lineHeight: '1.5em',
                  color: theme.badgeColor,
                }}
              >
                {caregiver.specialty}
              </Typography>
            </Box>
          </Stack>
        </RowStack>
      </Box>

      {/* ── Section 2: Details ──────────────────────────────────────────── */}
      <Stack sx={{ padding: '16px 20px', gap: '12px' }}>
        <Box
          sx={{
            background: '#F7F9FB',
            border: '0.67px solid #F0F2F5',
            borderRadius: '14px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Specialty */}
          <RowStack spacing={'10px'} sx={{ flex: 1, padding: '14px 16px' }}>
            <LocalHospitalOutlinedIcon
              sx={{ fontSize: 13, color: '#9CA3AF' }}
            />
            <Stack spacing={0}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(10),
                  lineHeight: '1.5em',
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                }}
              >
                Specialty
              </Typography>
              <Typography
                sx={{
                  fontFamily: (t) => t.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: theme.specialtyColor,
                }}
              >
                {caregiver.specialty}
              </Typography>
            </Stack>
          </RowStack>

          {/* Divider */}
          <Box
            sx={{
              width: '1px',
              height: '32px',
              background: '#E5E7EB',
              flexShrink: 0,
            }}
          />

          {/* Certifications */}
          <RowStack spacing={'10px'} sx={{ flex: 1, padding: '14px 16px' }}>
            <DescriptionOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
            <Stack spacing={0}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(10),
                  lineHeight: '1.5em',
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                }}
              >
                Certifications
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: '#374151',
                }}
              >
                {caregiver.certifications}
              </Typography>
            </Stack>
          </RowStack>
        </Box>

        {/* ── Phone & Location row ──────────────────────────────────── */}
        <RowStack spacing={0} sx={{ width: '100%' }}>
          <Stack
            sx={{
              flex: 1,
              background: '#F7F9FB',
              borderRadius: '14px',
              padding: '10px 12px',
              gap: '2px',
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(10),
                lineHeight: '1.5em',
                color: '#9CA3AF',
                textTransform: 'uppercase',
              }}
            >
              Phone
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: '#374151',
              }}
            >
              {caregiver.phone}
            </Typography>
          </Stack>

          <Stack
            sx={{
              flex: 1,
              background: '#F7F9FB',
              borderRadius: '14px',
              padding: '10px 12px',
              gap: '2px',
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(10),
                lineHeight: '1.5em',
                color: '#9CA3AF',
                textTransform: 'uppercase',
              }}
            >
              Location
            </Typography>
            <RowStack spacing={'4px'}>
              <PlaceOutlinedIcon sx={{ fontSize: 12, color: '#6B7280' }} />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  lineHeight: '1.5em',
                  color: '#374151',
                }}
              >
                {caregiver.location}
              </Typography>
            </RowStack>
          </Stack>
        </RowStack>

        {/* ── Capability Chips ─────────────────────────────────────── */}
        {caregiver.capabilities.length > 0 && (
          <RowStack spacing={'6px'} sx={{ flexWrap: 'wrap' }}>
            {caregiver.capabilities.map((cap) => (
              <Chip
                key={cap}
                icon={(capabilityIcons[cap] as React.ReactElement) || undefined}
                label={cap}
                size="small"
                sx={{
                  background: theme.chipBg,
                  color: theme.chipColor,
                  border: `0.67px solid ${theme.chipBorder}`,
                  borderRadius: '100px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: pxToRem(11),
                  height: '22px',
                  '& .MuiChip-icon': {
                    marginLeft: '6px',
                    marginRight: '-2px',
                  },
                }}
              />
            ))}
          </RowStack>
        )}
      </Stack>

      {/* ── Section 3: Footer — Rating + Action Buttons ──────────────── */}
      <RowStack
        justifyContent={'space-between'}
        sx={{
          borderTop: '0.67px solid #F3F4F6',
          padding: '10px 20px',
          marginTop: 'auto',
        }}
      >
        {/* Rating + Assignments */}
        <RowStack spacing={'8px'}>
          <StarIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(13),
              lineHeight: '1.5em',
              color: '#374151',
            }}
          >
            {caregiver.rating.toFixed(1)}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              lineHeight: '1.5em',
              color: '#9CA3AF',
            }}
          >
            · {caregiver.assignments} assignments
          </Typography>
        </RowStack>

        {/* Action Buttons */}
        <RowStack spacing={'6px'}>
          <Box
            onClick={() => onEdit?.(caregiver)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              background: '#EEF3FF',
              border: '0.67px solid #C7D7F9',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': { background: '#E0EBFF' },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 11, color: '#2F6FED' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: '#2F6FED',
              }}
            >
              Edit
            </Typography>
          </Box>

          <Box
            onClick={() => onDocuments?.(caregiver)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              background: '#FFFFFF',
              border: '0.67px solid #E5E7EB',
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': { background: '#F9FAFB' },
            }}
          >
            <DescriptionOutlinedIcon sx={{ fontSize: 11, color: '#374151' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: '#374151',
              }}
            >
              Documents
            </Typography>
          </Box>

          <Box
            onClick={() => onViewDetails?.(caregiver)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              background: theme.chipBg,
              border: `0.67px solid ${theme.chipBorder}`,
              borderRadius: '10px',
              cursor: 'pointer',
              '&:hover': { opacity: 0.85 },
            }}
          >
            <VisibilityOutlinedIcon
              sx={{ fontSize: 11, color: theme.chipColor }}
            />
            <Typography
              sx={{
                fontFamily: (t) => t.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                lineHeight: '1.5em',
                color: theme.chipColor,
              }}
            >
              View Details
            </Typography>
          </Box>
        </RowStack>
      </RowStack>
    </Box>
  );
};
