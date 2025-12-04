'use client';

import * as React from 'react';
import { Settings, User } from 'lucide-react';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CircleDashed } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Laptop2 } from 'lucide-react';
import { useTheme } from '@/store/theme';

type NavigatorItem = {
  name: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type NavigatorNavItem = {
  name: string;
  href: string;
  submenu?: NavigatorItem[];
};

type NavigatorProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: NavigatorNavItem[];
};

export function Navigator({ open, setOpen, navigation }: NavigatorProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  return (
    <CommandDialog className="rounded-none" open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="What do you need...?" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages"></CommandGroup>
        {navigation.map((item, index) => (
          <React.Fragment key={item.name + index}>
            {item.submenu?.length && <CommandSeparator />}
            <CommandItem
              value={item.name}
              onSelect={() => {
                setOpen(false);
                router.push(item.href);
              }}
              className="rounded-none"
            >
              <Circle className="mr-2 !h-3.5 !w-3.5" />
              <span>{item.name}</span>
            </CommandItem>
            {item.submenu?.length && (
              <CommandGroup className="!pt-1 !px-0" heading={item.name}>
                {item.submenu.map((menu, index) => (
                  <CommandItem
                    key={menu.name + index}
                    value={menu.name + item.name}
                    onSelect={() => {
                      setOpen(false);
                      router.push(menu.href);
                    }}
                    className="rounded-none"
                  >
                    {menu.icon ? <menu.icon className="mr-2 !h-3.5 !w-3.5" /> : <CircleDashed className="mr-2 !h-3.5 !w-3.5" />}
                    <h1>{menu.name}</h1>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </React.Fragment>
        ))}
        <CommandSeparator />
        <CommandGroup className="!pt-1 !px-0" heading="Settings">
          <CommandItem>
            <User className="mr-2 !h-4 !w-4" />
            <span>Profile</span>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 !h-4 !w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup className="!pt-1 !px-0" heading="Theme">
          <CommandItem
            onSelect={() => {
              setTheme('light');
              setOpen(false);
            }}
          >
            <Sun className="mr-2 !h-4 !w-4" />
            <span>Light</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setTheme('dark');
              setOpen(false);
            }}
          >
            <Moon className="mr-2 !h-4 !w-4" />
            <span>Dark</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setTheme('system');
              setOpen(false);
            }}
          >
            <Laptop2 className="mr-2 !h-4 !w-4" />
            <span>System</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
