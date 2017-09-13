'use strict';
angular.module('volunteerApp')

.controller('IndexController', ['$scope', 'organizationFactory', function($scope, organizationFactory) {
    
	//Reading organizations
    $scope.organizations = [];
    organizationFactory.getOrganizations()
    .then(
        function(response) {
            $scope.organizations = response.data;
            console.log("Organizações lidas com sucesso");
        },
        function(response) {
            console.log("Erro na leitura das organizações: "+response.status + " " + response.statusText);
        }
    );
}])

.controller('RegisterController', ['$scope', '$location', 'organizationFactory', 'userPersistenceFactory', function($scope, $location, organizationFactory, userPersistenceFactory) {
    
	//Creating the religions array
    var religions = [{value:"Sem religião", label:"Sem religião"},
                     {value:"Católica", label:"Católica"}, 
                     {value:"Evangélica",label:"Evangélica"},
                     {value:"Espírita",label:"Espírita"},
                     {value:"Ateu",label:"Ateu"}];
    $scope.religions = religions;

    //Putting a change listener on file chooser
    var imageURL = "";
	jQuery('#fileInput').on('change', function (event) {
		
		//Multiple files case
//		var files = event.target.files;
//		if(files) {
		//Single file case
		var imageFile = event.target.files[0];
		if(imageFile) {
			//Multiple files case
//			var fileName = img.name;// not path
//			var numberOfFiles = files.length;
//	        if(numberOfFiles > 1) {
//		        jQuery('#fileChooserText').text(numArquivos + ' arquivos selecionados');
//	        } 
//	        else {
//				jQuery('#fileChooserText').text(fileName);
//	        }
			//Single file case
			jQuery('#fileChooserText').text(imageFile.name);
			
			//Parsing file
			var reader = new FileReader();
			reader.onloadend = function (event) {
				imageURL = event.target.result;
				jQuery("#imageDiv > img").remove();
				jQuery("#imageDiv").append("<img id=\"theImg\" width=\"200\" src=\"" + imageURL + "\"/>");
			};
			reader.readAsDataURL(imageFile);
		}
    });
    
	//Putting a mask on phone input
	jQuery("#phone").mask("(99) 9999?9-9999");
	
	//Putting a blur listener on phone input to remove the last space if the number doesn`t have nine digits
	jQuery("#phone").on("blur", function() {

		var last = $(this).val().substr( $(this).val().indexOf("-") + 1 );
	    
	    if( last.length == 3 ) {
	        var move = $(this).val().substr( $(this).val().indexOf("-") - 1, 1 );
	        var lastfour = move + last;
	        
	        var first = $(this).val().substr( 0, 9 );
	        
	        $(this).val( first + '-' + lastfour );
	    }
	});
	
	//Defining function to register an organization
	$scope.registerOrganization = function() {

		//Registering organization
		if(userPersistenceFactory.getUser() == null) {
			$scope.organization.image = imageURL;
	    	organizationFactory.postOrganization($scope.organization)
	    	.then(
    	        function(response) {
    	        	console.log("Cadastro realizado com sucesso");
    	            //Directing to home page
    	            $location.path('/');
    	        },
    	        function(response) {
    	        	console.log("Erro no cadastro: " + response.status + " " + response.statusText);
    	            //Directing to home page
    	            $location.path('/');
    	        }
    	    );
		}
		//Updating organization
		else {
			if(imageURL != "")
				$scope.organization.image = imageURL;
	    	organizationFactory.updateOrganization($scope.organization)
	    	.then(
    	        function(response) {
    	        	console.log("Atualização da organização realizada com sucesso");
    	            //Directing to home page
    	            $location.path('/');
    	        },
    	        function(response) {
    	        	console.log("Erro na atualização da organização: " + response.status + " " + response.statusText);
    	            //Directing to home page
    	            $location.path('/');
    	        }
    	    );

		}
//    	//Refreshing page
//        $scope.organization = {
//    	      id:"",
//    	      email:"",
//    	      password:"",
//    	      passwordConfirmation:"",
//    	      name:"",
//    	      acronym:"",
//    	      image:"",
//    	      religion:"",
//    	      description:"",
//    	      address:"",
//    	      phone:"",
//    	      activities:[]
//        };
//        $scope.organizationForm.$setPristine();
//        jQuery('#fileChooserText').text("Nenhum arquivo selecionado");
//        jQuery("#imageDiv > img").remove();
    };
    
    //Filling logged user controls
    if(!(userPersistenceFactory.getUser() == null)) {
    	var loggedOrganization;
		var organizationIndex = userPersistenceFactory.getUser();
		organizationFactory.getOrganization(organizationIndex)
	    .then(
	        function(response) {
	        	$scope.organization = response.data;
	    		jQuery("#registerBreadcrumb").text("Editar");
	    		jQuery("#registerTitle").text("Edite o cadastro da sua organização");
		        jQuery('#fileChooserText').text("Veja a imagem atual ao lado");
	    		jQuery("#imageDiv > img").remove();
				jQuery("#imageDiv").append("<img id=\"theImg\" width=\"200\" src=\"" + $scope.organization.image + "\"/>");
	    		jQuery("#registerSubmitButton").text("Editar");
	            console.log("Organização logada lida com sucesso");
	        },
	        function(response) {
	        	console.log("Erro na leitura da organização logada: " + response.status + " " + response.statusText);
	        }
	    );
    }
}])

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
}])

