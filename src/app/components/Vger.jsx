import React from 'react';
import Menu from './Menu.jsx';
import Vmap from './Vmap.jsx';
import List from './List.jsx';
import reqwest from 'reqwest';

const defaultLocation = {
    latitude: 51.505,
    longitude: -0.09
}

const wikiBaseUrl = 'http://en.wikipedia.org/w/api.php';

var Vger = React.createClass({
    getInitialState: function() {
        return {
            mapVisible: true, // on small screens, either map or list is showing
            userLocation: defaultLocation,
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
                that.getArticles(position.coords.latitude, position.coords.longitude);
            }, function() {
                error = true;
            });
        } else {
            error = true;
        }
        if (error) {
            this.setState({
                userLocation: defaultLocation
            });
        }
    },
    getArticles: function(latitude, longitude) {
        const articlesUrl = wikiBaseUrl + '?format=json&action=query&list=geosearch&gsradius=10000&gscoord=' + latitude + '|' + longitude + '&gslimit=20&callback=JSON_CALLBACK';
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
    componentDidMount: function() {
        this.getUserLocation();
    },
    render: function(){
        return(
            <div id="container">
                <Menu toggleVisible={this.toggleVisible}
                      mapVisible={this.state.mapVisible} />
                <div id="main"
                     className={this.state.mapVisible ? 'map-visible' : 'list-visible'}>
                    <Vmap userLocation={this.state.userLocation}
                          articles={this.state.articles}/>
                    <List />
                </div>
            </div>
        )
    }
});

export default Vger;
