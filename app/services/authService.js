var authService = angular.module('AuthService', []);

authService.service('AuthService', ['$facebook', function ($facebook) {
    //'use strict';

    this.userLoggedIn = null;
    this.setUserLoggedIn = function(user) {
        this.userLoggedIn = user;
        for (var i in this.onLoginQueue) {
            var call = this.onLoginQueue[i];
            call(user);
        }
    }

    this.setUserLoggedOut = function() {
        this.userLoggedIn = null;
        for (var i in this.onLogoutQueue) {
            var call = this.onLogoutQueue[i];
            call();
        }
    }

    this.getUser = function() {
        return this.userLoggedIn;
    }

    this.getUserFeed = function (callback) {
        $facebook.api("/" + this.userLoggedIn.id + "/feed").then(function (userWall) {
            callback(userWall)
        });
    }

    this.onLoginQueue = [];
    this.loginCallbackNames = [];
    this.doOnLogin = function (callbackName, callback) {
        if (this.userLoggedIn != null) {
            callback(this.userLoggedIn);
        }

        if (this.loginCallbackNames.indexOf(callbackName) == -1) {
            this.onLoginQueue.push(callback);
            this.loginCallbackNames.push(callbackName);
        }
    }


    this.onLogoutQueue = [];
    this.logoutCallbackNames = [];
    this.doOnLogout = function (callbackName, callback) {
        if (this.userLoggedIn == null) {
            callback(this.userLoggedIn);
        }

        if (this.logoutCallbackNames.indexOf(callbackName) == -1) {
            this.onLogoutQueue.push(callback);
            this.logoutCallbackNames.push(callbackName);
        }
    }
}]);