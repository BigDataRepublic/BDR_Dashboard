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
        when('/admin/accounts', {
        	templateUrl: 'partials/accounts.html',
        	controller: 'accountsCtrl'
        }).
        when('/skillMatrix/:id', {
        	templateUrl: 'partials/personalMatrix.html',
        	controller: 'personalMatrixCtrl'
        }).
        when('/account/:id', {
        	templateUrl: 'partials/accountManagement.html',
        	controller: 'accountManagementCtrl'
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

app.factory('navigate', function($location, Session) {
  var navigate = {};
  
  navigate.login = function(){
	  delete Session;
	  $location.path("/login")
  };
  
  navigate.skills = function(){
	  console.log("Navigating to accounts skills")
	  $location.path("/admin")
  };
  
  navigate.accounts = function(){
	  console.log("Navigating to accounts")
	  $location.path("/admin/accounts")
  };
  
  navigate.accountManagement = function(id){
	  console.log("Account management")
	  $location.path("/account/" + id)
  };
  
  navigate.skillMatrix = function(id){
	  $location.path("skillMatrix/" + id)
  }
  // factory function body that constructs shinyNewServiceInstance
  return navigate;
});