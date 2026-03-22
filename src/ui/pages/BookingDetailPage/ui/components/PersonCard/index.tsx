import { Box, Stack, Typography } from '@mui/material';
import { RowStack, StyledImage } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import StarIcon from '@mui/icons-material/Star';
import phoneIcon from '../../assets/icons/phone-icon.svg';
import emailIcon from '../../assets/icons/email-icon.svg';
import insuranceIcon from '../../assets/icons/insurance-icon.svg';
import driverinfoIcon from '../../assets/icons/driverinfo-icon.svg';
import totaltripsIcon from '../../assets/icons/totaltrips-icon.svg';
import specialtyIcon from '../../assets/icons/specialty-icon.svg';
import certsIcon from '../../assets/icons/certs-icon.svg';

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
  const iconSize = { width: 11, height: 11 };

  const infoRows = [
    {
      icon: <StyledImage src={phoneIcon} alt="phone" {...iconSize} />,
      label: 'Phone',
      value: phone,
    },
    {
      icon: <StyledImage src={emailIcon} alt="email" {...iconSize} />,
      label: 'Email',
      value: email,
    },
    {
      icon: <StyledImage src={insuranceIcon} alt="insurance" {...iconSize} />,
      label: 'Insurance',
      value: insurance,
    },
    {
      icon: (
        <StyledImage src={insuranceIcon} alt="member since" {...iconSize} />
      ),
      label: 'Member Since',
      value: memberSince,
    },
    {
      icon: <StyledImage src={driverinfoIcon} alt="vehicle" {...iconSize} />,
      label: 'Vehicle',
      value: vehicle,
    },
    {
      icon: <StyledImage src={insuranceIcon} alt="plate" {...iconSize} />,
      label: 'Plate',
      value: plate,
    },
    {
      icon: (
        <StyledImage src={totaltripsIcon} alt="total trips" {...iconSize} />
      ),
      label: 'Total Trips',
      value: totalTrips,
    },
    {
      icon: <StyledImage src={specialtyIcon} alt="specialty" {...iconSize} />,
      label: 'Specialty',
      value: specialty,
    },
    {
      icon: <StyledImage src={certsIcon} alt="certs" {...iconSize} />,
      label: 'Certs',
      value: certs,
    },
    {
      icon: (
        <StyledImage src={totaltripsIcon} alt="assignments" {...iconSize} />
      ),
      label: 'Assignments',
      value: assignments,
    },
  ].filter((row) => row.value);

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
        {infoRows.map((row) => (
          <InfoRow
            key={row.label}
            icon={row.icon}
            label={row.label}
            value={row.value!}
          />
        ))}
      </Stack>
    </Stack>
  );
};
