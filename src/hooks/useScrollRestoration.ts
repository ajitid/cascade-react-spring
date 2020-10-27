import { RefObject, useEffect } from 'react';

const cache: Record<string, number> = {};

const useScrollRestoration = (key: string, elRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const el = elRef.current;
    if (el == null) return;

    if (Object.keys(cache).includes(key)) {
      el.scrollTop = cache[key];
    } else {
      cache[key] = el.scrollTop;
    }

    return () => {
      cache[key] = el.scrollTop;
    };
  }, [elRef, key]);
};

export const deleteScrollPositionFromCache = (key: string) => {
  delete cache[key];
};

export default useScrollRestoration;
