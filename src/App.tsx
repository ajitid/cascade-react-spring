import React, { FC, useContext, useEffect, useState } from 'react';
import { useTransition, a, useSpring } from 'react-spring';
import useMeasure from 'react-use-measure';
import { nanoid } from 'nanoid';

import 'styles/tailwind.css';

import Seo from 'elements/Seo';
import { Children, Cascade, Item, ItemContext } from 'elements/Cascade/Cascade';
import { WC } from 'shared/types';

function App() {
  const [containerRef, { height }] = useMeasure();
  const containerStyle = useSpring({ height });

  const [action, setAction] = useState<'shift' | 'push'>('push');
  const [current, setCurrent] = useState(() => nanoid());
  const shift = () => {
    setAction('shift');

    const id = nanoid();
    setCurrent(id);
  };
  const push = () => {
    setAction('push');

    const id = nanoid();
    setCurrent(id);
  };

  const WIDTH = 80;

  const [immediate, setImmediate] = useState(true);
  useEffect(() => {
    setImmediate(false);
  }, []);

  const transition = useTransition(current, {
    from: {
      x: action === 'shift' ? (-1 * WIDTH) / 4 : WIDTH,
    },
    enter: {
      x: 0,
    },
    leave: {
      x: action === 'shift' ? WIDTH : (-1 * WIDTH) / 4,
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
        key={item}
        ref={arrivingId === item ? containerRef : () => {}}
        className="absolute top-0 left-0 bg-gray-300"
        style={{
          ...style,
          width: WIDTH,
          zIndex: !isCurrentArriving && action === 'shift' ? 10 : 0,
        }}
      >
        {item}
      </a.div>
    );
  });

  return (
    <div className="min-h-screen font-sans antialiased text-gray-900 break-words">
      <Seo title="Home" />
      <div className="container mx-auto">
        <p>
          Making a web version of{' '}
          <a
            href="https://twitter.com/saketme/status/1314834865469222917"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700"
          >
            Saket's Cascade
          </a>
          :
        </p>

        <button onClick={shift}>shift</button>
        <button onClick={push}>push</button>

        <a.div
          style={{ ...containerStyle, width: WIDTH }}
          className="relative overflow-hidden bg-gray-300"
        >
          {fragment}
        </a.div>
      </div>

      <Cascade>
        <SastaButton>A</SastaButton>

        <Item label="B">
          <SastaButton>B</SastaButton>

          <Children>
            <SastaButton>B.A</SastaButton>
            <SastaButton>B.B</SastaButton>
            <Item label="🤜 B.C">
              <SastaButton>B.C</SastaButton>

              <Children>
                <SastaButton>B.C.A</SastaButton>
                <SastaButton>B.C.B</SastaButton>
              </Children>
            </Item>
            <SastaButton>B.D</SastaButton>
          </Children>
        </Item>

        <SastaButton>C</SastaButton>
        <SastaButton>D</SastaButton>
      </Cascade>
    </div>
  );
}

const SastaButton: FC<WC> = ({ children }) => {
  const { gotoChildren } = useContext(ItemContext);

  return (
    <button onClick={gotoChildren} className="block">
      {children}
    </button>
  );
};

export default App;

/*
<Cascade>
  <Cascade.Item>
      <Cascade.Children>
        <Cascase.Item>
          <div><Icon /> Name</div>
        </Cascase.Item>
      </Cascade.Children>
  </Cascade.Item>
</Cascade>

*/
