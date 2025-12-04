'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const defaultFilter = [
  {
    label: 'Today',
    value: 'today',
  },
  {
    label: 'Yesterday',
    value: 'yesterday',
  },
  {
    label: 'Last 7 Days',
    value: 'last7Days',
  },
  {
    label: 'This Month',
    value: 'thisMonth',
  },
  {
    label: 'Lifetime',
    value: 'lifetime',
  },
  {
    label: 'Custom',
    value: 'custom',
  },
];

export interface FilterItemProps {
  iconOnly?: boolean;
  onChange?: (value: string) => void;
  onCustomChange?: (date: DateRange) => void;
  className?: string;
  defaultRange?: DateRange;
  label?: string;
  overrideLabel?: boolean;
  checkbox?: boolean;
  filter?: { label: string; value: string }[];
  defaultValue?: string;
}

export const FilterItem = ({
  iconOnly = false,
  onChange,
  onCustomChange,
  className = '',
  defaultRange,
  label = 'Filter',
  overrideLabel = false,
  checkbox = false,
  filter = defaultFilter,
  defaultValue,
}: FilterItemProps) => {
  const [value, setValue] = React.useState<string | undefined>(checkbox ? undefined : defaultValue);
  const [date, setDate] = React.useState<DateRange | undefined>(defaultRange);

  const hasCustomFilter = filter.some(item => item.value === 'custom');

  const handleDateSelect = (e: DateRange) => {
    setValue('custom');
    setDate(e);
    if (onCustomChange) {
      onCustomChange(e);
    }
  };

  const handleValueChange = (newValue: string) => {
    if (value === newValue) {
      setValue(undefined);
      if (onChange) {
        onChange('');
      }
    } else {
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const handleClearFilter = () => {
    setValue('');
    if (onChange) {
      onChange('');
    }
  };

  return iconOnly ? (
    <div className={cn('flex items-center', className)}>
      {hasCustomFilter && (
        <Popover>
          <PopoverTrigger className="w-full" asChild>
            <Button variant="outline" size="sm" className={cn('min-w-10 w-10 h-10!', value === 'custom' && 'bg-pink-50 dark:bg-muted text-primary')}>
              <CalendarIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto" align="center">
            <Calendar autoFocus mode="range" required defaultMonth={date?.from} selected={date} onSelect={handleDateSelect} numberOfMonths={2} />
          </PopoverContent>
        </Popover>
      )}

      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-16 min-w-16 h-10!" size="sm">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          {filter.slice(0, checkbox ? 6 : 5).map(item => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
          {value && (
            <>
              <SelectSeparator />
              <Button variant="secondary" size="sm" className="w-full text-sm rounded-[6px] cursor-pointer" onClick={handleClearFilter} title="Clear filter">
                Clear filter
              </Button>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  ) : (
    <div className={cn('flex', className)}>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="bg-card dark:bg-card h-8 rounded-r-none min-h-auto max-h-8 max-w-30 min-w-0 truncate border-border dark:border-border">
          {value === 'custom' ? (
            date?.from ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="truncate">
                    {format(date.from, 'MMM d, yyyy')}
                    {date.to ? ` - ${format(date.to, 'MMM d, yyyy')}` : ''}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {format(date.from, 'MMM d, yyyy')}
                  {date.to ? ` - ${format(date.to, 'MMM d, yyyy')}` : ''}
                </TooltipContent>
              </Tooltip>
            ) : (
              <div>Select date range</div>
            )
          ) : (
            <SelectValue className="truncate min-w-0" placeholder={overrideLabel ? label : 'Filter'} />
          )}
        </SelectTrigger>
        <SelectContent>
          {filter.slice(0, checkbox ? 6 : 5).map(item => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
          {value && (
            <>
              <SelectSeparator />
              <Button variant="secondary" size="sm" className="w-full text-sm rounded-[6px] cursor-pointer" onClick={handleClearFilter} title="Clear filter">
                Clear filter
              </Button>
            </>
          )}
        </SelectContent>
      </Select>

      {hasCustomFilter && (
        <Popover>
          <PopoverTrigger className="w-full" asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'min-w-8 size-8 bg-card dark:bg-card cursor-pointer rounded-l-none border-border dark:border-border border-l-0',
                value === 'custom' && '!bg-popover text-brand-ocean-primary'
              )}
            >
              <CalendarIcon className="h-[18px] w-[18px]" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto" align="center">
            <Calendar autoFocus mode="range" required defaultMonth={date?.from} selected={date} onSelect={handleDateSelect} numberOfMonths={2} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
