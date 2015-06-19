var app = angular.module('app', ['ngRoute', 'appControllers'])

app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
      	when('/login', {
      		templateUrl: 'partials/login.html',
            controller: 'loginCtrl'
      	}).
      	when('/login/admin', {
      		templateUrl: 'partials/login.html',
            controller: 'adminLoginCtrl'
      	}).
        when('/admin', {
          templateUrl: 'partials/skillmatrix.html',
          controller: 'adminCtrl'
        }).
        when('/skillMatrix/:id', {
        	templateUrl: 'partials/personalMatrix.html',
        	controller: 'personalMatrixCtrl'
        }).
        otherwise({
          redirectTo: '/login'
        });
    }]);

var appControllers = angular.module('appControllers', []);

app.factory('Session', function() {
	var Session = {};
	return Session;
})