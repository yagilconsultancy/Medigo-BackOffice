'use client';

import { useState, useMemo } from 'react';
import { IconButton, Skeleton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import {
  pxToRem,
  useGetAdminInvitations,
  useAdminInvitationsApi,
} from '../../../common';
import dayjs from 'dayjs';
import { GridColSpec } from '../../modules/components/GridTable';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { EmptyState } from '../../modules/blocks';
import { InviteAdminModal } from './ui/components';

type InvitationRow = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  invitedBy: string;
  status: string;
  expiresAt: string;
  createdAt: string;
};

export const AdminInvitationsPage = () => {
  const [page, setPage] = useState(1);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const { data: invitationsData, isFetching: isFetchingInvitations } =
    useGetAdminInvitations({ offset: 0, limit: 20 });
  const { revokeInvitation } = useAdminInvitationsApi();

  const invitations = useMemo(() => {
    const items = invitationsData?.data;
    if (!items?.length) return [];
    return items.map((item) => ({
      id: item.id,
      email: item.email,
      fullName: item.full_name,
      role: item.role_display_name,
      invitedBy: item.invited_by_name,
      status: item.status,
      expiresAt: dayjs(item.expires_at).format('MMM D, YYYY'),
      createdAt: dayjs(item.created_at).format('MMM D, YYYY'),
    }));
  }, [invitationsData?.data]);

  const handleInviteAdmin = () => {
    setInviteModalOpen(true);
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    await revokeInvitation(invitationId);
  };

  const columns: GridColSpec<InvitationRow>[] = [
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            color: (theme) => theme.color.deepBlue,
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'fullName',
      headerName: 'Full Name',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'invitedBy',
      headerName: 'Invited By',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) => (
        <Stack
          sx={{
            background:
              params.value === 'pending'
                ? '#FFFBEB'
                : params.value === 'accepted'
                  ? '#ECFDF5'
                  : '#FEF2F2',
            color:
              params.value === 'pending'
                ? '#F59E0B'
                : params.value === 'accepted'
                  ? '#059669'
                  : '#EF4444',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: pxToRem(11.5),
            fontWeight: 600,
            textAlign: 'center',
            textTransform: 'capitalize',
          }}
        >
          {params.value}
        </Stack>
      ),
    },
    {
      field: 'expiresAt',
      headerName: 'Expires At',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'actions' as string,
      headerName: 'Actions',
      flex: 0.5,
      minWidth: 60,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          sx={{ color: '#EF4444' }}
          onClick={() => handleRevokeInvitation(params.row.id)}
        >
          <DeleteOutlineIcon sx={{ fontSize: 15 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={3}>
        <RowStack justifyContent="space-between">
          <DashboardTitleAndDesc
            title="Admin Invitations"
            desc="Manage pending admin invitations"
          />
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleInviteAdmin}
            sx={{
              textTransform: 'none',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              padding: '10px 20px',
              borderRadius: '10px',
              background: (theme) => theme.palette.primary.main,
              color: '#FFFFFF',
              '&:hover': {
                background: (theme) => theme.palette.primary.dark,
              },
            }}
          >
            Invite Admin
          </AppButton>
        </RowStack>

        {/* Invitations Table */}
        {isFetchingInvitations ? (
          <Stack spacing={'12px'}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={80}
                sx={{ borderRadius: '14px' }}
              />
            ))}
          </Stack>
        ) : (
          <AppGridtable
            columns={columns}
            data={invitations}
            emptyState={<EmptyState animationSrc="/empty.json" />}
            initialPageSize={10}
            pageSizeOptions={[10, 20, 50]}
            totalRows={invitationsData?.total ?? 0}
            sx={{
              height: 'auto',
              width: '100%',
            }}
          >
            <RowStack justifyContent="space-between" width="100%">
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(15),
                    color: (theme) => theme.color.deepBlue,
                  }}
                >
                  Pending Invitations
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: (theme) => theme.color.lightGrey,
                  }}
                >
                  {invitationsData?.total ?? 0} invitations
                </Typography>
              </Stack>
            </RowStack>
          </AppGridtable>
        )}
      </Stack>

      {/* Invite Admin Modal */}
      <InviteAdminModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
    </AppDashboardLayout>
  );
};
