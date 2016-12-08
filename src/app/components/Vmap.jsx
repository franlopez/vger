import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

const position = [51.505, -0.09];

var Vmap = React.createClass({
    render: function(){
        return(
            <Map id='vmap'
                 center={[this.props.userLocation.latitude, this.props.userLocation.longitude]}
                 zoom={16}>
                <TileLayer
                    url='http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png'
                    attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                />
                <Marker position={position}>
                    <Popup>
                        <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
                    </Popup>
                </Marker>
            </Map>
        )
    }
});

export default Vmap;
