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

type DataPoint = {
  [key: string]: string | number;
};

type HomeChartProps = {
  data: DataPoint[];
  xKey: string;
  yKey: string;
  strokeColor?: string;
  fillColor?: string;
  height?: number;
};

export const HomeChart = ({
  data,
  xKey,
  yKey,
  strokeColor = '#4F7BF7',
  fillColor = '#4F7BF7',
  height = 200,
}: HomeChartProps) => {
  const gradientId = `chartGradient-${yKey}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity={0.15} />
            <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#F0F4F8"
        />
        <XAxis
          dataKey={xKey}
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
          tick={{ fontSize: 13, fill: '#9CA3AF', fontWeight: 400 }}
          dx={-5}
        />
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #F0F4F8',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
            fontSize: '13px',
          }}
          cursor={{ stroke: '#E2E8F0', strokeDasharray: '4 4' }}
        />
        <Area
          type="linear"
          dataKey={yKey}
          stroke={strokeColor}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={{ r: 4, fill: '#FFFFFF', stroke: strokeColor, strokeWidth: 2 }}
          activeDot={{
            r: 5,
            fill: strokeColor,
            stroke: '#FFFFFF',
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
