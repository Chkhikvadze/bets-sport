'use strict';

angular.module('myApp').controller('betController',
    ['$scope', '$location', '$route', 'Bet',
        function ($scope, $location, $route, Bet) {

            $scope.stake = 1000;
            $scope.getNewBets = function () {
                Bet.getNewBets( {site : "pet"}, function (response) {
                    console.log(response);
                });

            };
            $scope.calculateBets = function () {
                Bet.calculateBets({
                    stake: $scope.stake
                }, function (response) {
                    console.log(response);
                    $scope.data = response.data.sort(function (a, b) {
                        return  b.profitPercent - a.profitPercent;
                    });
                });
            };
            $scope.calculateBets();
        }]);