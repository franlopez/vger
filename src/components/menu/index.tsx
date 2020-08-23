import React from 'react';

import logo from './logo.svg';
import './style.css';

function Menu() {
  return (
    <div className="menu">
      <span className="logoContainer">
        <img src={logo} className="logo" alt="Vger" />      
      </span>
    </div>
  );
}

export default Menu;
