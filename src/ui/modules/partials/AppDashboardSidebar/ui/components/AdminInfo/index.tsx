import { Avatar, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../components';
import {
  pxToRem,
  useResolvedApiQuery,
  useGetUserProfile,
} from '../../../../../../../common';

type AdminInfoProp = {
  isSideBarOpen: boolean;
};

export const AdminInfo = ({ isSideBarOpen }: AdminInfoProp) => {
  // Fetch user profile from API
  const { data: userProfile } = useResolvedApiQuery(useGetUserProfile, null);

  // Generate initials from first and last name
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  };

  const initials = getInitials(userProfile?.first_name, userProfile?.last_name);
  const fullName =
    `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim();
  const email = userProfile?.email || '';

  return (
    <RowStack
      spacing={'12px'}
      sx={{
        padding: '10px 17px 10px 12px',
        background: '#CCCCCC17',
      }}
    >
      <Avatar
        src={userProfile?.avatar_url}
        alt={fullName}
        sx={{
          bgcolor: '#2F6FED',
          color: '#FFFFFF',
          fontWeight: 600,
          fontSize: pxToRem(13),
        }}
      >
        {!userProfile?.avatar_url && initials}
      </Avatar>
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
            {fullName}
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
            {email}
          </Typography>
        </Stack>
      )}
    </RowStack>
  );
};
