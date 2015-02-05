'use strict';

angular.module('tour2App').controller('ViewPlaceController', function ($scope, $stateParams, PlaceService) {

    $scope.place = {};

    PlaceService.getById($stateParams.id).then(function (place){
        $scope.place = place;
    });

    $scope.onDeletePlace = function () {
        var placeInstance = new PlaceService($scope.place);

        placeInstance.$remove(
            function () {
                console.log('removed');
            },
            function () {
                console.log('removed_2');
            }
        );
    }
});