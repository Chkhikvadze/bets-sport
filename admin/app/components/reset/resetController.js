
angular.module('myApp').controller('resetController', ['$scope', '$location', 'User',
	function ($scope, $location, User) {
		var token = $location.search().token;
		// clear search params
		$location.url($location.path());
		if (!token) {
			return $location.path('/');
		}
		$scope.message = "";
		$scope.data = {
			password: "",
			confirmPassword: "",
			token: token
		};

		$scope.reset = function () {
			$scope.message = "";

			User.reset(this.data, function (response) {
				$location.path('login');
			}, function (response) {
					if (response.status === 404) {
					} else if (response.status === 400) {
					}

					$scope.message = 'Reset token expired!';
				});
		};
	}]);