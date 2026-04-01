'use client';

import { useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Drawer,
  IconButton,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { pxToRem } from '../../../../../../common';
import { RowStack } from '../../../../../modules/components';

// ─── Types ──────────────────────────────────────────────────────────────────

export type CaregiverViewData = {
  name: string;
  avatar: string;
  caregiverId: string;
  specialty: string;
  phone: string;
  email: string;
  location: string;
  joinedDate: string;
  status: string;
  rating: number;
  assignments: number;
  certifications: string;
  capabilities: string[];
};

export type ViewCaregiverDrawerProps = {
  open: boolean;
  onClose: () => void;
  caregiver: CaregiverViewData | null;
};

// ─── Status Badge Config ────────────────────────────────────────────────────

const statusBadgeConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Available: { color: '#166534', bg: '#EDFAF4', border: '#BBF7D0' },
  'On Assignment': { color: '#3730A3', bg: '#EEF2FF', border: '#C7D2FE' },
  Suspended: { color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },
};

// ─── Mock Certifications Data ───────────────────────────────────────────────

const certificationsData = [
  {
    title: 'Personal Support Worker (PSW)',
    subtitle: 'Ontario College of Social Workers',
    expiry: '2027-01-15',
  },
  {
    title: 'First Aid & CPR Level C',
    subtitle: 'Canadian Red Cross',
    expiry: '2026-08-22',
  },
  {
    title: 'Dementia Care Specialist',
    subtitle: 'Alzheimer Society of Canada',
    expiry: '2027-03-10',
  },
];

const backgroundCheck = {
  status: 'Verified',
  expiry: '2027-05-15',
};

// ─── Mock Assignments Data ──────────────────────────────────────────────────

const assignmentsData = [
  {
    id: 'AS-9821',
    patient: 'Margaret Wilson',
    route: '120 King St W, Toronto → Toronto General Hospital',
    date: 'Mar 18, 2026',
    duration: '2h 15m',
    status: 'Completed',
  },
  {
    id: 'AS-9818',
    patient: 'Robert Beaumont',
    route: '455 René-Lévesque Blvd W → Montreal General Hospital',
    date: 'Mar 17, 2026',
    duration: '1h 45m',
    status: 'Completed',
  },
  {
    id: 'AS-9812',
    patient: "Patricia O'Brien",
    route: '1225 Gladstone Ave, Ottawa → Civic Hospital',
    date: 'Mar 16, 2026',
    duration: '3h 10m',
    status: 'Completed',
  },
];

// ─── Mock Reviews Data ──────────────────────────────────────────────────────

const reviewsData = [
  {
    name: 'Margaret Wilson',
    rating: 5,
    date: 'Mar 18, 2026',
    comment:
      'Emma was incredibly caring and attentive. Made my mother feel comfortable throughout the entire appointment.',
  },
  {
    name: 'Robert Beaumont',
    rating: 5,
    date: 'Mar 17, 2026',
    comment:
      'Professional and punctual. Excellent medical knowledge and very reassuring presence.',
  },
  {
    name: "Patricia O'Brien",
    rating: 4,
    date: 'Mar 16, 2026',
    comment:
      'Very helpful and friendly. Only minor issue with timing but overall great experience.',
  },
];

// ─── Reusable Section Card ──────────────────────────────────────────────────

const SectionCard = ({
  icon,
  title,
  trailing,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      border: '0.67px solid #EAECF0',
      borderRadius: '16px',
      overflow: 'hidden',
    }}
  >
    {/* Card Header */}
    <RowStack
      justifyContent={'space-between'}
      sx={{
        background: '#FAFBFF',
        borderBottom: '0.67px solid #F0F2F5',
        padding: '14px 20px',
      }}
    >
      <RowStack spacing={'10px'}>
        {icon}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13.5),
            color: '#111827',
          }}
        >
          {title}
        </Typography>
      </RowStack>
      {trailing}
    </RowStack>

    {/* Card Body */}
    <Stack sx={{ padding: '20px' }} spacing={'16px'}>
      {children}
    </Stack>
  </Box>
);

// ─── Reusable Read-Only Field ───────────────────────────────────────────────

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <Stack spacing={'4px'}>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(11),
        letterSpacing: '0.04em',
        color: '#9CA3AF',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(13),
        color: '#374151',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

// ─── Main Component ─────────────────────────────────────────────────────────

