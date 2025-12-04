'use client';

import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const dummyData = [
  { date: 'Day 1', amount: 3200 },
  { date: 'Day 2', amount: 4100 },
  { date: 'Day 3', amount: 3800 },
  { date: 'Day 4', amount: 5200 },
  { date: 'Day 5', amount: 4500 },
  { date: 'Day 6', amount: 4800 },
  { date: 'Day 7', amount: 5500 },
];

const skeletonConfig = {
  amount: {
    label: 'Amount',
    color: 'var(--muted)',
  },
};

export const AreaChartSkeleton = () => {
  return (
    <div className="absolute w-full top-0 pr-8 pointer-events-none animate-pulse">
      <ChartContainer config={skeletonConfig} className="h-[80px] w-full">
        <AreaChart data={dummyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} accessibilityLayer>
          <defs>
            <linearGradient id="skeletonGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--muted)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--muted)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} className="text-xs" />
          <YAxis tickLine={false} axisLine={false} className="text-xs" hide/>
          <Area type="step" dataKey="amount" stroke="var(--muted)" strokeWidth={2} fill="url(#skeletonGradient)" fillOpacity={1} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
