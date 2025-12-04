'use client';

import { useState, useMemo } from 'react';
import { useQuizStatistics } from '@/data/admin/statistics';
import { format, subDays } from 'date-fns';
import { convertDateRangeToStrings, type DateRange } from '@/lib/date-filters';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceArea } from 'recharts';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { AreaChartSkeleton } from '@/components/ui/area-chart-skeleton';

const chartConfig = {
  submissions: {
    label: 'Submissions',
    color: 'var(--chart-3)',
  },
};

interface QuizStatsChartProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
  standalone?: boolean;
}

export const QuizStatsChart = ({ dateRange: externalDateRange, onDateRangeChange }: QuizStatsChartProps = {}) => {
  const initialDateRange = useMemo<DateRange>(
    () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
    []
  );

  const [internalDateRange, setInternalDateRange] = useState(initialDateRange);
  const dateRange = externalDateRange || internalDateRange;
  const setDateRange = onDateRangeChange || setInternalDateRange;
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [showZoomPopover, setShowZoomPopover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const { data: statsData, isLoading } = useQuizStatistics(convertDateRangeToStrings(dateRange));

  const chartData = useMemo(() => {
    if (!statsData?.data) return [];
    return [
      {
        date: format(dateRange.from, 'MMM dd'),
        submissions: statsData.data.totalSubmissions,
      },
    ];
  }, [statsData, dateRange]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleMouseDown: (state: unknown, e: unknown) => void = (_state, e) => {
    const event = e as { activeLabel?: string | number };
    const label = String(event?.activeLabel);
    if (label && label !== 'undefined') {
      setIsDragging(true);
      setRefAreaLeft(label);
      setRefAreaRight(label);
    }
  };

  const handleMouseMove: (state: unknown, e: unknown) => void = (_state, e) => {
    const event = e as { activeLabel?: string | number };
    const label = String(event?.activeLabel);
    if (isDragging && refAreaLeft && label && label !== 'undefined') {
      setRefAreaRight(label);
    }
  };

  const handleMouseUp: (state: unknown, e: unknown) => void = (_state, e) => {
    setIsDragging(false);
    const event = e as { activeLabel?: string | number; clientX?: number; clientY?: number };
    const label = String(event?.activeLabel);
    if (refAreaLeft && refAreaRight && refAreaLeft !== label) {
      const mouseEvent = event;
      setPopoverPosition({
        x: Number(mouseEvent?.clientX || 0),
        y: Number(mouseEvent?.clientY || 0),
      });
      setShowZoomPopover(true);
    } else {
      setRefAreaLeft(null);
      setRefAreaRight(null);
    }
  };

  const handleZoomIn = () => {
    if (!refAreaLeft || !refAreaRight || !chartData.length) return;

    const leftIndex = chartData.findIndex(d => d.date === refAreaLeft);
    const rightIndex = chartData.findIndex(d => d.date === refAreaRight);

    if (leftIndex === -1 || rightIndex === -1) return;

    const [startIdx, endIdx] = leftIndex <= rightIndex ? [leftIndex, rightIndex] : [rightIndex, leftIndex];

    const daysFromEnd = chartData.length - 1;
    const newFrom = subDays(dateRange.to, daysFromEnd - startIdx);
    const newTo = subDays(dateRange.to, daysFromEnd - endIdx);

    setDateRange({ from: newFrom, to: newTo });
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setShowZoomPopover(false);
  };

  const handleCancelZoom = () => {
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setShowZoomPopover(false);
  };

  const handleReset = () => {
    setDateRange(initialDateRange);
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setShowZoomPopover(false);
  };

  const isZoomed = dateRange.from.getTime() !== initialDateRange.from.getTime() || dateRange.to.getTime() !== initialDateRange.to.getTime();

  const getSelectedDateRange = () => {
    if (!refAreaLeft || !refAreaRight || !chartData.length) return null;

    const leftIndex = chartData.findIndex(d => d.date === refAreaLeft);
    const rightIndex = chartData.findIndex(d => d.date === refAreaRight);

    if (leftIndex === -1 || rightIndex === -1) return null;

    const [startIdx, endIdx] = leftIndex <= rightIndex ? [leftIndex, rightIndex] : [rightIndex, leftIndex];

    return {
      start: chartData[startIdx].date,
      end: chartData[endIdx].date,
      days: Math.abs(endIdx - startIdx) + 1,
    };
  };

  if (isLoading && !chartData.length) {
    return <AreaChartSkeleton />;
  }

  const selectedRange = getSelectedDateRange();

  return (
    <>
      {isZoomed && (
        <div className="absolute top-0 right-4 z-10">
          <Button onClick={handleReset} size="icon" variant="outline" className="size-6">
            <RotateCcw className="size-3" />
            <span className="sr-only">Reset</span>
          </Button>
        </div>
      )}
      <div className="absolute w-full top-0 pr-8">
        <ChartContainer config={chartConfig} className="h-[80px] w-full cursor-crosshair [&_svg]:cursor-crosshair">
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            accessibilityLayer
            className="cursor-crosshair"
          >
            <defs>
              <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-submissions)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="var(--color-submissions)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted-active" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} padding={{ left: -60 }} className="text-xs select-none" />
            <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={formatNumber} />
            <ChartTooltip content={<ChartTooltipContent formatter={value => formatNumber(Number(value))} />} />
            <Area type="step" dataKey="submissions" stroke="var(--color-submissions)" strokeWidth={2} fill="url(#colorSubmissions)" fillOpacity={1} className="cursor-crosshair" />
            {refAreaLeft && refAreaRight && <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="hsl(var(--chart-3))" fillOpacity={0.3} />}
          </AreaChart>
        </ChartContainer>
      </div>

      {showZoomPopover && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleCancelZoom} />
          <div
            className="fixed z-50 bg-popover text-popover-foreground border rounded-lg shadow-lg p-4"
            style={{
              left: `${popoverPosition.x}px`,
              top: `${popoverPosition.y}px`,
              transform: 'translate(-30%, -50%)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3">
              <div className="text-center">
                <p className="font-medium text-sm whitespace-nowrap">
                  {selectedRange?.start} - {selectedRange?.end}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedRange?.days} day{selectedRange?.days !== 1 ? 's' : ''}
                </p>
              </div>
              <Button onClick={handleZoomIn} size="sm">
                Zoom In
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
