import React from 'react';

import Menu from '../menu';
import Map from '../map';
import List from '../list';

import './style.css';

function App() {
  return (
    <div className="app">
      <Menu />
      <div className="container">
        <Map />
        <List />
      </div>
    </div>
  );
}

export default App;
