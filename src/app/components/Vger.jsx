import React from 'react';
import Menu from './Menu.jsx';
import Vmap from './Vmap.jsx';
import List from './List.jsx';
import Settings from './Settings.jsx';
import reqwest from 'reqwest';

const wikiBaseUrl = 'http://en.wikipedia.org/w/api.php';

var Vger = React.createClass({
    getInitialState: function() {
        return {
            mapVisible: true, // on small screens, either map or list is showing
            userLocation: null, // this is an object with 'latitude' and 'longitude'
            mapCenter: null, // this is an object with 'latitude' and 'longitude'
            articles: {},
            openArticle: null, // set the currently opened article
            displaySettings: false,
            language: 'en'
        }
    },
    toggleVisible: function() {
        var newMapVisible = !this.state.mapVisible;
        this.setState({
            mapVisible: newMapVisible
        });
    },
    toggleSettings: function() {
        var newDisplaySettings = !this.state.displaySettings;
        this.setState({
            displaySettings: newDisplaySettings
        });
    },
    setLanguage: function(newLanguage) {
        // newLanguage should be alanguage code
        this.setState({
            language: newLanguage
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
                    },
                    mapCenter: {
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
        const articlesUrl = wikiBaseUrl + '?format=json&formatversion=2&action=query&prop=coordinates|pageimages|extracts|info&inprop=url&colimit=20&piprop=thumbnail&pithumbsize=144&pilimit=20&exchars=250&exlimit=20&exintro=&generator=geosearch&ggscoord=' + pos.latitude + '|' + pos.longitude + '&ggsradius=10000&ggslimit=20&callback=JSON_CALLBACK';
        const that = this;
        reqwest({
            url: articlesUrl,
            type: 'jsonp',
            success: function (resp) {
                that.setState({
                    articles: resp.query.pages
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
    setOpenArticle: function(id) {
        this.setState({
            openArticle: id
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
                      toggleSettings={this.toggleSettings}
                      getArticles={this.getArticles} />
                <div id="main"
                     className={this.state.mapVisible ? 'map-visible' : 'list-visible'}>
                    <Vmap userLocation={this.state.userLocation}
                          getUserLocation={this.getUserLocation}
                          articles={this.state.articles}
                          updateMapCenter={this.updateMapCenter}
                          mapCenter={this.state.mapCenter}
                          setOpenArticle={this.setOpenArticle}
                          openArticle={this.state.openArticle} />
                    <List articles={this.state.articles}
                          setOpenArticle={this.setOpenArticle}
                          openArticle={this.state.openArticle} />
                    <Settings display={this.state.displaySettings}
                              toggleSettings={this.toggleSettings}
                              language={this.state.language}
                              setLanguage={this.setLanguage} />
                </div>
            </div>
        )
    }
});

export default Vger;
