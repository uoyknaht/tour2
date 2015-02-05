(function () {

    'use strict';

    angular.module('tour2App').controller('AllPlacesController', AllPlacesController);
    AllPlacesController.$inject = ['$scope', '$state', 'MediatorService', 'PlaceService', 'MapService', 'CategoryService'];

    function AllPlacesController($scope, $state, MediatorService, PlaceService, MapService, CategoryService) {
        $scope.data = {};
        $scope.data.allPlaces = [];
        $scope.data.activePlaces = [];
        $scope.data.allCategories = [];
        $scope.data.selectedCategories = [];
        $scope.data.map = {};
        $scope.onShowPlace = function (place) { return onShowPlace(place) };
        $scope.onCategoriesFilterChange = onCategoriesFilterChange;

        activate();

        function activate() {
            bindToServicesData();

            var loadingMap = MapService.loadMap();
            var settingCategories = CategoryService.setCategories();
            var settingPlaces = PlaceService.setPlaces();

            settingCategories.then(function (categories) {
                $scope.data.selectedCategories = CategoryService.getCategoriesFromQuery($state.params.categories);

                settingPlaces.then(function (places) {
                    PlaceService.filterByCategories($scope.data.selectedCategories);

                    loadingMap.then(function () {
                        // todo: set only if in list view
                        MapService.setMarkersFromPlaces($scope.data.activePlaces);
                    });  
                }); 
            });
        }

        function bindToServicesData() {
            PlaceService.registerObserverCallback(function () {
                $scope.data.allPlaces = PlaceService.data.allPlaces;
                $scope.data.activePlaces = PlaceService.data.activePlaces;
            });

            CategoryService.registerObserverCallback(function () {
                $scope.data.allCategories = CategoryService.data.allCategories;
            });            

            MapService.registerObserverCallback(function () {
                $scope.data.map = MapService.getMap();
            });       
        }    

        function onShowPlace (place) {
            $state.go('places.view', {id: place._id});
        }

        function onCategoriesFilterChange () {
            var selectedCategoriesQueryString = CategoryService.getQueryString($scope.data.selectedCategories);
            $state.go('places.list', { categories: selectedCategoriesQueryString });
            PlaceService.filterByCategories($scope.data.selectedCategories);
            MapService.setMarkersFromPlaces($scope.data.activePlaces);
        }        

    }

})();