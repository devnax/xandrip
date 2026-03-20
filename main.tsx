import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRoot } from '@xanui/core';
import Example from './example';


const App = () => {
  return (
    <AppRoot theme='dark' height="100vh">
      <Example />
    </AppRoot>
  )
}

const rootEle = document.getElementById('root')
if (rootEle) {
  const root = createRoot(rootEle);
  root.render(<App />);
}
