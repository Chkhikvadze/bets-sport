/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
'use strict';

angular.module('myApp').factory('Bet', ['$resource', 'appSettings',
    function ($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + "/bet/:id", {id: '@_id'}, {
            query: {
                method: 'GET',
                isArray: false
            },
            update: {
                method: 'PUT'
            },
            getNewBets: {
                method: 'GET',
                url: appSettings.apiServiceBaseUri + "/bet/getNewBets/:site",
                isArray: false,
                params: {
                    site: '@site'
                }
            },
            calculateBets: {
                method: 'GET',
                url: appSettings.apiServiceBaseUri + "/bet/calculateBets/:stake",
                isArray: false,
                params: {
                    stake: '@stake'
                }
            }
        });
    }
]);