'use client';

import { useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
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
import { pxToRem, useGetCaregiverDetail } from '../../../../../../common';
import { EmptyState, ImagePdfViewer } from '../../../../../modules/blocks';
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
  languages?: string[];
};

export type ViewCaregiverDrawerProps = {
  open: boolean;
  onClose: () => void;
  caregiver: CaregiverViewData | null;
};

const statusBadgeConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Available: { color: '#166534', bg: '#EDFAF4', border: '#BBF7D0' },
  'On Assignment': { color: '#3730A3', bg: '#EEF2FF', border: '#C7D2FE' },
  Suspended: { color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },
};

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
    <RowStack
      justifyContent="space-between"
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
    <Stack sx={{ padding: '20px' }} spacing={'16px'}>
      {children}
    </Stack>
  </Box>
);

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

const formatDateLabel = (value?: string | null) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const ViewCaregiverDrawer = ({
  open,
  onClose,
  caregiver,
}: ViewCaregiverDrawerProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const { data: caregiverDetailResponse, isLoading } = useGetCaregiverDetail(
    caregiver?.caregiverId ?? ''
  );

  if (!caregiver) return null;

  const caregiverDetail = caregiverDetailResponse?.success
    ? caregiverDetailResponse.data
    : null;

  const personalInfo = caregiverDetail?.personal_info;
  const documents = caregiverDetail?.documents ?? [];
  const certifications = caregiverDetail?.certifications ?? [];
  const assignments = caregiverDetail?.assignments ?? [];
  const ratings = caregiverDetail?.ratings ?? [];

  const resolvedName = personalInfo?.full_name ?? caregiver.name;
  const resolvedSpecialty = personalInfo?.specialty ?? caregiver.specialty;
  const resolvedPhone = personalInfo?.phone ?? caregiver.phone;
  const resolvedEmail = personalInfo?.email ?? caregiver.email;
  const resolvedLocation =
    [personalInfo?.city, personalInfo?.province].filter(Boolean).join(', ') ||
    caregiver.location;
  const resolvedJoinedDate =
    personalInfo?.joined && !Number.isNaN(Date.parse(personalInfo.joined))
      ? new Date(personalInfo.joined).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      : caregiver.joinedDate;
  const resolvedRating = caregiverDetail?.avg_rating ?? caregiver.rating ?? 0;
  const resolvedAssignments =
    caregiverDetail?.total_assignments ?? caregiver.assignments ?? 0;
  const resolvedCapabilities = personalInfo?.capabilities?.length
    ? personalInfo.capabilities
    : caregiver.capabilities;
  const resolvedLanguages = personalInfo?.languages?.length
    ? personalInfo.languages
    : (caregiver.languages ?? []);
  const badge =
    statusBadgeConfig[caregiver.status] || statusBadgeConfig['Available'];

  const nameParts = resolvedName.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  const renderLoading = () => (
    <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
      <CircularProgress size={24} />
    </Stack>
  );

  const renderEmpty = () => <EmptyState animationSrc="/empty.json" />;

  const renderPersonalInfo = () => (
    <SectionCard
      icon={<PersonOutlineIcon sx={{ fontSize: 16, color: '#2F6FED' }} />}
      title="Personal Information"
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        <ReadOnlyField label="Full Name" value={resolvedName} />
        <ReadOnlyField label="Specialty" value={resolvedSpecialty} />
        <ReadOnlyField label="Phone" value={resolvedPhone} />
        <ReadOnlyField label="Email" value={resolvedEmail} />
        <ReadOnlyField label="City" value={resolvedLocation} />
        <ReadOnlyField label="Joined" value={resolvedJoinedDate} />
      </Box>

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
        {resolvedLanguages.length ? (
          <RowStack spacing={'8px'} sx={{ flexWrap: 'wrap' }}>
            {resolvedLanguages.map((lang) => (
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
        ) : (
          renderEmpty()
        )}
      </Stack>

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
        {resolvedCapabilities.length ? (
          <RowStack spacing={'8px'} sx={{ flexWrap: 'wrap' }}>
            {resolvedCapabilities.map((cap) => (
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
        ) : (
          renderEmpty()
        )}
      </Stack>
    </SectionCard>
  );

  const renderCertifications = () => (
    <SectionCard
      icon={<VerifiedOutlinedIcon sx={{ fontSize: 16, color: '#2F6FED' }} />}
      title="Certifications"
    >
      {isLoading ? (
        renderLoading()
      ) : certifications.length ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          {certifications.map((cert) => (
            <RowStack
              key={cert.name}
              justifyContent="space-between"
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
                    {cert.name}
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
                    {cert.status}
                    {cert.expiry_date
                      ? ` · ${formatDateLabel(cert.expiry_date)}`
                      : ''}
                  </Typography>
                </Stack>
              </RowStack>
              <CheckCircleOutlinedIcon
                sx={{ fontSize: 16, color: '#10B981', flexShrink: 0 }}
              />
            </RowStack>
          ))}
        </Box>
      ) : (
        renderEmpty()
      )}
    </SectionCard>
  );

  const renderDocuments = () => (
    <SectionCard
      icon={<DescriptionOutlinedIcon sx={{ fontSize: 16, color: '#2F6FED' }} />}
      title="Documents"
    >
      {isLoading ? (
        renderLoading()
      ) : documents.length ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '12px',
          }}
        >
          {documents.map((doc) => (
            <ImagePdfViewer
              key={doc.id}
              imageFileName={doc.file_name}
              fileUri={doc.file_uri || doc.file_name}
            >
              <Box
                sx={{
                  background: '#F7F9FB',
                  border: '0.67px solid #E8ECF0',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    background: '#EEF4FF',
                    borderColor: '#C7D7FE',
                  },
                }}
              >
                <RowStack spacing={'12px'} alignItems="flex-start">
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
                  <Stack spacing={'4px'} sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12.5),
                        color: '#111827',
                        lineHeight: '1.4em',
                      }}
                    >
                      {doc.document_type}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(11),
                        color: '#6B7280',
                        lineHeight: '1.4em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {doc.file_name}
                    </Typography>
                  </Stack>
                </RowStack>
              </Box>
            </ImagePdfViewer>
          ))}
        </Box>
      ) : (
        renderEmpty()
      )}
    </SectionCard>
  );

  const renderAssignments = () => (
    <SectionCard
      icon={<AssignmentOutlinedIcon sx={{ fontSize: 16, color: '#2F6FED' }} />}
      title="Recent Assignments"
      trailing={
        <Chip
          label={`${resolvedAssignments} Total`}
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
      {isLoading ? (
        renderLoading()
      ) : assignments.length ? (
        <Stack spacing={'12px'}>
          {assignments.map((assignment) => (
            <Box
              key={assignment.assignment_id}
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
                  fontSize: pxToRem(12.5),
                  fontWeight: 600,
                  color: '#2F6FED',
                }}
              >
                {assignment.assignment_id}
              </Typography>
              <Typography
                sx={{
                  fontSize: pxToRem(12.5),
                  fontWeight: 500,
                  color: '#374151',
                }}
              >
                {assignment.patient_name}
              </Typography>
              <Typography
                sx={{
                  fontSize: pxToRem(12),
                  fontWeight: 400,
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
                  fontSize: pxToRem(12),
                  fontWeight: 400,
                  color: '#6B7280',
                }}
              >
                {assignment.date}
              </Typography>
              <Typography
                sx={{
                  fontSize: pxToRem(12),
                  fontWeight: 500,
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
        </Stack>
      ) : (
        renderEmpty()
      )}
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
            {resolvedRating.toFixed(1)}
          </Typography>
        </RowStack>
      }
    >
      {isLoading ? (
        renderLoading()
      ) : ratings.length ? (
        <Stack spacing={'10px'}>
          {ratings.map((review) => (
            <Stack
              key={`${review.patient_name}-${review.date}`}
              spacing={'10px'}
              sx={{
                background: '#F7F9FB',
                border: '0.67px solid #E8ECF0',
                borderRadius: '14px',
                padding: '16px 20px',
              }}
            >
              <RowStack justifyContent="space-between">
                <RowStack spacing={'10px'}>
                  <Typography
                    sx={{
                      fontSize: pxToRem(13),
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    {review.patient_name}
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
                <Typography sx={{ fontSize: pxToRem(11.5), color: '#9CA3AF' }}>
                  {review.date}
                </Typography>
              </RowStack>
              <Typography
                sx={{
                  fontSize: pxToRem(13),
                  color: '#374151',
                  lineHeight: 1.6,
                }}
              >
                {review.review || 'No review provided.'}
              </Typography>
            </Stack>
          ))}
        </Stack>
      ) : (
        renderEmpty()
      )}
    </SectionCard>
  );

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
      <Stack
        sx={{
          padding: '20px 24px 0',
          borderBottom: '0.67px solid #F0F4F8',
        }}
        spacing={'16px'}
      >
        <RowStack justifyContent="space-between">
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
              {nameParts[0]?.charAt(0)}
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
                {resolvedName}
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
                  {resolvedSpecialty} · {caregiver.caregiverId}
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
          <Tab label="Documents" />
          <Tab label="Assignments" />
          <Tab label="Ratings" />
        </Tabs>
      </Stack>

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
        {activeTab === 2 && renderDocuments()}
        {activeTab === 3 && renderAssignments()}
        {activeTab === 4 && renderRatings()}
      </Stack>
    </Drawer>
  );
};
