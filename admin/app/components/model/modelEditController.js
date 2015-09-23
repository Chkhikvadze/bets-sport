angular.module('myApp').controller('modelEditController',
    ['$scope', '$location', '$http', 'appSettings', '$routeParams', 'Project',
        function ($scope, $location, $http, appSettings, $routeParams, Project) {
            $scope.doc = {};
            $scope.project = {};
            $scope.projectId = $routeParams.id;
            $scope.modelId = $routeParams.modelid;


            $scope.typeList = [
                'String',
                'Number',
                'Date',
                'Buffer',
                'Boolean',
                'Mixed',
                'ObjectId',
                'Array',
                'Object',
                'Object Array'
            ];
            $scope.refList = [];
            $scope.parentList = [];

            if ($routeParams.id) {
                Project.get({id: $routeParams.id}, function (response) {
                    $scope.project = response.data;
                    if ($routeParams.modelid) {
                        $scope.doc = response.data.models.filter(function (v) {
                            return v._id === $scope.modelId; // filter out appropriate one
                        })[0];
                    }

                    $scope.refList = $scope.project.models.map(function (e) {
                        return e.name
                    });

                    if ($scope.doc.fields === undefined)
                        $scope.doc.fields = [];
                    $scope.parentList =$scope.doc.fields.map(function (e) {
                       return e.name
                    });
                });
            }

            $scope.save = function () {
                if ($scope.doc._id) { // edit
                    var index = $scope.project.models.map(function (e) {
                        return e._id;
                    }).indexOf($scope.modelId);
                    $scope.project.models[index] = $scope.doc;

                    Project.update($scope.project);
                    $location.path($scope.url.project + "/" + $routeParams.id + "/models");
                } else { // add
                    $scope.project.models.push($scope.doc);
                    Project.update($scope.project);
                    $location.path($scope.url.project + "/" + $routeParams.id + "/models");
                }
            };

            $scope.currentField = {};
            $scope.saveField = function () {
                if ($scope.doc.fields === undefined) {
                    $scope.doc.fields = [];
                }
                var index = $scope.doc.fields.map(function (e) {
                    return e.name;
                }).indexOf($scope.currentField.name);

                if (index >= 0)
                    $scope.doc.fields.splice(index, 1);


                $scope.doc.fields.push($scope.currentField);


                $scope.parentList =$scope.doc.fields.map(function (e) {
                    return e.name
                });
                //$scope.$apply();
                $scope.currentField = {};
            };

            $scope.editField = function (name) {
                var index = $scope.doc.fields.map(function (e) {
                    return e.name;
                }).indexOf(name);

                $scope.currentField = $scope.doc.fields[index];

                $scope.parentList =$scope.doc.fields.map(function (e) {
                    return e.name
                });
            };

            $scope.deleteField = function (name) {
                deleteObjectNotification(name, function () {
                    var index = $scope.doc.fields.map(function (e) {
                        return e.name;
                    }).indexOf(name);
                    if (index >= 0) {
                        $scope.doc.fields.splice(index, 1);
                        $scope.$apply();
                    }

                    $scope.parentList =$scope.doc.fields.map(function (e) {
                        return e.name
                    });
                });
            };

        }]);