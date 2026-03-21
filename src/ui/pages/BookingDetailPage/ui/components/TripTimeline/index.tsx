import { Box, Chip, Stack, Typography } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { useState } from 'react';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

type TimelineEntry = {
  time: string;
  label: string;
  isCompleted: boolean;
  isCurrent?: boolean;
};

type AdminNote = {
  initial: string;
  author: string;
  time: string;
  text: string;
};

type TripTimelineProps = {
  entries: TimelineEntry[];
  adminNotes?: AdminNote[];
};

export const TripTimeline = ({
  entries,
  adminNotes = [],
}: TripTimelineProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: 'Trip Timeline',
      icon: <TimelineOutlinedIcon sx={{ fontSize: 13 }} />,
    },
    {
      label: 'Admin Notes',
      icon: <NoteAltOutlinedIcon sx={{ fontSize: 13 }} />,
    },
  ];

  return (
    <Stack
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid #EAECF0',
        borderRadius: '14px',
        overflow: 'hidden',
      }}
    >
      <RowStack
        sx={{
          borderBottom: '0.67px solid #EAECF0',
        }}
      >
        {tabs.map((tab, index) => (
          <RowStack
            key={index}
            spacing={'6px'}
            onClick={() => setActiveTab(index)}
            sx={{
              padding: '12px 20px',
              cursor: 'pointer',
              borderBottom:
                activeTab === index ? '2px solid' : '2px solid transparent',
              borderColor: activeTab === index ? 'primary.main' : 'transparent',
            }}
          >
            <Box
              sx={{
                color: activeTab === index ? '#111827' : '#9CA3AF',
                display: 'flex',
              }}
            >
              {tab.icon}
            </Box>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: activeTab === index ? 700 : 500,
                fontSize: pxToRem(12.5),
                color:
                  activeTab === index
                    ? (theme) => theme.color.deepBlue
                    : (theme) => theme.color.lightGrey,
              }}
            >
              {tab.label}
            </Typography>
          </RowStack>
        ))}
      </RowStack>

      {/* Trip Timeline Tab */}
      {activeTab === 0 && (
        <Timeline
          sx={{
            padding: '12px 20px',
            '& .MuiTimelineItem-root:before': {
              display: 'none',
            },
          }}
        >
          {entries.map((entry, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    margin: 0,
                    padding: 0,
                    width: entry.isCurrent ? 32 : 28,
                    height: entry.isCurrent ? 32 : 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'none',
                    background: entry.isCompleted
                      ? '#FFFFFF'
                      : entry.isCurrent
                        ? '#2F6FED'
                        : '#F3F4F6',
                    border: entry.isCompleted ? '1.5px solid #E5E7EB' : 'none',
                  }}
                >
                  {entry.isCompleted ? (
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 12, color: '#059669' }}
                    />
                  ) : entry.isCurrent ? (
                    <LocalShippingOutlinedIcon
                      sx={{ fontSize: 13, color: '#FFFFFF' }}
                    />
                  ) : (
                    <AccessTimeOutlinedIcon
                      sx={{ fontSize: 11, color: '#9CA3AF' }}
                    />
                  )}
                </TimelineDot>
                {index < entries.length - 1 && (
                  <TimelineConnector
                    sx={{
                      backgroundColor: entry.isCompleted
                        ? '#2F6FED'
                        : '#E5E7EB',
                      width: '1.5px',
                    }}
                  />
                )}
              </TimelineSeparator>
              <TimelineContent
                sx={{
                  padding: '0 0 24px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <RowStack spacing={'8px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: entry.isCurrent
                        ? 700
                        : entry.isCompleted
                          ? 500
                          : 400,
                      fontSize: pxToRem(entry.isCurrent ? 13.5 : 13),
                      color: entry.isCurrent
                        ? (theme) => theme.color.deepBlue
                        : entry.isCompleted
                          ? (theme) => theme.color.grey
                          : '#C4C9D4',
                    }}
                  >
                    {entry.label}
                  </Typography>
                  {entry.isCurrent && (
                    <Chip
                      label="CURRENT"
                      size="small"
                      sx={{
                        background: '#EEF3FF',
                        color: '#2F6FED',
                        fontSize: pxToRem(9),
                        fontWeight: 700,
                        height: '19px',
                        borderRadius: '10px',
                      }}
                    />
                  )}
                </RowStack>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: entry.isCurrent ? 500 : 400,
                    fontSize: pxToRem(11.5),
                    color:
                      entry.isCompleted || entry.isCurrent
                        ? (theme) => theme.color.lightGrey
                        : '#D1D5DB',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {entry.time}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}

      {/* Admin Notes Tab */}
      {activeTab === 1 && (
        <Stack spacing={'12px'} sx={{ padding: '20px' }}>
          {adminNotes.map((note, index) => (
            <Stack
              key={index}
              spacing={'8px'}
              sx={{
                background: '#F7F9FB',
                borderRadius: '14px',
                padding: '17px',
              }}
            >
              <RowStack justifyContent="space-between">
                <RowStack spacing={'8px'}>
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: '#EAECF0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 800,
                        fontSize: pxToRem(9),
                        color: (theme) => theme.color.grey,
                      }}
                    >
                      {note.initial}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(12),
                      color: (theme) => theme.color.grey,
                    }}
                  >
                    {note.author}
                  </Typography>
                </RowStack>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11),
                    color: (theme) => theme.color.lightGrey,
                  }}
                >
                  {note.time}
                </Typography>
              </RowStack>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  color: '#4B5563',
                }}
              >
                {note.text}
              </Typography>
            </Stack>
          ))}
          <Box
            sx={{
              border: '1.5px dashed #E5E7EB',
              borderRadius: '14px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#9CA3AF',
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(12.5),
                color: (theme) => theme.color.lightGrey,
              }}
            >
              + Add Note
            </Typography>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};
