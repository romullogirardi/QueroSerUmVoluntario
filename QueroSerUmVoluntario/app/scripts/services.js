'use strict';
angular.module('volunteerApp')

.constant("baseURL","http://localhost:3000/")

.service('organizationFactory', ['$http', 'baseURL', function($http, baseURL) {

	this.getOrganizations = function(){
        return $http.get(baseURL + "organizations");
    };
    
    this.getOrganization = function(index) {
        return $http.get(baseURL + "organizations/" + index);
    };

    this.postOrganization = function(organization) {
        return $http.post(baseURL + "organizations", organization);
    };

    this.updateOrganization = function(organization) {
        return $http.put(baseURL + "organizations/" + organization.id, organization);
    };
    
    this.deleteOrganization = function(index) {
        return $http.delete(baseURL + "organizations/" + index);
    };
}])

.service("userPersistenceFactory", ['$cookies', function($cookies) {

	this.setUser = function(organizationIndex) {
		$cookies.put("user", organizationIndex);
	};

	this.getUser = function() {
		return $cookies.get("user");
	};
	
	this.removeUser = function() {
		$cookies.remove("user");
	};
}]);