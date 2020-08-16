import React from 'react';

import { ViewElement } from '../../types';
import logo from './logo.svg';
import mapIcon from './map.svg';
import listIcon from './list.svg';
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
      {
        showing === ViewElement.Map &&
          <button onClick={switchView}>
            <img src={listIcon} alt="List" /> 
            <span>List</span>
          </button>
      }
      {
        showing === ViewElement.List &&
          <button onClick={switchView}>
            <img src={mapIcon} alt="Map" /> 
            <span>Map</span>
          </button>
      }

      <span className="logoContainer">
        <img src={logo} className="logo" alt="Vger" />      
      </span>
    </div>
  );
}

export default Menu;
