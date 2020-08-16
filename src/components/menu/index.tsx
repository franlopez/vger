import React from 'react';

import { ViewElement } from '../../types';
import logo from './logo.svg';
import './style.css';

interface MenuProps {
  showing: ViewElement,
  updateShowing: (newShowing: ViewElement) => void,
}

function Menu({showing, updateShowing}: MenuProps) {
  const switchView = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    updateShowing(showing === ViewElement.Map ? ViewElement.List : ViewElement.Map);
  };

  return (
    <div className="menu">
      { showing === ViewElement.Map && <button onClick={switchView}>List</button> }
      { showing === ViewElement.List && <button onClick={switchView}>Map</button> }
      <img src={logo} className="logo" alt="Vger" />      
    </div>
  );
}

export default Menu;
