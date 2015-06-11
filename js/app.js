var app = angular.module('app', ['ngRoute', 'appControllers'])

app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/skillMatrix', {
          templateUrl: 'partials/skillmatrix.html',
          controller: 'skillmatrixCtrl'
        }).
        otherwise({
          redirectTo: '/skillMatrix'
        });
    }]);

var appControllers = angular.module('appControllers', []);