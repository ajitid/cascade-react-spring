import React from 'react';

import 'styles/tailwind.css';

import Seo from 'elements/Seo';

function App() {
  return (
    <div className="min-h-screen font-sans antialiased text-brand-black bg-brand-white">
      <Seo title="Home" />
    </div>
  );
}

export default App;
