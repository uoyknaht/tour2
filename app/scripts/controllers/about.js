'use strict';

/**
 * @ngdoc function
 * @name tour2App.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the tour2App
 */
angular.module('tour2App')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
