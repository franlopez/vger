import React from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';

import { Position } from '../../types';
import './style.css';

interface MapProps {
  mapCenter: Position,
}

function Map({ mapCenter }: MapProps) {
  return (
    <LeafletMap className="map" center={[mapCenter.lat, mapCenter.lng]} zoom={13}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </LeafletMap>
  );
}

export default Map;
