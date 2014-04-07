'use strict';

/* App Module */

var <%= angularAppName %> = angular.module('<%= angularAppName %>', ['ngResource', 'ngRoute', 'ngCookies', 'pascalprecht.translate']);

<%= angularAppName %>
    .config(['$routeProvider', '$httpProvider', '$translateProvider',
        function ($routeProvider, $httpProvider, $translateProvider) {
            $routeProvider
                .when('/login', {
                    templateUrl: 'views/login.html',
                    controller: 'LoginController'
                })
                .when('/profil', {
                    templateUrl: 'views/profil.html',
                    controller: 'ProfilController'
                })
                .when('/logout', {
                    templateUrl: 'views/index.html',
                    controller: 'LogoutController'
                })
                .otherwise({
                    templateUrl: 'views/index.html',
                    controller: 'MainController'
                })


            // Handle the 401 error
            var unauthorizedInterceptor = ['$rootScope', '$q', '$location', function (scope, $q, $location) {
                function success(response) {
                    return response;
                }

                function error(response) {
                    var status = response.status;
                    if (status == 401) {
                        $location.path('login').replace();
                    }
                    return $q.reject(response);
                }

                return function (promise) {
                    return promise.then(success, error);
                }
            }];
            $httpProvider.responseInterceptors.push(unauthorizedInterceptor);

            // Initialize angular-translate
            $translateProvider.useStaticFilesLoader({
                prefix: 'resources/i18n/',
                suffix: '.json'
            });

            $translateProvider.preferredLanguage('en');

            // remember language
            $translateProvider.useCookieStorage();
        }]);
