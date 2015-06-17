var app = angular.module('app', ['ngRoute', 'appControllers'])

app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/skillMatrix', {
          templateUrl: 'partials/skillmatrix.html',
          controller: 'skillmatrixCtrl'
        }).
        when('/skillMatrix/:id', {
        	templateUrl: 'partials/personalMatrix.html',
        	controller: 'personalMatrixCtrl'
        }).
        otherwise({
          redirectTo: '/skillMatrix'
        });
    }]);

var appControllers = angular.module('appControllers', []);