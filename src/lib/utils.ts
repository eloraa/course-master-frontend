import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID() {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Adds scroll to a child element.
 *
 * @param {HTMLElement} childElement the element to add scroll to
 * @return {boolean | number} `height` if the child element is scrollable
 */
export const addScroll = (childElement: HTMLElement) => {
  const parent = childElement.parentElement;
  if (!parent) {
    return false;
  }

  const exceeds = childElement.scrollWidth > parent.clientWidth;
  const leftButton = parent.querySelector<HTMLElement>('.left');
  const rightButton = parent.querySelector<HTMLElement>('.right');

  if (!leftButton || !rightButton) {
    return false;
  }
  let bindEvent: ((event: MouseEvent) => void) | undefined;

  const isScrollable = childElement.scrollWidth > childElement.clientWidth;

  if (exceeds && isScrollable) {
    let isMouseDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleDrag = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const x = e.pageX - startX;
      childElement.scrollLeft = scrollLeft - x;
      updateButtonVisibility();
    };

    const handleMouseUp = () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleMouseUp);
      childElement.style.removeProperty('cursor');
      childElement.style.removeProperty('user-select');
    };
    bindEvent = (e: MouseEvent) => {
      isMouseDown = true;
      startX = e.pageX;
      scrollLeft = childElement.scrollLeft;

      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleMouseUp);
      childElement.style.cursor = 'grabbing';
      childElement.style.userSelect = 'none';
    };

    childElement.addEventListener('mousedown', bindEvent);

    leftButton.addEventListener('click', () => {
      childElement.scrollBy({
        left: -60,
        behavior: 'smooth',
      });
      updateButtonVisibility();
    });

    rightButton.addEventListener('click', () => {
      childElement.scrollBy({
        left: 60,
        behavior: 'smooth',
      });
      updateButtonVisibility();
    });

    const updateButtonVisibility = () => {
      const maxScroll = childElement.scrollWidth - childElement.clientWidth;

      leftButton.style.opacity = childElement.scrollLeft > 0 ? '1' : '0';
      rightButton.style.opacity = childElement.scrollLeft < maxScroll ? '1' : '0';

      leftButton.style.pointerEvents = childElement.scrollLeft > 0 ? 'auto' : 'none';
      rightButton.style.pointerEvents = childElement.scrollLeft < maxScroll ? 'auto' : 'none';
    };

    updateButtonVisibility();
  }

  if (!isScrollable) {
    if (bindEvent) {
      childElement.removeEventListener('mousedown', bindEvent);
    }
    leftButton.style.opacity = '0';
    leftButton.style.pointerEvents = 'none';
    rightButton.style.opacity = '0';
    rightButton.style.pointerEvents = 'none';
  } else {
    const rightButtonWrapper = rightButton.parentElement?.parentElement as HTMLElement | null;
    if (rightButtonWrapper) {
      rightButtonWrapper.style.height = `${childElement.clientHeight}px`;
    }
    rightButton.style.opacity = '1';
    rightButton.style.pointerEvents = 'auto';
  }

  window.addEventListener('resize', () => addScroll(childElement), { once: true });

  return isScrollable ? childElement.clientHeight : false;
};

interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 *
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @param options The options object
 * @returns Returns the new debounced function
 */
export function debounce<T extends (...args: never[]) => unknown>(func: T, wait: number = 0, options: DebounceOptions = {}): T & { cancel: () => void; flush: () => ReturnType<T> | undefined } {
  let lastArgs: Parameters<T> | undefined;
  let lastThis: ThisParameterType<T> | undefined;
  let maxWait: number | undefined;
  let result: ReturnType<T> | undefined;
  let timerId: NodeJS.Timeout | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  const leading = !!options.leading;
  const maxing = 'maxWait' in options;
  const trailing = 'trailing' in options ? !!options.trailing : true;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }

  wait = Number(wait) || 0;
  if (maxing) {
    maxWait = Math.max(Number(options.maxWait) || 0, wait);
  }

  function invokeFunc(time: number): ReturnType<T> | undefined {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg || undefined, args!) as ReturnType<T>;
    return result;
  }

  function leadingEdge(time: number): ReturnType<T> | undefined {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing ? Math.min(timeWaiting, maxWait! - timeSinceLastInvoke) : timeWaiting;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || (maxing && timeSinceLastInvoke >= maxWait!);
  }

  function timerExpired(): void {
    const time = Date.now();
    if (shouldInvoke(time)) {
      trailingEdge(time);
      return;
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number): ReturnType<T> | undefined {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel(): void {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush(): ReturnType<T> | undefined {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced(...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = undefined;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced as T & { cancel: () => void; flush: () => ReturnType<T> | undefined };
}
