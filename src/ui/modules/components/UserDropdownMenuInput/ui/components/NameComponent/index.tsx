'use client';

import { RowStack } from '@flxfleet-frontend-apps/component-library';
import { Avatar, Skeleton, Stack } from '@mui/material';
import React, { useMemo } from 'react';
import { useGetUserProfileInfo, useResolvedApiQuery } from '@/common/hooks';
import { Tabletext } from '@/ui/modules/components/TableText';

export type NameComponentProps = {
  userId: string;
};

export const NameComponent = ({ userId }: NameComponentProps) => {
  const payload = useMemo(() => ({ userId }), [userId]);

  const { data: admin, isFetching } = useResolvedApiQuery(
    useGetUserProfileInfo,
    null,
    payload
  );

  if (isFetching || admin === null) {
    return (
      <RowStack spacing={'10px'} width={'100%'}>
        <Skeleton variant="circular" height={40} width={50} />
        <Stack spacing={'10px'} width={'100%'}>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        </Stack>
      </RowStack>
    );
  }

  return (
    <RowStack spacing={'10px'}>
      <Avatar
        src={admin.profilePhotoUri}
        alt={admin.firstName}
        sx={{
          backgroundColor: !admin.profilePhotoUri
            ? 'primary.main'
            : 'transparent',
          color: (theme) => theme.palette.text.primary,
        }}
      >
        {`${admin.lastName.charAt(0)}${admin.firstName.charAt(0)}`}
      </Avatar>

      <Stack spacing={1}>
        <Tabletext text={`${admin.lastName} ${admin.firstName}`} />
        <Tabletext text={admin.email} />
      </Stack>
    </RowStack>
  );
};