.controller('ActivitiesController', ['$scope', '$state', 'organizationFactory', 'userPersistenceFactory', function($scope, $state, organizationFactory, userPersistenceFactory) {
    
    //Loading logged user
    if(!(userPersistenceFactory.getUser() == null)) {
		var organizationIndex = userPersistenceFactory.getUser();
		organizationFactory.getOrganization(organizationIndex)
	    .then(
	        function(response) {
	        	$scope.organization = response.data;
	            console.log("Organização lida com sucesso para atividades");
	        },
	        function(response) {
	        	console.log("Erro na leitura da organização para atividades: " + response.status + " " + response.statusText);
	        }
	    );
    }
    
    //Defining function to register an activity in a organization
    $scope.creatingActivity = {name:"" };
	$scope.pushActivity = function() {

		//Pushing activity
        $scope.organization.activities.push($scope.creatingActivity);
		
		//Updating organization
    	organizationFactory.updateOrganization($scope.organization)
    	.then(
	        function(response) {
	        	console.log("Atualização das atividades realizada com sucesso");
	        },
	        function(response) {
	        	console.log("Erro na atualização das atividades: " + response.status + " " + response.statusText);
	        }
	    );

    	//Refreshing form
    	$scope.creatingActivity = {name:""};
        $scope.activityForm.$setPristine();
    };

    //Defining function to delete an activity in a organization
	$scope.removeActivity = function(index) {

		//Pushing activity
        $scope.organization.activities.splice(index, 1);
		
		//Updating organization
    	organizationFactory.updateOrganization($scope.organization)
    	.then(
	        function(response) {
	        	console.log("Remoção de atividade realizada com sucesso");
	        },
	        function(response) {
	        	console.log("Erro na remoção de atividade: " + response.status + " " + response.statusText);
	        }
	    );
    };
    
    //Defining function to show updating activity modal
    $scope.showUpdatingActivityModal = function(index) {
    	jQuery("#activityIndex").val(index);
        $scope.updatingActivity = $scope.organization.activities[index];
        jQuery("#updatingActivityName").val($scope.updatingActivity.name);
    	jQuery("#activityModal").modal('show');
	};
	
    //Defining function to update an activity in a organization
    $scope.updateActivity = function() {

    	//Getting updating activity index
    	var index = jQuery("#activityIndex").val();
    	
		//Updating activity
        $scope.organization.activities[index] = $scope.updatingActivity;
		
		//Updating organization
    	organizationFactory.updateOrganization($scope.organization)
    	.then(
	        function(response) {
	        	console.log("Atualização realizada com sucesso na atividade de índice = " + index);
	    		
	    		//Dismissing activity modal
	    		jQuery("#activityModal").modal('hide');

	    		//Refresh page
	    		setTimeout(function(){$state.reload();}, 250);
	        },
	        function(response) {
	        	console.log("Erro na atualização: " + response.status + " " + response.statusText);
	    		//Dismissing activity modal
	    		jQuery("#activityModal").modal('hide');
	        }
	    );

    	//Refreshing form
        $scope.updatingActivityForm.$setPristine();
    };
}]);