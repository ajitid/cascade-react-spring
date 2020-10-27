import React, { ReactNode, useEffect, useState, createContext, useContext } from 'react';

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

  const push = (parentLabel: string, node: ReactNode) => {
    setAction('push');

    setStack(prevStack => {
      const stack = [...prevStack];

      stack.push({ parentLabel, content: node });
      return stack;
    });
  };

  const pop = () => {
    setAction('pop');

    setStack(prevStack => {
      const stack = [...prevStack];

      stack.pop();
      return stack;
    });
  };

  return (
    <CascadeContext.Provider value={{ push, pop }}>
      {stack.length > 0 && (
        <>
          <button onClick={pop} className="block">
            {stack[stack.length - 1].parentLabel}
          </button>
          {stack[stack.length - 1].content}
        </>
      )}
    </CascadeContext.Provider>
  );
};

export default Cascade;
