(function () {

    'use strict';

    angular.module('tour2App').controller('EditPlaceController', EditPlaceController);
    EditPlaceController.$inject = ['$scope', '$stateParams', '$state', '$q', '_', 'tourAppConfig', 'MediatorService', 'PlaceService', 'CategoryService', 'MapService'];

    function EditPlaceController($scope, $stateParams, $state, $q, _, tourAppConfig, MediatorService, PlaceService, CategoryService, MapService) {

        var placeId = $stateParams.id;
        var geocoder;
        $scope.data = {};
        $scope.data.place = {};
        $scope.data.allCategories = [];
        $scope.isEditAction = $stateParams.id ? true : false;
        $scope.title = $scope.isEditAction ? 'Edit place' : 'Add new place';
        $scope.isSaving = false;

        activate();

        function activate() {
            var placesDataReady = PlaceService.dataReady();
            var categoriesDataReady = CategoryService.dataReady();

            $q.all([placesDataReady, categoriesDataReady]).then(function () {
                $scope.data.allCategories = CategoryService.data.allCategories;

                if ($scope.isEditAction) {
                    PlaceService.get({ _id: placeId }).then(function (place) {
                        $scope.data.place = angular.copy(place);
                        $scope.data.place.categories = CategoryService.getCategoriesFromIds($scope.data.place.categoriesIds);
                        MapService.setMarkersFromPlaces($scope.data.place);
                        MapService.makeMarkerDraggableFromPlace($scope.data.place);
                    });
                } else {
                    createNewPlace();
                    MapService.setMarkersFromPlaces($scope.data.place);
                    MapService.makeMarkerDraggableFromPlace($scope.data.place);
                    // MapService.centerOnMarker();

                    // MapService.makeMarkerDraggable($scope.$parent.markers[0], function (newLat, newLon) {
                    //     $scope.data.place.latitude = newLat;
                    //     $scope.data.place.longitude = newLon;
                    // });             

                }                
            });
        }        

        function createNewPlace() {
            $scope.data.place.latitude = tourAppConfig.defaultMapCenterLatitude;
            $scope.data.place.longitude = tourAppConfig.defaultMapCenterLongitude;
            $scope.data.place.categories = [];
        }       

        $scope.onSavePlace = function () {
            $scope.isSaving = true;

            if ($scope.isEditAction) {
                PlaceService.update($scope.data.place).then(
                    function () {
                        $scope.isSaving = false;
                    },
                    function () {
                        $scope.isSaving = false;
                    }
                );
            } else {
                PlaceService.add($scope.data.place).then(
                    function (placeId) {
                        $scope.isSaving = false;
                        $state.go('places.edit', {id: placeId});
                    },
                    function () {
                        $scope.isSaving = false;
                    }
                );
            }
        };

        $scope.onCoordinateBlur = function (coordinateType) {
            MapService.setMarkersFromPlaces($scope.data.place);
        };        

        $scope.onCancelSavePlace = function () {
            if ($scope.isEditAction) {
                $state.go('places.view', {id: $scope.data.place._id});    
            } else {
                $state.go('places.list');
            }
        };

        $scope.onSetMarkerPositionFromAddressClick = function () {
            if (!geocoder) {
                geocoder = new google.maps.Geocoder();    
            }
            
            geocoder.geocode( { 'address': $scope.data.place.address}, function(results, status) {

              if (status == google.maps.GeocoderStatus.OK) {

                var location = results[0].geometry.location;
                var latitude = location.lat().toFixed(8);
                var longitude = location.lng().toFixed(8);

     
                $scope.data.place.latitude = latitude;
                $scope.data.place.longitude = longitude;

                MapService.addMarkerFromPlace($scope.data.place);
                $scope.$parent.markers = MapService.markers;

              } else {

              }
            });

        };

        function setMarkerInitialCoords () {
            var lat = tourAppConfig.defaultMapCenterLatitude;
            var lon = tourAppConfig.defaultMapCenterLongitude;

            if ($scope.editAction && markerIsSet()) {
                lat = $scope.place.latitude;
                lon = $scope.place.longitude;
            }

            $scope.markers[0].coords = {
                latitude: lat,
                longitude: lon
            };
        }

        function markerIsSet () {
            return $scope.place.latitude && $scope.place.longitude;
        }

        function getZoom () {
            var zoom = tourAppConfig.defaultMapZoomInSingle;

            if (markerIsSet()) {
                zoom = tourAppConfig.defaultMapZoomInList;
            }

            return zoom;
        }       
    }


})();

        // function initMap () {
        //     uiGmapGoogleMapApi.then(function() {
            
        //         $scope.map = { 
        //             center: { 
        //                 latitude: $scope.place.latitude || tourAppConfig.defaultMapCenterLatitude,
        //                 longitude: $scope.place.longitude || tourAppConfig.defaultMapCenterLongitude
        //             }, 
        //             zoom: getZoom()
        //         };

        //         $scope.marker = {
        //             id: 0,
        //             // coords: {
        //             //     latitude: $scope.place.latitude || tourAppConfig.defaultMapCenterLatitude,
        //             //     longitude: $scope.place.longitude || tourAppConfig.defaultMapCenterLongitude
        //             // },
        //             options: { draggable: true },
        //             events: {
        //                 dragend: function (marker, eventName, args) {
        //                     var lat = marker.getPosition().lat();
        //                     var lon = marker.getPosition().lng();

        //                     $scope.place.latitude = lat;
        //                     $scope.place.longitude = lon;
        //                 }
        //             }
        //         }; 

        //         setMarkerInitialCoords();


        //     });
        // }