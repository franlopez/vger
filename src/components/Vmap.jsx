import React from 'react';
import PropTypes from 'prop-types';
import Article from './Article.jsx';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

const markIcon = L.icon({
  iconUrl: 'img/mark.svg',
  iconSize: [24, 35], // size of the icon
  iconAnchor: [12, 35], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -37] // point from which the popup should open relative to the iconAnchor
});

const userIcon = L.divIcon({
  html: '<img src="img/user.svg"/>',
  iconAnchor: [10, 10],
  className: 'user-position'
});

class Vmap extends React.Component {
  constructor(...args) {
    super(...args);

    this.propTypes = {
      updateMapCenter: PropTypes.func.isRequired,
      getUserLocation: PropTypes.func.isRequired,
      gettingUserLocation: PropTypes.bool.isRequired,
      articles: PropTypes.array.isRequired,
      openArticle: PropTypes.number,
      setOpenArticle: PropTypes.func.isRequired,
      userLocation: PropTypes.object, // can be null
      language: PropTypes.string
    };

    this.defaultProps = {
      userLocation: null,
      language: 'en'
    };

    this.articleRefs = {};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openArticle !== this.props.openArticle) {
      this.articleRefs[this.props.openArticle] && this.articleRefs[this.props.openArticle].leafletElement.openPopup();
    }
  }

  handleViewportChanged = ({ center }) => {
    this.props.updateMapCenter(center[0], center[1]);
  }

  renderMap = () => {
    // area that the map should contain, these are just starter values
    var southWestBound = [this.props.userLocation.latitude - 0.01, this.props.userLocation.longitude - 0.01],
        northEastBound = [this.props.userLocation.latitude + 0.01, this.props.userLocation.longitude + 0.01];
    
    var markers = this.props.articles.map((article, index) => {
      if (index == 0) {
        southWestBound = [article.coordinates[0].lat, article.coordinates[0].lon];
        northEastBound = [article.coordinates[0].lat, article.coordinates[0].lon];
      } else {
        southWestBound[0] = article.coordinates[0].lat < southWestBound[0] ? article.coordinates[0].lat : southWestBound[0];
        southWestBound[1] = article.coordinates[0].lon < southWestBound[1] ? article.coordinates[0].lon : southWestBound[1];
        northEastBound[0] = article.coordinates[0].lat > northEastBound[0] ? article.coordinates[0].lat : northEastBound[0];
        northEastBound[1] = article.coordinates[0].lon > northEastBound[1] ? article.coordinates[0].lon : northEastBound[1];
      }

      return (
        <Marker
          key={article.pageid}
          ref={(articleRef) => { this.articleRefs[article.pageid] = articleRef; }}
          position={[article.coordinates[0].lat, article.coordinates[0].lon]}
          icon={markIcon}
          onClick={() => { this.props.setOpenArticle(article.pageid); }}
        >
          <Popup>
            <Article
              article={article}
              excerpt={true}
              language={this.props.language}
            />
          </Popup>
        </Marker>
      );
    });

    markers.push(
      <Marker
        key='userposition'
        position={[this.props.userLocation.latitude, this.props.userLocation.longitude]}
        icon={userIcon}
      />
    );

    return (
      <Map
        id='vmap'
        center={[this.props.mapCenter.latitude, this.props.mapCenter.longitude]}
        bounds={[southWestBound, northEastBound]}
        onViewportChanged={this.handleViewportChanged}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='Map &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors. App by <a href="http://franlopez.info">Fran López</a>.'
          detectRetina={true}
        />
        {markers}
      </Map>
    );
  }

  render() {
    var renderedMap = this.renderMap(); 

    return (
      <div>
        {renderedMap}
        <div
          id="getUserLocation"
          onClick={this.props.getUserLocation}
          className={this.props.gettingUserLocation ? 'loading' : null} >
          <img src='img/target.svg' />
        </div>
      </div>
    );
  }
}

export default Vmap;