var vger =  angular.module('vger', []);

vger.run(['$rootScope', function ($rootScope) {
	// set visibility state for elements
	$rootScope.loading = true;
	$rootScope.messageVisible = false;
	$rootScope.mapVisible = true;
	$rootScope.spreadMenu = false;
	
	// set map on screen
	$rootScope.screenMap = L.map('map', {zoomControl: false}).locate({setView: true, maxZoom: 17});
	L.control.zoom({position: 'bottomleft'}).addTo($rootScope.screenMap);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo($rootScope.screenMap);	
}]);

vger.controller('ListCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
	
	var markIcon = L.icon({
		iconUrl: 'mark.png',
		shadowUrl: 'shadow.png',
		iconSize:     [32, 48], // size of the icon
		shadowSize:   [40, 48], // size of the shadow
		iconAnchor:   [16, 48], // point of the icon which will correspond to marker's location
		shadowAnchor: [1, 48],  // the same for the shadow
		popupAnchor:  [0, -52] // point from which the popup should open relative to the iconAnchor
	});
		
	// get wikipedia entries for given position
	var getWikipediaEntries = function(lat, lng) {
			$scope.loading = true;
			angular.forEach($scope.entries, function(value, index) {
				value.marker.closePopup().unbindPopup().setOpacity(0);
			});
			$scope.entries = [];
			//get list of closer entries
			$http.jsonp('http://en.wikipedia.org/w/api.php?format=json&action=query&list=geosearch&gsradius=10000&gscoord=' + lat + '|' + lng + '&gslimit=20&callback=JSON_CALLBACK').success(function(data) {
				$scope.entries = data.query.geosearch;
				var ids = "";
				angular.forEach($scope.entries, function(value, index) {
					ids += value.pageid + "|";
					value.popUp = L.popup().setContent('<h4>' + value.title + '</h4>');
					value.marker = L.marker([value.lat, value.lon], {icon: markIcon});
					value.marker.addTo($rootScope.screenMap).bindPopup(value.popUp);
				});
				ids = ids.slice(0, - 1);
				// get thumbnails
				$http.jsonp('http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=60&pilimit=20&pageids=' + ids + '&callback=JSON_CALLBACK').success(function(data) {
					angular.forEach($scope.entries, function(value, index) {
						value.thumbnail = data.query.pages[value.pageid].thumbnail;
					});
					//get excerpts
					$http.jsonp('http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exchars=250&exlimit=20&exintro=&pageids=' + ids + '&callback=JSON_CALLBACK').success(function(data) {
						angular.forEach($scope.entries, function(value, index) {
							value.popUp.setContent('<h4>' + value.title + '</h4>' +
												   data.query.pages[value.pageid].extract + '<br/>' +
												   '<a href="http://en.m.wikipedia.org/w/index.php?title=' + value.title + '" class="button-link">Read more</a>');
						});
						$scope.loading = false;
					});
				});
			});
	};
	
	// load wikipedia entries for current location
	$scope.reload = function() {
		$rootScope.localization = $rootScope.screenMap.getCenter();
		getWikipediaEntries($rootScope.localization.lat, $rootScope.localization.lng);
	};
	
	// set map to current location
	$scope.currentLocation = function() {
		$rootScope.screenMap.locate({setView: true, zoom: 14, maxZoom: 17});
	};

	// open pop-up of a selected entry
	$scope.openPopUp = function(index) {
		$scope.entries[index].marker.openPopup();
		showMap();
	};

	// locations to visit if current location not available
	var visitLocations = [
		{ name: 'La Habana', position: [23.13986, -82.38445] },
		{ name: 'Pompeii', position: [40.7512, 14.4869] },
		{ name: 'Tiananmen Square', position: [39.9021, 116.3917] },
	];
	
	// set the map to any of the visitLocations
	$scope.visitLocation = function() {
		var location = visitLocations[Math.floor(Math.random() * visitLocations.length)];
		$scope.message = "Sorry, Vger couldn't find the current location... You've been redirected to "
							+ location.name + ".";
		$rootScope.screenMap.setView(location.position, 14);
		$rootScope.localization = $rootScope.screenMap.getCenter();
		getWikipediaEntries($rootScope.localization.lat, $rootScope.localization.lng);
		$scope.messageVisible = true;
	}
	$rootScope.screenMap.on('locationerror', function() {
		$scope.visitLocation();
	});

	// set the current location on the map
	var personIcon = L.icon({
		iconUrl: 'person.png',
		shadowUrl: 'shadow.png',
		iconSize:     [32, 48], // size of the icon
		shadowSize:   [40, 48], // size of the shadow
		iconAnchor:   [16, 48], // point of the icon which will correspond to marker's location
		shadowAnchor: [1, 48],  // the same for the shadow
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
		$rootScope.screenMap.setZoom(14);
		getWikipediaEntries($rootScope.localization.lat, $rootScope.localization.lng);
	});
	
	$scope.showMap = function() {
		window.scrollTo(0,0);
		$scope.mapVisible = true;
	}
	
	$scope.showList = function() {
		window.scrollTo(0,0);
		$scope.mapVisible = false;
	}
	
	$scope.logo = function() {
		$scope.message = "<p>Vger is being designed and developed as a weekend project by Fran López.</p><p><a href='mailto:fran@fran-lopez.com' class='loading'><h4>fran@fran-lopez.com</h4></a></p>";
		$scope.messageVisible = true;
	}

}]);
