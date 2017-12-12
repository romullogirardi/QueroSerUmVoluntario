'use strict';
angular.module('volunteerApp')

.controller('IndexController', ['$scope', 'organizationFactory', function($scope, organizationFactory) {
    
	//Reading organizations
    organizationFactory.getOrganizations()
    .then(
        function(response) {
        	
        	//Reading organizations from json server
            $scope.organizations = response.data;
            
            //Mounting dataset to load into table
            var dataSet = [];
            for(var organizationIndex = 0; organizationIndex < $scope.organizations.length; organizationIndex++) {
            	if($scope.organizations[organizationIndex].activities) {
	            	for(var activityIndex = 0; activityIndex < $scope.organizations[organizationIndex].activities.length; activityIndex++) {
	                	dataSet.push([
  							$scope.organizations[organizationIndex].activities[activityIndex].category,
							$scope.organizations[organizationIndex].activities[activityIndex].periodicity,
							daysToString($scope.organizations[organizationIndex].activities[activityIndex]),
   							hourToString($scope.organizations[organizationIndex].activities[activityIndex]),
							$scope.organizations[organizationIndex].acronym, 
							$scope.organizations[organizationIndex].address 
	                    ]);
	            	}
            	}
            }
            
            console.log("Organizações/Atividades lidas com sucesso");

           //Loading table (https://datatables.net/examples/basic_init/zero_configuration.html)
            if ($.fn.dataTable.isDataTable('#table')) {
                table = $('#table').DataTable();
            }
            else {
                table = $('#table').DataTable( {
                    "order": [[ 0, "asc" ]],
                    "language": {
                    	"sEmptyTable": "Nenhum registro encontrado",
                        "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                        "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
                        "sInfoFiltered": "(Filtrados de _MAX_ registros)",
                        "sInfoPostFix": "",
                        "sInfoThousands": ".",
                        "sLengthMenu": "_MENU_ resultados por página",
                        "sLoadingRecords": "Carregando...",
                        "sProcessing": "Processando...",
                        "sZeroRecords": "Nenhum registro encontrado",
                        "sSearch": "Pesquisar",
                        "oPaginate": {
                            "sNext": "Próximo",
                            "sPrevious": "Anterior",
                            "sFirst": "Primeiro",
                            "sLast": "Último"
                        },
                        "oAria": {
                            "sSortAscending": ": Ordenar colunas de forma ascendente",
                            "sSortDescending": ": Ordenar colunas de forma descendente"
                        }
                    },
                    "data": dataSet,
                    "columns": [
                        {title: "Categoria"},
                        {title: "Periodicidade"},
                        {title: "Dias da semana"},
                        {title: "Horário"},
                        {title: "Organização"},
                        {title: "Endereço"}
                    ]
                });
            }
        },
        function(response) {
            console.log("Erro na leitura das Organizações/Atividades: "+response.status + " " + response.statusText);
        }
    );
    
    function daysToString(activity) {

    	var toString = "";
    	toString += (activity.monday) ? "S" : "";
    	var separator = (toString.length == 0) ? "" : " ";
    	toString += (activity.tuesday) ? (separator + "T") : "";
    	var separator = (toString.length == 0) ? "" : " ";
    	toString += (activity.wednesday) ? (separator + "Q") : "";
    	var separator = (toString.length == 0) ? "" : " ";
    	toString += (activity.thursday) ? (separator + "Q") : "";
    	var separator = (toString.length == 0) ? "" : " ";
    	toString += (activity.friday) ? (separator + "S") : "";
    	var separator = (toString.length == 0) ? "" : " ";
    	toString += (activity.saturday) ? (separator + "S") : "";
    	var separator = (toString.length == 0) ? "" : " ";
    	toString += (activity.sunday) ? (separator + "D") : "";
    	return toString;
    };
    
    function hourToString(activity) {
		return activity.beginningTime + " - " + activity.endingTime;
	};
 }])

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
	    id:"",
	    email:"",
	    password:"",
	    passwordConfirmation:"",
	    name:"",
	    acronym:"",
	    image:"",
	    religion:"Sem religião",
	    description:"",
	    address:"",
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
    
	//Creating the categories array
    var categories = [
	     {value:"Educação", label:"Educação"},
	     {value:"Recreação infantil", label:"Recreação infantil"}, 
	     {value:"Distribuição de alimentos",label:"Distribuição de alimentos"},
	     {value:"Artesanato",label:"Artesanato"},
	     {value:"Esporte",label:"Esporte"}
	];
    $scope.categories = categories;

    //Creating the periodicities array
    var periodicities = [
	     {value:"Semanal", label:"Semanal"},
	     {value:"Mensal", label:"Mensal"}, 
	     {value:"Semestral",label:"Semestral"},
	     {value:"Anual",label:"Anual"}
	];
    $scope.periodicities = periodicities;

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
    $scope.creatingActivity = {name:"", category:"Educação", description:"", periodicity:"Semanal", monday:true, tuesday:true,  
    		wednesday:true,  thursday:true,  friday:true,  saturday:true,  sunday:true, beginningTime:"12:00", endingTime:"13:00"};
    //Referência: http://timepicker.co/
    jQuery('#beginningTime').timepicker({
        timeFormat: 'HH:mm',
        interval: 30,
        minTime: '00',
        maxTime: '23:30',
        defaultTime: '12',
        startTime: '00:00',
        dynamic: true,
        dropdown: true,
        scrollbar: true
    });
    jQuery('#endingTime').timepicker({
        timeFormat: 'HH:mm',
        interval: 30,
        minTime: '00',
        maxTime: '23:30',
        defaultTime: '13',
        startTime: '00:00',
        dynamic: true,
        dropdown: true,
        scrollbar: true
    });
    //Referência: http://jonthornton.github.io/jquery-timepicker/
