var vger =  angular.module('vger', []);

var screenMap;

vger.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {controller: 'ListCtrl', reloadOnSearch: false }).
		otherwise({redirectTo: '/'});
}]);

vger.run(['Map', function(Map) {
	Map.setScreenMap();
		
	document.getElementById("buttonMap").onclick = function() {
		showMap();
	}
	document.getElementById("buttonList").onclick = function() {
		showList();
	}
	document.getElementById("buttonMenu").onclick = function() {
		toggleMenu();
	}
	document.getElementById("message-ok").onclick = function() {
		var messageBox = document.getElementById('message');
		removeClass(messageBox, 'active');
		addClass(messageBox, 'inactive');
	}
	

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
	
	$scope.currentLocationMarkers = new Array();
	
	var getWikipediaEntries = function(lat, lng) {
			angular.forEach($scope.entries, function(value, index) {
				value.marker.closePopup().unbindPopup().setOpacity(0);
			});
			$scope.entries = [];
			var logo = document.getElementById('logo');
			addClass(logo, 'loading');
			//get list of closer entries
			$http.jsonp('http://en.wikipedia.org/w/api.php?format=json&action=query&list=geosearch&gsradius=10000&gscoord=' + lat + '|' + lng + '&gslimit=20&callback=JSON_CALLBACK').success(function(data) {
				$scope.entries = data.query.geosearch;
				var ids = "";
				angular.forEach($scope.entries, function(value, index) {
					ids += value.pageid + "|";
					value.popUp = L.popup().setContent('<h4>' + value.title + '</h4>');
					value.marker = L.marker([value.lat, value.lon], {icon: markIcon});
					value.marker.addTo(screenMap).bindPopup(value.popUp);
				});
				ids = ids.slice(0, - 1);
				// get thumbnails
				$http.jsonp('http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=60&pilimit=20&pageids=' + ids + '&callback=JSON_CALLBACK').success(function(data) {
					angular.forEach($scope.entries, function(value, index) {
						value.thumbnail = data.query.pages[value.pageid].thumbnail;
					});
					//get excerpts
					$http.jsonp('http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exchars=250&exlimit=20&exintro=&pageids=' + ids + '&callback=JSON_CALLBACK').success(function(data) {
						var logo = document.getElementById('logo');
						removeClass(logo, 'loading');
						angular.forEach($scope.entries, function(value, index) {
							value.popUp.setContent('<h4>' + value.title + '</h4>' +
												   data.query.pages[value.pageid].extract + '<br/>' +
												   '<a href="http://en.m.wikipedia.org/w/index.php?title=' + value.title + '" class="button-link">Read more</a>');
						});
					});
				});
			});
	};
	
	$scope.reload = function() {
		$rootScope.localization = screenMap.getCenter();
		getWikipediaEntries($rootScope.localization.lat, $rootScope.localization.lng);
	};
	
	$scope.currentLocation = function() {
		screenMap.locate({setView: true, zoom: 14, maxZoom: 17});
		// $rootScope.localization = screenMap.getCenter();
		// getWikipediaEntries($rootScope.localization.lat, $rootScope.localization.lng);
	};

	$scope.openPopUp = function(index) {
		$scope.entries[index].marker.openPopup();
		showMap();
	};

	var visitLocations = [
		{ name: 'La Habana', position: [23.13986, -82.38445] },
		{ name: 'Pompeii', position: [40.7512, 14.4869] },
		{ name: 'Tiananmen Square', position: [39.9021, 116.3917] },
	];
	
	$scope.visitLocation = function() {
		var location = visitLocations[Math.floor(Math.random() * visitLocations.length)];
		$scope.message = "Sorry, Vger couldn't find the current location... You've been redirected to "
							+ location.name + ".";
		screenMap.setView(location.position, 14);
		$rootScope.localization = screenMap.getCenter();
		getWikipediaEntries($rootScope.localization.lat, $rootScope.localization.lng);
		var messageBox = document.getElementById('message');
		removeClass(messageBox, 'inactive');
		addClass(messageBox, 'active');
		var developedBy = document.getElementById('developed-by');
		removeClass(developedBy, 'active');
		addClass(developedBy, 'inactive');
		var locationNotLoaded = document.getElementById('location-not-loaded');
		removeClass(locationNotLoaded, 'inactive');
		addClass(locationNotLoaded, 'active');
	}
	
	screenMap.on('locationerror', function() {
		$scope.visitLocation();
	});

	var personIcon = L.icon({
		iconUrl: 'person.png',
		shadowUrl: 'shadow.png',
		iconSize:     [32, 48], // size of the icon
		shadowSize:   [40, 48], // size of the shadow
		iconAnchor:   [16, 48], // point of the icon which will correspond to marker's location
		shadowAnchor: [1, 48],  // the same for the shadow
		popupAnchor:  [0, -52] // point from which the popup should open relative to the iconAnchor
	});
	
	screenMap.on('locationfound', function() {
		$rootScope.localization = screenMap.getCenter();
		if ($scope.currentLocationMarkers.length > 0) {
			$scope.currentLocationMarkers[$scope.currentLocationMarkers.length - 1].setOpacity(0);
		}
		var currentLocationMark = L.marker([$rootScope.localization.lat, $rootScope.localization.lng], {icon: personIcon});
		currentLocationMark.addTo(screenMap);
		$scope.currentLocationMarkers.push(currentLocationMark);
		screenMap.setZoom(14);
		getWikipediaEntries($rootScope.localization.lat, $rootScope.localization.lng);
	});

	document.getElementById("logo").onclick = function() {
		var messageBox = document.getElementById('message');
		removeClass(messageBox, 'inactive');
		addClass(messageBox, 'active');
		var developedBy = document.getElementById('developed-by');
		removeClass(developedBy, 'inactive');
		addClass(developedBy, 'active');
		var locationNotLoaded = document.getElementById('location-not-loaded');
		removeClass(locationNotLoaded, 'active');
		addClass(locationNotLoaded, 'inactive');
	}

}]);


