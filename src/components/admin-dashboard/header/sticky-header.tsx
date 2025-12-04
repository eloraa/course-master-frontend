'use client';
import { addScroll } from '@/lib/utils';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { MoveLeft } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

type StickyHeaderLink = {
  href: string;
  label: string;
  query?: Record<string, unknown>;
  strictMatch?: boolean;
};

type StickyHeadersProps = {
  links?: StickyHeaderLink[];
  label?: string;
  width?: string | number;
  strictMatch?: boolean;
  multiply?: number;
};

export const StickyHeaders: React.FC<StickyHeadersProps> = ({ links, label, width, strictMatch, multiply }) => {
  const barRef = useRef<HTMLUListElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isSticky, setSticky] = useState(false);
  const [scroll, setScroll] = useState<number | false>(false);
  const [isScrollingTowardsTop, setScrollingTowardsTop] = useState(false);

  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const dropdownItems = segments.slice(0, -2);
  const visibleItems = segments.slice(-2);

  useEffect(() => {
    const current = barRef.current as HTMLElement | null;
    if (current) {
      setScroll(addScroll(current));
    }
  }, []);

  useEffect(() => {
    let lastScrollTop = 0;

    function checkSticky() {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      if (rect.top <= 70) {
        setSticky(true);
      } else {
        setSticky(false);
      }

      // Find scrollable element
      let currentScrollTop = window.scrollY;

      if (!currentScrollTop) {
        currentScrollTop = document.documentElement.scrollTop;
      }
      if (!currentScrollTop) {
        currentScrollTop = document.body.scrollTop;
      }

      if (currentScrollTop < lastScrollTop) {
        setScrollingTowardsTop(true);
      } else {
        setScrollingTowardsTop(false);
      }

      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }

    // Trigger immediately on mount to check initial state
    checkSticky();

    // Find the scrollable parent element
    let scrollElement = document.documentElement;
    if (document.body.scrollHeight > window.innerHeight) {
      scrollElement = document.body;
    }

    const handleScroll = () => {
      checkSticky();
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={elementRef} className="my-4 sticky top-0 z-30 bg-background transition-[top] px-2 md:px-4" style={{ top: multiply && isScrollingTowardsTop ? 47.5 * multiply : 56 }}>
      <div className="absolute bottom-[0.0123px] inset-x-0 border-b"></div>
      <div className="absolute flex items-center inset-x-0 bottom-0 justify-between md:mx-10 mx-5 z-10 pointer-events-none" style={{ height: scroll || 0, display: scroll ? 'flex' : 'none' }}>
        <button className="bg-linear-to-r from-violet-50 to-transparent h-full flex items-center justify-center w-8 left transition-opacity opacity-0 pointer-events-none">
          <div className="w-3 h-3 text-primary stroke-2 mt-0.5">
            <ArrowLeft className="w-3 h-3" />
          </div>
        </button>
        <button className="bg-linear-to-l from-violet-50 to-transparent h-full flex items-center justify-center w-8 pointer-events-auto right transition-opacity">
          <div className="w-3 h-3 text-primary stroke-2 mt-0.5">
            <ArrowRight className="w-3 h-3" />
          </div>
        </button>
      </div>
      <ul ref={barRef} className="leading-none relative flex items-center gap-10 whitespace-nowrap text-sm font-medium overflow-x-auto no-scroll overflow-y-hidden">
        <div
          className="flex items-center transition-[margin]"
          style={{ width: isSticky ? `${width}ch` || '6rem' : '0', marginLeft: isSticky ? '0' : `-${Number(width) - 3}ch`, opacity: isSticky ? '1' : '0' }}
        >
          <Link href="/" className={clsx({ 'pointer-events-none': !isSticky })}>
            <div className="text-primary dark:text-white flex items-center gap-2" style={{ minWidth: '6rem', width: '6rem' }}>
              <div>
                <MoveLeft className="w-4" />
              </div>
              <h1>{label || 'Coursemaster'}</h1>
            </div>
          </Link>
        </div>
        <Breadcrumb
          className={clsx('overflow-hidden *:whitespace-nowrap whitespace-normal max-h-10 flex-nowrap', {
            'w-0 pointer-events-none -custom-ml-12': !isSticky,
          })}
        >
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {dropdownItems.length > 0 && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <BreadcrumbEllipsis className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {dropdownItems.map((segment, index) => (
                        <DropdownMenuItem key={index}>
                          <BreadcrumbLink href={`/${segments.slice(0, index + 1).join('/')}`}>{segment}</BreadcrumbLink>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            {visibleItems.slice(0, -1).map((segment, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${segments.slice(0, segments.length - 3 + index + 1).join('/')}`}>{segment}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            ))}
            <BreadcrumbItem>
              <BreadcrumbPage>{visibleItems.slice(-1)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {!!links &&
          !!links.length &&
          links.map((link, index) => (
            <li key={index}>
              <Link
                className={cn(
                  clsx('py-4 block opacity-60 hover:opacity-100 transition-opacity border-b-2 border-transparent', {
                    'opacity-100 border-b-primary': strictMatch || link.strictMatch ? pathname.includes(link.href) : pathname === link.href,
                  })
                )}
                href={{ pathname: link.href, query: link.query as Record<string, string | string[] | number | undefined> | undefined }}
              >
                {link.label}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};
