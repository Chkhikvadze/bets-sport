'use strict';

angular.module('myApp').controller('betController',
    ['$scope', '$location', '$route', 'Bet',
        function ($scope, $location, $route, Bet) {

            $scope.stake = 1000;
            $scope.getNewBets = function () {
                NProgress.configure({ parent: '#container' });
                NProgress.start();
                Bet.getNewBets( {site : "pet"}, function (response) {
                    console.log(response);
                    NProgress.done();
                });

            };

            $scope.calculateBets = function () {
                NProgress.configure({ parent: '#containerGrid'});
                NProgress.start();
                Bet.calculateBets({
                    stake: $scope.stake
                }, function (response) {
                    console.log(response);
                    $scope.data = response.data.sort(function (a, b) {
                        return  b.profitPercent - a.profitPercent;
                    });
                    NProgress.done();
                });
            };
            $scope.calculateBets();
        }]);