'use strict';
angular.module('volunteerApp')

.controller('LoginController', ['$scope', '$location', 'organizationFactory', 'userPersistenceFactory', function($scope, $location, organizationFactory, userPersistenceFactory) {
    
	//Reading organizations
    var organizations = [];
    organizationFactory.getOrganizations()
    .then(
        function(response) {
            organizations = response.data;
        },
        function(response) {
            console.log("Erro: "+response.status + " " + response.statusText);
        }
    );
    
    //Login method
    jQuery("#loginErrorMessage").hide();
    $scope.login = function() {
    	
    	var loginEmail = jQuery("#loginEmail").val();
    	var loginPassword = jQuery("#loginPassword").val();
    	var loginOk = false;
    	var organizationLogged;
    	for(var index = 0; index < organizations.length; index++) {
    		var organization = organizations[index];
    		if(organization.email == loginEmail && organization.password == loginPassword) {
    			loginOk = true;
    			organizationLogged = organization;
    			break;
    		}
    	}
    	
    	if(loginOk) {
    		//Starting user session
    		userPersistenceFactory.setUser(organizationLogged.id);
    		
    		//Load logged user acronym to refresh the user greeting
    		loadLoggedUserAcronym();

    		//Hidind error message
    		jQuery("#loginErrorMessage").hide();
    		
    		//Dismissing login modal
    		jQuery("#loginModal").modal('hide');
    		
    		//Directing to home page
            $location.path('/');
    	}
    	else {
    		//Showing error message
    		jQuery("#loginErrorMessage").show();
    	}
    	
    	//Refreshing form
    	jQuery("#loginEmail").val("");
    	jQuery("#loginPassword").val("");
    };
    
    $scope.logout = function() {
		//Finishing user session
    	userPersistenceFactory.removeUser();
    	
    	//Directing to home page
        $location.path('/');
	}
    
    //Forget password method
    $scope.forgetPassword = function() {
		console.log("Cliquei no Esqueci minha senha");
	};
	
	//Logged user methods
	$scope.hasLoggedUser = function() {
		return !(userPersistenceFactory.getUser() == null);
	};

	loadLoggedUserAcronym();
	function loadLoggedUserAcronym() {
		if(!(userPersistenceFactory.getUser() == null)) {
			var organizationIndex = userPersistenceFactory.getUser();
			organizationFactory.getOrganization(organizationIndex)
		    .then(
		        function(response) {
		        	$scope.loggedUserAcronym = response.data.acronym;
		        	console.log("Acrônimo lido com sucesso");
		        },
		        function(response) {
		        	console.log("Erro na leitura do acrônimo: " + response.status + " " + response.statusText);
		        }
		    );
		}
	};
}]);
