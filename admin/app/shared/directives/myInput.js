angular.module("myApp").directive("myInput",
    function () {

        return {
            restrict: 'E',
            scope: {
                id: '@',
                title: '@',
                bindModel:'=ngModel',
                type : '@' || 'text'
            },
            link: function (scope, element, attributes) {
                if (attributes.required !== undefined) {
                    scope.required = "required";
                }
            },

            templateUrl: 'shared/directives/myInput.html'
        };
    });