vger.factory('Map', ['$rootScope', function($rootScope) {
	return {
		setScreenMap: function() {
			screenMap = L.map('map', {zoomControl: false}).locate({setView: true, maxZoom: 17});
			L.control.zoom({position: 'bottomleft'}).addTo(screenMap);

			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(screenMap);
		}
	}
}]);


var hasClass = function (elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

function addClass(ele,cls) {
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
      var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      ele.className=ele.className.replace(reg,' ');
  }
}

function showMap() {
	window.scrollTo(0,0);
	var map = document.getElementById('map');
	removeClass(map, 'inactive');
	addClass(map, 'active');
	var list = document.getElementById('list');
	removeClass(list, 'active');
	addClass(list, 'inactive');
	var buttonMap = document.getElementById('buttonMap');
	removeClass(buttonMap, 'active');
	addClass(buttonMap, 'inactive');
	var buttonList = document.getElementById('buttonList');
	removeClass(buttonList, 'inactive');
	addClass(buttonList, 'active');
}

function showList() {
	window.scrollTo(0,0);
	var list = document.getElementById('list');
	removeClass(list, 'inactive');
	addClass(list, 'active');
	var map = document.getElementById('map');
	removeClass(map, 'active');
	addClass(map, 'inactive');
	var buttonList = document.getElementById('buttonList');
	removeClass(buttonList, 'active');
	addClass(buttonList, 'inactive');
	var buttonMap = document.getElementById('buttonMap');
	removeClass(buttonMap, 'inactive');
	addClass(buttonMap, 'active');
}

function toggleMenu() {
	var menu = document.getElementById('menu');
	if (hasClass(menu, 'spread')) {
		removeClass(menu, 'spread');
	} else {
		addClass(menu, 'spread');
	}
}
