'use strict';
angular.module('volunteerApp', ['ui.router','ngResource'])

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
        $urlRouterProvider.otherwise('/');
})