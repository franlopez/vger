var vger =  angular.module('vger', ['pascalprecht.translate']);

vger.config(['$translateProvider', function($translateProvider) {
    // load translations and set english as default
    for(var lang in translations){
		$translateProvider.translations(lang, translations[lang]);
	}
    $translateProvider.preferredLanguage('en');
}]);

vger.run(['$rootScope', '$translate', function ($rootScope, $translate) {
    // set visibility state for elements
    $rootScope.loading = true;
    $rootScope.messageVisible = false;
    $rootScope.messageWelcome = false;
    $rootScope.mapVisible = true;
    $rootScope.spreadMenu = false;
    
    // get previously loaded language
    $rootScope.lang = window.localStorage.getItem("vger-lang");

    // set map on screen
    $rootScope.screenMap = L.map('map', {zoomControl: false});
    L.control.zoom({position: 'bottomleft'}).addTo($rootScope.screenMap);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo($rootScope.screenMap);

    // check if running as phonegap app
    $rootScope.phonegapApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    if ($rootScope.phonegapApp) {
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            document.addEventListener("menubutton", onMenuKeyDown, false);
            
            // locate map only if online
            if (navigator.connection.type == Connection.NONE) {
                $rootScope.messageOffline = true;
                $rootScope.messageVisible = true;
            } else {
                $rootScope.screenMap.locate({setView: true, maxZoom: 15});
            }
            
            setLang();
        }
        
        function onMenuKeyDown() {
            $rootScope.$apply(function(){
                !$rootScope.spreadMenu && window.scrollTo(0,0);
                $rootScope.spreadMenu = !$rootScope.spreadMenu;
            });
        }
    } else {
        $rootScope.messageVisible = true;
        $rootScope.messageWelcome = true;
        setLang();
    }
    
    // detect language if not saved, check and save
    function setLang(){
        if (!$rootScope.lang) {
            if ($rootScope.phonegapApp) {
                navigator.globalization.getPreferredLanguage(
                    function (language) {
                        $rootScope.lang = language.value.substring(0, 2);
                    }
                );
            } else {
                $rootScope.lang = navigator.language || navigator.userLanguage;
                $rootScope.lang = $rootScope.lang.substring(0, 2);
            }
            checkLang();
        } else {
            $translate.use($rootScope.lang);
        }
    }
    
    // check, default and save the current language
    function checkLang() {
        var passed = { lang: false };
        angular.forEach(translations, function(values, key) {
            this.lang = $rootScope.lang === key ? true : false;
        }, passed);

        $rootScope.lang = passed.lang ? $rootScope.lang : 'en';
        $translate.use($rootScope.lang);
        window.localStorage.setItem("vger-lang", $rootScope.lang);
    }
    
    // get api url with current language, default to english
    $rootScope.apiUrl = function() {
        var langCode = $rootScope.lang ? $rootScope.lang : 'en';
        return 'http://' + $rootScope.lang + '.wikipedia.org/w/api.php';
    };
}]);