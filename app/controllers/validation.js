(function() {

'use strict';
angular.module('ValetApp')
	.controller('ValidationController', ['$scope',
		'$route',
		'EndpointCallService',
		ValidationController
	]);

	function ValidationController($scope, $route, EndpointCallService) {
		$scope.qrData = [];

		$scope.loadCode = function() {
			const qrConfig = {
				method: 'GET',
				url: EndpointCallService.getBaseUrl() + '/user/validation',
				headers: {
					'Content-Type': 'application/json',
				},
				params: {
					ticket: $route.current.params.ticket
				}
			};

			const qrPromise = EndpointCallService.callEndpoint(qrConfig);
			qrPromise.then(function(success) {
				$scope.qrData = success.data;
				QRCode.toDataURL($scope.qrData, function (err, qrCode) {
				  if (err) {
					console.log(err);
				  } else {
				  	// leaving 2 secs loading time
				  	window.setTimeout(function() {
					  const img = document.getElementById('qrcode-container');
					  img.src = qrCode;
				  	}, 2000);
				  }

				});
			}, function(err) {
				console.log(err);
			});
		};

		$scope.loadCode();
	}
	
})();