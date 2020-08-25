import React, { useMemo } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngBoundsLiteral } from 'leaflet';

import targetIcon from '../target.svg';
import mark from './mark.svg';
import { Position, Article } from '../../types';

import './style.css';

interface MapProps {
  userLocation: Position,
  articles: Article[],
}

interface ArticleMarkersAndBounds {
  markers: React.ReactNode[], // renderd article markers for the map
  southWestBound: Position, // farthest southwest visible position to include in the map
  northEastBound: Position, // farthest visible position to include in the map
}

const userIcon = new Icon({
  iconUrl: targetIcon,
  iconSize: [28, 28]
});

const markIcon =  new Icon({
  iconUrl: mark,
  iconSize: [24, 35],
  iconAnchor: [12, 35],
  popupAnchor: [0, -37],
});

const generateArticleMarkers = (articles: Article[]): ArticleMarkersAndBounds => articles.reduce<ArticleMarkersAndBounds>(
  (result, article, index) => {
    if (index === 0) {
      result.southWestBound = { lat: article.coordinates[0].lat, lng: article.coordinates[0].lon };
      result.northEastBound = { lat: article.coordinates[0].lat, lng: article.coordinates[0].lon };
    } else {
      result.southWestBound.lat = article.coordinates[0].lat < result.southWestBound.lat ? article.coordinates[0].lat : result.southWestBound.lat;
      result.southWestBound.lng = article.coordinates[0].lon < result.southWestBound.lng ? article.coordinates[0].lon : result.southWestBound.lng;
      result.northEastBound.lat = article.coordinates[0].lat > result.northEastBound.lat ? article.coordinates[0].lat : result.northEastBound.lat;
      result.northEastBound.lng = article.coordinates[0].lon > result.northEastBound.lng ? article.coordinates[0].lon : result.northEastBound.lng;
    }

    result.markers.push(
      <Marker
        key={article.pageid}
        className="articleMarker"
        position={[article.coordinates[0].lat, article.coordinates[0].lon]}
        icon={markIcon}
      >
        <Popup className="articlePopup">
          {article.title}
        </Popup>
      </Marker>
      );

    return result;

  },
  { markers: [], southWestBound: { lat: 0, lng: 0 }, northEastBound: { lat: 0, lng: 0 } });

function Map({ userLocation, articles }: MapProps) {
  const placedMarkers = useMemo(() => generateArticleMarkers(articles), [articles]);
  const mapBounds:LatLngBoundsLiteral = useMemo(() =>
    [
      [placedMarkers.southWestBound.lat, placedMarkers.southWestBound.lng],
      [placedMarkers.northEastBound.lat, placedMarkers.northEastBound.lng],
    ],
    [placedMarkers.southWestBound, placedMarkers.northEastBound]
  );

  return (
    <LeafletMap className="map" center={userLocation} bounds={mapBounds}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="tiles"
      />

      <Marker
        className="userMarker"
        position={userLocation}
        icon={userIcon}
      />

      {placedMarkers.markers}
    </LeafletMap>
  );
}

export default Map;
