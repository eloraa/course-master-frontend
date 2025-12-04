import { format, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DateRangeStrings {
  startDate: string;
  endDate: string;
}

/**
 * Convert relative filter values to date range
 */
export const getDateRangeFromFilter = (filter: string): DateRange => {
  const today = new Date();
  const now = startOfDay(today);

  switch (filter) {
    case 'today':
      return { from: now, to: endOfDay(today) };
    case 'yesterday':
      return {
        from: startOfDay(subDays(today, 1)),
        to: endOfDay(subDays(today, 1)),
      };
    case 'last7Days':
    case 'last_week':
      return {
        from: startOfDay(subDays(today, 6)),
        to: endOfDay(today),
      };
    case 'lastMonth':
    case 'last_month':
      return {
        from: startOfDay(subDays(today, 29)),
        to: endOfDay(today),
      };
    case 'thisMonth':
    case 'this_month':
      return {
        from: startOfMonth(today),
        to: endOfMonth(today),
      };
    case 'last_calendar_month':
      const previousMonth = subMonths(today, 1);
      return {
        from: startOfMonth(previousMonth),
        to: endOfMonth(previousMonth),
      };
    default:
      // Default to today
      return { from: now, to: endOfDay(today) };
  }
};

/**
 * Convert DateRange to API format (yyyy-MM-dd strings)
 */
export const convertDateRangeToStrings = (dateRange: DateRange): DateRangeStrings => {
  return {
    startDate: format(dateRange.from, 'yyyy-MM-dd'),
    endDate: format(dateRange.to, 'yyyy-MM-dd'),
  };
};

/**
 * Convert filter value directly to API format strings
 */
export const getDateStringsFromFilter = (filter: string): DateRangeStrings => {
  const dateRange = getDateRangeFromFilter(filter);
  return convertDateRangeToStrings(dateRange);
};
