'use strict';
angular.module('volunteerApp')

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

    //Setting form default values
    $scope.creatingActivity = {
		name:"", 
		category:"Educação", 
		description:"", 
		periodicity:"Semanal", 
		monday:true, 
		tuesday:true,  
		wednesday:true,  
		thursday:true,  
		friday:true,  
		saturday:true,  
		sunday:true, 
		beginningTime:"12:00", 
		endingTime:"13:00"
	};
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

    //Defining function to register an activity in a organization
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
//		//Updating activity
//    	organizationFactory.updateActivity($scope.organization._id, $scope.creatingActivity)
//    	.then(
//	        function(response) {
//	        	console.log("Atualização das atividades realizada com sucesso");
//	        	
//	        	//Refreshing form
//	        	$scope.creatingActivity = {name:"", category:"Educação", description:"", periodicity:"Semanal", monday:true, tuesday:true, 
//	        			wednesday:true,  thursday:true,  friday:true,  saturday:true,  sunday:true, beginningTime:"12:00", endingTime:"13:00"};
//	            $scope.activityForm.$setPristine();
//
//	            //Refresh page
//	    		setTimeout(function(){$state.reload();}, 250);
//	        },
//	        function(response) {
//	        	console.log("Erro na atualização das atividades: " + response.status + " " + response.statusText);
//	        }
//	    );
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