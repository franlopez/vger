import React from 'react';
import Menu from './Menu.jsx';
import Vmap from './Vmap.jsx';
import List from './List.jsx';
import Modal from './Modal.jsx';
import Settings from './Settings.jsx';
import About from './About.jsx';
import ErrorMsg from './ErrorMsg.jsx';
import reqwest from 'reqwest';

var Vger = React.createClass({
    getInitialState: function() {
        var language = localStorage.getItem('vgerLanguage') || 'en';
        return {
            mapVisible: true, // on small screens, either map or list is showing
            userLocation: null, // this is an object with 'latitude' and 'longitude'
            gettingUserLocation: false,
            mapCenter: null, // this is an object with 'latitude' and 'longitude'
            articles: [],
            gettingArticles: false,
            openArticle: null, // set the currently opened article
            modal: null, // string, which modal to show, null to hide
            language: language
        }
    },
    toggleVisible: function() {
        var newMapVisible = !this.state.mapVisible;
        this.setState({
            mapVisible: newMapVisible
        });
    },
    closeModal: function() {
        this.setState({
            modal: null
        });
    },
    setModal: function(modal) {
        this.setState({
            modal: modal
        });
    },
    setLanguage: function(newLanguage) {
        // newLanguage should be alanguage code
        localStorage.setItem('vgerLanguage', newLanguage);
        this.setState({
            language: newLanguage
        });
    },
    getUserLocation: function() {
        const errorState = {
            userLocation: null,
            modal: 'error-location',
            gettingUserLocation: false
        };
        if (navigator.geolocation) {
            var that = this;
            that.setState({
                gettingUserLocation: true
            });
            navigator.geolocation.getCurrentPosition(function(position) {
                that.setState({
                    userLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    mapCenter: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    modal: null,
                    gettingUserLocation: false
                });
                that.getArticles({latitude: position.coords.latitude, longitude: position.coords.longitude});
            }, function() {
                that.setState(errorState);
            },
            {timeout: 5000});
        } else {
            that.setState(errorState);
        }
    },
    getArticles: function(pos) {
        this.setState({
            gettingArticles: true
        });

        // default to mapcenter
        if (!pos.latitude) {
            pos = this.state.mapCenter;
        }
        const articlesUrl = 'https://' + this.state.language + '.wikipedia.org/w/api.php' + '?format=json&formatversion=2&action=query&prop=coordinates|pageimages|extracts|info&inprop=url&colimit=20&piprop=thumbnail&pithumbsize=144&pilimit=20&exchars=250&exlimit=20&exintro=&generator=geosearch&ggscoord=' + pos.latitude + '|' + pos.longitude + '&ggsradius=10000&ggslimit=20&callback=JSON_CALLBACK';
        const that = this;
        reqwest({
            url: articlesUrl,
            type: 'jsonp',
            timeout: 12000,
            success: function (resp) {
                var articles = resp.query.pages.sort(function(a, b) {
                    // sort articles by title
                    var titleA = a.title.toLowerCase(),
                        titleB=b.title.toLowerCase();
                    if (titleA < titleB) {
                        return -1;
                    }
                    if (titleA > titleB) {
                        return 1;
                    }
                    return 0;
                });
                that.setState({
                    articles: articles,
                    modal: null
                });
            },
            error: function (err) {
                that.setState({
                    modal: 'error-articles'
                });
            },
            complete: function() {
                that.setState({
                    gettingArticles: false
                });
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
            openArticle: id,
            mapVisible: true
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
                      setModal={this.setModal}
                      language={this.state.language}
                      getArticles={this.getArticles}
                      gettingArticles={this.state.gettingArticles} />
                <div id="main"
                     className={this.state.mapVisible ? 'map-visible' : 'list-visible'}>
                    <Vmap userLocation={this.state.userLocation}
                          getUserLocation={this.getUserLocation}
                          gettingUserLocation={this.state.gettingUserLocation}
                          articles={this.state.articles}
                          updateMapCenter={this.updateMapCenter}
                          mapCenter={this.state.mapCenter}
                          setOpenArticle={this.setOpenArticle}
                          openArticle={this.state.openArticle}
                          language={this.state.language} />
                    <List articles={this.state.articles}
                          setOpenArticle={this.setOpenArticle}
                          openArticle={this.state.openArticle} />
                </div>
                <Modal modal={this.state.modal}
                       closeModal={this.closeModal}>
                    <Settings language={this.state.language}
                              setLanguage={this.setLanguage}
                              modal={this.state.modal} />
                    <About language={this.state.language}
                           modal={this.state.modal} />
                    <ErrorMsg language={this.state.language}
                              modal={this.state.modal}
                              getUserLocation={this.getUserLocation}
                              getArticles={this.getArticles} />
                </Modal>
            </div>
        )
    }
});

export default Vger;
