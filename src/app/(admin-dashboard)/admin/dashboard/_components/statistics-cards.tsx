'use client';
import React from 'react';
import { format } from 'date-fns';
import type { DateRange } from '@/lib/date-filters';
import type {
  OrderStatisticsResponse,
  CourseStatisticsResponse,
  QuizStatisticsResponse,
  UserStatisticsResponse,
} from '@/data/admin/statistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DateRangePicker } from './_components/date-range-picker';

interface StatisticsCardsProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  orderStats?: OrderStatisticsResponse;
  courseStats?: CourseStatisticsResponse;
  quizStats?: QuizStatisticsResponse;
  userStats?: UserStatisticsResponse;
  isLoading?: boolean;
}

const StatCard = ({
  title,
  value,
  isLoading,
  icon: Icon,
  variant = 'default',
}: {
  title: string;
  value: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}) => {
  const variantClasses = {
    default: 'bg-card',
    success: 'bg-green-50 dark:bg-green-950',
    warning: 'bg-yellow-50 dark:bg-yellow-950',
    destructive: 'bg-red-50 dark:bg-red-950',
  };

  return (
    <Card className={variantClasses[variant]}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
};

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  dateRange,
  onDateRangeChange,
  orderStats,
  courseStats,
  quizStats,
  userStats,
  isLoading,
}) => {
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return '0';
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-4">
      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
          </p>
        </div>
        <DateRangePicker dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
      </div>

      {/* Order Statistics */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Order Statistics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(orderStats?.data?.totalRevenue)}
            isLoading={isLoading}
            variant="success"
          />
          <StatCard
            title="Total Orders"
            value={formatNumber(orderStats?.data?.totalOrders)}
            isLoading={isLoading}
          />
          <StatCard
            title="Average Order Value"
            value={formatCurrency(orderStats?.data?.averageOrderValue)}
            isLoading={isLoading}
          />
          <StatCard
            title="Orders Completed"
            value={formatNumber(orderStats?.data?.ordersBreakdown?.completed)}
            isLoading={isLoading}
            variant="success"
          />
        </div>
      </div>

      {/* Course Statistics */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Course Statistics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Courses"
            value={formatNumber(courseStats?.data?.totalCourses)}
            isLoading={isLoading}
          />
          <StatCard
            title="Published Courses"
            value={formatNumber(courseStats?.data?.publishedCourses)}
            isLoading={isLoading}
            variant="success"
          />
          <StatCard
            title="Total Enrollments"
            value={formatNumber(courseStats?.data?.totalEnrollments)}
            isLoading={isLoading}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(courseStats?.data?.totalRevenue)}
            isLoading={isLoading}
            variant="success"
          />
        </div>
      </div>

      {/* Quiz Statistics */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quiz Statistics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Quizzes"
            value={formatNumber(quizStats?.data?.totalQuizzes)}
            isLoading={isLoading}
          />
          <StatCard
            title="Total Submissions"
            value={formatNumber(quizStats?.data?.totalSubmissions)}
            isLoading={isLoading}
          />
          <StatCard
            title="Average Score"
            value={`${(quizStats?.data?.averageScore || 0).toFixed(1)}%`}
            isLoading={isLoading}
            variant="warning"
          />
          <StatCard
            title="Average Pass Rate"
            value={`${(quizStats?.data?.averagePassRate || 0).toFixed(1)}%`}
            isLoading={isLoading}
            variant="success"
          />
        </div>
      </div>

      {/* User Statistics */}
      <div>
        <h2 className="text-lg font-semibold mb-4">User Statistics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={formatNumber(userStats?.data?.totalUsers)}
            isLoading={isLoading}
          />
          <StatCard
            title="Student Count"
            value={formatNumber(userStats?.data?.studentCount)}
            isLoading={isLoading}
          />
          <StatCard
            title="Admin Count"
            value={formatNumber(userStats?.data?.adminCount)}
            isLoading={isLoading}
          />
          <StatCard
            title="Total Enrollments"
            value={formatNumber(userStats?.data?.totalEnrollments)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
