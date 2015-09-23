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
				$scope.info = "თქვენს ელ. ფოსტაზე გამოგზავნილია ინსტრუქცია პაროლის აღსადგენად";
			}, function (response) {
					if (response.status === 404) {
						console.log("not found user");
					} else if (response.status === 400) {
					}

					$scope.message = 'მომხმარებელი ასეთი ელ. ფოსტით არ არსებობს!';
				});
		};

	}]);