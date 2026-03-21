import { Box, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import StarIcon from '@mui/icons-material/Star';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <RowStack spacing={'8px'} width="100%">
    <RowStack spacing={'6px'} sx={{ width: 90 }}>
      <Box sx={{ color: '#9CA3AF', display: 'flex' }}>{icon}</Box>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(11.5),
          lineHeight: '17.25px',
          color: (theme) => theme.color.lightGrey,
        }}
      >
        {label}
      </Typography>
    </RowStack>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(12),
        lineHeight: '18px',
        color: (theme) => theme.color.grey,
        flex: 1,
      }}
    >
      {value}
    </Typography>
  </RowStack>
);

type PersonCardProps = {
  initials: string;
  initialsColor?: string;
  name: string;
  rating?: number;
  badge?: string;
  badgeColor?: string;
  phone?: string;
  email?: string;
  insurance?: string;
  memberSince?: string;
  vehicle?: string;
  plate?: string;
  totalTrips?: string;
  specialty?: string;
  certs?: string;
  assignments?: string;
};

export const PersonCard = ({
  initials,
  initialsColor = '#2F6FED',
  name,
  rating,
  badge,
  badgeColor,
  phone,
  email,
  insurance,
  memberSince,
  vehicle,
  plate,
  totalTrips,
  specialty,
  certs,
  assignments,
}: PersonCardProps) => {
  const iconSx = { fontSize: 11, color: '#9CA3AF' };

  return (
    <Stack spacing={'12px'}>
      <RowStack spacing={'12px'}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: `${initialsColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(14),
              color: initialsColor,
            }}
          >
            {initials}
          </Typography>
        </Box>
        <Stack spacing={'2px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(14),
              lineHeight: '21px',
              color: (theme) => theme.color.deepBlue,
            }}
          >
            {name}
          </Typography>
          <RowStack spacing={'6px'}>
            {rating && (
              <RowStack spacing={'2px'}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    sx={{
                      fontSize: 9,
                      color: i < Math.floor(rating) ? '#F59E0B' : '#D1D5DB',
                    }}
                  />
                ))}
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(11),
                    color: (theme) => theme.color.grey,
                    ml: '4px',
                  }}
                >
                  {rating}
                </Typography>
              </RowStack>
            )}
            {badge && (
              <Box
                sx={{
                  background: `${badgeColor || '#059669'}15`,
                  borderRadius: '12px',
                  padding: '2px 8px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(7),
                    color: badgeColor || '#059669',
                  }}
                >
                  {badge}
                </Typography>
              </Box>
            )}
          </RowStack>
        </Stack>
      </RowStack>

      <Stack spacing={'8px'}>
        {phone && (
          <InfoRow
            icon={<PhoneOutlinedIcon sx={iconSx} />}
            label="Phone"
            value={phone}
          />
        )}
        {email && (
          <InfoRow
            icon={<EmailOutlinedIcon sx={iconSx} />}
            label="Email"
            value={email}
          />
        )}
        {insurance && (
          <InfoRow
            icon={<BadgeOutlinedIcon sx={iconSx} />}
            label="Insurance"
            value={insurance}
          />
        )}
        {memberSince && (
          <InfoRow
            icon={<CalendarTodayOutlinedIcon sx={iconSx} />}
            label="Member Since"
            value={memberSince}
          />
        )}
        {vehicle && (
          <InfoRow
            icon={<DirectionsCarOutlinedIcon sx={iconSx} />}
            label="Vehicle"
            value={vehicle}
          />
        )}
        {plate && (
          <InfoRow
            icon={<BadgeOutlinedIcon sx={iconSx} />}
            label="Plate"
            value={plate}
          />
        )}
        {totalTrips && (
          <InfoRow
            icon={<WorkOutlineOutlinedIcon sx={iconSx} />}
            label="Total Trips"
            value={totalTrips}
          />
        )}
        {specialty && (
          <InfoRow
            icon={<WorkOutlineOutlinedIcon sx={iconSx} />}
            label="Specialty"
            value={specialty}
          />
        )}
        {certs && (
          <InfoRow
            icon={<VerifiedOutlinedIcon sx={iconSx} />}
            label="Certs"
            value={certs}
          />
        )}
        {assignments && (
          <InfoRow
            icon={<AssignmentOutlinedIcon sx={iconSx} />}
            label="Assignments"
            value={assignments}
          />
        )}
      </Stack>
    </Stack>
  );
};
