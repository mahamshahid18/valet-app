(function() {

'use strict';
angular.module('ValetApp')
	.controller('ValetController', ['$scope',
		'EndpointCallService',
		ValetController
	]);

	function ValetController($scope, EndpointCallService) {
		$scope.ticketModel = {
			name: '',
			phone: '',
			reg_no: '',
			color: '',
			model_make: '',
		};
		// console.log(EndpointCallService.getBaseUrl());

		$scope.gotoTicketGeneration = function() {
			window.location.href = '#!/valet/generateTicket';
		};
		$scope.gotoValidation = function() {
			window.location.href = '#!/valet/validate';
		};

		$scope.generateTicket = function() {
			const config = {
				method: 'POST',
				url: EndpointCallService.getBaseUrl() + '/generateTicket',
				headers: {
					'Content-Type': 'application/json'
				},
				data: $scope.ticketModel
			};
			const promise = EndpointCallService.callEndpoint(config);
			promise.then(function(success) {
				window.alert('Ticket Generated!');
				window.location.href = '#!/';
			}, function(err) {
				// window.alert(JSON.stringify(err));
				window.alert('Ticket could not be generated. Contact System Admin!');
			});
		};
	}
	
})();