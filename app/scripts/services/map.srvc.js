'use strict';

angular.module('tour2App').factory('MapService', [ 'uiGmapGoogleMapApi', 'tourAppConfig', '$q', '_', function (uiGmapGoogleMapApi, tourAppConfig, $q, _) {

    var data = {};
    data.map = {};
    data.map.markers = [];

    var isDataInitialized = false;

    var observerCallbacks = [];

    function loadMap () {
        var deferred = $q.defer();

        uiGmapGoogleMapApi.then(function() {
            isDataInitialized = true;
        
            data.map.center = {
                latitude: tourAppConfig.defaultMapCenterLatitude,
                longitude: tourAppConfig.defaultMapCenterLongitude
            };
            data.map.zoom = tourAppConfig.defaultMapZoomInList;
            notifyObservers();

            deferred.resolve();
        });

        return deferred.promise;        
    }

    function setMarkersFromPlaces (places) {

        var markers = [];

        if (_.isArray(places)) {
            _.each(places, function (place) {
                var marker = createMarkerFromPlace(place);
                markers.push(marker);
            });     
        } else {
            var marker = createMarkerFromPlace(places);
            markers.push(marker);
        }

        data.map.markers = markers;
        data.map.zoom = tourAppConfig.defaultMapZoomInList;
        notifyObservers();
    }

    function createMarkerFromPlace(place) {
        var marker = {
            id: getMarkerId(place._id),
            coords: {
                latitude: place.latitude,
                longitude: place.longitude
            },
            options: {}       
            // onClick: function () {
            //     //console.log(a);
            //     $state.go('places.view', {id: place._id});
            // }
        };

        return marker;
    }

    function getMarkerFromPlace(place) {
        var markerId = getMarkerId(place._id);
        var marker = _.find(data.map.markers, { id: markerId});
        return marker;
    }    

    function getMarkerId(placeId) {
        return 'markerKey_' + placeId;
    }

    function centerOnMarker (marker) {
        map.center.latitude = marker.coords.latitude;
        map.center.longitude = marker.coords.longitude;
        notifyObservers();
    }

    function centerOnPlace (place) {
        map.center.latitude = place.latitude;
        map.center.longitude = place.longitude;
        notifyObservers();
    }

    function makeMarkerDraggableFromPlace (place) {
        var marker = getMarkerFromPlace(place);
        marker.options = marker.options || {};
        marker.options.draggable = true;

        data.map.events = data.map.events || {};
        data.map.events.dragend = function (marker, eventName, args) {
            var lat = marker.getPosition().lat();
            var lon = marker.getPosition().lng();
            place.latitude = lat;
            place.longitude = lon;
        };
        notifyObservers();
    }



    function getMap () {
        return data.map;
    }


    function getMarkers () {
        return data.map.markers;
    }

    function aaa () {
        var marker = angular.copy(markers[0]);
        markers = [marker];

    }

    function registerObserverCallback(callback) {
        observerCallbacks.push(callback);
    }

    function notifyObservers() {
        _.each(observerCallbacks, function(callback){
            callback();
        });
    }


    return {
        //map: map,
        //markers: markers,
        data: data,
        loadMap: loadMap,
        setMarkersFromPlaces: setMarkersFromPlaces,
        centerOnMarker: centerOnMarker,
        centerOnPlace: centerOnPlace,
        makeMarkerDraggableFromPlace: makeMarkerDraggableFromPlace,
        getMarkers: getMarkers,
        getMap: getMap,
        aaa: aaa,
        registerObserverCallback: registerObserverCallback
    };




//     var mapService = {
//         map: {},
//         markers: [],
//         isMapLoaded: false
//     };


//     mapService.initMap = function () {
//         var deferred = $q.defer();

//         uiGmapGoogleMapApi.then(function() {
//             mapService.isMapLoaded = true;
        
//             mapService.map = { 
//                 center: { 
//                     latitude: tourAppConfig.defaultMapCenterLatitude,
//                     longitude: tourAppConfig.defaultMapCenterLongitude
//                 }, 
//                 zoom: tourAppConfig.defaultMapZoomInList
//             };

//             deferred.resolve();
//         });

//         return deferred.promise;
//     };

//     mapService.setMarkersFromPlaces = function (places) {

//         mapService.markers = [];

//         for (var i = 0; i < places.length; i++) {
//             var place = places[i];

//             var marker = {
//                 id: 'markerKey_' + place._id,
//                 coords: {
//                     latitude: place.latitude,
//                     longitude: place.longitude
//                 }
//                 // onClick: function () {
//                 //     //console.log(a);
//                 //     $state.go('places.view', {id: place._id});
//                 // }
//             };

//             mapService.markers.push(marker);
//         }

//         mapService.map.zoom = tourAppConfig.defaultMapZoomInList;
//     };

//     mapService.setMarker = function (placeId, latitude, longitude) {

//         mapService.markers = [];


//             var marker = {
//                 id: 'markerKey_' + placeId,
//                 coords: {
//                     latitude: latitude,
//                     longitude: longitude
//                 },
//             };

//             mapService.markers.push(marker);


//         mapService.map.zoom = tourAppConfig.defaultMapZoomInSingle

//         mapService.centerOnMarker(marker);
//     };




// /////////////////////

//     mapService.addMarkerFromPlace = function (place) {

//         mapService.markers = [];

//         var marker = {
//             id: 'markerKey_' + (place._id ? place._id : 'temp'),
//             coords: {
//                 latitude: place.latitude,
//                 longitude: place.longitude
//             },
//             options: { 
//                 // animation: 1 
//                 // animation: new window.google.maps.Animation.BOUNCE
//             }            
//         };

//         mapService.markers.push(marker);


//         //mapService.map.zoom = tourAppConfig.defaultMapZoomInSingle

//         mapService.centerOnMarker(marker);
//     };

//     mapService.centerOnMarker = function (marker) {
//         mapService.map.center.latitude = marker.coords.latitude;
//         mapService.map.center.longitude = marker.coords.longitude;
//     };

//     mapService.centerMapOnPlace = function (place) {
//         mapService.map.center.latitude = place.latitude;
//         mapService.map.center.longitude = place.longitude;
//     };



// /////////////////////


//     mapService.makeMarkerDraggable = function (marker, callback) {
//         marker.options = marker.options || {};
//         marker.options.draggable = true;
//         marker.events = marker.events || {};
//         marker.events.dragend = function (marker, eventName, args) {
//             var lat = marker.getPosition().lat();
//             var lon = marker.getPosition().lng();
//             callback(lat, lon);
//         };
//     };

    // return mapService;

}]);
