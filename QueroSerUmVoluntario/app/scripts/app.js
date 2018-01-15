'use strict';
angular.module('volunteerApp', ['ui.router', 'ngCookies'])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        // route for the home page
        .state('app', {
            url:'/',
            views: {
                'header': {
                    templateUrl : 'views/header.html'
                },
                'content': {
                    templateUrl : 'views/home.html',
                    controller  : 'IndexController'
                },
                'footer': {
                    templateUrl : 'views/footer.html'
                }
            }
		})
        // route for the register page
        .state('app.register', {
            url:'register',
            views: {
                'content@': {
                    templateUrl : 'views/register.html',
                    controller  : 'RegisterController'
               }
            }
        })
        // route for the activities page
        .state('app.activities', {
            url:'activities',
            views: {
                'content@': {
                    templateUrl : 'views/activities.html',
                    controller  : 'ActivitiesController'
               }
            }
        })
        // route for the activity details page
        .state('app.activityDetails', {
            url:'activityDetails',
            views: {
                'content@': {
                    templateUrl : 'views/activityDetails.html',
                    controller  : 'ActivitiesController'
               }
            }
        })
        $urlRouterProvider.otherwise('/');
})