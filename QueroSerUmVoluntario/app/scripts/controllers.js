'use strict';
angular.module('volunteerApp')

.controller('IndexController', ['$scope', 'organizationFactory', function($scope, organizationFactory) {
    $scope.message="Carregando ...";
    $scope.organization = organizationFactory.getOrganizations().get({id:0})
    .$promise.then(
        function(response){
            $scope.organization = response;
        },
        function(response) {
            $scope.message = "Erro: "+response.status + " " + response.statusText;
        }
    );
}])

.controller('RegisterController', ['$scope', 'organizationFactory', function($scope, organizationFactory) {
    $scope.registerOrganization = function() {
    	console.log($scope.organization);
    	organizationFactory.getOrganizations().save($scope.organization);
        $scope.organization = {
    	      id:"",
    	      email:"",
    	      password:"",
    	      name:"",
    	      acronym:"",
    	      image:"",
    	      religion:"",
    	      description:"",
    	      address:"",
    	      phone:"",
    	      activities:[]
        };
        $scope.organizationForm.$setPristine();
    }
}]);