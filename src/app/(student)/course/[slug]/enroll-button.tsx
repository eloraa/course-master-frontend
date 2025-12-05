'use client';

import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/client/auth';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useEnrollCourse, useEnrollmentStatus } from '@/data/student/enrollment';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

interface EnrollButtonProps {
  courseId: string;
  price: number;
  currency: string;
}

export const EnrollButton = ({ courseId, price, currency }: EnrollButtonProps) => {
  const { session, loading: sessionLoading } = useSession();
  const router = useRouter();

  // Check enrollment status
  const { data: isEnrolled, isLoading: enrollmentLoading } = useEnrollmentStatus(courseId, !!session);

  // Enrollment mutation
  const enrollMutation = useEnrollCourse();

  const handleEnroll = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      await enrollMutation.mutateAsync({ courseId });
      toast.success('Successfully enrolled in the course!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to enroll. Please try again.';
      toast.error(message);
    }
  };

  if (sessionLoading || enrollmentLoading) {
    return <Spinner className="size-8" />;
  }

  // If already enrolled
  if (isEnrolled) {
    return (
      <Button size="lg" className="w-full" variant="secondary" disabled>
        <CheckCircle2 className="mr-2 h-5 w-5" />
        Enrolled
      </Button>
    );
  }

  return (
    <Button onClick={handleEnroll} disabled={enrollMutation.isPending} size="lg" className="w-full">
      {enrollMutation.isPending ? (
        <>
          <Spinner className="mr-2 h-4 w-4" />
          Enrolling...
        </>
      ) : session ? (
        `Enroll Now - ${currency} ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      ) : (
        'Login to Enroll'
      )}
    </Button>
  );
};
