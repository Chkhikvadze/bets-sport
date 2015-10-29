/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
'use strict';

angular.module('myApp').controller('forgotController', ['$scope', '$location', 'User',
	function ($scope, $location, User) {
		$scope.data = {
			username: ""
		};
		$scope.message = "";
		$scope.info = "";

		$scope.forgot = function () {
			$scope.message = "";
			$scope.info = "";
			
			User.forgot(this.data, function (response) {
				$scope.info = "Your e-mail. Posted mailed instructions for password recovery";
			}, function (response) {
					if (response.status === 404) {
						console.log("not found user");
					} else if (response.status === 400) {
					}

					$scope.message = 'Users of such mail does not exist!';
				});
		};

	}]);