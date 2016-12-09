import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

const markIcon = L.icon({
    iconUrl: 'img/mark.svg',
    iconSize: [24, 35], // size of the icon
    iconAnchor: [12, 35], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -39] // point from which the popup should open relative to the iconAnchor
});

var Vmap = React.createClass({
    handleMoveend: function(event) {
        if (event.target.dragging._positions.length) {
            var currentCenter = this.refs.vmap.leafletElement.getCenter();
            this.props.updateMapCenter(currentCenter.lat, currentCenter.lng);
        }
    },
    render: function(){
        if (this.props.userLocation) {
            // area that the map should contain, these are just starter values
            var southWestBound = [this.props.userLocation.latitude - 0.01, this.props.userLocation.longitude - 0.01],
                northEastBound = [this.props.userLocation.latitude + 0.01, this.props.userLocation.longitude + 0.01];
            var markers = this.props.articles.map(function(article, index) {
                if (index == 0) {
                    southWestBound = [article.lat, article.lon];
                    northEastBound = [article.lat, article.lon];
                } else {
                    southWestBound[0] = article.lat < southWestBound[0] ? article.lat : southWestBound[0];
                    southWestBound[1] = article.lon < southWestBound[1] ? article.lon : southWestBound[1];
                    northEastBound[0] = article.lat > northEastBound[0] ? article.lat : northEastBound[0];
                    northEastBound[1] = article.lon > northEastBound[1] ? article.lon : northEastBound[1];
                }
                return (
                    <Marker key={index}
                            position={[article.lat, article.lon]}
                            icon={markIcon} >
                        <Popup>
                            <h4>{article.title}</h4>
                        </Popup>
                    </Marker>
                );
            });
            return(
                <Map id='vmap'
                     ref='vmap'
                     center={[this.props.userLocation.latitude, this.props.userLocation.longitude]}
                     bounds={[southWestBound, northEastBound]}
                     onMoveend={this.handleMoveend}>
                    <TileLayer
                        url='http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png'
                        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.' />
                    {markers}
                </Map>
            );
        } else {
            return(
                <div id='vmap'></div>
            );
        }
    }
});

export default Vmap;
