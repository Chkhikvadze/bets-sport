/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
'use strict';

angular.module('myApp').factory('User', ['$resource', 'appSettings',
    function ($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + "/user", {}, {
            activate: {
                method: 'GET',
                url: appSettings.apiServiceBaseUri + "/user/activate/:token",
                isArray: false,
                params: {
                    token: '@token'
                }
            },
            requestActivate: {
                method: 'POST',
                url: appSettings.apiServiceBaseUri + "/user/activate/"
            },
            signUp: {
                method: 'POST',
                url: appSettings.apiServiceBaseUri + "/user/signup/"
            },
            login: {
                method: 'POST',
                url: appSettings.apiServiceBaseUri + "/user/login/"
            },
            forgot: {
                method: 'POST',
                url: appSettings.apiServiceBaseUri + "/user/forgot/"
            },
            reset: {
                method: 'POST',
                url: appSettings.apiServiceBaseUri + "/user/reset/"
            },
            facebook: {
                method: 'POST',
                url: appSettings.apiServiceBaseUri + "/user/login/social/facebook/"
            }
        });
    }]);