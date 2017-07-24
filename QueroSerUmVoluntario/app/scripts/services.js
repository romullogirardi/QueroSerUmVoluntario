'use strict';
angular.module('volunteerApp')

.constant("baseURL","http://localhost:3000/")

.service('organizationFactory', ['$resource', 'baseURL', function($resource,baseURL) {

	this.getOrganizations = function(){
        return $resource(baseURL+"organizations/:id", null, {'update':{method:'PUT' }});
    };
}]);