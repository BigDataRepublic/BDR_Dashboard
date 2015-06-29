//var database = "http://localhost:5000"
var database = "http://bdr-skillmatrix-api.elasticbeanstalk.com"

Object.size = function(obj) {
	var size = 0, key;
	for(key in obj) {
		if(obj.hasOwnProperty(key))
			size++;
	}
	return size;
}
	
appControllers.controller('adminLoginCtrl', ['$scope', '$http', '$location', 'Session',
function ($scope, $http, $location, Session) {
	$scope.Session = Session;
	$scope.hideError = true;
	$scope.checkLogin = function(name, password) {
		console.log("Logging in")
		$http.get(database + "/user/"+name+"/password/"+password).success(function(result) {
			if(Object.size(result) == 0)
				$scope.hideError = false;
			else {
				if (result.id != 0909)
					$scope.hideError = false;
				else {
					Session['id'] = result.id.toString();
					Session['type'] = "admin";
					$location.path("/admin")
				}
	  		}
	  		})
	  	}
  }]);

appControllers.controller('loginCtrl', ['$scope', '$http', '$location', 'Session',
  function ($scope, $http, $location, Session) {
	$scope.Session = Session;
	$scope.hideError = true;
	$scope.checkLogin = function(name, password) {
		$http.get(database + "/user/"+name+"/password/"+password).success(function(result) {
			if(Object.size(result) == 0)
				$scope.hideError = false;
			else {
				Session['id'] = result.id; 
				Session['type'] = "client";
				Session['name'] = name
				$location.path("/skillMatrix/"+Session.id)
			}
		})
	}
}]);
	
appControllers.controller('adminCtrl', ['$scope', '$http','$location', 'Session', 'navigate',
  function ($scope, $http, $location, Session, navigate) {
	if (Session.id != 0909)
		$location.path("/login")
	$scope.Session = Session;
	console.log($scope.Session)
	$scope.navigate = navigate;
	$scope.deleteForm = {};
	$scope.hideGroupForm = true;
	$scope.hideDeleteForm = true;
	$scope.newGroupSkills = {};
	$scope.addingSkill = {};
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
			$scope.addingSkill[group] = "";
		})
	}
	
	$scope.openGroupForm = function() {
		console.log("Opening add group form");
		$scope.hideGroupForm = false;
	}
	
	$scope.addSkillToNewGroup = function(skill) {
		$scope.newGroupSkills[skill] = skill
		$scope.newGroupSkill = "";
	}
	
	$scope.addGroup = function(name) {
		for (skill in $scope.newGroupSkills) {
			$scope.addSkill(skill, name)
		}
		$scope.hideGroupForm = true;
		$scope.newGroupSkills = {};
		$scope.newGroupName = "";
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
}])


appControllers.controller('personalMatrixCtrl', ['$scope', '$http', '$routeParams', 'Session', 'navigate',
  function ($scope, $http, $routeParams, Session, navigate) {
	$scope.hideSaveSuccess = true;
	$scope.navigate = navigate;
	$scope.Session = Session;
	var accountID = $routeParams.id
	//if(!(Session.id == accountID || Session.id == 0909))
		//navigate.login()
	
	$http.get(database + "/user/"+accountID+"/remark").success(function(result) {
		console.log(result)
		$scope.remarks = result.remark
	})
	$http.get(database + '/user/'+ accountID + '/name').success(function(data) {
		$scope.account_name = data.name
	})
	$scope.skillLevels = ["Basic","Moderate","Advanced","Strong","Expert"] //["none", "weak", "average", "strong", "expert"]
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
	
	$scope.saveMatrix = function() {
		$http.post(database + "/addRemark/"+accountID+"/"+$scope.remarks).success(function(result) {
			$scope.hideSaveSuccess = false;
			console.log(result)
		})
	}	
	
	$scope.print = function(){
		window.print()
	}
}]);