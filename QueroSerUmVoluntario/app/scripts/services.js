'use strict';
angular.module('volunteerApp')

.constant("baseURL","http://localhost:3000/")

.service('organizationFactory', ['$http', 'baseURL', function($http, baseURL) {

	this.getOrganizations = function(){
//        return $http.get(baseURL + "organizations");
		return $http.get('server_php/organizationAction.php', {
            params:{
                'type':'view'
            }
        });
    };
    
    this.getOrganization = function(organizationId) {
        return $http.get(baseURL + "organizations/" + organizationId);
    };

    this.postOrganization = function(organization) {
        return $http({
        	method: 'POST',
        	url: baseURL + "organizations",
        	headers: {"Content-Type": "application/x-www-form-urlencoded"},
        	transformRequest: function(obj) {
                var str = [];
                for(var p in obj) {
                	console.log(obj[p]);
                	str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            },
        	data: organization
        });
    };

    this.updateOrganization = function(organization) {
        return $http({
        	method: 'POST',
        	url: baseURL + "organizations/" + organization._id,
        	headers: {"Content-Type": "application/x-www-form-urlencoded"},
        	transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
        	data: organization
        });
    };
    
    this.deleteOrganization = function(organizationId) {
        return $http.delete(baseURL + "organizations/" + organizationId);
    };

//    this.getActivities = function(organizationId){
//        return $http.get(baseURL + "organizations/" + organizationId + "/activities");
//    };
//    
//    this.getActivitiy = function(organizationId, activityId) {
//        return $http.get(baseURL + "organizations/" + organizationId + "/activities/" + activityId);
//    };
//
//    this.postActivitiy = function(organizationId, activity) {
//        return $http({
//        	method: 'POST',
//        	url: baseURL + "organizations/" + organizationId + "/activities",
//        	headers: {"Content-Type": "application/x-www-form-urlencoded"},
//        	transformRequest: function(obj) {
//                var str = [];
//                for(var p in obj) {
//                	console.log(obj[p]);
//                	str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//                }
//                return str.join("&");
//            },
//        	data: activity
//        });
//    };
//
//    this.updateActivity = function(organizationId, activityId, activity) {
//        return $http({
//        	method: 'POST',
//        	url: baseURL + "organizations/" + organizationId + "/activities/" + activityId,
//        	headers: {"Content-Type": "application/x-www-form-urlencoded"},
//        	transformRequest: function(obj) {
//                var str = [];
//                for(var p in obj)
//                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//                return str.join("&");
//            },
//        	data: activity
//        });
//    };
//    
//    this.deleteActivitiy = function(organizationId, activityId) {
//        return $http.delete(baseURL + "organizations/" + organizationId + "/activities/" + activityId);
//    };
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