angular.module("myApp").directive("myTextArea",
    function () {

        return {
            restrict: 'E',
            scope: {
                id: '@',
                title: '@',
                bindModel:'=ngModel'
            },
            link: function (scope, element, attributes) {
                if (attributes.required !== undefined) {
                    scope.required = "required";
                }
            },
            templateUrl: 'shared/directives/myTextArea.html'
        };
    });