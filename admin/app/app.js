/// <reference path="../../typings/angularjs/angular.d.ts"/>

var myApp = angular.module('myApp',
    ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngAnimate', 'ngCookies', "ngTable", 'ui.select', 'ngSanitize', 'ui.bootstrap',
        'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.moveColumns',
        'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.pinning',
        'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.pagination', 'ui.grid.expandable','ngFileUpload']);


// routes
myApp.config(function ($routeProvider) {

    $routeProvider

        .when("/", {
            controller: "homeController",
            templateUrl: "/components/home/home.html"
        })
        .when("/login", {
            controller: "loginController",
            templateUrl: "/components/login/login.html"
        })
        .when("/signup", {
            controller: "signupController",
            templateUrl: "/components/signup/signup.html"
        })

        .when("/profile", {
            controller: "profileController",
            templateUrl: "/components/profile/profile.tpl.html"
        })

        .when("/courses", {
            templateUrl: '/components/course/course.tpl.html',
            controller: "courseController"
        })
        .when("/about", {
            controller: "aboutController",
            templateUrl: "/components/about/about.html"
        })

        .when("/forgot/", {
            controller: "forgotController",
            templateUrl: "/components/forgot/forgot.html"
        })
        .when("/reset/", {
            controller: "resetController",
            templateUrl: "/components/reset/reset.html",
            reloadOnSearch: false
        })

        //Bet
        .when(bet, {
            controller: "betController",
            templateUrl: "/components/bet/list.html"
        })
        .when(bet + "/add", {
            controller: "betEditController",
            templateUrl: "/components/bet/edit.html"
        })
        .when(bet + "/edit/:id", {
            controller: "betEditController",
            templateUrl: "/components/bet/edit.html"
        })
        //Bet ###


});

myApp.constant('appSettings', {
    apiServiceBaseUri: 'http://localhost:7778/api/v1'
});

myApp.config(['$httpProvider', '$locationProvider',
    function ($httpProvider, $locationProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    }]);

myApp.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
});


myApp.run(['authService', '$rootScope', '$location', '$route',
    function (authService, $rootScope, $location, $route) {

        authService.fillAuth();
        $rootScope.AccActivate = true;

        $rootScope.$watch(function () {
            if (authService.user.isActive == true && authService.user.isLoggedIn == true) $rootScope.AccActivate = true;
            else if (authService.user.isActive == false && authService.user.isLoggedIn == true) $rootScope.AccActivate = false;
            else $rootScope.AccActivate = true;
        });

        var original = $location.path;
        $location.path = function (path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            }
            return original.apply($location, [path]);
        };

        $rootScope.url = {
            root: root,
            feedback: feedback,

            bet: bet,
            users: users,
        }
    }]);

