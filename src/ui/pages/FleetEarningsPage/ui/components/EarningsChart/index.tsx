'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { pxToRem } from '../../../../../../common';

const monthlyData = [
  { month: "Sep '25", earnings: 42000 },
  { month: "Oct '25", earnings: 55000 },
  { month: "Nov '25", earnings: 48000 },
  { month: "Dec '25", earnings: 62000 },
  { month: "Jan '26", earnings: 71000 },
  { month: "Feb '26", earnings: 83000 },
  { month: "Mar '26", earnings: 100000 },
];

export const EarningsChart = () => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={monthlyData}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2F6FED" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#2F6FED" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#F0F4F8"
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: pxToRem(10),
            fill: '#9CA3AF',
            fontWeight: 400,
          }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 400 }}
          dx={-5}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #F0F4F8',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
            fontSize: '13px',
          }}
          formatter={(value: number) => [
            `$${value.toLocaleString()}`,
            'Revenue',
          ]}
          cursor={{ stroke: '#E2E8F0', strokeDasharray: '4 4' }}
        />
        <Area
          type="linear"
          dataKey="earnings"
          stroke="#2F6FED"
          strokeWidth={2.5}
          fill="url(#earningsGradient)"
          dot={{
            r: 4,
            fill: '#FFFFFF',
            stroke: '#2F6FED',
            strokeWidth: 2,
          }}
          activeDot={{
            r: 5,
            fill: '#2F6FED',
            stroke: '#FFFFFF',
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
