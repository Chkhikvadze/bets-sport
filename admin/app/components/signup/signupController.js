
angular.module('myApp').controller('signupController', ['$scope', '$location', 'authService',
	function ($scope, $location, authService) {
		$scope.savedSuccessfully = false;
		$scope.message = "";

		$scope.registration = {
			username: "",
			password: "",
			confirmPassword: ""
		};

		$scope.signUp = function () {

			authService.registration($scope.registration).then(function (response) {
				$location.path('active');
			}, function (response) {
					$scope.message = "Users of this email already registered";
				});
		};
	}]);