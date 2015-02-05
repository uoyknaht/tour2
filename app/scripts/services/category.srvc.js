(function () {

    'use strict';

    angular.module('tour2App').factory('CategoryService', CategoryService);
    CategoryService.$inject = ['$http', '$q', '$resource', '$interval', '_'];

    function CategoryService ($http, $q, $resource, $interval, _) {

        var resource = $resource('/api/categories/:id', { id: '@_id' });

        var data = {};
        data.allCategories = [];

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

        function setCategories() {
            var deferred = $q.defer();

            if (data.allCategories.length) {
                notifyObservers();
                deferred.resolve();
            } else {
                resource.query(function(result){
                    data.allCategories = result;
                    isDataInitialized = true;
                    notifyObservers();
                    deferred.resolve();
                }); 
            }

            return deferred.promise;
        }

        function getCategoriesFromIds(categoriesIds) {
            var categories = _.map(categoriesIds, function (categoryId) {
                var category = _.find(data.allCategories, {_id: categoryId});
                return category;
            });

            return categories;
        } 

        function getIdsFromCategories(categories) {
            var ids = _.map(categories, function (category) {
                return category._id;
            });

            return ids;
        } 

        function getCategoriesFromQuery(query) {
            if (!query) {
                return [];
            }

            var ids = query.split(',');

            var categories = _.filter(data.allCategories, function (category) {
                return _.contains(ids, category._id);
            });

            return categories;
        }         

        function getQueryString(categories) {
            var query = '';
            _.each(categories, function (category) {
                query = query + category._id + ',';    
                
            });
            query = query.slice(0, -1);

            return query;
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
            setCategories: setCategories,
            getCategoriesFromIds: getCategoriesFromIds,
            getIdsFromCategories: getIdsFromCategories,
            getCategoriesFromQuery: getCategoriesFromQuery,
            getQueryString: getQueryString,
            registerObserverCallback: registerObserverCallback
        };
    }

})();
