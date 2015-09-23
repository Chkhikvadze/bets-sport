/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
'use strict';

angular.module('myApp').factory('authInterceptorService',
	['$q', '$injector', '$location', '$cookies',
		function ($q, $injector, $location, $cookies) {

			var _authService;
			var authInterceptorServiceFactory = {};

			var _request = function (req) {
				req.headers = req.headers || {};

				_authService = _authService || $injector.get('authService');
				// set token
				req.headers.Authorization = _authService.getToken();

				return req;
			};

			var _responseError = function (rejection) {
				if (rejection.status === 401) {
					_authService = _authService || $injector.get('authService');
					// logout
					_authService.logOut();
					$location.path('/login');
				} else if (rejection.status === 403) { // require admin
					return $q.reject(rejection);
				}
				return $q.reject(rejection);
			};

			authInterceptorServiceFactory.request = _request;
			authInterceptorServiceFactory.responseError = _responseError;

			return authInterceptorServiceFactory;
		}]);