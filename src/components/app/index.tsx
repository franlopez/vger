import React, { Component } from 'react';
import jsonp from 'jsonp';

import { Position, Article } from '../../types';
import Menu from '../menu';
import Map from '../map';
import List from '../list';

import './style.css';

export const breakpoint = 900;

interface AppState {
  showList: boolean,
  userLocation: Position | null ;
  articles: Article[];
}

class App extends Component<{}, AppState> {
  state: AppState = {
    showList: false,
    userLocation: null,
    articles: [],
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
      }, this.getArticles);
    });
  };

  getArticles = () => {
    const { userLocation } = this.state

    if (userLocation) {
      const articlesUrl = 'https://en.wikipedia.org/w/api.php?format=json&formatversion=2&action=query&prop=coordinates|pageimages|extracts|info'
        + '&inprop=url&colimit=20&piprop=thumbnail&pithumbsize=144&pilimit=20&exchars=250&exlimit=20&exintro=&generator=geosearch'
        + `&ggscoord=${userLocation.lat}|${userLocation.lng}&ggsradius=10000&ggslimit=20&callback=JSON_CALLBACK`;

      jsonp(articlesUrl, {}, (error, data) => {
        if (!error) {
          // sort articles by title
          const articles = data.query.pages.sort((a: Article, b: Article) => a.title.localeCompare(b.title));

          this.setState({ articles });
        }
      });
    }
  };

  render() {
    const { showList, userLocation, articles } = this.state;

    return (
      <div className="app">
        <Menu />
        <div className="container">
          { userLocation && <Map userLocation={userLocation} articles={articles} /> }
          { showList && <List /> }
        </div>
      </div>
    );
  }
}

export default App;
