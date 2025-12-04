'use client';
import React, { useState } from 'react';
import type { DateRange as PickerDateRange } from 'react-day-picker';
import { useOrderStatistics, useCourseStatistics, useQuizStatistics, useUserStatistics } from '@/data/admin/statistics';
import { getDateRangeFromFilter, convertDateRangeToStrings, type DateRange } from '@/lib/date-filters';
import { statsFilter } from '@/constants/stats-filter';
import { StatsCardWithChart } from './_components/stats-card-with-chart';
import { EnrollmentChart } from './_charts/enrollment-chart';
import { QuizStatsChart } from './_charts/quiz-stats-chart';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';

const getIconClass = () => 'size-4 min-w-4 text-muted-foreground';

export const Stats = () => {
  // Individual card filters
  const [cardFilters, setCardFilters] = useState<Record<string, string>>({
    order_revenue: 'today',
    enrollment: 'today',
    quiz_stats: 'today',
    total_users: 'today',
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  // Convert filters to date ranges
  const getDateRangeForCard = (cardKey: string): DateRange => {
    const filterValue = cardFilters[cardKey];
    return getDateRangeFromFilter(filterValue);
  };

  // Fetch statistics based on individual card filters
  const orderDateRange = getDateRangeForCard('order_revenue');
  const enrollmentDateRange = getDateRangeForCard('enrollment');
  const quizDateRange = getDateRangeForCard('quiz_stats');
  const usersDateRange = getDateRangeForCard('total_users');

  const orderStats = useOrderStatistics(convertDateRangeToStrings(orderDateRange));
  const courseStats = useCourseStatistics(convertDateRangeToStrings(enrollmentDateRange));
  const quizStats = useQuizStatistics(convertDateRangeToStrings(quizDateRange));
  const userStats = useUserStatistics(convertDateRangeToStrings(usersDateRange));

  // Track initial load per card group - shows skeleton only if that specific group hasn't fetched
  const isOrderStatsFirstLoad = !orderStats.isFetched;
  const isCourseStatsFirstLoad = !courseStats.isFetched;
  const isQuizStatsFirstLoad = !quizStats.isFetched;
  const isUserStatsFirstLoad = !userStats.isFetched;

  // Format helpers
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return '0';
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Handle filter changes
  const handleFilterChange = (cardKey: string, value: string) => {
    if (value === 'custom') return;

    if (value === '') {
      // Clear filter
      setCardFilters(prev => ({
        ...prev,
        [cardKey]: 'today',
      }));
    } else {
      // Set active filter
      setActiveFilters(prev => [...prev, cardKey]);

      setCardFilters(prev => ({
        ...prev,
        [cardKey]: value,
      }));

      setActiveFilters(prev => prev.filter(k => k !== cardKey));
    }
  };

  const handleCustomFilterChange = (cardKey: string, dateRange?: PickerDateRange) => {
    if (!dateRange?.from) return;
    const normalizedRange: DateRange = {
      from: dateRange.from,
      to: dateRange.to ?? dateRange.from,
    };

    setActiveFilters(prev => [...prev, cardKey]);

    // Store date range as string for comparison
    const fromStr = normalizedRange.from.toISOString();
    const toStr = normalizedRange.to.toISOString();

    setCardFilters(prev => ({
      ...prev,
      [cardKey]: `${fromStr}|${toStr}`,
    }));

    setActiveFilters(prev => prev.filter(k => k !== cardKey));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Statistics</h1>
        <p className="text-muted-foreground">View dashboard metrics</p>
      </div>

      {/* Order Statistics Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Order Analytics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <TrendingUp className={getIconClass()} />
                <span className="min-w-0 truncate">Total Revenue</span>
              </div>
            }
            value={formatCurrency(orderStats.data?.data?.totalRevenue)}
            isLoading={isOrderStatsFirstLoad}
          />

          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <BarChart3 className={getIconClass()} />
                <span className="min-w-0 truncate">Total Orders</span>
              </div>
            }
            value={formatNumber(orderStats.data?.data?.totalOrders)}
            isLoading={isOrderStatsFirstLoad}
          />

          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <PieChart className={getIconClass()} />
                <span className="min-w-0 truncate">Avg Order Value</span>
              </div>
            }
            value={formatCurrency(orderStats.data?.data?.averageOrderValue)}
            isLoading={isOrderStatsFirstLoad}
          />

          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <TrendingUp className={getIconClass()} />
                <span className="min-w-0 truncate">Orders Completed</span>
              </div>
            }
            value={formatNumber(orderStats.data?.data?.ordersBreakdown?.completed)}
            isLoading={isOrderStatsFirstLoad || activeFilters.includes('order_revenue')}
            hasFilter
            filter={statsFilter}
            onFilterChange={value => handleFilterChange('order_revenue', value)}
            onCustomFilterChange={range => handleCustomFilterChange('order_revenue', range)}
            defaultFilterValue="today"
          />
        </div>
      </section>

      {/* Course Statistics with Chart */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Course Analytics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <BarChart3 className={getIconClass()} />
                <span className="min-w-0 truncate">Total Courses</span>
              </div>
            }
            value={formatNumber(courseStats.data?.data?.totalCourses)}
            isLoading={isCourseStatsFirstLoad}
          />

          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <TrendingUp className={getIconClass()} />
                <span className="min-w-0 truncate">Published</span>
              </div>
            }
            value={formatNumber(courseStats.data?.data?.publishedCourses)}
            isLoading={isCourseStatsFirstLoad}
          />

          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <Users className={getIconClass()} />
                <span className="min-w-0 truncate">Total Enrollments</span>
              </div>
            }
            value={formatNumber(courseStats.data?.data?.totalEnrollments)}
            isLoading={isCourseStatsFirstLoad}
          />

          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <TrendingUp className={getIconClass()} />
                <span className="min-w-0 truncate">Revenue</span>
              </div>
            }
            value={formatCurrency(courseStats.data?.data?.totalRevenue)}
            isLoading={isCourseStatsFirstLoad || activeFilters.includes('enrollment')}
            hasFilter
            filter={statsFilter}
            onFilterChange={value => handleFilterChange('enrollment', value)}
            onCustomFilterChange={range => handleCustomFilterChange('enrollment', range)}
            defaultFilterValue="today"
            hasChart
            className="h-[150px]"
          >
            <EnrollmentChart standalone={false} />
          </StatsCardWithChart>
        </div>
      </section>

      {/* Quiz Statistics with Chart */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Quiz Analytics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <BarChart3 className={getIconClass()} />
                <span className="min-w-0 truncate">Total Quizzes</span>
              </div>
            }
            value={formatNumber(quizStats.data?.data?.totalQuizzes)}
            isLoading={isQuizStatsFirstLoad}
          />

          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <TrendingUp className={getIconClass()} />
                <span className="min-w-0 truncate">Submissions</span>
              </div>
            }
            value={formatNumber(quizStats.data?.data?.totalSubmissions)}
            isLoading={isQuizStatsFirstLoad}
          />

          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <PieChart className={getIconClass()} />
                <span className="min-w-0 truncate">Avg Score</span>
              </div>
            }
            value={`${(quizStats.data?.data?.averageScore || 0).toFixed(1)}%`}
            isLoading={isQuizStatsFirstLoad}
          />

          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <TrendingUp className={getIconClass()} />
                <span className="min-w-0 truncate">Pass Rate</span>
              </div>
            }
            value={`${(quizStats.data?.data?.averagePassRate || 0).toFixed(1)}%`}
            isLoading={isQuizStatsFirstLoad || activeFilters.includes('quiz_stats')}
            hasFilter
            filter={statsFilter}
            onFilterChange={value => handleFilterChange('quiz_stats', value)}
            onCustomFilterChange={range => handleCustomFilterChange('quiz_stats', range)}
            defaultFilterValue="today"
            hasChart
            className="h-[150px]"
          >
            <QuizStatsChart standalone={false} />
          </StatsCardWithChart>
        </div>
      </section>

      {/* User Statistics */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">User Analytics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <Users className={getIconClass()} />
                <span className="min-w-0 truncate">Total Users</span>
              </div>
            }
            value={formatNumber(userStats.data?.data?.totalUsers)}
            isLoading={isUserStatsFirstLoad || activeFilters.includes('total_users')}
            hasFilter
            filter={statsFilter}
            onFilterChange={value => handleFilterChange('total_users', value)}
            onCustomFilterChange={range => handleCustomFilterChange('total_users', range)}
            defaultFilterValue="today"
          />

          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <BarChart3 className={getIconClass()} />
                <span className="min-w-0 truncate">Students</span>
              </div>
            }
            value={formatNumber(userStats.data?.data?.studentCount)}
            isLoading={isUserStatsFirstLoad}
          />

          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <Users className={getIconClass()} />
                <span className="min-w-0 truncate">Admins</span>
              </div>
            }
            value={formatNumber(userStats.data?.data?.adminCount)}
            isLoading={isUserStatsFirstLoad}
          />

          <StatsCardWithChart
            title={
              <div className="flex items-center gap-2 truncate min-w-0">
                <TrendingUp className={getIconClass()} />
                <span className="min-w-0 truncate">Enrollments</span>
              </div>
            }
            value={formatNumber(userStats.data?.data?.totalEnrollments)}
            isLoading={isUserStatsFirstLoad}
          />
        </div>
      </section>
    </div>
  );
};
