import React, { Component } from 'react';

import { ViewElement, Position } from '../../types';
import Menu from '../menu';
import Map from '../map';
import List from '../list';

import './style.css';

export const breakpoint = 900;

interface AppState {
  showing: ViewElement,
  userLocation: Position | null ;
  mapCenter: Position | null;
}

class App extends Component<{}, AppState> {
  state: AppState = {
    showing: ViewElement.Map,
    userLocation: null,
    mapCenter: null,
  };

  componentDidMount(){
    this.calculateShowing();
    window.addEventListener("resize", this.calculateShowing);

    this.getUserLocation();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.calculateShowing);
  }

  // figure out if showing map, list or both according to window size
  calculateShowing = () => {
    const { showing } = this.state;
    const newShowing = window.innerWidth >= breakpoint ? ViewElement.Both : ViewElement.Map;

    if (showing !== newShowing) {
      this.setState({ showing: newShowing });
    }
  }

  getUserLocation = () => {
    navigator.geolocation?.getCurrentPosition(geoPosition => {
      const userLocation: Position = { lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude };

      this.setState({
        mapCenter: userLocation,
        userLocation,
      });
    });
  };

  updateShowing = (showing: ViewElement) => this.setState({ showing });

  render() {
    const { showing, mapCenter } = this.state;
    const showingMap = showing === ViewElement.Map || showing === ViewElement.Both;
    const showingList = showing === ViewElement.List || showing === ViewElement.Both;

    return (
      <div className="app">
        <Menu showing={showing} updateShowing={this.updateShowing} />
        <div className="container">
          { showingMap && mapCenter && <Map mapCenter={mapCenter}/> }
          { showingList && <List /> }
        </div>
      </div>
    );
  }
}

export default App;
