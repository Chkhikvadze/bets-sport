/* global hello */
/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
'use strict';

angular.module('myApp').controller('loginController',
	['$scope', '$location', 'authService', 'User',
		function ($scope, $location, authService, User) {
			$scope.loginData = {
				username: "",
				password: ""
			};
			$scope.message = "";

			$scope.login = function () {
				authService.login(this.loginData).then(function (response) {
					$location.path('active');
				}, function (err) {
						$scope.message = 'მომხმარებელი ან პაროლი არასწორია';
					});
			};
		
			// init social
			hello.init({
				'facebook': {
					id: '927529420633398',
					refresh: false,
					force: true
				},
			});
			// clear previous logins
			hello.logout("facebook");

			// handle login event
			hello.on('auth.login', function (auth) {

				if (auth.network === 'facebook') {
					authService.facebook({ access_token: auth.authResponse.access_token })
						.then(function (response) {
						$location.path('active');
					}, function (err) {
							console.log(err);
							$scope.message = 'ელ. ფოსტა აუცილებელია!!!';
						});
				}

			});

			$scope.facebook = function () {
				hello('facebook').login({ scope: 'public_profile, email' });
			};
		}]);