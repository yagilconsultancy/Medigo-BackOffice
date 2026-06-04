import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { ImagePdfViewer } from '../../../../../modules/blocks';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem, useGetFleetApplicationById } from '../../../../../../common';
import { FleetApplicationRow, ApplicationStatus } from '../ApplicationCard';

// ─── Status Badge Config ────────────────────────────────────────────────────

const statusConfig: Record<ApplicationStatus, { color: string; bg: string }> = {
  Pending: { color: '#D97706', bg: '#FFFBEB' },
  Approved: { color: '#059669', bg: '#ECFDF5' },
  Rejected: { color: '#EF4444', bg: '#FEF2F2' },
  'More Info Required': { color: '#2F6FED', bg: '#EBF2FF' },
};

// ─── Component ──────────────────────────────────────────────────────────────

type FleetApplicationDetailModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  application: FleetApplicationRow | null;
  onApprove?: () => void;
  onReject?: () => void;
  onRequestDocs?: () => void;
};

export const FleetApplicationDetailModal = ({
  open,
  setOpen,
  application,
  onApprove,
  onReject,
  onRequestDocs,
}: FleetApplicationDetailModalProps) => {
  const applicationId = application?.id ?? '';
  const { data: applicationDetailResponse, isFetching } =
    useGetFleetApplicationById(applicationId);

  if (!application) return null;

  const badge = statusConfig[application.status];
  const documents =
    applicationDetailResponse?.success &&
    applicationDetailResponse.data?.documents
      ? applicationDetailResponse.data.documents
      : application.documents;

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="Application Details"
      sx={{
        '& .MuiDialog-paper': {
          width: '560px',
          maxWidth: '560px',
          padding: '0 !important',
        },
      }}
    >
      <Stack sx={{ width: '100%' }}>
        {/* Header */}
        <RowStack
          justifyContent="space-between"
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <RowStack spacing={'12px'}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '14px',
                background: '#EBF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: pxToRem(14),
                  color: '#2F6FED',
                }}
              >
                {application.companyName.charAt(0)}
              </Typography>
            </Box>
            <Stack spacing={'4px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  lineHeight: '1.3em',
                  color: '#111827',
                }}
              >
                {application.companyName}
              </Typography>
              <RowStack spacing={'8px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: '#9CA3AF',
                  }}
                >
                  {application.appId}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: badge.bg,
                    borderRadius: '100px',
                    padding: '2px 10px',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(11.5),
                      lineHeight: '1.5em',
                      color: badge.color,
                    }}
                  >
                    {application.status}
                  </Typography>
                </Box>
              </RowStack>
            </Stack>
          </RowStack>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              background: '#F3F4F6',
              border: '0.67px solid #E5E7EB',
              borderRadius: '8px',
              width: 30,
              height: 30,
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* Info Row: Fleet Size | Submitted | Location */}
        <RowStack
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <InfoColumn
            label="FLEET SIZE"
            value={`${application.fleetSize} vehicles`}
            hasBorder
          />
          <InfoColumn
            label="SUBMITTED"
            value={application.submittedDate}
            hasBorder
          />
          <InfoColumn label="LOCATION" value={application.city} />
        </RowStack>

        {/* Contact Information */}
        <Stack
          spacing={'14px'}
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <SectionLabel>CONTACT INFORMATION</SectionLabel>
          <Stack spacing={'12px'}>
            <ContactRow
              icon={
                <PersonOutlineIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
              }
              label="Contact Person"
              value={application.contactPerson}
            />
            <ContactRow
              icon={
                <EmailOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
              }
              label="Email Address"
              value={application.contactEmail}
            />
            <ContactRow
              icon={
                <PhoneOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
              }
              label="Phone Number"
              value={application.contactPhone}
            />
            <ContactRow
              icon={
                <LocationOnOutlinedIcon
                  sx={{ fontSize: 13, color: '#9CA3AF' }}
                />
              }
              label="City / Province"
              value={application.city}
            />
          </Stack>
        </Stack>

        {/* Application Message */}
        <Stack
          spacing={'10px'}
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <SectionLabel>APPLICATION MESSAGE</SectionLabel>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              lineHeight: '1.65em',
              color: '#4B5563',
            }}
          >
            {application.message}
          </Typography>
        </Stack>

        {/* Submitted Documents */}
        <Stack
          spacing={'12px'}
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <SectionLabel>SUBMITTED DOCUMENTS</SectionLabel>
          <RowStack spacing={'8px'}>
            {isFetching && documents.length === 0 ? (
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  color: '#6B7280',
                }}
              >
                Loading documents...
              </Typography>
            ) : (
              documents.map((doc) => (
                <ImagePdfViewer
                  key={doc.id}
                  imageFileName={doc.file_name}
                  fileUri={doc.file_name}
                >
                  <RowStack
                    spacing={'6px'}
                    sx={{
                      cursor: 'pointer',
                      background: '#F7F9FB',
                      border: '0.67px solid #E8ECF0',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      '&:hover': {
                        background: '#EEF4FF',
                        borderColor: '#C7D7FE',
                      },
                    }}
                  >
                    <DescriptionOutlinedIcon
                      sx={{ fontSize: 12, color: '#2F6FED' }}
                    />
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 500,
                        fontSize: pxToRem(12.5),
                        color: '#374151',
                      }}
                    >
                      {doc.document_type
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Typography>
                  </RowStack>
                </ImagePdfViewer>
              ))
            )}
          </RowStack>
        </Stack>

        {/* Footer Actions */}
        {application.status === 'Pending' && (
          <RowStack spacing={'12px'} sx={{ padding: '20px 24px' }}>
            <ActionButton
              label="Reject"
              bg="#FEF2F2"
              color="#EF4444"
              border="#FECACA"
              onClick={onReject}
            />
            <ActionButton
              label="Request Docs"
              bg="#F7F9FB"
              color="#374151"
              border="#E8ECF0"
              onClick={onRequestDocs}
            />
            <ActionButton
              label="Approve"
              bg="#059669"
              color="#FFFFFF"
              onClick={onApprove}
            />
          </RowStack>
        )}

        {application.status === 'Rejected' && (
          <RowStack sx={{ padding: '20px 24px' }}>
            <ActionButton
              label="Approve"
              bg="#059669"
              color="#FFFFFF"
              fullWidth
              onClick={onApprove}
            />
          </RowStack>
        )}
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
      letterSpacing: '0.08em',
      color: '#9CA3AF',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </Typography>
);

const InfoColumn = ({
  label,
  value,
  hasBorder,
}: {
  label: string;
  value: string;
  hasBorder?: boolean;
}) => (
  <Stack
    spacing={'6px'}
    sx={{
      flex: 1,
      paddingRight: hasBorder ? '20px' : 0,
      borderRight: hasBorder ? '0.67px solid #F0F4F8' : 'none',
    }}
  >
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
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(13.5),
        color: '#111827',
      }}
    >
      {value}
    </Typography>
  </Stack>
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
    <RowStack spacing={'8px'}>
      {icon}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12.5),
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
        fontSize: pxToRem(13),
        color: '#111827',
      }}
    >
      {value}
    </Typography>
  </RowStack>
);

const ActionButton = ({
  label,
  bg,
  color,
  border,
  fullWidth,
  onClick,
}: {
  label: string;
  bg: string;
  color: string;
  border?: string;
  fullWidth?: boolean;
  onClick?: () => void;
}) => (
  <Box
    onClick={onClick}
    sx={{
      flex: fullWidth ? 1 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '41px',
      background: bg,
      border: border ? `0.67px solid ${border}` : 'none',
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
        color,
        textAlign: 'center',
      }}
    >
      {label}
    </Typography>
  </Box>
);
