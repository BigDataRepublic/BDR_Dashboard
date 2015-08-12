var accountInfo = ["password", "email", "telephone"];

function parseDate(date) {
	function padding(number) {
		if (number < 10)
			return "0"+number.toString();
		else
			return number.toString();
	}
	return date.getFullYear()+"-"+padding(parseInt(date.getMonth())+1)+"-"+padding(parseInt(date.getDate()))
}

appControllers.controller('accountManagementCtrl', ['$scope', '$http', '$location', '$routeParams', 'Session', 'navigate',
function ($scope, $http, $location, $routeParams, Session, navigate) {
	$scope.Session = Session;
	var id = $routeParams.id
	if(!(Session.id == id || Session.id == 0909))
		navigate.login()
	$scope.navigate = navigate;
	$scope.hideSaveSuccess = true;
	
	$http.get(database + "/user/" + id).success(function(data) {
		console.log(data)
		$scope.accountInfo = {"e-mail": data.email, "telephone": data.phone}
	});
	
	$scope.editAccount = function() {
		$http.post(database + "/editAccount/"+id+"/phone/"+$scope.accountInfo.telephone+"/email/"+$scope.accountInfo['e-mail']).success(function(result){
			console.log(result);
			$scope.hideSaveSuccess = false;
			setTimeout(function(){
				console.log("timeout ended")
				$scope.hideSaveSuccess = true;
			}, 2000)
		})
	}
}])

appControllers.controller('accountsCtrl', ['$scope', '$http', '$location', 'Session', 'navigate',
function ($scope, $http, $location, Session, navigate) {
	if (Session.id != 0909)
		$location.path("/login")
	$scope.Session = Session;
	console.log(Session);
	$scope.navigate = navigate;
	$scope.hideDeleteConfirmation = true;
	$scope.hideAccountForm = true;
	$scope.accountInfo = accountInfo
	
	$http.get(database + "/accounts").success(function(data) {
		$scope.accounts = data;
		console.log(data)
	});
	
	$scope.openDeleteConfirmation = function(account) {
		$scope.accountToDelete = account;
		$scope.hideDeleteConfirmation = false;
	}
	
	$scope.closeDelteConfirmation = function() {
		$scope.hideDeleteConfirmation = true;
	}
	
	$scope.deleteItem = function() {
		$http.post(database + "/deleteAccount/" + $scope.accountToDelete).success(function(result) {
			console.log(result)
		})
		$scope.hideDeleteConfirmation = true;
		delete $scope.accounts[$scope.accountToDelete]
	}
	
	$scope.openAccountForm = function() {
		$scope.hideAccountForm = false;
	}
	
	$scope.closeAccountForm = function() {
		$scope.hideAccountForm = true;
	}
	
	$scope.createAccount = function(accountInfo) {
		$http.post(database + "/addUser/"+accountInfo.name+"/"+accountInfo.password+"/"+accountInfo.email+"/"+accountInfo.telephone).success(function(result) {
			var today = new Date()
			$scope.accounts[accountInfo.name] = {"date": parseDate(today), "phone": accountInfo.telephone, "email": accountInfo.email}
		});
		console.log(accountInfo)
		$scope.closeAccountForm();
	}
}]);