'use client';

import { useMemo, useState } from 'react';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import dayjs from 'dayjs';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  pxToRem,
  useListPricingLogs,
  useExportPricingLogs,
  useResolvedApiQuery,
  PricingLog,
} from '../../../common';

type LogRow = {
  id: string;
  logId: string;
  adminName: string;
  adminAvatar: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  city: string;
  change: string;
  before: string;
  after: string;
  timestamp: string;
};

export const PricingLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { mutateAsync: exportLogs, isPending: isExporting } =
    useExportPricingLogs();

  const { data: logsData } = useResolvedApiQuery(
    useListPricingLogs,
    null,
    {
      page,
      page_size: pageSize,
      search: searchQuery || null,
    }
  );

  const handleExport = async () => {
    try {
      const response = await exportLogs({
        search: searchQuery || null,
      });

      if (response.data.success && response.data.data) {
        const { download_url } = response.data.data;

        // Fetch the file and download it
        const fileResponse = await fetch(download_url);
        const blob = await fileResponse.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = download_url.split('/').pop() ?? 'pricing-logs.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      console.error('Failed to download export', err);
    }
  };

  // Helper function to map category to colors
  const getCategoryStyle = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('fare')) {
      return { color: '#2F6FED', bg: '#EBF2FF' };
    } else if (categoryLower.includes('surcharge')) {
      return { color: '#D97706', bg: '#FFFBEB' };
    } else if (categoryLower.includes('package')) {
      return { color: '#6366F1', bg: '#EEF2FF' };
    }
    return { color: '#6B7280', bg: '#F3F4F6' };
  };

  const mappedLogs: LogRow[] = useMemo(() => {
    if (!logsData?.items) return [];

    return logsData.items.map((log: PricingLog) => {
      const style = getCategoryStyle(log.category);
      const initials = log.admin_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      return {
        id: log.id,
        logId: log.id.slice(0, 8),
        adminName: log.admin_name,
        adminAvatar: initials,
        category: log.category,
        categoryColor: style.color,
        categoryBg: style.bg,
        city: log.city || 'N/A',
        change: log.change_description,
        before: log.before_value || '—',
        after: log.after_value || '—',
        timestamp: dayjs(log.created_at).format('MMM DD, YYYY · h:mm A'),
      };
    });
  }, [logsData]);

  const columns: GridColSpec<LogRow>[] = [
    {
      field: 'logId',
      headerName: 'Log ID',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'adminName',
      headerName: 'Admin',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <RowStack spacing={'10px'}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: pxToRem(10),
              fontWeight: 600,
              background: '#EBF2FF',
              color: '#2F6FED',
            }}
          >
            {params.row.adminAvatar}
          </Avatar>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(13),
              color: '#111827',
            }}
          >
            {params.value}
          </Typography>
        </RowStack>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            background: params.row.categoryBg,
            color: params.row.categoryColor,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(11.5),
            borderRadius: '100px',
            height: 24,
          }}
        />
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'change',
      headerName: 'Change',
      flex: 1.2,
      minWidth: 170,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'before',
      headerName: 'Before',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#9CA3AF',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'after',
      headerName: 'After',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#10B981',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(12.5),
            color: '#9CA3AF',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <DashboardTitleAndDesc
            title="Pricing Logs"
            desc="Track and review all pricing changes, updates, and system-generated adjustments for transparency and auditing."
          />
          <AppButton
            variant="contained"
            startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={handleExport}
            isLoading={isExporting}
            disabled={isExporting}
            sx={{
              background: '#FFFFFF',
              border: '0.67px solid #E8ECF0',
              borderRadius: '14px',
              padding: '10px 20px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: pxToRem(13),
              color: '#374151',
              boxShadow: 'none',
              '&:hover': {
                background: '#F7F9FB',
                boxShadow: 'none',
              },
            }}
          >
            Export Logs
          </AppButton>
        </RowStack>

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={mappedLogs}
          initialPageSize={pageSize}
          disableRowClick
          totalRows={logsData?.total || 0}
          page={page}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <RowStack justifyContent="space-between" width="100%">
            {/* Left: Title + Description */}
            <Stack spacing={'4px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(18),
                  color: '#111827',
                }}
              >
                Pricing Change History
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#6B7280',
                }}
              >
                Audit trail of all fare, surcharge, and package edits
              </Typography>
            </Stack>

            {/* Right: Search */}
            <AppSearchField
              name="search"
              placeholder="Search logs…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              boxProps={{
                sx: { width: '240px' },
              }}
            />
          </RowStack>
        </AppGridtable>
      </Stack>
    </AppDashboardLayout>
  );
};
