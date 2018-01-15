'use strict';
angular.module('volunteerApp')

.controller('RegisterController', ['$scope', '$location', 'organizationFactory', 'userPersistenceFactory', function($scope, $location, organizationFactory, userPersistenceFactory) {
    
	//Creating the religions array
    var religions = [
	     {value:"Sem religião", label:"Sem religião"},
	     {value:"Católica", label:"Católica"}, 
	     {value:"Evangélica",label:"Evangélica"},
	     {value:"Espírita",label:"Espírita"},
	     {value:"Ateu",label:"Ateu"}
	];
    $scope.religions = religions;

    //Creating the neighborhoods array
    var neighborhoods = [
	     {value:"Centro", label:"Centro"},
	     {value:"Barra da Tijuca", label:"Barra da Tijuca"}, 
	     {value:"Recreio dos Bandeirantes",label:"Recreio dos Bandeirantes"},
	     {value:"Taquara",label:"Taquara"},
	     {value:"Urca",label:"Urca"}
	];
    $scope.neighborhoods = neighborhoods;
    
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
	$scope.organization = {
	    email:"",
	    password:"",
	    passwordConfirmation:"",
	    name:"",
	    acronym:"",
	    image:"",
	    religion:"Sem religião",
	    description:"",
	    address:"",
	    neighborhood:"Centro",
	    phone:"",
	    activities:[]
	};
	$scope.registerOrganization = function() {

		//Registering organization
		if(userPersistenceFactory.getUser() == null) {
			$scope.organization.image = imageURL;
	    	organizationFactory.postOrganization($scope.organization)
	    	.then(
    	        function(response) {
    	        	console.log("Cadastro da organização realizado com sucesso");
    	            //Directing to home page
    	            $location.path('/');
    	        },
    	        function(response) {
    	        	console.log("Erro no cadastro da organização: " + response.status + " " + response.statusText);
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
}]);