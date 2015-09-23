angular.module("myApp").directive("myButton",
    function () {

        return {
            restrict: 'E',
            scope: {
                id: '@',
                title: '@'
            },
            link: function (scope, element, attributes) {
            },
            templateUrl: 'shared/directives/myButton.html'
        };
    });