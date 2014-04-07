'use strict';

/* Services */

<%= angularAppName %>.factory('Account', ['$resource',
    function ($resource) {
        return $resource('services/rest/account', {}, {
        });
    }]);

<%= angularAppName %>.factory('AuthenticationSharedService', ['$rootScope', '$http',
    function ($rootScope, $http) {
        return {
            message: '',
            prepForBroadcast: function(msg) {
                this.message = msg;
                this.broadcastItem();
            },
            broadcastItem: function() {
                $rootScope.$broadcast("authenticationEvent");
            },
            login: function (param) {
                var that = this;
                var data ="j_username=" + param.username +"&j_password=" + param.password +"&_spring_security_remember_me=" + param.rememberMe +"&submit=Login";
                $http.post('services/authentication', data, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).success(function (data, status, headers, config) {
                        $rootScope.authenticationError = false;
                        that.prepForBroadcast("login");
                        if(param.success){
                            param.success(data, status, headers, config);
                        }
                    }).error(function (data, status, headers, config) {
                        $rootScope.authenticationError = true;
                        if(param.error){
                            param.error(data, status, headers, config);
                        }
                    });
            },
            logout: function () {
                $rootScope.authenticationError = false;
                var that = this;
                $http.get('services/logout')
                    .success(function (data, status, headers, config) {
                        that.prepForBroadcast("logout");
                    });
            }
        };
    }]);
