'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterItem } from '@/components/admin-dashboard/statistic/filter-item/filter-item';
import { cn } from '@/lib/utils';
import { type DateRange } from 'react-day-picker';

interface StatsCardWithChartProps {
  title: string | React.ReactNode;
  value?: React.ReactNode;
  children?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  hasChart?: boolean;
  hasFilter?: boolean;
  filter?: { label: string; value: string }[];
  onFilterChange?: (value: string) => void;
  onCustomFilterChange?: (date: DateRange) => void;
  defaultFilterValue?: string;
}

export const StatsCardWithChart: React.FC<StatsCardWithChartProps> = ({
  title,
  value,
  children,
  isLoading,
  className,
  hasChart,
  hasFilter,
  filter,
  onFilterChange,
  onCustomFilterChange,
  defaultFilterValue = 'today',
}) => {
  return (
    <Card className={cn('relative', className)}>
      <CardHeader className="flex justify-between items-center h-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <CardTitle className="text-sm font-medium dark:font-normal min-w-0 truncate">{title}</CardTitle>
          </TooltipTrigger>
          <TooltipContent>{title}</TooltipContent>
        </Tooltip>
        {hasFilter && (
          <CardAction>
            <FilterItem
              filter={filter}
              onChange={onFilterChange}
              onCustomChange={onCustomFilterChange}
              defaultValue={defaultFilterValue}
              iconOnly
            />
          </CardAction>
        )}
      </CardHeader>
      <CardContent className={cn('relative', hasChart && 'pb-0')}>
        {hasChart ? (
          <>
            {value && <span className="relative bg-card z-10 text-2xl font-bold">{value}</span>}
            {children}
          </>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
      {isLoading && (
        <div className="flex absolute inset-0 justify-center items-center bg-background/50 z-20 rounded-lg">
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
        </div>
      )}
    </Card>
  );
};
