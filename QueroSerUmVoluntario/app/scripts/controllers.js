'use strict';
angular.module('volunteerApp')

.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";
    $scope.dishes = [];
    menuFactory.getDishes().query(
        function(response) {
            $scope.dishes = response;
            $scope.showMenu = true;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
    });
    
    $scope.select = function(setTab) {
        $scope.tab = setTab;
        if (setTab === 2) {
            $scope.filtText = "appetizer";
        }
        else if (setTab === 3) {
            $scope.filtText = "mains";
        }
        else if (setTab === 4) {
            $scope.filtText = "dessert";
        }
        else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };
    
    $scope.toggleDetails = function() {
        $scope.showDetails = !$scope.showDetails;
    };
}])

.controller('ContactController', ['$scope', function($scope) {
    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
    var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
    $scope.channels = channels;
    $scope.invalidChannelSelection = false;
}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {
    $scope.sendFeedback = function() {
        console.log($scope.feedback);
        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")&& !$scope.feedback.mychannel) {
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        }
        else {
            feedbackFactory.getFeedbacks.save($scope.feedback);
            $scope.invalidChannelSelection = false;
            $scope.feedback = {mychannel:"", firstName:"", lastName:"",
                               agree:false, email:"" };
            $scope.feedback.mychannel="";

            $scope.feedbackForm.$setPristine();
            console.log($scope.feedback);
        }
    };
}])

.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
    $scope.showDish = false;
    $scope.message="Loading ...";
    $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
    .$promise.then(
        function(response){
            $scope.dish = response;
            $scope.showDish = true;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
    
    $scope.filter = '';
    $scope.formatDate = function(string){

        var date = new Date(string);
        var monthNumber = date.getMonth();
        var monthToString = "";
        if(monthNumber == 0)
            monthToString = "Jan";
        else if(monthNumber == 1)
            monthToString = "Feb";
        else if(monthNumber == 2)
            monthToString = "Mar";
        else if(monthNumber == 3)
            monthToString = "Apr";
        else if(monthNumber == 4)
            monthToString = "May";
        else if(monthNumber == 5)
            monthToString = "Jun";
        else if(monthNumber == 6)
            monthToString = "Jul";
        else if(monthNumber == 7)
            monthToString = "Aug";
        else if(monthNumber == 8)
            monthToString = "Sep";
        else if(monthNumber == 9)
            monthToString = "Oct";
        else if(monthNumber == 10)
            monthToString = "Nov";
        else
            monthToString = "Dec";
        return monthToString + ', ' + date.getDate() + ', ' + date.getFullYear();
    }; 
    
    $scope.feedback = {author:"", rating:"5", comment:"", date:"" };
    $scope.sendFeedback = function() {
        $scope.feedback.date = new Date().toISOString();
        $scope.dish.comments.push($scope.feedback);
        menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);                           
/*
        console.log($scope.feedback);
        console.log($scope.dish);
*/
        $scope.feedback = {author:"", rating:"5", comment:"", date:"" };
        $scope.dishFeedbackForm.$setPristine();
    };
}])

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
    console.log($scope.organization.name);
    
    $scope.registerOrganization = function() {
            organizationFactory.getOrganizations.save($scope.organization);
            $scope.organization = {
            	      id = "",
            	      email = "",
            	      password = "",
            	      name = "",
            	      acronym = "",
            	      image = "",
            	      religion = "",
            	      description = "",
            	      address = "",
            	      phone = "",
            	      activities = []
            };
            $scope.organizationForm.$setPristine();
        }
    };

}])

.controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
    corporateFactory.getLeaderships().query(
        function(response) {
            $scope.leaderships = response;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
    });
}]);