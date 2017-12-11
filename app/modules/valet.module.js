(function() {

	'use strict';

	var app = angular.module('ValetApp', ['ngRoute']);

	app.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/valet', {
				templateUrl: 'valet-landing-page.html',
				controller: 'ValetController'
			})
			.when('/valet/generateTicket', {
				templateUrl: 'generate-ticket.html',
				controller: 'ValetController'
			})
			.when('/valet/validate', {
				templateUrl: 'validate-ticket.html',
				controller: 'ValetController'
			})
			.when('/user', {
				templateUrl: 'customer-landing.html',
				controller: 'CustomerController'
			})
			.when('/user/validate', {
				templateUrl: 'thankyou.html',
				controller: 'ValidationController'
			})
			.otherwise({
				redirectTo: '/valet'
			});

		// $locationProvider.html5Mode(true);
	});

	app.run(function(EndpointCallService) {
		EndpointCallService.setConfiguration();
	});
	
})();