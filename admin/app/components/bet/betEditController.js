angular.module('myApp').controller('projectEditController',
    ['$scope', '$location', '$http', 'appSettings', '$routeParams', 'Bet',
        function ($scope, $location, $http, appSettings, $routeParams, Bet) {
            $scope.doc = {};

            if ($routeParams.id) {
                Bet.get({id: $routeParams.id}, function (response) {
                    $scope.doc = response.data;
                });
            }

            $scope.save = function () {
                if ($scope.doc._id) { // edit
                    Bet.update($scope.doc);
                    $location.path($scope.url.project);
                } else { // add
                    Bet.save($scope.doc);
                    $location.path($scope.url.project);
                }
            };
        }]);