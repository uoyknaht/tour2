(function () {

    'use strict';

    angular.module('tour2App').factory('PlaceService', PlaceService);
    PlaceService.$inject = ['$http', '$q', '$resource', '$interval', '_', 'CategoryService'];

    function PlaceService ($http, $q, $resource, $interval, _, CategoryService) {

        var resource = $resource('/api/places/:id', { id: '@_id' }, {
            update: {
                method: 'PUT'
            }
        });

        var data = {};
        data.allPlaces = [];
        data.activePlaces = [];

        var isDataInitialized = false;
        var observerCallbacks = [];

        function dataReady() {
            var deferred = $q.defer();

            if (isDataInitialized) {
                deferred.resolve();
            } else {
                var interval = $interval(function () {
                    if (isDataInitialized) {
                        $interval.cancel(interval);
                        deferred.resolve();
                    }
                }, 50);
            }

            return deferred.promise;
        }

        function setPlaces() {
            var deferred = $q.defer();

            if (data.allPlaces.length) {
                notifyObservers();
                deferred.resolve(data.allPlaces);
            } else {
                resource.query(function(result){
                    data.allPlaces = result;
                    isDataInitialized = true;
                    notifyObservers();
                    deferred.resolve();
                }); 
            }

            return deferred.promise;
        }

        function getPlaces() {
            return data.allPlaces;
        }

        function get(queryParams) {
            var deferred = $q.defer();
            var result;
            queryParams = queryParams || {};

            if (data.allPlaces.length) {
                result = _.find(data.allPlaces, queryParams);
                deferred.resolve(result);
            } else {
                resource.query(queryParams, function(result){
                    deferred.resolve(result);
                });            
            }

            return deferred.promise; 
        }

        function add(place) {
            var deferred = $q.defer();
            place.categoriesIds = CategoryService.getIdsFromCategories(place.categories);
            place = new resource(place);

            place.$save(
                function (place) {
                    data.allPlaces.push(place);
                    data.activePlaces.push(place);
                    notifyObservers();
                    deferred.resolve(place._id);
                },
                function () {
                    $scope.saving = false;
                    deferred.resolve();
                }
            );

            return deferred.promise; 
        }    

        function update(place) {
            var deferred = $q.defer();

            var placeCopy = angular.copy(place);
            placeCopy.categoriesIds = CategoryService.getIdsFromCategories(placeCopy.categories);

            placeCopy.$update(
                function () {
                    notifyObservers();
                    deferred.resolve();
                },
                function () {
                    deferred.reject();
                }
            );

            return deferred.promise; 
        }

        function remove(place) {
            var deferred = $q.defer();

            place.$delete(
                function () {
                    _.remove(data.allPlaces, {_id: place._id});
                    _.remove(data.activePlaces, {_id: place._id});
                    notifyObservers();
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                }
            );

            return deferred.promise; 
        }

        function filterByCategories(categories) {

            if (!categories || !categories.length) {
                data.activePlaces = angular.copy(data.allPlaces);
                notifyObservers();
                return;
            }

            var filteredPlaces = _.filter(data.allPlaces, function (place) {
                var found = false;
                var include = false;

                _.each(place.categoriesIds, function (categoryId) {
                    if (found) {
                        return false;
                    }
                    _.each(categories, function (selectedCategory) {
                        if (selectedCategory._id === categoryId) {
                            found = true;
                            include = true;
                            return false;
                        }
                    });
                });

                return include;
            });

            data.activePlaces = filteredPlaces;
            notifyObservers();
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
            data: data,
            dataReady: dataReady,
            getPlaces: getPlaces,
            setPlaces: setPlaces,
            get: get,
            add: add,
            update: update,
            remove: remove,
            filterByCategories: filterByCategories,
            registerObserverCallback: registerObserverCallback
        };
    }

})();

    // var placeService = {};
    // var baseUrl = tourAppConfig.apiUrl + 'places/';

    // placeService.get = function () {

    //     var defered = $q.defer();

    //     $http.get(baseUrl)
    //         .success(function (places) {
    //             defered.resolve(places);
    //         })
    //         .error(function () {
    //             defered.reject();
    //         })

    //     return defered.promise;
    // };    

    // placeService.getById = function (id) {

    //     var defered = $q.defer();

    //     $http.get(baseUrl + id)
    //         .success(function (place) {
    //             defered.resolve(place);
    //         })
    //         .error(function () {
    //             defered.reject();
    //         })

    //     return defered.promise;
    // };       

    // placeService.save = function (place) {

    //     var defered = $q.defer();

    //     $http.post(baseUrl, place)
    //         .success(function (place) {
    //             defered.resolve(place);
    //         })
    //         .error(function () {
    //             defered.reject();
    //         });

    //     return defered.promise;
    // };


    // return placeService;






            // PlaceService.get({ id: $stateParams.id }, function (place){
            //     $scope.place = place;

            //     $scope.map = MapService.map;
            //     MapService.setMarker($scope.place._id, $scope.place.latitude, $scope.place.longitude);
            //     $scope.$parent.markers = MapService.markers;

            //     MapService.makeMarkerDraggable($scope.$parent.markers[0], function (newLat, newLon) {
            //         $scope.place.latitude = newLat;
            //         $scope.place.longitude = newLon;
            //     });  


            // });

