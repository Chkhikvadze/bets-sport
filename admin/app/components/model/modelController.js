'use strict';

angular.module('myApp').controller('modelController',
    ['$scope', '$location', '$route', 'Project','$routeParams',
        function ($scope, $location, $route, Project, $routeParams) {
            $scope.projectId = $routeParams.id;
            if ($routeParams.id) {
                Project.get({id: $routeParams.id}, function (response) {
                    $scope.data = response.data;
                });
            }

            $scope.delete = function (id, name) {
                deleteObjectNotification(name, function () {

                    var index = $scope.data.models.map(function (e) {
                        return e._id;
                    }).indexOf(id);
                    $scope.data.models.splice(index, 1);
                    Project.update($scope.data);
                    $route.reload();
                });
            };
        }]);