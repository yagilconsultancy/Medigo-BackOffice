import { useState } from 'react';
import {
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { AppButton, RowStack } from '../../../../../modules/components';
import {
  pxToRem,
  useAddBookingNote,
  useGetBookingNotes,
  extractValidationErrorMessage,
} from '../../../../../../common';
import { AdminNoteResponse } from '../../../../../../common/types';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontSize: pxToRem(13.5),
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#E8ECF0',
  },
};

const NoteRow = ({ note }: { note: AdminNoteResponse }) => {
  const isSystem = note.author_type === 'system';
  return (
    <Stack
      spacing={0.75}
      sx={{
        background: isSystem ? '#F7F9FB' : '#FFFFFF',
        border: '0.67px solid #EAECF0',
        borderLeft: `3px solid ${note.is_driver_visible ? '#2F6FED' : '#EAECF0'}`,
        borderRadius: '10px',
        padding: '12px 14px',
      }}
    >
      <RowStack justifyContent="space-between" spacing={1}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: pxToRem(11.5),
            color: '#6B7280',
            textTransform: 'capitalize',
          }}
        >
          {note.author_name || note.author_type}
        </Typography>
        <RowStack spacing={0.75}>
          {note.is_driver_visible && (
            <Chip
              label="Driver visible"
              size="small"
              sx={{
                background: alpha('#2F6FED', 0.1),
                color: '#2F6FED',
                fontWeight: 600,
                fontSize: pxToRem(10),
                height: '18px',
              }}
            />
          )}
          <Typography sx={{ fontSize: pxToRem(10.5), color: '#9CA3AF' }}>
            {dayjs(note.created_at).format('MMM D, YYYY · hh:mm A')}
          </Typography>
        </RowStack>
      </RowStack>
      <Typography sx={{ fontSize: pxToRem(12.5), color: '#111827' }}>
        {note.content}
      </Typography>
    </Stack>
  );
};

/**
 * Booking notes, with the option to flag one as visible to the assigned driver.
 *
 * Kept out of the main edit form on purpose: adding a note is immediate and
 * doesn't go through the password re-auth that guards field edits, and it never
 * touches the rider's own `special_instructions`.
 */
export const DriverNotesSection = ({ rideId }: { rideId: string }) => {
  const { data, isFetching, refetch } = useGetBookingNotes(rideId);
  const addNote = useAddBookingNote();

  const [content, setContent] = useState('');
  const [isDriverVisible, setIsDriverVisible] = useState(true);

  const notes = data && data.success ? data.data : [];

  const handleAdd = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    addNote.mutate(
      { rideId, content: trimmed, is_driver_visible: isDriverVisible },
      {
        onSuccess: () => {
          toast.success(
            isDriverVisible
              ? 'Note added and sent to the driver'
              : 'Internal note added'
          );
          setContent('');
          refetch();
        },
        onError: (error) => {
          toast.error(
            extractValidationErrorMessage(error, 'Failed to add note')
          );
        },
      }
    );
  };

  return (
    <Stack spacing={2}>
      <Typography
        sx={{
          color: (theme) => theme.color.lightGrey,
          fontWeight: 600,
          fontSize: pxToRem(11),
          lineHeight: '16px',
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
        }}
      >
        Notes for driver
      </Typography>

      {isFetching && !notes.length ? (
        <Stack alignItems="center" sx={{ py: 2 }}>
          <CircularProgress size={18} sx={{ color: '#2F6FED' }} />
        </Stack>
      ) : notes.length ? (
        <Stack spacing={1.25}>
          {notes.map((note) => (
            <NoteRow key={note.id} note={note} />
          ))}
        </Stack>
      ) : (
        <Typography sx={{ fontSize: pxToRem(12), color: '#9CA3AF' }}>
          No notes on this booking yet.
        </Typography>
      )}

      <TextField
        label="Add a note"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="e.g. Buzz unit 4B, the family will meet you at the door"
        fullWidth
        size="small"
        multiline
        minRows={2}
        sx={fieldSx}
      />

      <RowStack justifyContent="space-between" spacing={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isDriverVisible}
              onChange={(e) => setIsDriverVisible(e.target.checked)}
              size="small"
              sx={{ color: '#2F6FED', '&.Mui-checked': { color: '#2F6FED' } }}
            />
          }
          label={
            <Typography sx={{ fontSize: pxToRem(12.5), color: '#374151' }}>
              Visible to the assigned driver
            </Typography>
          }
        />
        <AppButton
          sx={{
            flexShrink: 0,
            px: 2.5,
            background: (theme) => theme.palette.primary.main,
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            '&:hover': { background: alpha('#2F6FED', 0.9) },
            '&.Mui-disabled': {
              background: alpha('#2F6FED', 0.4),
              color: '#fff',
            },
          }}
          onClick={handleAdd}
          disabled={!content.trim() || addNote.isPending}
        >
          {addNote.isPending ? 'Adding...' : 'Add Note'}
        </AppButton>
      </RowStack>
    </Stack>
  );
};
