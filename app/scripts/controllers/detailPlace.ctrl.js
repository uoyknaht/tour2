(function () {

    'use strict';

    angular.module('tour2App').controller('DetailPlaceController', DetailPlaceController);
    DetailPlaceController.$inject = ['$scope', '$stateParams', 'dialogs', 'MediatorService', 'PlaceService', 'CategoryService', 'MapService'];

    function DetailPlaceController($scope, $stateParams, dialogs, MediatorService, PlaceService, CategoryService, MapService) {
        $scope.data = {};
        $scope.data.place = {};
        $scope.isDeleted = false;
        $scope.onDeletePlace = onDeletePlace;

        activate();

        function activate() {
            PlaceService.dataReady().then(function () {
                PlaceService.get({ _id: $stateParams.id }).then(function (place) {
                    $scope.data.place = place;
                    $scope.data.place.categories = CategoryService.getCategoriesFromIds($scope.data.place.categoriesIds);
                    MapService.setMarkersFromPlaces($scope.data.place);
                });
            });
        }

        function onDeletePlace() {
            var dialog = dialogs.confirm();

            dialog.result.then(
                function(btn){
                    PlaceService.remove($scope.data.place).then(function () {
                        $scope.isDeleted = true;
                    });
                }
            );        
        }
       
    }

})();