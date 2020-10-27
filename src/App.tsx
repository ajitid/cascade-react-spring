import React, { FC, useContext, useEffect, useState } from 'react';
import { useTransition, a, useSpring } from 'react-spring';
import useMeasure from 'react-use-measure';
import { nanoid } from 'nanoid';

import 'styles/tailwind.css';

import Seo from 'elements/Seo';
import { Children, Cascade, Item, ItemContext } from 'elements/Cascade/Cascade';
import { WC } from 'shared/types';

function App() {
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

        <Cascade>
          <SastaButton>A</SastaButton>

          <Item label="B">
            <SastaButton>B</SastaButton>

            <Children>
              <SastaButton>B.A</SastaButton>
              <SastaButton>B.B</SastaButton>

              <Item label="B.C">
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
        </Cascade>
      </div>
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
