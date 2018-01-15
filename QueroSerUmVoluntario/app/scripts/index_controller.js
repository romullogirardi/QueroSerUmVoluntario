'use strict';
angular.module('volunteerApp')

.controller('IndexController', ['$scope', '$state', '$location', 'organizationFactory', function($scope, $state, $location, organizationFactory) {
    
	//////////////////////////////////////////////////////////////////// FILTER INITIALIZATION ////////////////////////////////////////////////////////////////////
	//Setting filterVisibility
	$scope.showFilter = false;
	//Creating filter categories array
    var categories = [
   	     {value:"Todas", label:"Todas"},
	     {value:"Educação", label:"Educação"},
	     {value:"Recreação infantil", label:"Recreação infantil"}, 
	     {value:"Distribuição de alimentos",label:"Distribuição de alimentos"},
	     {value:"Artesanato",label:"Artesanato"},
	     {value:"Esporte",label:"Esporte"}
	];
    $scope.categories = categories;
    //Creating filter periodicities array
    var periodicities = [
   	     {value:"Todas", label:"Todas"},
	     {value:"Semanal", label:"Semanal"},
	     {value:"Mensal", label:"Mensal"}, 
	     {value:"Semestral",label:"Semestral"},
	     {value:"Anual",label:"Anual"}
	];
    $scope.periodicities = periodicities;
	//Creating filter religions array
    var religions = [
   	     {value:"Todas", label:"Todas"},
	     {value:"Sem religião", label:"Sem religião"},
	     {value:"Católica", label:"Católica"}, 
	     {value:"Evangélica",label:"Evangélica"},
	     {value:"Espírita",label:"Espírita"},
	     {value:"Ateu",label:"Ateu"}
	];
    $scope.religions = religions;
    //Creating filter neighborhoods array
    var neighborhoods = [
	     {value:"Todos", label:"Todos"},
	     {value:"Centro", label:"Centro"},
	     {value:"Barra da Tijuca", label:"Barra da Tijuca"}, 
	     {value:"Recreio dos Bandeirantes",label:"Recreio dos Bandeirantes"},
	     {value:"Taquara",label:"Taquara"},
	     {value:"Urca",label:"Urca"}
	];
    $scope.neighborhoods = neighborhoods;

    //Setting filter form default values
    $scope.filter = {
		category:"Todas", 
		periodicity:"Todas",
		religion:"Todas",
		monday:true, 
		tuesday:true, 
		wednesday:true,
		thursday:true, 
		friday:true,  
		saturday:true,  
		sunday:true, 
		beginningTime:"", 
		endingTime:"", 
		neighborhood:"Todos"
    };
    //Setting filter time pickers
    jQuery('#filterBeginningTime').timepicker({
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
    jQuery('#filterEndingTime').timepicker({
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
    //Setting filter button actions
	$scope.toogleFilter = function() {
		$scope.showFilter = !$scope.showFilter;
		if($scope.showFilter) {
			jQuery("#filterButtonIcon").attr("class", "glyphicon glyphicon-chevron-up");
			jQuery("#filterButton").attr("class", "btn btn-basic");
		}
		else {
			jQuery("#filterButtonIcon").attr("class", "glyphicon glyphicon-chevron-down");
			jQuery("#filterButton").attr("class", "btn btn-primary");
			$scope.reloadTable(false);
		}
	};

	///////////////////////////////////////////////////////////////////////////// TABLE INITIALIZATION //////////////////////////////////////////////////////////////////////////////
    var table;
    var dataSet = [];
	//Reading organizations
    organizationFactory.getOrganizations()
    .then(
        function(response) {
        	
        	//Reading organizations from json server
            $scope.organizations = response.data;
            console.log($scope.organizations);
            
            //Mounting dataset to load into table
            for(var organizationIndex = 0; organizationIndex < $scope.organizations.length; organizationIndex++) {
            	if($scope.organizations[organizationIndex].activities) {
	            	for(var activityIndex = 0; activityIndex < $scope.organizations[organizationIndex].activities.length; activityIndex++) {
	                	dataSet.push([
							$scope.organizations[organizationIndex].id,
							activityIndex,
  							$scope.organizations[organizationIndex].activities[activityIndex].category,
							$scope.organizations[organizationIndex].activities[activityIndex].periodicity,
							$scope.organizations[organizationIndex].religion,
							daysToString($scope.organizations[organizationIndex].activities[activityIndex]),
   							hourToString($scope.organizations[organizationIndex].activities[activityIndex]),
							$scope.organizations[organizationIndex].acronym, 
							$scope.organizations[organizationIndex].neighborhood
	                    ]);
	            	}
            	}
            }
            
            console.log("Organizações/Atividades lidas com sucesso");

            //Loading table (https://datatables.net/examples/basic_init/zero_configuration.html)
            if (jQuery.fn.dataTable.isDataTable('#table')) {
                table = jQuery('#table').DataTable();
            }
            else {
                table = jQuery('#table').DataTable( {
                    "order": [[ 0, "asc" ]],
                    "scrollX": true,
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
                        {title: "organizationID"},
                        {title: "activityIndex"},
                        {title: "Categoria"},
                        {title: "Periodicidade"},
                        {title: "Religião"},
                        {title: "Dias da semana"},
                        {title: "Horário"},
                        {title: "Organização"},
                        {title: "Bairro"}
                    ],
                    "columnDefs": [
                       {
                           "targets": [0],
                           "visible": false,
                           "searchable": false
                       },
                       {
                           "targets": [1],
                           "visible": false,
                           "searchable": false
                       }
                   ]
                });
            }
            
            //Setting on click listener on table rows
            jQuery('#table tbody').on('click', 'tr', function () {
                var data = table.row( this ).data();
                for(var index = 0; index < $scope.organizations.length; index++) {
                	if($scope.organizations[index].id == data[0]) {
                		var organizationSelected = $scope.organizations[index];
                		//Directing to activity details page (TODO)
                        $location.path('register');
                		alert( 'Você clicou na atividade ' + data[1] + " da organização " + organizationSelected.acronym);
                		break;
                	}
                }
            });
        },
        function(response) {
            console.log("Erro na leitura das Organizações/Atividades: "+response.status + " " + response.statusText + response);
        }
    );
    
    //////////////////////////////////////////////////////////////////////// RELOAD TABLE METHOD ////////////////////////////////////////////////////////////////////////////////
	$scope.reloadTable = function(filter) {
		//Reading organizations
	    organizationFactory.getOrganizations()
	    .then(
	        function(response) {
	        	
	        	//Reading organizations from json server
	            $scope.organizations = response.data;
	            
	            //Mounting dataset to load into table
	            dataSet = [];
	            for(var organizationIndex = 0; organizationIndex < $scope.organizations.length; organizationIndex++) {
	            	if($scope.organizations[organizationIndex].activities) {
		            	for(var activityIndex = 0; activityIndex < $scope.organizations[organizationIndex].activities.length; activityIndex++) {
		            		var filterMatch = ($scope.filter.category == "Todas" || $scope.filter.category == $scope.organizations[organizationIndex].activities[activityIndex].category)
		            			&& ($scope.filter.periodicity == "Todas" || $scope.filter.periodicity == $scope.organizations[organizationIndex].activities[activityIndex].periodicity)
		            			&& ($scope.filter.religion == "Todas" || $scope.filter.religion == $scope.organizations[organizationIndex].religion)
		            			&& (($scope.filter.monday == $scope.organizations[organizationIndex].activities[activityIndex].monday)
		            			|| ($scope.filter.tuesday == $scope.organizations[organizationIndex].activities[activityIndex].tuesday)
		            			|| ($scope.filter.wednesday == $scope.organizations[organizationIndex].activities[activityIndex].wednesday)
		            			|| ($scope.filter.thursday == $scope.organizations[organizationIndex].activities[activityIndex].thursday)
		            			|| ($scope.filter.friday == $scope.organizations[organizationIndex].activities[activityIndex].friday)
		            			|| ($scope.filter.saturday == $scope.organizations[organizationIndex].activities[activityIndex].saturday)
		            			|| ($scope.filter.sunday == $scope.organizations[organizationIndex].activities[activityIndex].sunday))
		            			&& ($scope.filter.beginningTime.length == 0 || true)
		            			&& ($scope.filter.endingTime.length == 0 || true)
		            			&& ($scope.filter.neighborhood == "Todos" || $scope.filter.neighborhood == $scope.organizations[organizationIndex].neighborhood);
		            		var match = !filter || filterMatch;
		            		if(match) {
			                	dataSet.push([
									$scope.organizations[organizationIndex].id,
									activityIndex,
		  							$scope.organizations[organizationIndex].activities[activityIndex].category,
									$scope.organizations[organizationIndex].activities[activityIndex].periodicity,
									$scope.organizations[organizationIndex].religion,
									daysToString($scope.organizations[organizationIndex].activities[activityIndex]),
		   							hourToString($scope.organizations[organizationIndex].activities[activityIndex]),
									$scope.organizations[organizationIndex].acronym, 
									$scope.organizations[organizationIndex].neighborhood 
			                    ]);
		            		}
		            	}
	            	}
	            }
	            
	            console.log("Organizações/Atividades recarregadas com sucesso");
	            console.log(dataSet);
	            table.clear();
	            table.rows.add(dataSet);
	            table.draw();
	        },
	        function(response) {
	            console.log("Erro na leitura das Organizações/Atividades: "+response.status + " " + response.statusText);
	        }
	    );
	};

	////////////////////////////////////////////////////////////////////////// LOCAL METHODS ////////////////////////////////////////////////////////////////////////////////
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
}]);