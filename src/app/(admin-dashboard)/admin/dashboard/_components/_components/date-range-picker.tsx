'use client';
import React, { useState } from 'react';
import { addDays, format, subDays } from 'date-fns';
import type { DateRange } from '@/lib/date-filters';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onDateRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    {
      label: 'Today',
      value: () => {
        const today = new Date();
        return { from: today, to: today };
      },
    },
    {
      label: 'Yesterday',
      value: () => {
        const yesterday = subDays(new Date(), 1);
        return { from: yesterday, to: yesterday };
      },
    },
    {
      label: 'Last 7 days',
      value: () => {
        const today = new Date();
        return { from: subDays(today, 6), to: today };
      },
    },
    {
      label: 'Last 30 days',
      value: () => {
        const today = new Date();
        return { from: subDays(today, 29), to: today };
      },
    },
    {
      label: 'Last 90 days',
      value: () => {
        const today = new Date();
        return { from: subDays(today, 89), to: today };
      },
    },
    {
      label: 'Last 1 year',
      value: () => {
        const today = new Date();
        return { from: subDays(today, 364), to: today };
      },
    },
  ];

  const handlePreset = (preset: (typeof presets)[0]) => {
    onDateRangeChange(preset.value());
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[250px] justify-start text-left font-normal">
          <Calendar className="mr-2 h-4 w-4" />
          <span className="flex-1">
            {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Select</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {presets.map(preset => (
          <DropdownMenuItem key={preset.label} onClick={() => handlePreset(preset)}>
            {preset.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
