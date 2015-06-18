var database = "http://localhost:5000"

appControllers.controller('skillmatrixCtrl', ['$scope', '$http',
  function ($scope, $http) {
	$scope.deleteForm = {};
	$scope.hideGroupForm = true;
	$scope.hideDeleteForm = true;
	$scope.newGroupSkills = {};
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
			if($scope.skillsByGroup[group])
				$scope.skillsByGroup[group][skillName] = skillName;
			else
				$scope.skillsByGroup[group] = {skillName: skillName}
		})
	}
	
	$scope.openGroupForm = function() {
		console.log("Opening add group form");
		$scope.hideGroupForm = false;
	}
	
	$scope.addSkillToNewGroup = function(skill) {
		console.log("Adding " + skill + " to new group")
		$scope.newGroupSkills[skill] = skill
		console.log($scope.newGroupSkills)
	}
	
	$scope.addGroup = function(name) {
		console.log("Creating group " + name)
		console.log("with skills: ")
		for (skill in $scope.newGroupSkills) {
			$scope.addSkill(skill, name)
		}
		$scope.hideGroupForm = true;
	}
	
	$scope.closeGroupForm = function(){
		$scope.hideGroupForm = true;
	}
	
	$scope.openDeleteConfirmation = function(type, name, group) {
		console.log("Opening delete confirmation for " + name + " " + type);
		$scope.deleteForm.name = name;
		$scope.deleteForm.type = type;
		$scope.deleteForm.group = group;
		$scope.hideDeleteForm = false;
	}
	
	$scope.deleteItem =  function() {
		var type = $scope.deleteForm.type;
		var name = $scope.deleteForm.name;
		var group = $scope.deleteForm.group;

		console.log("Deleting " + type + " " + name)
		switch(type) {
		    case "group":
		        for(skillKey in $scope.skillsByGroup[name]) {
		        	console.log(skillKey)
		        	var skill = $scope.skillsByGroup[name][skillKey]
		        	console.log("deleting skill " + skill)
		        	$http.post(database + "/deleteSkill/" + name + "/" + skill).success(function(data) {
		        		console.log("Delte successful")
		        	})
		        }
		        delete $scope.skillsByGroup[name]
		        break;
		    case "skill":
		    	$http.post(database + "/deleteSkill/" + group + "/" + name).success(function(data) {
	        		console.log("Delte successful")
	        		delete $scope.skillsByGroup[group][name];
	        		console.log($scope.skillsByGroup[group])
	        	})
		        break;
		    default:
		        console.log("type not valid")
		} 
		$scope.hideDeleteForm = true;
		$scope.deleteForm = {};
	}
	
	$scope.closeDelteConfirmation = function() {
		$scope.hideDeleteForm = true;
		$scope.deleteForm = {};
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