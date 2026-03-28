import { alpha, Chip, Stack, Typography } from '@mui/material';
import { Centered, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

// ─── Types ──────────────────────────────────────────────────────────────────

type NotificationInfoUIProps = {
  icon: React.ReactNode;
  infoBg: string;
  cardTitle: string;
  cardChipLabel: string;
  chipColor: string;
  cardDesc: string;
  admin: string;
  num: number;
  date: string;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const NotificationInfoUI = ({
  icon,
  infoBg,
  cardTitle,
  cardChipLabel,
  chipColor,
  cardDesc,
  admin,
  num,
  date,
}: NotificationInfoUIProps) => {
  return (
    <RowStack
      sx={{
        background: '#F7F9FB',
        padding: '16px',
        borderRadius: '14px',
        border: '0.67px solid #F0F4F8',
        width: '100%',
      }}
      spacing={2}
    >
      <RowStack flex={1} spacing={2}>
        <Centered
          sx={{
            background: infoBg,
            borderRadius: '14px',
            width: '42px',
            height: '42px',
          }}
        >
          {icon}
        </Centered>
        <Stack spacing={0.5} width={'100%'}>
          <RowStack
            sx={{
              width: '100%',
            }}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <RowStack spacing={'7.83px'}>
              <Typography
                sx={{
                  color: (theme) => theme.color.deepBlue,
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontSize: pxToRem(14),
                  fontWeight: 600,
                  lineHeight: '21px',
                }}
              >
                {cardTitle}
              </Typography>
              <Chip
                label={cardChipLabel}
                sx={{
                  color: chipColor,
                  background: alpha(chipColor, 0.1),
                  fontSize: pxToRem(11),
                  lineHeight: '16.5px',
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                }}
              />
            </RowStack>
            <RowStack spacing={1}>
              <TaskAltOutlinedIcon
                sx={{
                  color: "#10B981",
                  width: '14px',
                  height: '14px',
                }}
              />
              <Typography
                sx={{
                  color: "#10B981",
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontSize: pxToRem(12),
                  fontWeight: 600,
                  lineHeight: '18px',
                }}
              >
                Delivered
              </Typography>
            </RowStack>
          </RowStack>
          <Typography
            sx={{
              color: 'text.secondary',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: pxToRem(13),
              fontWeight: 400,
              lineHeight: '18px',
            }}
          >
            {cardDesc}
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: pxToRem(12),
              fontWeight: 400,
              lineHeight: '18px',
            }}
          >
            {`→ ${admin} ${`  `}    sent to ${num}  ${`  `}   ${date}`}
          </Typography>
        </Stack>
      </RowStack>
    </RowStack>
  );
};
