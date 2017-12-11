(function() {

'use strict';
angular.module('ValetApp')
	.controller('CustomerController', ['$scope',
		'$route',
		'EndpointCallService',
		CustomerController
	]);

	function CustomerController($scope, $route, EndpointCallService) {
		$scope.paymentControl = {
			showPayment: false
		};
		$scope.dataModel = {};
		$scope.qrData = [];

		$scope.loadData = function() {
			const config = {
				method: 'GET',
				url: EndpointCallService.getBaseUrl() + '/user',
				headers: {
					'Content-Type': 'application/json',
				},
				params: {
					ticket: $route.current.params.ticket
				}
			};
			const promise = EndpointCallService.callEndpoint(config);
			promise.then(function(response) {
				$scope.dataModel = response.data;
			}, function(err) {
				console.log(err);
			});
		};
		$scope.loadData();

		$scope.showPayment = function() {
			$scope.paymentControl.showPayment = true;
		};

		$scope.makePayment = function() {
			// all logic for calling payment api here

			const config = {
				method: 'POST',
				url: EndpointCallService.getBaseUrl() + '/user/updatePaymentStatus',
				headers: {
					'Content-Type': 'application/json',
				},
				data: {
					ticket: $route.current.params.ticket
				}
			};
			// TODO: move http call inside success callback
			// after calling the payment api
			const promise = EndpointCallService.callEndpoint(config);
			promise.then(function(response) {
				window.location.href = '#!/user/validate?ticket=' + $route.current.params.ticket;				
			}, function(err) {
				console.log(err);
			});
		};

		$scope.cancelPayment = function() {
			$scope.paymentControl.showPayment = false;
		}
	}
	
})();