'use client';

import {
  DataGrid,
  DataGridProps,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridSortDirection,
  MuiEvent,
} from '@mui/x-data-grid';
import { DataGridLoader, DataGridPagination } from './ui/components';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { pxToRem } from '../../../../common';
import { alpha, Box, useTheme } from '@mui/material';

export type GridRow = { id: string | number };

export type GridColSpec<T extends GridRow> = Omit<
  GridColDef<T>,
  'field' | 'headerName'
> & {
  field: Extract<keyof T, string> | string;
  headerName: string;
};

export type GridSortSpec<T extends GridRow> = {
  field: Extract<keyof T, string> | string;
  sort: GridSortDirection;
};

export type GridDataFetchResult<T extends GridRow> = {
  rows: T[];
  totalRows: number;
};

export type GridDataFetcher<T extends GridRow> = (
  page: number,
  pageSize: number,
  sortModel: GridSortSpec<T>[]
) => Promise<GridDataFetchResult<T>>;

export type AppDataGridProps<T extends GridRow> = Omit<
  DataGridProps,
  'columns' | 'rows' | 'onRowClick'
> & {
  columns: GridColSpec<T>[];
  fetchData: GridDataFetcher<T>;
  disableRowClick?: boolean;
  initialPageSize?: number;
  onRowClick?: (
    row: T,
    event: MuiEvent<MouseEvent>,
    details: GridCallbackDetails
  ) => void;
};

export const AppDataGrid = <T extends GridRow>({
  columns,
  fetchData,
  sx,
  disableRowClick,
  onRowClick,
  initialPageSize = 10, // Changed default to 10
  slots,
  pageSizeOptions = [5, 10, 15, 25, 50, 100], // Added default page size options
  ...moreGridProps
}: AppDataGridProps<T>) => {
  const [rows, setRows] = useState<T[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: initialPageSize,
    page: 0,
  });
  const [sortModel, setSortModel] = useState<GridSortSpec<T>[]>([]);

  const rowClickHandler: DataGridProps['onRowClick'] = (
    params,
    event,
    details
  ) => {
    if (disableRowClick || !onRowClick) return;
    onRowClick(params.row, event, details);
  };

  const handleRowClick = useCallback(rowClickHandler, [onRowClick]);

  useEffect(() => {
    const loadData = async () => {
      const { page, pageSize } = paginationModel;

      setLoading(true);
      const data = await fetchData(page + 1, pageSize, sortModel);
      setRows(data.rows);
      setRowCount(data.totalRows);
      setLoading(false);
    };

    loadData();
  }, [paginationModel, sortModel, fetchData]);

  return (
    <Box
      sx={
        {
          // width: '100%',
          // height: 600,
          // background: 'red'
        }
      }
    >
      <DataGrid<T>
        columns={columns}
        rows={rows}
        rowCount={rowCount}
        loading={loading}
        paginationModel={paginationModel}
        // pageSizeOptions={pageSizeOptions}
        rowHeight={60}
        disableColumnSelector
        disableRowSelectionOnClick
        disableColumnMenu
        sx={{
          // width: '100%',
          '&, [class^=MuiDataGrid]': {
            border: 'none',
          },
          '& .MuiDataGrid-container--top [role=row]': {
            backgroundColor: '#F9FAFB',
            borderRadius: '16px',
          },
          '& .MuiDataGrid-columnHeaders': {},
          '& .MuiDataGrid-columnHeaderRow': {},
          '& .MuiDataGrid-columnHeader': {
            borderBottom: 'none !important',
            background: alpha(theme.palette.primary.main, 0.1),
          },
          '& .MuiDataGrid-filler': {
            borderBottom: 'none !important',
            height: '0 !important',

            '& div': {
              borderTop: 'none',
            },
          },
          '& .MuiDataGrid-columnSeparator': {
            '&:hover': {
              color: '#010005',
            },
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: 'primary.main',
            fontWeight: 106,
            fontSize: pxToRem(16),
            lineHeight: '20px',
            fontFamily: (theme) => theme.typography.fontFamily,
          },
          '& .MuiDataGrid-row': {
            position: 'relative',
            backgroundColor: 'inherit',
            // marginTop: "8px",
            borderBottom: `1px solid #EAECF0`,
            borderRadius: '4px',
            boxShadow: 'none',
            transition: '.3s ease',
            cursor: disableRowClick ? 'default' : 'pointer',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',

            // "&:hover": {
            //   backgroundColor: disableRowClick ? row.background : row.hoverBackground,
            //   border: `1px solid ${row.hoverBorder}`,
            //   boxShadow: disableRowClick ? "none" : row.hoverShadow,
            //   transition: ".3s ease",
            // },
          },
          '& .MuiDataGrid-cell': {
            color: '#101828',
            fontWeight: 400,
            fontSize: pxToRem(14),
            lineHeight: '20px',
            paragraph: '14px',
            mt: '25px',
            fontFamily: (theme) => theme.typography.fontFamily,
          },
          '& .MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within, .MuiDataGrid-cell:focus, .MuiDataGrid-columnHeader:focus':
            {
              outline: 'none',
            },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #EAECF0',
          },
          ...sx,
        }}
        {...moreGridProps}
        pagination
        onRowClick={handleRowClick}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={setSortModel}
        sortModel={sortModel}
        slots={{
          pagination: DataGridPagination,
          loadingOverlay: DataGridLoader,
          ...slots,
        }}
      />
    </Box>
  );
};
