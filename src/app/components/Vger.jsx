import React from 'react';
import Menu from './Menu.jsx';
import Vmap from './Vmap.jsx';
import List from './List.jsx';

const defaultLocation = {
    latitude: 51.505,
    longitude: -0.09
}

var Vger = React.createClass({
    getInitialState: function() {
        return {
            mapVisible: true, // on small screens, either map or list is showing
            userLocation: defaultLocation
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
                    <Vmap userLocation={this.state.userLocation} />
                    <List />
                </div>
            </div>
        )
    }
});

export default Vger;
