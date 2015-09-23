/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
'use strict';

angular.module('myApp').factory('Profile', ['$resource', 'appSettings', 'SerializeHelper',
    function ($resource, appSettings, SerializeHelper) {
        return $resource(appSettings.apiServiceBaseUri + "/admin/user/profile", {}, {
            update: {
                method: 'PUT',
                headers: { 'Content-Type': undefined },
                transformRequest: SerializeHelper.transformRequestToFormData
            },
            userInfo: {
                method: 'GET',
                url: appSettings.apiServiceBaseUri + "/user/profile/:userId",
                isArray: false,
                params: {
                    userId: '@userId'
                }
            }
        });

    }]);