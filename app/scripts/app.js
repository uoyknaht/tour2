'use strict';

// TODO:
// - i direktyvas view'us sumest
// - move to git
// - implement node as backend
// - deploy online
// - jshint
// - jei view place in detailPlaceCtrl nerasta, tai rodyt kad not found
// - kad padeployinus testai butu vykdomi
// - grunt task kad viska suminifikuotu ir includintu (build taskas)

angular.module('tour.vendors.lodash', []).constant('_', window._);

angular.module('tour2App', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'uiGmapgoogle-maps',
    'mongolabResourceHttp',
    'ui.bootstrap',
    'ui.select',
    'dialogs.main',
    'tour.vendors.lodash'
    ])
    .config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {

        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'app/views/home.html',
            controller: 'HomeController'
        });

        $stateProvider.state('places', {
            url: '/places',
            templateUrl: 'app/views/places/list.html',
            abstract: true,
            controller: 'AllPlacesController'
        });   

        $stateProvider.state('places.list', {
            url: '/list?categories'
        });   

        $stateProvider.state('places.view', {
            url: '/:id/view',
            templateUrl: 'app/views/places/detail.html',
            controller: 'DetailPlaceController'
        });   

        $stateProvider.state('places.add', {
            url: '/add',
            templateUrl: 'app/views/places/edit.html',
            controller: 'EditPlaceController'
        });   

        $stateProvider.state('places.edit', {
            url: '/:id/edit',
            templateUrl: 'app/views/places/edit.html',
            controller: 'EditPlaceController'
        });   


        // $stateProvider.state('places', {
        //     url: '/places',
        //     templateUrl: 'views/places/list.html',
        //     controller: 'AllPlacesController'
        // });     

        // $stateProvider.state('placesView', {
        //     url: '/places/:id',
        //     templateUrl: 'views/places/view.html',
        //     controller: 'ViewPlaceController'
        // });    

   

        // $stateProvider.state('placesAdd', {
        //     url: '/places/add',
        //     templateUrl: 'views/places/edit.html',
        //     controller: 'EditPlaceController'
        // });   

        // $stateProvider.state('placesEdit', {
        //     url: '/places/edit/:id',
        //     templateUrl: 'views/places/edit.html',
        //     controller: 'EditPlaceController'
        // });      

        $urlRouterProvider.otherwise('/');

        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });



    }])

    .constant('tourAppConfig', {
        apiUrl: 'http://localhost:3000/api/',
        defaultMapCenterLatitude: 55.22503,
        defaultMapCenterLongitude: 23.96883,
        defaultMapZoomInList: 7,
        defaultMapZoomInSingle: 12
    });

    // .run(function(_) {

    // });

    // .constant('_', window._)

    // .run(function ($rootScope) {
    //     $rootScope._ = window._