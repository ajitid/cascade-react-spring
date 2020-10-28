import React, { FC, useContext } from 'react';
import { ChevronLeft as ChevronLeftIcon } from 'react-feather';

import 'styles/tailwind.css';

import Seo from 'elements/Seo';
import { Children, Cascade, Item, ItemContext, BackProps } from 'elements/Cascade/Cascade';
import { WC } from 'shared/types';

function App() {
  return (
    <div className="min-h-screen font-sans antialiased text-gray-800 break-words bg-green-500">
      <Seo title="Home" />
      <div className="container mx-auto">
        <p className="font-bold py-4">
          Making a web version of{' '}
          <a
            href="https://twitter.com/saketme/status/1314834865469222917"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-900 underline focus:outline-black"
          >
            Saket's Cascade
          </a>
          :
        </p>

        <Cascade
          width={140}
          className="bg-green-200 shadow rounded"
          itemClassName="bg-green-200"
          Back={Back}
        >
          <ListItemButton>A</ListItemButton>

          <Item label="B">
            <ListItemButton>B</ListItemButton>

            <Children>
              <ListItemButton>B.A</ListItemButton>
              <ListItemButton>B.B</ListItemButton>

              <Item label="B.C">
                <ListItemButton>B.C</ListItemButton>

                <Children>
                  <ListItemButton>B.C.A</ListItemButton>
                  <ListItemButton>B.C.B</ListItemButton>
                </Children>
              </Item>

              <ListItemButton>B.D</ListItemButton>
            </Children>
          </Item>

          <ListItemButton>C</ListItemButton>
        </Cascade>
      </div>
    </div>
  );
}

const ListItemButton: FC<WC> = ({ children }) => {
  const { gotoChildren } = useContext(ItemContext);

  return (
    <button
      onClick={gotoChildren}
      className="block px-2 py-1 w-full text-left focus:outline-none active:bg-green-300 transition-colors duration-150"
    >
      {children}
    </button>
  );
};

const Back: FC<BackProps> = ({ goBack, parentLabel }) => {
  return (
    <button
      onClick={goBack}
      className="flex items-center text-sm bg-green-300 w-full py-1 px-2 text-left focus:outline-none active:bg-green-300 transition-colors duration-150"
    >
      <ChevronLeftIcon size={16} className="inline-block -ml-1 mr-1" />
      <span>{parentLabel}</span>
    </button>
  );
};

export default App;