//    jQuery('#beginningTime').timepicker();
//    jQuery('#endingTime').timepicker();

	$scope.pushActivity = function() {

		//Getting time values
		$scope.creatingActivity.beginningTime = jQuery('#beginningTime').val();
		$scope.creatingActivity.endingTime = jQuery('#endingTime').val();
		
		//Pushing activity
        $scope.organization.activities.push($scope.creatingActivity);
		
		//Updating organization
    	organizationFactory.updateOrganization($scope.organization)
    	.then(
	        function(response) {
	        	console.log("Atualização das atividades realizada com sucesso");
	        	
	        	//Refreshing form
	        	$scope.creatingActivity = {name:"", category:"Educação", description:"", periodicity:"Semanal", monday:true, tuesday:true, 
	        			wednesday:true,  thursday:true,  friday:true,  saturday:true,  sunday:true, beginningTime:"12:00", endingTime:"13:00"};
	            $scope.activityForm.$setPristine();

	            //Refresh page
	    		setTimeout(function(){$state.reload();}, 250);
	        },
	        function(response) {
	        	console.log("Erro na atualização das atividades: " + response.status + " " + response.statusText);
	        }
	    );
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
    
    //Defining function to set updating index using a hidden form input (because modals have sync problems with angularJS)
    $scope.setUpdatingActivityIndex = function(index) {
    	console.log("Setou index = " + index);
    	jQuery("#activityIndex").val(index);
	};
	
	//Defining function to get updating index using a hidden form input (because modals have sync problems with angularJS)
	$scope.getActivityIndex = function() {
    	console.log("Leu index = " + jQuery("#activityIndex").val());
		return jQuery("#activityIndex").val();
	};
	
	jQuery('#activityModal').on('shown.bs.modal', function (e) {
		jQuery('#updatingActivityBeginningTime').timepicker({
		    timeFormat: 'HH:mm',
		    interval: 30,
		    minTime: '00',
		    maxTime: '23:30',
		    defaultTime: '12',
		    startTime: '00:00',
		    dynamic: true,
		    dropdown: true,
		    scrollbar: true,
		    zindex: 9999
		});
		jQuery('#updatingActivityBeginningTime').val($scope.organization.activities[jQuery("#activityIndex").val()].beginningTime);
		jQuery('#updatingActivityEndingTime').timepicker({
	        timeFormat: 'HH:mm',
	        interval: 30,
	        minTime: '00',
	        maxTime: '23:30',
	        defaultTime: '13',
	        startTime: '00:00',
	        dynamic: true,
	        dropdown: true,
	        scrollbar: true,
	        zindex: 9999
	    });
		jQuery('#updatingActivityEndingTime').val($scope.organization.activities[jQuery("#activityIndex").val()].endingTime);
//		jQuery('#updatingActivityBeginningTime').timepicker();
//		jQuery('#updatingActivityEndingTime').timepicker();
	});
	
    //Defining function to update an activity in a organization
    $scope.updateActivity = function() {

		//Getting time values
		$scope.organization.activities[jQuery("#activityIndex").val()].beginningTime = jQuery('#updatingActivityBeginningTime').val();
		$scope.organization.activities[jQuery("#activityIndex").val()].endingTime = jQuery('#updatingActivityEndingTime').val();
    	
		//Updating organization
    	organizationFactory.updateOrganization($scope.organization)
    	.then(
	        function(response) {
	        	console.log("Atualização da atividade realizada com sucesso");
	    		
	    		//Dismissing activity modal
	    		jQuery("#activityModal").modal('hide');

	    		//Refresh page
	    		setTimeout(function(){$state.reload();}, 250);
	        },
	        function(response) {
	        	console.log("Erro na atualização da atividade: " + response.status + " " + response.statusText);

	        	//Dismissing activity modal
	    		jQuery("#activityModal").modal('hide');
	        }
	    );

    	//Refreshing form
        $scope.updatingActivityForm.$setPristine();
    };
    
    $scope.daysToString = function(activity) {
    	
    	var toString = "";
    	toString += (activity.monday) ? "Segundas" : "";
    	var separator = (toString.length == 0) ? "" : ", ";
    	toString += (activity.tuesday) ? (separator + "Terças") : "";
    	var separator = (toString.length == 0) ? "" : ", ";
    	toString += (activity.wednesday) ? (separator + "Quartas") : "";
    	var separator = (toString.length == 0) ? "" : ", ";
    	toString += (activity.thursday) ? (separator + "Quintas") : "";
    	var separator = (toString.length == 0) ? "" : ", ";
    	toString += (activity.friday) ? (separator + "Sextas") : "";
    	var separator = (toString.length == 0) ? "" : ", ";
    	toString += (activity.saturday) ? (separator + "Sábados") : "";
    	var separator = (toString.length == 0) ? "" : ", ";
    	toString += (activity.sunday) ? (separator + "Domingos") : "";
    	return toString;
    };
}]);