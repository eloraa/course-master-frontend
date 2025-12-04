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
