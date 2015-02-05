(function () {

    'use strict';

    angular.module('tour2App').factory('MediatorService', MediatorService);
    MediatorService.$inject = ['$q', 'PlaceService'];

    function MediatorService ($q, PlaceService) {

        var store = {};


        function setPlaces () {

            var deferred = $q.defer();

            if (store.places) {
                deferred.resolve(store.places);
            } else {
                PlaceService.get(function(places){
                    store.places = places;
                    deferred.resolve(store.places);
                });
            }

            return deferred.promise;
        }

        return  {
            store: store,
            setPlaces: setPlaces
        };
    }

})();