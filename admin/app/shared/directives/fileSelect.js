
angular.module("myApp").directive("ngFileSelect",
	function () {
		return {
			link: function ($scope, el) {
				el.bind("change", function (e) {
					$scope.uploadImage = (e.srcElement || e.target).files[0];
					$scope.getUploadImage();
				});
			}
		};
	});