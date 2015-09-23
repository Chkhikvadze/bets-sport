'use strict';

angular.module('myApp').service('SerializeHelper', function () {
	return {
		transformRequestToFormData: function (data) {
			var form = new FormData;

			for (var i in data) {
				if (typeof data[i] === "object" &&
					data[i].constructor != File) {
					var subdoc = data[i];
					for (var subi in subdoc) {
						form.append(i + '[' + subi + ']', subdoc[subi]);
					}
				} else {
					form.append(i, data[i]);
				}
			}

			return form;
		}
	};
});