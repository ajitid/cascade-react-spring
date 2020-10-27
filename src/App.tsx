import React, { useRef, useState } from 'react';
import { useTransition, a, useSpring } from 'react-spring';
import useMeasure from 'react-use-measure';
import { nanoid } from 'nanoid';

import 'styles/tailwind.css';

import Seo from 'elements/Seo';

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

  const WIDTH = 304;

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
  });

  const fragment = transition((style, item) => {
    const arrivingId = current;
    const isCurrentArriving = arrivingId === item;

    return (
      <a.div
        key={item}
        ref={arrivingId === item ? containerRef : () => {}}
        className="h-8 absolute top-0 left-0 bg-gray-300"
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
    <div className="min-h-screen font-sans antialiased text-gray-900">
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
    </div>
  );
}

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
