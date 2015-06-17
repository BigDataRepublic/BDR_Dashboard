var database = "http://localhost:5000"

appControllers.controller('skillmatrixCtrl', ['$scope', '$http',
  function ($scope, $http) {
	$scope.skillLevels = ["none", "weak", "average", "strong", "expert"]
    $http.get(database + '/skills').success(function(data) {
    	$scope.skillsByGroup = data;
    	console.log(data)
    	$scope.skillForms = {};
    	for(group in data)
    		$scope.skillForms[group] = true;
    	console.log($scope.skillForms)
    })
	
    $scope.addSkillForm = function(group) {
		console.log("Opening skillForm for " + group)
		$scope.skillForms[group] = false;
		console.log($scope.skillForms)
	}
	
	$scope.addSkill = function(skillName, group) {
		console.log("Adding skill " + skillName + " to " + group)
		$http.post(database + '/addSkill/' + group + '/' + skillName).success(function(reply) {
			console.log(reply)
			$scope.skillsByGroup[group].push({"skill": skillName})
		})
	}
}]);

appControllers.controller('personalMatrixCtrl', ['$scope', '$http', '$routeParams',
  function ($scope, $http, $routeParams) {
	var accountID = $routeParams.id
	console.log(accountID)
	$http.get(database + '/user/'+ accountID + '/name').success(function(data) {
		$scope.account_name = data.name
		console.log($scope.account_name)
	})
	$scope.skillLevels = ["none", "weak", "average", "strong", "expert"]
    $http.get(database + '/skills/' + accountID).success(function(data) {
    	console.log(data)
    	$scope.skillsByGroup = data;
    })
	
	$scope.buttonStyle = function(level, score) {
		if(level <= score)
			return "btn-success";
		else
			return "btn-default";
	}
	
	$scope.scoreSkill = function(group, skill, score) {
		var skillName = $scope.skillsByGroup[group][skill].skill;
		$http.post(database + '/skills/score/' + skillName + '/' + score + '/' + accountID).success(function(reply) {
			console.log(skillName + " scored for " + score);
			$scope.skillsByGroup[group][skill].score = score;
		})
	}
}]);