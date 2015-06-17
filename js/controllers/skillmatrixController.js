appControllers.controller('skillmatrixCtrl', ['$scope', '$http',
  function ($scope, $http) {
	$scope.skillLevels = ["none", "weak", "average", "strong", "expert"]
    $http.get('http://bdr-skillmatrix-api-dev.elasticbeanstalk.com/skills').success(function(data) {
    	$scope.skillsByGroup = data;
    })
    
    $scope.userID = 6040530933;
	
	$scope.scoreSkill = function(skill, score) {
		$http.post('http://bdr-skillmatrix-api-dev.elasticbeanstalk.com/skills').success(function(result) {
			console.log(result)
	    })
	}
  }]);