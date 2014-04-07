'use strict';

/* Controllers */

<%= angularAppName %>.controller('MainController', ['$scope',
    function ($scope) {
    }]);

<%= angularAppName %>.controller('LanguageController', ['$scope', '$translate',
    function ($scope, $translate) {
        $scope.changeLanguage = function (languageKey) {
            $translate.uses(languageKey);
        };
    }]);

<%= angularAppName %>.controller('MenuController', ['$rootScope', '$scope', '$location', 'Account',
    function ($rootScope, $scope, $location, Account) {
        $scope.init = function () {
            $rootScope.account = Account.get({}, function () {
                $rootScope.authenticated = true;
            }, function (response) {
                if (response.status === 401) {
                    $rootScope.authenticated = false;
                    $location.path('');
                }
            });
        };
        $scope.$on('authenticationEvent', function () {
            $scope.init();
        });
        $scope.init();
    }]);

<%= angularAppName %>.controller('LoginController', ['$scope', '$location', 'AuthenticationSharedService',
    function ($scope, $location, AuthenticationSharedService) {
        $scope.rememberMe = true;
        $scope.login = function () {
            AuthenticationSharedService.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe,
                success: function () {
                    $location.path('');
                }
            })
        }
    }]);

<%= angularAppName %>.controller('LogoutController', ['$location', 'AuthenticationSharedService',
    function ($location, AuthenticationSharedService) {
        AuthenticationSharedService.logout({
            success: function () {
                $location.path('');
            }
        });
    }]);

<%= angularAppName %>.controller('ProfilController', ['$scope', 'Account',
    function ($scope, Account) {
        $scope.success = null;
        $scope.error = null;
        $scope.init = function () {
            $scope.settingsAccount = Account.get();
        };
    }]);
