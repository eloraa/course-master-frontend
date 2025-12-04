'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '../../ui/navigation-menu';
import { usePathname } from 'next/navigation';
import { CheckIcon, StopCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Button } from '../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { ThemeToggler } from './theme-toggler';
import { useState } from 'react';
import { Kbd } from '../../ui/kbd';
import clsx from 'clsx';
import { Logo } from '@/components/ui/logo';
import { Navigator } from './navigator';
import { signOut } from 'next-auth/react';
import { useSession } from '@/lib/client/auth';
import { Spinner } from '@/components/ui/spinner';

type NavigationChild = {
  name: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
};

type NavigationItem = NavigationChild & {
  submenu?: NavigationChild[];
};

export const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { session, loading } = useSession();

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
    },
    {
      name: 'Courses',
      href: '/admin/course',
      submenu: [
        {
          name: 'Draft',
          href: '/admin/course/draft',
          icon: StopCircle,
        },
        {
          name: 'Published',
          href: '/admin/course/published',
          icon: CheckIcon,
        },
      ],
    },
  ];

  return (
    <header className="flex items-center justify-between md:px-4 px-2 pt-2 z-40 bg-background pb-2 __line bg-size-[8px_1px] bg-bottom min-w-0 sticky top-0">
      <Navigator navigation={navigation} open={open} setOpen={setOpen} />
      <div className="flex items-center xl:gap-4 max-md:flex-row max-md:items-center max-lg:flex-col max-lg:items-start max-lg:w-full min-w-0 gap-2">
        <Link href="/">
          <Logo className="size-5" />
        </Link>
        <div className="flex flex-col md:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-auto px-1" size="sm">
                <svg className="w-4" aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 24">
                  <path d="M13 8.517L8 3 3 8.517M3 15.48l5 5.517 5-5.517"></path>
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full bg-transparent shadow-none outline-none border-none z-45">
              <NavigationMenu orientation="vertical">
                <NavigationMenuViewport className="top-0 bottom-0 left-full border bg-popover rounded-r-md overflow-hidden" />
                <NavigationMenuList className="flex-col space-y-0.5 [&>li]:w-full [&>li>a]:w-full [&>li>a]:text-left border py-1 rounded-l-md bg-popover overflow-hidden [&>li>a]:justify-start items-start space-x-0">
                  {navigation.map(item => (
                    <NavigationMenuItem className="relative" key={item.name}>
                      {item.submenu ? (
                        <>
                          <NavigationMenuTrigger
                            noicon={true}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              'w-full text-left justify-start',
                              `${(pathname === '/' && item.href === '/') || (pathname !== '/' && item.href !== '/' && pathname.includes(item.href)) ? 'bg-accent/70' : ''}`
                            )}
                          >
                            {item.name}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent data-motion="from-end" data-orientation="vertical" className="justify-center flex top-0 left-0">
                            <ul className="grid w-[200px] ">
                              {item.submenu.map(item => (
                                <li key={item.name} className="w-full [&button]:w-full [&>a]:w-full [&>a]:text-left [&>a]:justify-start relative">
                                  <Link href={item.href} passHref legacyBehavior>
                                    <NavigationMenuLink
                                      className={cn(
                                        'flex items-center gap-2',
                                        navigationMenuTriggerStyle(),
                                        `${(pathname === '/' && item.href === '/') || (pathname !== '/' && item.href !== '/' && pathname.includes(item.href)) ? 'bg-accent/70' : ''}`
                                      )}
                                    >
                                      {item.icon && <item.icon className="w-4 h-4 text-primary" style={{ color: item.color }} />}
                                      {item.name}
                                    </NavigationMenuLink>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <Link href={item.href} passHref legacyBehavior>
                          <NavigationMenuLink
                            className={cn(
                              navigationMenuTriggerStyle(),
                              'flex items-center w-full gap-2',
                              `${(pathname === '/' && item.href === '/') || (pathname !== '/' && item.href !== '/' && pathname.includes(item.href)) ? 'bg-accent/70' : ''}`
                            )}
                          >
                            {item.name}
                          </NavigationMenuLink>
                        </Link>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
        </div>
        <div className="max-md:hidden flex justify-start max-lg:pb-[600px] max-lg:-custom-mb-[600px] no-scrollbar max-lg:overflow-x-auto max-lg:w-full">
          <NavigationMenu>
            <NavigationMenuList className="space-x-0">
              {navigation.map(item => (
                <NavigationMenuItem className="relative" key={item.name}>
                  {item.submenu ? (
                    <>
                      <NavigationMenuTrigger
                        className={clsx(navigationMenuTriggerStyle(), {
                          'bg-accent/70': (pathname === '/' && item.href === '/') || (pathname !== '/' && item.href !== '/' && pathname.includes(item.href)),
                        })}
                      >
                        <Link href={item.href}>{item.name}</Link>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="justify-center flex top-full">
                        <ul className="grid w-[200px] gap-3 p-2 md:w-[200px] lg:w-[400px] rounded-md border bg-popover text-popover-foreground shadow-lg">
                          {item.submenu.map(item => (
                            <li key={item.name} className="w-full [&>a]:w-full [&>a]:text-left [&>a]:justify-start relative">
                              <Link href={item.href} passHref legacyBehavior>
                                <NavigationMenuLink
                                  className={cn(
                                    'flex items-center gap-2',
                                    navigationMenuTriggerStyle(),
                                    `${(pathname === '/' && item.href === '/') || (pathname !== '/' && item.href !== '/' && pathname.includes(item.href)) ? 'bg-accent/70' : ''}`
                                  )}
                                >
                                  {item.icon && <item.icon className="w-4 h-4 text-primary" style={{ color: item.color }} />}
                                  {item.name}
                                </NavigationMenuLink>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href} passHref legacyBehavior>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          `${(pathname === '/' && item.href === '/') || (pathname !== '/' && item.href !== '/' && pathname.includes(item.href)) ? 'bg-accent/70' : ''}`
                        )}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="max-lg:self-start min-w-0">
        {loading || !session ? (
          <Spinner />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:bg-transparent w-8! h-8! rounded-full!" asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.jpg" alt="@shadcn" />
                  <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session.user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel onClick={() => setOpen(true)} className="font-normal flex items-center justify-between cursor-pointer">
                Navigator
                <div className="flex items-center gap-1">
                  <Kbd>Ctrl</Kbd>
                  <Kbd>K</Kbd>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-normal flex items-center justify-between">
                Theme
                <ThemeToggler />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    Setting
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};