export const ViewCaregiverDrawer = ({
  open,
  onClose,
  caregiver,
}: ViewCaregiverDrawerProps) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!caregiver) return null;

  const nameParts = caregiver.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  const badge =
    statusBadgeConfig[caregiver.status] || statusBadgeConfig['Available'];

  // ─── Tab Content Renderers ──────────────────────────────────────────────

  const renderPersonalInfo = () => (
    <SectionCard
      icon={<PersonOutlineIcon sx={{ fontSize: 16, color: '#2F6FED' }} />}
      title="Personal Information"
    >
      {/* 2-column grid fields */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        <ReadOnlyField label="Full Name" value={caregiver.name} />
        <ReadOnlyField label="Specialty" value={caregiver.specialty} />
        <ReadOnlyField label="Phone" value={caregiver.phone} />
        <ReadOnlyField label="Email" value={caregiver.email} />
        <ReadOnlyField label="City" value={caregiver.location} />
        <ReadOnlyField label="Joined" value={caregiver.joinedDate} />
      </Box>

      {/* Languages */}
      <Stack spacing={'8px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(11),
            letterSpacing: '0.04em',
            color: '#9CA3AF',
            textTransform: 'uppercase',
          }}
        >
          Languages
        </Typography>
        <RowStack spacing={'8px'}>
          {['English', 'French'].map((lang) => (
            <Chip
              key={lang}
              label={lang}
              size="small"
              sx={{
                background: '#F7F9FB',
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: pxToRem(12),
                height: '28px',
                borderRadius: '100px',
              }}
            />
          ))}
        </RowStack>
      </Stack>

      {/* Capabilities */}
      <Stack spacing={'8px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(11),
            letterSpacing: '0.04em',
            color: '#9CA3AF',
            textTransform: 'uppercase',
          }}
        >
          Capabilities
        </Typography>
        <RowStack spacing={'8px'} sx={{ flexWrap: 'wrap' }}>
          {caregiver.capabilities.map((cap) => (
            <Chip
              key={cap}
              label={cap}
              size="small"
              sx={{
                background: '#EEF3FF',
                color: '#2F6FED',
                border: '0.67px solid #C7D7F9',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(12),
                height: '28px',
                borderRadius: '100px',
              }}
            />
          ))}
        </RowStack>
      </Stack>
    </SectionCard>
  );

  const renderCertifications = () => (
    <SectionCard
      icon={
        <VerifiedOutlinedIcon sx={{ fontSize: 16, color: '#2F6FED' }} />
      }
      title="Certifications & Documents"
    >
      {/* Certification cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}
      >
        {certificationsData.map((cert) => (
          <RowStack
            key={cert.title}
            justifyContent={'space-between'}
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              borderRadius: '14px',
              padding: '14px 16px',
            }}
          >
            <RowStack spacing={'12px'}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: '#EBF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <DescriptionOutlinedIcon
                  sx={{ fontSize: 16, color: '#2F6FED' }}
                />
              </Box>
              <Stack spacing={0}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(12.5),
                    color: '#111827',
                    lineHeight: '1.4em',
                  }}
                >
                  {cert.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11),
                    color: '#9CA3AF',
                    lineHeight: '1.4em',
                  }}
                >
                  {cert.subtitle}
                </Typography>
              </Stack>
            </RowStack>
            <CheckCircleOutlinedIcon
              sx={{ fontSize: 16, color: '#10B981', flexShrink: 0 }}
            />
          </RowStack>
        ))}
      </Box>

      {/* Background Check */}
      <RowStack
        justifyContent={'space-between'}
        sx={{
          background: '#F7F9FB',
          border: '0.67px solid #E8ECF0',
          borderRadius: '14px',
          padding: '16px 20px',
        }}
      >
        <RowStack spacing={'12px'}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: '#EBF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircleOutlinedIcon
              sx={{ fontSize: 16, color: '#2F6FED' }}
            />
          </Box>
          <Stack spacing={0}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#111827',
              }}
            >
              Background Check
            </Typography>
            <RowStack spacing={'8px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#374151',
                }}
              >
                Status: {backgroundCheck.status}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                · Certification Expiry: {backgroundCheck.expiry}
              </Typography>
            </RowStack>
          </Stack>
        </RowStack>
        <CheckCircleOutlinedIcon
          sx={{ fontSize: 20, color: '#10B981', flexShrink: 0 }}
        />
      </RowStack>
    </SectionCard>
  );

  const renderAssignments = () => (
    <SectionCard
      icon={<AssignmentOutlinedIcon sx={{ fontSize: 16, color: '#2F6FED' }} />}
      title="Recent Assignments"
      trailing={
        <Chip
          label={`${caregiver.assignments} Total`}
          size="small"
          sx={{
            background: '#EBF2FF',
            color: '#2F6FED',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: pxToRem(11.5),
            height: '24px',
            borderRadius: '100px',
          }}
        />
      }
    >
      {/* Table Header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '0.8fr 1fr 1.8fr 0.9fr 0.7fr 0.8fr',
          gap: '8px',
          background: '#F7F9FB',
          borderRadius: '10px',
          padding: '10px 16px',
        }}
      >
        {['Assignment', 'Patient', 'Route', 'Date', 'Duration', 'Status'].map(
          (header) => (
            <Typography
              key={header}
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: '#6B7280',
              }}
            >
              {header}
            </Typography>
          )
        )}
      </Box>

      {/* Table Rows */}
      {assignmentsData.map((assignment) => (
        <Box
          key={assignment.id}
          sx={{
            display: 'grid',
            gridTemplateColumns: '0.8fr 1fr 1.8fr 0.9fr 0.7fr 0.8fr',
            gap: '8px',
            padding: '12px 16px',
            borderBottom: '0.67px solid #F3F4F6',
            '&:last-child': { borderBottom: 'none' },
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12.5),
              color: '#2F6FED',
            }}
          >
            {assignment.id}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(12.5),
              color: '#374151',
            }}
          >
            {assignment.patient}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: '#6B7280',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {assignment.route}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: '#6B7280',
            }}
          >
            {assignment.date}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(12),
              color: '#374151',
            }}
          >
            {assignment.duration}
          </Typography>
          <Chip
            label={assignment.status}
            size="small"
            sx={{
              background: '#ECFDF5',
              color: '#059669',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: pxToRem(10.5),
              height: '22px',
              borderRadius: '100px',
              width: 'fit-content',
            }}
          />
        </Box>
      ))}
    </SectionCard>
  );

  const renderRatings = () => (
    <SectionCard
      icon={<StarOutlineIcon sx={{ fontSize: 16, color: '#2F6FED' }} />}
      title="Patient Ratings & Reviews"
      trailing={
        <RowStack spacing={'6px'}>
          <StarIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(18),
              color: '#111827',
            }}
          >
            {caregiver.rating.toFixed(1)}
          </Typography>
        </RowStack>
      }
    >
      {reviewsData.map((review) => (
        <Stack
          key={review.name + review.date}
          spacing={'10px'}
          sx={{
            background: '#F7F9FB',
            border: '0.67px solid #E8ECF0',
            borderRadius: '14px',
            padding: '16px 20px',
          }}
        >
          {/* Review header */}
          <RowStack justifyContent={'space-between'}>
            <RowStack spacing={'10px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#111827',
                }}
              >
                {review.name}
              </Typography>
              <Rating
                value={review.rating}
                max={5}
                readOnly
                size="small"
                icon={<StarIcon sx={{ fontSize: 12, color: '#F59E0B' }} />}
                emptyIcon={
                  <StarIcon sx={{ fontSize: 12, color: '#E5E7EB' }} />
                }
              />
            </RowStack>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(11.5),
                color: '#9CA3AF',
              }}
            >
              {review.date}
            </Typography>
          </RowStack>

          {/* Review text */}
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              color: '#374151',
              lineHeight: 1.6,
            }}
          >
            {review.comment}
          </Typography>
        </Stack>
      ))}
    </SectionCard>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '860px',
          boxShadow: '-4px 0px 48px rgba(0, 0, 0, 0.14)',
        },
      }}
    >
      {/* ─── Sticky Header ──────────────────────────────────────────── */}
      <Stack
        sx={{
          padding: '20px 24px 0',
          borderBottom: '0.67px solid #F0F4F8',
        }}
        spacing={'16px'}
      >
        {/* Avatar + Name + Close */}
        <RowStack justifyContent={'space-between'}>
          <RowStack spacing={'12px'}>
            <Avatar
              src={caregiver.avatar || undefined}
              alt={caregiver.name}
              sx={{
                width: 48,
                height: 48,
                fontSize: pxToRem(16),
                fontWeight: 700,
                background: '#ECFDF5',
                color: '#059669',
              }}
            >
              {initials}
            </Avatar>
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(17),
                  color: '#111827',
                  lineHeight: '1.5em',
                }}
              >
                {caregiver.name}
              </Typography>
              <RowStack spacing={'6px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: '#6B7280',
                  }}
                >
                  {caregiver.specialty} · {caregiver.caregiverId}
                </Typography>
                <Chip
                  label={caregiver.status}
                  size="small"
                  sx={{
                    background: badge.bg,
                    color: badge.color,
                    border: `0.67px solid ${badge.border}`,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: pxToRem(10.5),
                    height: '22px',
                    borderRadius: '100px',
                  }}
                />
              </RowStack>
            </Stack>
          </RowStack>
          <IconButton
            onClick={onClose}
            sx={{
              width: 32,
              height: 32,
              background: '#F3F4F6',
              border: '0.67px solid #E5E7EB',
              borderRadius: '8px',
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            minHeight: 'unset',
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTabs-flexContainer': { gap: '8px' },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: pxToRem(12.5),
              fontWeight: 500,
              color: '#6B7280',
              minHeight: '34px',
              padding: '6px 14px',
              borderRadius: '8px',
              transition: 'all 0.15s ease',
              '&.Mui-selected': {
                fontWeight: 600,
                color: '#2F6FED',
                background: '#EBF2FF',
              },
            },
          }}
        >
          <Tab label="Personal Info" />
          <Tab label="Certifications" />
          <Tab label="Assignments" />
          <Tab label="Ratings" />
        </Tabs>
      </Stack>

      {/* ─── Scrollable Content ──────────────────────────────────────── */}
      <Stack
        sx={{
          flex: 1,
          overflow: 'auto',
          padding: '20px 24px 24px',
        }}
        spacing={'20px'}
      >
        {activeTab === 0 && renderPersonalInfo()}
        {activeTab === 1 && renderCertifications()}
        {activeTab === 2 && renderAssignments()}
        {activeTab === 3 && renderRatings()}
      </Stack>
    </Drawer>
  );
};
