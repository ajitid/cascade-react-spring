import React, {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
  CSSProperties,
} from 'react';
import { useTransition, a, useSpring } from 'react-spring';
import useMeasure from 'react-use-measure';
import cn from 'clsx';

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

export interface BackProps {
  parentLabel: string;
  goBack: () => void;
  style?: CSSProperties;
  className?: string;
}

interface BackWrapperProps extends BackProps {
  Back?: FC<BackProps>;
}

export const BackWrapper: FC<BackWrapperProps> = ({
  parentLabel,
  goBack,
  style,
  className,
  Back,
}) => {
  // We have to do this as parentLabel gets immediately switched when
  // we move from one list to the next
  const parentLabelRef = useRef(parentLabel);

  if (Back != null) return <Back {...{ parentLabel: parentLabelRef.current, goBack }} />;

  return (
    <button
      onClick={goBack}
      style={style}
      className={cn([className, 'block text-sm text-left w-full focus:outline-black'])}
    >
      Go back to {parentLabelRef.current}
    </button>
  );
};

export const Cascade: FC<WC<{
  style?: CSSProperties;
  className?: string;
  itemStyle?: CSSProperties;
  itemClassName?: string;
  width?: number;
  Back?: FC<BackProps>;
}>> = ({ children, width = 80, Back, style, className, itemStyle, itemClassName }) => {
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
    if (stack.length <= 1) return;

    setAction('pop');

    setStack(prevStack => {
      const stack = [...prevStack];

      stack.pop();
      return stack;
    });
  };

  const [containerRef, { height }] = useMeasure();
  const containerStyle = useSpring({ height });

  const WIDTH = width;

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

  const fragment = transition((animStyle, item) => {
    const arrivingId = current;
    const isCurrentArriving = arrivingId === item;

    return (
      <a.div
        ref={isCurrentArriving ? containerRef : () => {}}
        className={cn(itemClassName, ['absolute top-0 left-0'])}
        style={{
          ...itemStyle,
          ...animStyle,
          width: WIDTH,
          zIndex: !isCurrentArriving && action === 'pop' ? 10 : 0,
        }}
      >
        {stack[0].content !== item.content && (
          <BackWrapper
            Back={Back}
            parentLabel={stack[stack.length - 1].parentLabel}
            goBack={pop}
          />
        )}
        {item.content}
      </a.div>
    );
  });

  return (
    <CascadeContext.Provider value={{ push, pop }}>
      {stack.length > 0 && (
        <>
          <a.div
            style={{ ...style, ...containerStyle, width: WIDTH }}
            className={cn(className, 'relative overflow-hidden')}
          >
            {fragment}
          </a.div>
        </>
      )}
    </CascadeContext.Provider>
  );
};

export default Cascade;
