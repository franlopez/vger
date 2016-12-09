import React from 'react';
import Menu from './Menu.jsx';
import Vmap from './Vmap.jsx';
import List from './List.jsx';
import reqwest from 'reqwest';

const wikiBaseUrl = 'http://en.wikipedia.org/w/api.php';

var Vger = React.createClass({
    getInitialState: function() {
        return {
            mapVisible: true, // on small screens, either map or list is showing
            userLocation: null, // this is an object with 'latitude' and 'longitude'
            mapCenter: null, // this is an object with 'latitude' and 'longitude'
            articles: []
        }
    },
    toggleVisible: function() {
        var newMapVisible = !this.state.mapVisible;
        this.setState({
            mapVisible: newMapVisible
        });
    },
    getUserLocation: function() {
        var error = false;
        if (navigator.geolocation) {
            var that = this;
            navigator.geolocation.getCurrentPosition(function(position) {
                that.setState({
                    userLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                });
                that.getArticles({latitude: position.coords.latitude, longitude: position.coords.longitude});
            }, function() {
                error = true;
            });
        } else {
            error = true;
        }
        if (error) {
            this.setState({
                userLocation: null
            });
        }
    },
    getArticles: function(pos) {
        // default to mapcenter
        if (!pos.latitude) {
            pos = this.state.mapCenter;
        }
        const articlesUrl = wikiBaseUrl + '?format=json&action=query&list=geosearch&gsradius=10000&gscoord=' + pos.latitude + '|' + pos.longitude + '&gslimit=20&callback=JSON_CALLBACK';
        const that = this;
        reqwest({
            url: articlesUrl,
            type: 'jsonp',
            success: function (resp) {
                that.setState({
                    articles: resp.query.geosearch
                });
            },
            error: function (err) {
                // couldn't load articles
            }
        })
    },
    updateMapCenter: function(latitude, longitude) {
        this.setState({
            mapCenter: {
                latitude: latitude,
                longitude: longitude
            }
        });
    },
    componentDidMount: function() {
        this.getUserLocation();
    },
    render: function(){
        return(
            <div id="container">
                <Menu toggleVisible={this.toggleVisible}
                      mapVisible={this.state.mapVisible}
                      getArticles={this.getArticles} />
                <div id="main"
                     className={this.state.mapVisible ? 'map-visible' : 'list-visible'}>
                    <Vmap userLocation={this.state.userLocation}
                          articles={this.state.articles}
                          updateMapCenter={this.updateMapCenter} />
                    <List />
                </div>
            </div>
        )
    }
});

export default Vger;
