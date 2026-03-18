import { Stack, Typography } from '@mui/material';
import {
  Centered,
  RowStack,
  StyledImage,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { StaticImageData } from 'next/image';

type RecentActivityProps = {
  iconBg: string;
  icon: StaticImageData;
  activityTitle: string;
  activityDesc: string;
  time: string;
};

export const RecentActivity = ({
  iconBg,
  icon,
  activityTitle,
  activityDesc,
  time,
}: RecentActivityProps) => {
  return (
    <RowStack width="100%" justifyContent={'space-between'}>
      <RowStack spacing={'12px'}>
        <Centered
          sx={{
            width: '32px',
            height: '32px',
            background: iconBg,
            borderRadius: '10px',
          }}
        >
          <StyledImage
            src={icon}
            alt="icon"
            sx={{
              width: '15px',
              height: '15px',
            }}
          />
        </Centered>
        <Stack spacing={0.3}>
          <Typography
            sx={{
              color: 'text.primary',
              fontWeight: 500,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
            }}
          >
            {activityTitle}
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: pxToRem(12),
              lineHeight: '18px',
            }}
          >
            {activityDesc}
          </Typography>
        </Stack>
      </RowStack>
      <Typography
        sx={{
          color: '#9CA3AF',
          fontWeight: 400,
          fontFamily: (theme) => theme.typography.fontFamily,
          fontSize: pxToRem(11),
          lineHeight: '16px',
        }}
      >
        {time}
      </Typography>
    </RowStack>
  );
};
