import { Avatar, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../components';
import { pxToRem } from '../../../../../../../common';
import { StaticImageData } from 'next/image';

type AdminInfoProp = {
  userName: string;
  userMail: string;
  icon: StaticImageData;
  isSideBarOpen: boolean;
};

export const AdminInfo = ({
  userName,
  userMail,
  icon,
  isSideBarOpen,
}: AdminInfoProp) => {
  return (
    <RowStack
      spacing={'12px'}
      sx={{
        padding: '10px 17px 10px 12px',
        background: '#CCCCCC17',
      }}
    >
      <Avatar src={icon.src} alt="user" />
      {isSideBarOpen && (
        <Stack spacing={0.3}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
              fontStyle: 'semibold',
              color: (theme) => theme.dashboard.deepBlue,
            }}
          >
            {userName}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              lineHeight: '16.5px',
              fontStyle: 'regular',
              color: '#6B7280',
            }}
          >
            {userMail}
          </Typography>
        </Stack>
      )}
    </RowStack>
  );
};
