/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
'use strict';

angular.module('myApp').factory('Public', ['$resource', 'appSettings',
    function ($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + "/admin/public/:id", { id: '@_id' },  {
            getXLSData: {
                method: 'GET',
                url: appSettings.apiServiceBaseUri + "/admin/getxlsdata/:name",
                isArray: false,
                params: {
                    name: '@name'
                }
            },
        });
    }]);