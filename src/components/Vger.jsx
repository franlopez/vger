import React from 'react';
import Menu from './Menu.jsx';
import Vmap from './Vmap.jsx';
import List from './List.jsx';
import Modal from './Modal.jsx';
import Settings from './Settings.jsx';
import About from './About.jsx';
import ErrorMsg from './ErrorMsg.jsx';
import reqwest from 'reqwest';

class Vger extends React.Component {
  constructor(...args) {
    super(...args);

    const language = localStorage.getItem('vgerLanguage') || 'en';

    this.state = {
      mapVisible: true, // on small screens, either map or list is showing
      userLocation: null, // this is an object with 'latitude' and 'longitude'
      gettingUserLocation: false,
      mapCenter: null, // this is an object with 'latitude' and 'longitude'
      articles: [],
      gettingArticles: false,
      openArticle: null, // set the currently opened article
      modal: null, // string, which modal to show, null to hide
      language: language
    };
  }

  toggleVisible = () => {
    const newMapVisible = !this.state.mapVisible;
    this.setState({
      mapVisible: newMapVisible
    });
  }

  closeModal = () => {
    this.setState({
      modal: null
    });
  }

  setModal = (modal) => {
    this.setState({
      modal: modal
    });
  }

  setLanguage = (newLanguage) => {
    // newLanguage should be alanguage code
    localStorage.setItem('vgerLanguage', newLanguage);
    this.setState({
      language: newLanguage
    });
  }

  getUserLocation = () => {
    const errorState = {
      userLocation: null,
      modal: 'error-location',
      gettingUserLocation: false
    };

    if (navigator.geolocation) {
      this.setState({
        gettingUserLocation: true
      });
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          mapCenter: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          modal: null,
          gettingUserLocation: false
        });
        this.getArticles({latitude: position.coords.latitude, longitude: position.coords.longitude});
      }, () => {
        this.setState(errorState);
      },
      {timeout: 5000});
    } else {
      this.setState(errorState);
    }
  }

  getArticles = (pos) => {
    this.setState({
      gettingArticles: true
    });

    // default to mapcenter
    if (!pos.latitude) {
      pos = this.state.mapCenter;
    }
    const articlesUrl = 'https://' + this.state.language + '.wikipedia.org/w/api.php' + '?format=json&formatversion=2&action=query&prop=coordinates|pageimages|extracts|info&inprop=url&colimit=20&piprop=thumbnail&pithumbsize=144&pilimit=20&exchars=250&exlimit=20&exintro=&generator=geosearch&ggscoord=' + pos.latitude + '|' + pos.longitude + '&ggsradius=10000&ggslimit=20&callback=JSON_CALLBACK';
    reqwest({
      url: articlesUrl,
      type: 'jsonp',
      timeout: 12000,
      success: (resp) => {
        const articles = resp.query.pages.sort(function(a, b) {
          // sort articles by title
          const titleA = a.title.toLowerCase(),
                titleB = b.title.toLowerCase();
          if (titleA < titleB) {
            return -1;
          } else if (titleA > titleB) {
            return 1;
          } else {
            return 0;
          }
        });
        this.setState({
          articles: articles,
          modal: null
        });
      },
      error: (err) => {
        this.setState({
          modal: 'error-articles'
        });
      },
      complete: () => {
        this.setState({
          gettingArticles: false
        });
      }
    })
  }

  updateMapCenter = (latitude, longitude) => {
    this.setState({
      mapCenter: {
        latitude: latitude,
        longitude: longitude
      }
    });
  }

  setOpenArticle = (id) => {
    this.setState({
      openArticle: id,
      mapVisible: true
    });
  }

  componentDidMount() {
    this.getUserLocation();
  }

  render() {
    return(
      <div id="container">
        <Menu
          toggleVisible={this.toggleVisible}
          mapVisible={this.state.mapVisible}
          setModal={this.setModal}
          language={this.state.language}
          getArticles={this.getArticles}
          gettingArticles={this.state.gettingArticles}
        />
        <div
          id="main"
          className={this.state.mapVisible ? 'map-visible' : 'list-visible'}
        >
          {
            this.state.userLocation
            ?
              <Vmap
                userLocation={this.state.userLocation}
                getUserLocation={this.getUserLocation}
                gettingUserLocation={this.state.gettingUserLocation}
                articles={this.state.articles}
                updateMapCenter={this.updateMapCenter}
                mapCenter={this.state.mapCenter}
                setOpenArticle={this.setOpenArticle}
                openArticle={this.state.openArticle}
                language={this.state.language}
              />
            : null
          }
          <List
            articles={this.state.articles}
            setOpenArticle={this.setOpenArticle}
            openArticle={this.state.openArticle}
          />
        </div>
        <Modal
          modal={this.state.modal}
          closeModal={this.closeModal}
        >
          <Settings
            language={this.state.language}
            setLanguage={this.setLanguage}
            modal={this.state.modal}
          />
          <About
            language={this.state.language}
            modal={this.state.modal}
          />
          <ErrorMsg
            language={this.state.language}
            modal={this.state.modal}
            getUserLocation={this.getUserLocation}
            getArticles={this.getArticles}
          />
        </Modal>
      </div>
    )
  }
}

export default Vger;
