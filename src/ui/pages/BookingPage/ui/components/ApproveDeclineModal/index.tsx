import { alpha, Divider, Stack, Typography } from '@mui/material';
import {
  AppButton,
  AppModal,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

type ApproveDeclineModalprops = {
  open: boolean;
  handleClose: () => void;
  title: string;
  text: string;
  location: string;
  textBeforeBtn: string;
  textBtn: string;
  modalLabel: string;
  btnBg: string;
  onConfirm?: () => void;
  isLoading?: boolean;
};

export const ApproveDeclineModal = ({
  open,
  handleClose,
  title,
  text,
  location,
  textBeforeBtn,
  textBtn,
  modalLabel,
  btnBg,
  onConfirm,
  isLoading,
}: ApproveDeclineModalprops) => {
  return (
    <AppModal label={modalLabel} open={open} setOpen={handleClose}>
      <Stack spacing={2} divider={<Divider />}>
        <Stack spacing={0.5}>
          <Typography
            sx={{
              color: (theme) => theme.color.deepBlue,
              fontWeight: 700,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontStyle: 'bold',
              fontSize: pxToRem(15),
              lineHeight: '22.5px',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontStyle: 'regular',
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
            }}
          >
            {text}
          </Typography>
        </Stack>
        <Stack spacing={2}>
          <Stack
            sx={{
              background: '#F7F9FB',
              borderRadius: '14px',
              padding: '17px 16px',
            }}
          >
            <Typography
              sx={{
                color: (theme) => theme.color.lightGrey,
                fontWeight: 400,
                fontFamily: (theme) => theme.typography.fontFamily,
                fontStyle: 'regular',
                fontSize: pxToRem(12),
                lineHeight: '18px',
                textTransform: 'uppercase',
              }}
            >
              PICKUP → DESTINATION
            </Typography>
            <Typography
              sx={{
                color: (theme) => theme.color.grey,
                fontWeight: 400,
                fontFamily: (theme) => theme.typography.fontFamily,
                fontStyle: 'regular',
                fontSize: pxToRem(13),
                lineHeight: '19px',
              }}
            >
              {location}
            </Typography>
          </Stack>
          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontStyle: 'regular',
              fontSize: pxToRem(13),
              lineHeight: '19px',
            }}
          >
            {textBeforeBtn}
          </Typography>
        </Stack>
        <RowStack spacing={'12px'} width={'100%'}>
          <AppButton
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              color: (theme) => theme.color.grey,
              fontWeight: 600,
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
              '&:hover': {
                background: alpha('#F7F9FB', 0.1),
              },
            }}
            fullWidth
            onClick={handleClose}
          >
            Cancel
          </AppButton>
          <AppButton
            sx={{
              background: btnBg,
              color: (theme) => theme.palette.background.default,
              fontWeight: 600,
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
              '&:hover': {
                background: alpha(btnBg, 0.95),
              },
            }}
            fullWidth
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : textBtn}
          </AppButton>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
