import React, { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { useTransition, a, useSpring } from 'react-spring';
import useMeasure from 'react-use-measure';

import { FC, WC } from 'shared/types';

interface CascadeContextShape {
  push: (parentLabel: string, nodes: ReactNode[]) => void;
  pop: () => void;
}

const CascadeContext = createContext<CascadeContextShape>({
  pop() {},
  push() {},
});

interface ItemContextShape {
  gotoChildren: () => void;
}

export const ItemContext = createContext<ItemContextShape>({
  gotoChildren() {},
});

export const Item: FC<WC<{ label: string }>> = ({ children, label }) => {
  const cascadeChildren = React.Children.toArray(children).filter(
    node => node.type === Children
  );

  const { push } = useContext(CascadeContext);
  const gotoChildren = () => {
    push(label, cascadeChildren);
  };

  const item = React.Children.toArray(children).filter(node => node.type !== Children);

  return <ItemContext.Provider value={{ gotoChildren }}>{item}</ItemContext.Provider>;
};

export const Children: FC<WC> = ({ children }) => {
  return <>{children}</>;
};

export const Cascade: FC<WC> = ({ children }) => {
  const [action, setAction] = useState<'pop' | 'push'>('push');

  const [stack, setStack] = useState<
    {
      parentLabel: string;
      content: ReactNode;
    }[]
  >(() => [{ parentLabel: 'Home', content: children }]);
  const current = stack[stack.length - 1];

  const push = (parentLabel: string, node: ReactNode) => {
    setAction('push');

    setStack(prevStack => {
      const stack = [...prevStack];

      stack.push({ parentLabel, content: node });
      return stack;
    });
  };

  const pop = () => {
    if (stack.length === 1) return;

    setAction('pop');

    setStack(prevStack => {
      const stack = [...prevStack];

      stack.pop();
      return stack;
    });
  };

  const [containerRef, { height }] = useMeasure();
  const containerStyle = useSpring({ height });

  const WIDTH = 80;

  const [immediate, setImmediate] = useState(true);
  useEffect(() => {
    setImmediate(false);
  }, []);

  const transition = useTransition(current, {
    from: {
      x: action === 'pop' ? (-1 * WIDTH) / 4 : WIDTH,
    },
    enter: {
      x: 0,
    },
    leave: {
      x: action === 'pop' ? WIDTH : (-1 * WIDTH) / 4,
    },
    immediate,
    // config: {
    //   damping: 1,
    //   frequency: 4,
    // },
  });

  const fragment = transition((style, item) => {
    const arrivingId = current;
    const isCurrentArriving = arrivingId === item;

    return (
      <a.div
        ref={isCurrentArriving ? containerRef : () => {}}
        className="absolute top-0 left-0 bg-gray-300"
        style={{
          ...style,
          width: WIDTH,
          zIndex: !isCurrentArriving && action === 'pop' ? 10 : 0,
        }}
      >
        {item.content}
      </a.div>
    );
  });

  return (
    <CascadeContext.Provider value={{ push, pop }}>
      {stack.length > 0 && (
        <>
          <button onClick={pop} className="block">
            ◀ {stack[stack.length - 1].parentLabel}
          </button>

          <a.div
            style={{ ...containerStyle, width: WIDTH }}
            className="relative overflow-hidden bg-gray-300"
          >
            {fragment}
          </a.div>
        </>
      )}
    </CascadeContext.Provider>
  );
};

export default Cascade;
