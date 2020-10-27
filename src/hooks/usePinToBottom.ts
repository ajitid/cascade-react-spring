import { RefObject, useLayoutEffect, useEffect, useRef, useState } from 'react';
import { useSpring } from 'react-spring';

import { noop } from 'utils/helpers';

/*
  - for received msgs, scroll if within buffer
  - for sent msgs, scroll to bottom automatically -> this can be forced using a fn
*/

export enum ScrollAction {
  DoNothing,
  ScrollToBottom,
  Peek,
}

interface PinToBottomConfig {
  peek?: number;
  scrollAction?: (type: ScrollAction) => void;
}

const usePinToBottom = (
  ref: RefObject<HTMLElement>,
  key: string | number,
  { peek = 0, scrollAction = noop }: PinToBottomConfig = {}
) => {
  const [, change] = useSpring(() => ({
    from: {
      scrollTop: ref.current?.scrollTop ?? 0,
    },
    scrollTop: ref.current?.scrollTop ?? 0,
    onChange: {
      scrollTop(v: number) {
        const node = ref.current;
        if (!node) return;

        node.scrollTop = v;
      },
    },
    config: {
      frequency: 0.5,
      damping: 1,
    },
  }));

  const [skip, setSkip] = useState(false);

  const forceScrollRef = useRef(false);
  const isFirstRunRef = useRef(true);
  const lastScrollHeightRef = useRef(ref.current?.scrollHeight ?? 0);
  const scrollActionRef = useRef<ScrollAction>(ScrollAction.DoNothing);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (forceScrollRef.current) {
      forceScrollRef.current = false;
      scrollActionRef.current = ScrollAction.ScrollToBottom;
      return;
    }

    const lastScrollHeight = lastScrollHeightRef.current;
    const scrollHeight = node.scrollHeight;
    const scrollPosition = node.scrollTop + node.clientHeight;
    const windowHeight = node.clientHeight;

    const isWithinAutoScrollBounds = scrollPosition >= lastScrollHeight - windowHeight;

    if (isWithinAutoScrollBounds) {
      const changeExceedsWindowHeight = scrollHeight > lastScrollHeight + windowHeight;

      if (changeExceedsWindowHeight) {
        scrollActionRef.current = ScrollAction.Peek;
      } else {
        scrollActionRef.current = ScrollAction.ScrollToBottom;
      }
    } else {
      scrollActionRef.current = ScrollAction.DoNothing;
    }
  }, [key, ref]);

  useEffect(() => {
    if (isFirstRunRef.current) return;

    scrollAction(scrollActionRef.current);
  }, [key, scrollAction]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (isFirstRunRef.current) return;

    const { scrollHeight, clientHeight: windowHeight, scrollTop } = node;
    const lastScrollHeight = lastScrollHeightRef.current;

    switch (scrollActionRef.current) {
      case ScrollAction.ScrollToBottom:
        change({
          from: {
            scrollTop,
          },
          scrollTop: scrollHeight - windowHeight,
        });

        break;
      case ScrollAction.Peek:
        change({
          from: {
            scrollTop,
          },
          scrollTop: lastScrollHeight - peek,
        });

        break;
    }
  }, [key, change, ref, peek]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (skip) return;

    lastScrollHeightRef.current = node.scrollHeight;
  }, [key, ref, skip]);

  useEffect(() => {
    isFirstRunRef.current = false;
  }, []);

  // manually scroll to bottom
  // batches the action for next key change
  const queueScrollToBottomRef = useRef(() => {
    const node = ref.current;
    if (!node) return;

    forceScrollRef.current = true;
  });

  return {
    queueScrollToBottom: queueScrollToBottomRef.current,
    setSkip,
  };
};

export default usePinToBottom;
