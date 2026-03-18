import { Avatar, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import StarIcon from '@mui/icons-material/Star';

type DriverComponentProps = {
  num: string;
  firstName: string;
  lastName: string;
  trips: string;
  value: number;
  avatarBg: string;
};

export const DriverComponent = ({
  num,
  firstName,
  lastName,
  trips,
  value,
  avatarBg,
}: DriverComponentProps) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  return (
    <RowStack
      width={'100%'}
      justifyContent={'space-between'}
      sx={{
        background: '#F7F9FB',
        padding: '12px 16px',
        borderRadius: '14px',
      }}
    >
      <RowStack spacing={'12px'} flex={1}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontStyle: 'bold',
            fontSize: pxToRem(13),
            lineHeight: '19.5px',
            color: 'text.secondary',
          }}
        >{`#${num}`}</Typography>
        <Avatar
          sx={{
            bgcolor: avatarBg,
            width: 40,
            height: 40,
            fontSize: pxToRem(14),
            fontWeight: 600,
          }}
        >
          {initials}
        </Avatar>
        <Stack spacing={0.3}>
          <Typography
            sx={{
              color: 'text.primary',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
            }}
          >{`${firstName} ${lastName}`}</Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              lineHeight: '18px',
            }}
          >{`${trips} trips`}</Typography>
        </Stack>
      </RowStack>
      <RowStack spacing={0.5}>
        <StarIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            lineHeight: '19.5px',
            color: '#374151',
          }}
        >
          {value.toFixed(1)}
        </Typography>
      </RowStack>
    </RowStack>
  );
};
