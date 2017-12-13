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
}]);