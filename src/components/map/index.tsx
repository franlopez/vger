import React, { useMemo } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

import targetIcon from '../target.svg';
import { Position, Article } from '../../types';

import './style.css';

interface MapProps {
  userLocation: Position,
  articles: Article[],
}

const userIcon = new Icon({
  iconUrl: targetIcon,
  iconSize: [28, 28]
});

function Map({ userLocation, articles }: MapProps) {
  const articleMarkers = useMemo(() => articles.map(article => (
      <Marker
        key={article.pageid}
        className="articleMarker"
        position={[article.coordinates[0].lat, article.coordinates[0].lon]}
      >
        <Popup>
          {article.title}
        </Popup>
      </Marker>
    )
  ), [articles]);

  return (
    <LeafletMap className="map" center={userLocation} zoom={13}>
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

      {articleMarkers}
    </LeafletMap>
  );
}

export default Map;
