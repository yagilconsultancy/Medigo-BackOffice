import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
  useTheme,
  Collapse,
} from '@mui/material';
// import calendar from "@/ui/pages/Users/ui/assets/icons/calendar.svg";
// import arrowUp from "@/ui/pages/Users/ui/assets/icons/arrow_up.svg";
import { RowStack } from '../RowStack';
import { StyledImage } from '../StyledImage';
import { pxToRem, useDateStore } from '../../../../common';
import { ArrowUpwardOutlined, CalendarMonth } from '@mui/icons-material';

// Initialize dayjs
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));
dayjs.extend(require('dayjs/plugin/quarterOfYear'));
dayjs.extend(require('dayjs/plugin/customParseFormat'));
dayjs.extend(require('dayjs/plugin/isSameOrBefore'));
dayjs.extend(require('dayjs/plugin/isSameOrAfter'));

// DateRange and DateFilter types
interface DateRange {
  startDate: Dayjs;
  endDate: Dayjs;
  label: string;
}

interface DateFilter {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  label: string;
}

const getPresetRanges = (): DateRange[] => {
  const today = dayjs();
  return [
    {
      startDate: today.startOf('day'),
      endDate: today.endOf('day'),
      label: 'Today',
    },
    {
      startDate: today.subtract(7, 'day').startOf('day'),
      endDate: today.endOf('day'),
      label: 'Last 7 days',
    },
    {
      startDate: today.subtract(14, 'day').startOf('day'),
      endDate: today.endOf('day'),
      label: 'Last 14 days',
    },
    {
      startDate: today.subtract(30, 'day').startOf('day'),
      endDate: today.endOf('day'),
      label: 'Last 30 days',
    },
    {
      startDate: today.startOf('month'),
      endDate: today.endOf('month'),
      label: 'This month',
    },
    {
      startDate: today.subtract(1, 'month').startOf('month'),
      endDate: today.subtract(1, 'month').endOf('month'),
      label: 'Last month',
    },
    {
      startDate: today.startOf('quarter'),
      endDate: today.endOf('quarter'),
      label: 'This quarter',
    },
    {
      startDate: today.startOf('year'),
      endDate: today.endOf('year'),
      label: 'This year',
    },
    {
      startDate: today.subtract(1, 'year').startOf('year'),
      endDate: today.subtract(1, 'year').endOf('year'),
      label: 'Last year',
    },
    {
      startDate: today.subtract(3, 'month').startOf('day'),
      endDate: today.endOf('day'),
      label: 'Last 3 months',
    },
    {
      startDate: today.subtract(6, 'month').startOf('day'),
      endDate: today.endOf('day'),
      label: 'Last 6 months',
    },
  ];
};

