import React, { Component } from 'react';

import { Position } from '../../types';
import Menu from '../menu';
import Map from '../map';
import List from '../list';

import './style.css';

export const breakpoint = 900;

interface AppState {
  showList: boolean,
  userLocation: Position | null ;
}

class App extends Component<{}, AppState> {
  state: AppState = {
    showList: false,
    userLocation: null,
  };

  componentDidMount(){
    this.updateShowList();
    window.addEventListener("resize", this.updateShowList);

    this.getUserLocation();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateShowList);
  }

  // figure out if showing map, list or both according to window size
  updateShowList = () => {
    const showList = window.innerWidth >= breakpoint ? true : false;

    this.setState({ showList });
  }

  getUserLocation = () => {
    navigator.geolocation?.getCurrentPosition(geoPosition => {
      const userLocation: Position = { lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude };

      this.setState({
        userLocation,
      });
    });
  };

  render() {
    const { showList, userLocation } = this.state;

    return (
      <div className="app">
        <Menu />
        <div className="container">
          { userLocation && <Map userLocation={userLocation} /> }
          { showList && <List /> }
        </div>
      </div>
    );
  }
}

export default App;
