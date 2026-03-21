import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { InfoCard } from '../InfoCard';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

type FareRowProps = {
  label: string;
  amount: string;
  percentage: number;
};

const FareRow = ({ label, amount, percentage }: FareRowProps) => (
  <Stack spacing={'6px'}>
    <RowStack justifyContent="space-between">
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12),
          lineHeight: '18px',
          color: (theme) => theme.color.grey,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 500,
          fontSize: pxToRem(12),
          lineHeight: '18px',
          color: (theme) => theme.color.grey,
        }}
      >
        {amount}
      </Typography>
    </RowStack>
    <LinearProgress
      variant="determinate"
      value={percentage}
      sx={{
        height: 3.5,
        borderRadius: '2px',
        backgroundColor: '#F3F4F6',
        '& .MuiLinearProgress-bar': {
          borderRadius: '2px',
          backgroundColor: '#2F6FED',
        },
      }}
    />
  </Stack>
);

type FareBreakdownProps = {
  baseFare: string;
  careAssistantFee: string;
  platformFee: string;
  totalAmount: string;
  paymentMethod: string;
};

export const FareBreakdown = ({
  baseFare,
  careAssistantFee,
  platformFee,
  totalAmount,
  paymentMethod,
}: FareBreakdownProps) => {
  return (
    <InfoCard
      icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 12, color: '#9CA3AF' }} />}
      title="Fare Breakdown"
    >
      <Stack spacing={'12px'}>
        <FareRow label="Base Fare" amount={baseFare} percentage={86} />
        <FareRow
          label="Care Assistant Fee"
          amount={careAssistantFee}
          percentage={82}
        />
        <FareRow label="Platform Fee" amount={platformFee} percentage={76} />
      </Stack>

      <RowStack
        justifyContent="space-between"
        sx={{
          background: '#F7F9FB',
          borderRadius: '14px',
          padding: '14px',
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            lineHeight: '18.75px',
            color: (theme) => theme.color.grey,
          }}
        >
          Total Amount
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 800,
            fontSize: pxToRem(17),
            lineHeight: '25.5px',
            color: (theme) => theme.color.deepBlue,
          }}
        >
          {totalAmount}
        </Typography>
      </RowStack>

      <RowStack justifyContent="center" spacing={'6px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11),
            lineHeight: '16.5px',
            color: (theme) => theme.color.lightGrey,
          }}
        >
          Payment:
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(11),
            lineHeight: '16.5px',
            color: (theme) => theme.color.grey,
          }}
        >
          {paymentMethod}
        </Typography>
      </RowStack>
    </InfoCard>
  );
};
