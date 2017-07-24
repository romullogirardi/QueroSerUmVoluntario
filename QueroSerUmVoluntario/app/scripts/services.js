'use strict';
angular.module('volunteerApp')

.constant("baseURL","http://localhost:3000/")

.service('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {

	this.getDishes = function(){
        return $resource(baseURL+"dishes/:id", null, {'update':{method:'PUT' }});
    };

    this.getPromotions = function(){
        return $resource(baseURL+"promotions/:id", null, {'update':{method:'PUT' }});
    };
}])

.service('organizationFactory', ['$resource', 'baseURL', function($resource,baseURL) {

	this.getOrganizations = function(){
        return $resource(baseURL+"organizations/:id", null, {'update':{method:'PUT' }});
    };
}])

.service('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {

	this.getLeaderships = function(){
        return $resource(baseURL+"leadership/:id", null, {'update':{method:'PUT' }});
    };
}])

.service('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {

	this.getFeedbacks = function(){
        return $resource(baseURL+"feedback/:id", null, {'update':{method:'PUT' }});
    };
}]);