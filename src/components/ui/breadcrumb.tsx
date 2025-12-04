import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';

type BreadcrumbProps = React.ComponentPropsWithoutRef<'nav'>;
type BreadcrumbRef = React.ElementRef<'nav'>;

const Breadcrumb = React.forwardRef<BreadcrumbRef, BreadcrumbProps>(({ className, ...props }, ref) => (
  <nav ref={ref} aria-label="breadcrumb" className={cn('text-sm', className)} {...props} />
));
Breadcrumb.displayName = 'Breadcrumb';

type BreadcrumbListProps = React.ComponentPropsWithoutRef<'ol'>;
type BreadcrumbListRef = React.ComponentRef<'ol'>;

const BreadcrumbList = React.forwardRef<BreadcrumbListRef, BreadcrumbListProps>(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn('flex flex-wrap items-center gap-1.5 wrap-break-word text-sm text-muted-foreground sm:gap-2.5', className)} {...props} />
));
BreadcrumbList.displayName = 'BreadcrumbList';

type BreadcrumbItemProps = React.ComponentPropsWithoutRef<'li'>;
type BreadcrumbItemRef = React.ComponentRef<'li'>;

const BreadcrumbItem = React.forwardRef<BreadcrumbItemRef, BreadcrumbItemProps>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

type BreadcrumbLinkProps = React.ComponentPropsWithoutRef<'a'> & {
  asChild?: boolean;
};
type BreadcrumbLinkRef = React.ComponentRef<'a'>;

const BreadcrumbLink = React.forwardRef<BreadcrumbLinkRef, BreadcrumbLinkProps>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a';

  return <Comp ref={ref} className={cn('transition-colors hover:text-foreground', className)} {...props} />;
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

type BreadcrumbPageProps = React.ComponentPropsWithoutRef<'span'>;
type BreadcrumbPageRef = React.ElementRef<'span'>;

const BreadcrumbPage = React.forwardRef<BreadcrumbPageRef, BreadcrumbPageProps>(({ className, ...props }, ref) => (
  <span ref={ref} role="link" aria-disabled="true" aria-current="page" className={cn('font-normal text-foreground', className)} {...props} />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

type BreadcrumbSeparatorProps = React.ComponentPropsWithoutRef<'li'>;

const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => (
  <li role="presentation" aria-hidden="true" className={cn('[&>svg]:size-3.5', className)} {...props}>
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

type BreadcrumbEllipsisProps = React.ComponentPropsWithoutRef<'span'>;

const BreadcrumbEllipsis = ({ className, ...props }: BreadcrumbEllipsisProps) => (
  <span role="presentation" aria-hidden="true" className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis };
