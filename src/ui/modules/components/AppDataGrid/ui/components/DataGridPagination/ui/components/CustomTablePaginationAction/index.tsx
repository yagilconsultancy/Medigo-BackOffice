import React from 'react';
import { Box, IconButton, Button, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { pxToRem } from '../../../../../../../../../../common';

interface CustomTablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

export const CustomTablePaginationActions = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: CustomTablePaginationActionsProps) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  // Function to generate page numbers with "..." when needed
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 10) {
      // Show all pages if <= 10
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      // If current page is far from start, add "..."
      if (page > 3) pages.push('...');

      // Add up to 3 pages before current page
      for (
        let i = Math.max(1, page - 2);
        i <= Math.min(totalPages - 2, page + 2);
        i++
      ) {
        pages.push(i);
      }

      // If current page is far from end, add "..."
      if (page < totalPages - 4) pages.push('...');

      // Always show last page
      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      {/* Previous Button */}
      <IconButton
        onClick={(event) => onPageChange(event, page - 1)}
        disabled={page === 0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: page === 0 ? '#ccc' : '#000',
        }}
      >
        <ChevronLeft />
        <Typography
          sx={{ fontWeight: 500, fontSize: pxToRem(14), marginLeft: '5px' }}
        >
          Previous
        </Typography>
      </IconButton>

      {/* Page Numbers */}
      <Box display="flex" alignItems="center">
        {getPageNumbers().map((p, index) =>
          p === '...' ? (
            <Typography
              key={index}
              sx={{ marginX: '8px', fontSize: pxToRem(14) }}
            >
              ...
            </Typography>
          ) : (
            <Button
              key={p}
              variant={page === p ? 'contained' : 'text'}
              color={page === p ? 'primary' : 'inherit'}
              onClick={(event) => onPageChange(event, Number(p))}
              sx={{
                minWidth: '32px',
                height: '32px',
                marginX: '4px',
                borderRadius: '5px',
              }}
            >
              {Number(p) + 1}
            </Button>
          )
        )}
      </Box>

      {/* Next Button */}
      <IconButton
        onClick={(event) => onPageChange(event, page + 1)}
        disabled={page >= totalPages - 1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: page >= totalPages - 1 ? '#ccc' : '#000',
        }}
      >
        <Typography
          sx={{ fontWeight: 500, fontSize: pxToRem(14), marginRight: '5px' }}
        >
          Next
        </Typography>
        <ChevronRight />
      </IconButton>
    </Box>
  );
};
