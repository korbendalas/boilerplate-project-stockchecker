import React from 'react';
import { render } from 'react-dom';

const root = document.getElementById('root');

const App = () =>
  <div>
    <h1>Hello World</h1>
  </div>

render(<App />, root);