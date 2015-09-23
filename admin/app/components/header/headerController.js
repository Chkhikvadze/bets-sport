/// <reference path="../../../../typings/angularjs/angular.d.ts"/>

angular.module('myApp').controller('headerController',
	['$scope', '$location', '$route', 'authService', 'User',
		function ($scope, $location, $route, authService, User) {
			$scope.logOut = function () {
				authService.logOut();
				$location.path('/');
			};

			$scope.user = authService.user;

			$scope.requestActivate = function () {
				User.requestActivate({}, function (response) {

				});
			};
		}]);