export function DateComponent() {
  const theme = useTheme();
  const today = dayjs();
  const { dateRange, setDateRange } = useDateStore();
  // console.log("Date Range", dateRange);

  // const [dateFilter, setDateFilter] = useState<DateFilter>({
  //   startDate: initialStartDate ? dayjs(initialStartDate) : null,
  //   endDate: initialEndDate ? dayjs(initialEndDate) : null,
  //   label: initialStartDate && initialEndDate ? `${dayjs(initialStartDate).format("MMM D, YYYY")} - ${dayjs(initialEndDate).format("MMM D, YYYY")}` : "Select date range",
  // });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tempCustomDates, setTempCustomDates] = useState<{
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  }>({
    startDate: dateRange.startDate ? dayjs(dateRange.startDate) : null,
    endDate: dateRange.endDate ? dayjs(dateRange.endDate) : null,
  });
  // console.log("Date", tempCustomDates);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDateFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDateFilterClose = () => {
    setAnchorEl(null);
    setShowCustomDatePicker(false);
    setTempCustomDates({ startDate: null, endDate: null });
  };

  const handlePresetRangeSelect = (range: DateRange) => {
    setDateRange(
      range.startDate.format('YYYY-MM-DD'),
      range.endDate.format('YYYY-MM-DD')
    );
    handleDateFilterClose();
  };

  const handleCustomRangeSelect = () => {
    setShowCustomDatePicker(true);
    setTempCustomDates({
      startDate: dateRange.startDate ? dayjs(dateRange.startDate) : null,
      endDate: dateRange.endDate ? dayjs(dateRange.endDate) : null,
    });
  };

  const handleApplyCustomRange = () => {
    if (tempCustomDates.startDate && tempCustomDates.endDate) {
      if (
        tempCustomDates.startDate.isAfter(today) ||
        tempCustomDates.endDate.isAfter(today)
      ) {
        setErrorMessage('You cannot select a date in the future.');
      } else {
        // Convert to string format before setting in the context
        setDateRange(
          tempCustomDates.startDate.format('YYYY-MM-DD'),
          tempCustomDates.endDate.format('YYYY-MM-DD')
        );
        // onDateRangeChange(tempCustomDates.startDate.format("YYYY-MM-DD"), tempCustomDates.endDate.format("YYYY-MM-DD"));
        setErrorMessage(null); // Clear the error message
      }
    }
  };

  const handleClearDateFilter = () => {
    setDateRange(null, null);
    // onDateRangeChange(null, null);
    handleDateFilterClose();
  };

  const open = Boolean(anchorEl);
  const presetRanges = getPresetRanges();

  return (
    <Box>
      <RowStack
        onClick={handleDateFilterClick}
        sx={{
          padding: '15.9px 13.25px',
          border: `1.32px solid ${theme.dashboard.borderColor}`,
          borderRadius: '8px',
          gap: '8px',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          minWidth: '200px',
          width: 'fit-content',
        }}
      >
        <CalendarMonth />
        {/* <StyledImage src={calendar} alt="calendar" /> */}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: pxToRem(14),
            lineHeight: '19.07px',
          }}
        >
          {dateRange.label}
        </Typography>
        <ArrowUpwardOutlined />
        {/* <StyledImage src={arrowUp} alt="arrow" /> */}
      </RowStack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleDateFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {!showCustomDatePicker ? (
          <Box sx={{ width: '300px' }}>
            <List sx={{ p: 0 }}>
              {presetRanges.map((range, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handlePresetRangeSelect(range)}
                  sx={{
                    py: 1,
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
                  }}
                >
                  <ListItemText primary={range.label} />
                </ListItemButton>
              ))}
              <Divider sx={{ marginTop: 1 }} />
              <ListItemButton
                onClick={handleCustomRangeSelect}
                sx={{
                  py: 1,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
                }}
              >
                <ListItemText primary="Custom range..." />
              </ListItemButton>
            </List>
          </Box>
        ) : (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ width: '300px', padding: '15px' }}>
              <Box sx={{ mb: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={tempCustomDates.startDate}
                  onChange={(newValue) =>
                    setTempCustomDates((prev) => ({
                      ...prev,
                      startDate: newValue,
                    }))
                  }
                  maxDate={today} // Ensure the selected start date is not in the future
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <DatePicker
                  label="End Date"
                  value={tempCustomDates.endDate}
                  onChange={(newValue) =>
                    setTempCustomDates((prev) => ({
                      ...prev,
                      endDate: newValue,
                    }))
                  }
                  minDate={tempCustomDates.startDate || undefined}
                  maxDate={today} // Ensure the selected end date is not in the future
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                    },
                  }}
                />
              </Box>

              <Collapse in={Boolean(errorMessage)}>
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Typography>
              </Collapse>

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setShowCustomDatePicker(false)}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleApplyCustomRange}
                  disabled={
                    !tempCustomDates.startDate || !tempCustomDates.endDate
                  }
                >
                  Apply
                </Button>
              </Box>
            </Box>
          </LocalizationProvider>
        )}
        {!showCustomDatePicker && dateRange.startDate && (
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleClearDateFilter} color="primary">
              Clear Filter
            </Button>
          </Box>
        )}
      </Popover>
    </Box>
  );
}
