import React from 'react';
import { Map as LeafletMap, TileLayer, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';

import targetIcon from '../target.svg';

import { Position } from '../../types';
import './style.css';

interface MapProps {
  userLocation: Position,
}

const userIcon = new Icon({
  iconUrl: targetIcon,
  iconSize: [28, 28]
});

function Map({ userLocation }: MapProps) {

  return (
    <LeafletMap className="map" center={userLocation} zoom={13}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        className="userMarker"
        position={userLocation}
        icon={userIcon}
      />
    </LeafletMap>
  );
}

export default Map;
