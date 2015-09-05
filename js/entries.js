vger.controller('EntriesCtrl', ['$rootScope', '$scope', '$http', '$translate', function ($rootScope, $scope, $http, $translate) {

    var markIcon = L.icon({
        iconUrl: 'icon.svg',
        iconSize:     [32, 48], // size of the icon
        shadowSize:   [40, 48], // size of the shadow
        iconAnchor:   [16, 48], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -52] // point from which the popup should open relative to the iconAnchor
    });
    
    $scope.currentLocationMarkers = new Array();

	// get wikipedia entries for given position
	var getWikipediaEntries = function(lat, lng) {
        // store bound limits to zoom the map and show all entries
        var southWestBound = [0, 0],
            northEastBound = [0, 0];
        
        $rootScope.loading = true;
        angular.forEach($scope.entries, function(value, index) {
            value.marker.closePopup().unbindPopup().setOpacity(0);
        });
        $scope.entries = [];
        //get list of closer entries
        $http.jsonp($rootScope.apiUrl() + '?format=json&action=query&list=geosearch&gsradius=10000&gscoord=' + lat + '|' + lng + '&gslimit=20&callback=JSON_CALLBACK').success(function(data) {
            $scope.entries = data.query.geosearch;
            var ids = "";
            angular.forEach($scope.entries, function(value, index) {
                ids += value.pageid + "|";
                value.popUp = L.popup().setContent('<h4>' + value.title + '</h4>');
                value.marker = L.marker([value.lat, value.lon], {icon: markIcon});
                value.marker.addTo($rootScope.screenMap).bindPopup(value.popUp);
                // update bound limits
                if (index == 0) {
                    southWestBound[0] = value.lat;
                    southWestBound[1] = value.lon;
                    northEastBound[0] = value.lat;
                    northEastBound[1] = value.lon;
                } else {
                    southWestBound[0] = value.lat < southWestBound[0] ? value.lat : southWestBound[0];
                    southWestBound[1] = value.lon < southWestBound[1] ? value.lon : southWestBound[1];
                    northEastBound[0] = value.lat > northEastBound[0] ? value.lat : northEastBound[0];
                    northEastBound[1] = value.lon > northEastBound[1] ? value.lon : northEastBound[1];
                }
            });
            ids = ids.slice(0, - 1);
            // get thumbnails
            $http.jsonp($rootScope.apiUrl() + '?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=60&pilimit=20&pageids=' + ids + '&callback=JSON_CALLBACK').success(function(data) {
                angular.forEach($scope.entries, function(value, index) {
                    value.thumbnail = data.query.pages[value.pageid].thumbnail;
                });
                //get excerpts
                $http.jsonp($rootScope.apiUrl() + '?action=query&prop=extracts&format=json&exchars=250&exlimit=20&exintro=&pageids=' + ids + '&callback=JSON_CALLBACK').success(function(data) {
                    angular.forEach($scope.entries, function(entry, index) {
                        var content = '<h4>' + entry.title + '</h4>'
                                      + data.query.pages[entry.pageid].extract + '<br/>'
                                      + '<a href="http://' + $rootScope.lang + '.m.wikipedia.org/w/index.php?title=' + entry.title + '" class="button-link" target="_blank">' + translations[$rootScope.lang]['Read more'] + '</a>';
                        if (entry.thumbnail) {
                            content = '<img src="' + entry.thumbnail.source + '" />' + content;
                        }
                        entry.popUp.setContent(content);
                    });
                    $rootScope.loading = false;
                });
            });
            // set inital zoom to show all entries
            $rootScope.screenMap.fitBounds([southWestBound, northEastBound], {padding: [16, 24]});
        });
    };
	
    // load wikipedia entries for current location
    $scope.reload = function() {
        $rootScope.localization = $rootScope.screenMap.getCenter();
        getWikipediaEntries($rootScope.localization.lat, $rootScope.localization.lng);
    };

    // set map to current location
    $scope.currentLocation = function() {
        $rootScope.screenMap.locate({setView: true, zoom: 14, maxZoom: 15});
        $scope.clearMessage();
    };

    // open pop-up of a selected entry
    $scope.openPopUp = function(index) {
        $scope.entries[index].marker.openPopup();
        $scope.showMap();
    };

    // locations to visit if current location not available
    var visitLocations = [
        { name: 'La Habana', position: [23.13986, -82.38445] },
        { name: 'Pompeii', position: [40.7512, 14.4869] },
        { name: 'Tiananmen Square', position: [39.9021, 116.3917] },
    ];

    // set the map to any of the visitLocations
    $scope.visitLocation = function() {
        $scope.location = visitLocations[Math.floor(Math.random() * visitLocations.length)];
        $rootScope.screenMap.setView($scope.location.position, 14);
        $rootScope.localization = $rootScope.screenMap.getCenter();
        getWikipediaEntries($rootScope.localization.lat, $rootScope.localization.lng);
        $scope.clearMessage();
    }
    $rootScope.screenMap.on('locationerror', function() {
        $scope.visitLocation();
    });

    // set the current location on the map
    var personIcon = L.icon({
        iconUrl: 'person.svg',
        iconSize:     [32, 48], // size of the icon
        iconAnchor:   [16, 48], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -52] // point from which the popup should open relative to the iconAnchor
    });
    $rootScope.screenMap.on('locationfound', function() {
        $rootScope.localization = $rootScope.screenMap.getCenter();
        // make the previous markers invisible
        if ($scope.currentLocationMarkers.length > 0) {
            $scope.currentLocationMarkers[$scope.currentLocationMarkers.length - 1].setOpacity(0);
        }
        var currentLocationMark = L.marker([$rootScope.localization.lat, $rootScope.localization.lng], {icon: personIcon});
        currentLocationMark.addTo($rootScope.screenMap);
        $scope.currentLocationMarkers.push(currentLocationMark);
        getWikipediaEntries($rootScope.localization.lat, $rootScope.localization.lng);
    });

    $scope.showMap = function() {
        window.scrollTo(0,0);
        $rootScope.mapVisible = true;
    }

    $scope.showList = function() {
        window.scrollTo(0,0);
        $rootScope.mapVisible = false;
    }

    $scope.logo = function() {
        $scope.messages.about = true;
        $rootScope.messageVisible = true;
    }
    
    // languages object for ui language selector
    $scope.languages = [];
    angular.forEach(translations, function(lang, key) {
        $scope.languages.push({
            code: key,
            name: lang.LanguageName
        });
    });
    
    // show ui language selector
    $scope.selectLanguage = function() {
        $scope.messages.language = true;
        $rootScope.messageVisible = true;
    };
    
    // save user selected language
    $scope.saveLanguage = function() {
        if (window.localStorage.getItem("vger-lang") != $rootScope.lang ) {
            $translate.use($rootScope.lang);
            window.localStorage.setItem("vger-lang", $rootScope.lang);
            $scope.reload();
        }
        $scope.clearMessage();
    };

    // user facing messages
    $scope.messages = {
        redirect: false,
        about: false,
        language: false
    };

    $scope.clearMessage = function() {
        $rootScope.messageVisible = false;
        $rootScope.messageWelcome = false;
        angular.forEach($scope.messages, function(message){
            message = false;
        });
    }

}]);