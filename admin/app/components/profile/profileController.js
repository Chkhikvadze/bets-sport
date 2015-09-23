/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
'use strict';

angular.module('myApp').controller('profileController',
    ['$scope', '$route', 'Profile', 'fileReader',
        function ($scope, $route, Profile, fileReader) {
            $scope.data = {};
            $scope.message = "";

            Profile.get(function (response) {
                $scope.data = response.data;
            });

            $scope.save = function () {
                Profile.update($scope.data, function (response) {
                    $scope.data = response.data;
                    $route.reload();
                });
            };
        }]);