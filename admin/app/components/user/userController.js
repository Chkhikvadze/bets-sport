'use strict';
angular.module('myApp').controller('userController',
    ['$scope','Profile','$routeParams','ContestImage',
        function ($scope,Profile,$routeParams,ContestImage) {
            $scope.userInfo = {};
            $scope.userContestList = {};

            Profile.userInfo({
                userId: $routeParams.userId
            },function(response){
                $scope.userInfo = response.data;
                console.log($scope.userInfo);
            });
}]);