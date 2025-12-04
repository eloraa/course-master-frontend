'use client';

import { useTheme } from '@/store/theme';
import { themeColor } from '@/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import type { ThemeVariant } from '@/store/theme';

const VARIANT_LABELS: Record<string, string> = {
  default: 'Default',
  'default-amoled': 'Default Amoled',
  claude: 'Claude',
  vitesse: 'Vitesse',
  solarized: 'Solarized',
  mono: 'Mono',
};

export const VariantSelector = () => {
  const { variant, setVariant, theme, initialized } = useTheme();

  if (!initialized) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full">
        {Array.from({ length: Object.keys(themeColor).length }).map((_, i) => (
          <div key={i} className="flex flex-col items-center w-full">
            <Skeleton className="w-full h-28 mb-2 rounded-lg" />
            <div className="flex items-center gap-2 w-full px-2">
              <Skeleton className="size-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <TooltipProvider>
        <RadioGroup
          value={variant}
          onValueChange={v => setVariant(v as ThemeVariant)}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full"
          disabled={!initialized}
        >
          {Object.keys(themeColor).map(v => {
            const id = `variant-${v}`;
            return (
              <div key={v} className="flex flex-col items-center cursor-pointer group w-full">
                <label htmlFor={id} className="flex flex-col cursor-pointer w-full">
                  <div
                    className={`w-full h-28 mb-2 flex items-center justify-center border border-border rounded-lg relative transition-all ${
                      variant === v ? 'ring-2 ring-ring ring-offset-1 ring-offset-background' : ''
                    }`}
                    style={{
                      background: themeColor[v][theme],
                    }}
                  >
                    <div className="absolute top-2 left-2 w-2/3 h-3 rounded bg-black/10 dark:bg-white/10" />
                    <div className="absolute top-6 left-2 w-1/2 h-3 rounded bg-black/10 dark:bg-white/10" />
                    <div className="absolute top-10 left-2 w-1/4 h-3 rounded bg-black/10 dark:bg-white/10" />
                    <div className="absolute bottom-2 left-2 w-1/4 h-2 rounded bg-black/10 dark:bg-white/10" />
                    <div className="absolute bottom-2 left-1/3 w-1/6 h-2 rounded bg-black/10 dark:bg-white/10" />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex item-center gap-2 overflow-hidden mt-1 ml-1">
                        <RadioGroupItem value={v} id={id} className="mt-px" />
                        <span className="text-sm flex items-center gap-2 min-w-0 truncate">{VARIANT_LABELS[v] || v}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{VARIANT_LABELS[v] || v}</TooltipContent>
                  </Tooltip>
                </label>
              </div>
            );
          })}
        </RadioGroup>
      </TooltipProvider>
    </>
  );
};
