/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
'use strict';

angular.module('myApp').factory('authService',
	['$q', '$cookies', 'User',
		function ($q, $cookies, User) {

			var authServiceFactory = {};
			var cookieStorageName = 'auth';
			var _user = {};

			var _fillUser = function (data) {
				_user.isLoggedIn = data ? true : false;
				_user.fullName = data ? data.fullName : "";
				_user.avatar = data ? data.avatar : "";
				_user.role = data ? data.role : "";
				_user.email = data ? data.email : "";
				_user.isActive = data ? data.isActive : false;
			};

			var _fillAuth = function () {
				_fillUser($cookies.getObject(cookieStorageName));
			};

			var _getToken = function () {
				var data = $cookies.getObject(cookieStorageName);
				return data ? data.token : null;
			};

			var _fillAuthFromResponse = function (response) {
				var resp = response.data;

				$cookies.putObject(cookieStorageName, {
					token: resp.token,
					fullName: resp.user.fullName,
					avatar: resp.user.avatar,
					role: resp.user.role,
					email: resp.user.email,
					isActive: resp.user.isActive
				}, {
					secure: false, //false = debug, true = production!!!!!
				});
			};

			var _logOut = function () {
				$cookies.remove(cookieStorageName);
				_fillUser();
			};

			var _registration = function (data) {
				_logOut();

				var deferred = $q.defer();

				User.signUp(data, function (response) {
					_fillAuthFromResponse(response); // save to cookie
					_fillAuth(); // load from cookie

					deferred.resolve(response);
				}, function (response) {
					deferred.reject(response);
				});

				return deferred.promise;
			};

			var _login = function (data) {
				var deferred = $q.defer();

				User.login(data, function (response) {
					_fillAuthFromResponse(response); // save to cookie
					_fillAuth(); // load from cookie

					deferred.resolve(response);
				}, function (response) {
					_logOut();
					deferred.reject(response);
				});

				return deferred.promise;
			};

			var _facebook = function (data) {
				var deferred = $q.defer();

				User.facebook(data, function (response) {
					_fillAuthFromResponse(response); // save to cookie
					_fillAuth(); // load from cookie

					deferred.resolve(response);
				}, function (response) {
					_logOut();
					deferred.reject(response);
				});

				return deferred.promise;
			};

			// init user for first time
			_fillUser();
			// expose private members
			authServiceFactory.user = _user;
			authServiceFactory.registration = _registration;
			authServiceFactory.login = _login;
			authServiceFactory.facebook = _facebook;
			authServiceFactory.logOut = _logOut;
			authServiceFactory.fillAuth = _fillAuth;
			authServiceFactory.getToken = _getToken;

			return authServiceFactory;
		}]);