import React from 'react';
import Article from './Article.jsx';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

const markIcon = L.icon({
    iconUrl: 'img/mark.svg',
    iconSize: [24, 35], // size of the icon
    iconAnchor: [12, 35], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -39] // point from which the popup should open relative to the iconAnchor
});

const userIcon = L.icon({
    iconUrl: 'img/user.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

var Vmap = React.createClass({
    handleMoveend: function(event) {
        if (event.target.dragging._positions.length) {
            var currentCenter = this.refs.vmap.leafletElement.getCenter();
            this.props.updateMapCenter(currentCenter.lat, currentCenter.lng);
        }
    },
    render: function(){
        var renderedMap = <div id='vmap'></div>;
        if (this.props.userLocation) {
            // area that the map should contain, these are just starter values
            var southWestBound = [this.props.userLocation.latitude - 0.01, this.props.userLocation.longitude - 0.01],
                northEastBound = [this.props.userLocation.latitude + 0.01, this.props.userLocation.longitude + 0.01];
            var markers = [];
            for (var index in this.props.articles) {
                if (this.props.articles.hasOwnProperty(index)) {
                    var article = this.props.articles[index];
                    if (index == 0) {
                        southWestBound = [article.coordinates[0].lat, article.coordinates[0].lon];
                        northEastBound = [article.coordinates[0].lat, article.coordinates[0].lon];
                    } else {
                        southWestBound[0] = article.coordinates[0].lat < southWestBound[0] ? article.coordinates[0].lat : southWestBound[0];
                        southWestBound[1] = article.coordinates[0].lon < southWestBound[1] ? article.coordinates[0].lon : southWestBound[1];
                        northEastBound[0] = article.coordinates[0].lat > northEastBound[0] ? article.coordinates[0].lat : northEastBound[0];
                        northEastBound[1] = article.coordinates[0].lon > northEastBound[1] ? article.coordinates[0].lon : northEastBound[1];
                    }
                    markers.push((
                        <Marker key={index}
                                position={[article.coordinates[0].lat, article.coordinates[0].lon]}
                                icon={markIcon} >
                            <Popup>
                                <Article article={article} excerpt={true} />
                            </Popup>
                        </Marker>
                    ));
                }
            }
            markers.push(
                <Marker position={[this.props.userLocation.latitude, this.props.userLocation.longitude]}
                        icon={userIcon} >
                </Marker>);

            renderedMap = (
                <Map id='vmap'
                     ref='vmap'
                     center={[this.props.mapCenter.latitude, this.props.mapCenter.longitude]}
                     bounds={[southWestBound, northEastBound]}
                     onMoveend={this.handleMoveend}>
                    <TileLayer
                        url='http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png'
                        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.' />
                    {markers}
                </Map>
            );
        }

        return (
            <div>
                {renderedMap}
                <img id="getUserLocation"
                     src='img/target.svg'
                     onClick={this.props.getUserLocation} />
            </div>
        );
    }
});

export default Vmap;
