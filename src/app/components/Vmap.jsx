import React from 'react';
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

var Vmap = React.createClass({
    propTypes: {
        updateMapCenter: React.PropTypes.func.isRequired,
        getUserLocation: React.PropTypes.func.isRequired,
        gettingUserLocation: React.PropTypes.bool.isRequired,
        articles: React.PropTypes.array.isRequired,
        openArticle: React.PropTypes.number,
        setOpenArticle: React.PropTypes.func.isRequired,
        userLocation: React.PropTypes.object, // can be null
        language: React.PropTypes.string
    },

    componentDidUpdate: function(prevProps) {
        if (prevProps.openArticle !== this.props.openArticle) {
            this.refs[this.props.openArticle].leafletElement.openPopup();
        }
    },

    // this is being called onMouseup, but it should be called onMoveend
    // investigate why onMoveend is fired constantly on mobile
    handleMoveend: function(event) {
        console.log("handleMoveend");
        if (event.target.dragging._positions.length) {
            var currentCenter = this.refs.vmap.leafletElement.getCenter();
            console.log("currentCenter", currentCenter);
            this.props.updateMapCenter(currentCenter.lat, currentCenter.lng);
        }
    },

    openArticle: function(pageId, event) {
        this.props.setOpenArticle(pageId);
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
                        <Marker key={article.pageid}
                                ref={article.pageid}
                                position={[article.coordinates[0].lat, article.coordinates[0].lon]}
                                icon={markIcon}
                                onClick={this.openArticle.bind(null, article.pageid)} >
                            <Popup>
                                <Article article={article}
                                         excerpt={true}
                                         language={this.props.language} />
                            </Popup>
                        </Marker>
                    ));
                }
            }
            markers.push(
                <Marker key='userposition'
                        position={[this.props.userLocation.latitude, this.props.userLocation.longitude]}
                        icon={userIcon} >
                </Marker>
            );


            renderedMap = (
                <Map id='vmap'
                     ref='vmap'
                     center={[this.props.mapCenter.latitude, this.props.mapCenter.longitude]}
                     bounds={[southWestBound, northEastBound]}
                     onDragend={this.handleMoveend}>
                    <TileLayer
                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        attribution='Map &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors. App by <a href="http://franlopez.info">Fran López</a>.'
                        detectRetina={true} />
                    {markers}
                </Map>
            );
        }

        return (
            <div>
                {renderedMap}
                <div id="getUserLocation"
                     onClick={this.props.getUserLocation}
                     className={this.props.gettingUserLocation ? 'loading' : null} >
                    <img src='img/target.svg' />
                </div>
            </div>
        );
    }
});

export default Vmap;
