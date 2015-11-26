'use strict';

var authService = angular.module( 'AuthService', [] );

authService.factory( 'Auth', [ '$http', '$q', 'AuthToken', function ( $http, $q, AuthToken ){

    // create auth factory object
    var Auth = {};
    
    Auth.mailCurrentUser = null;

    // log a user in
    Auth.login = function( email, password ) {
        Auth.mailCurrentUser = email;
        
        // return the promise object and its data
        return $http.post( '/api/authenticate', {
            email: email,
            password: password
        } )
        .success( function( data ) {
            AuthToken.setToken( data.token );
            return data;
        } );
    };

    // log a user out by clearing the token
    Auth.logout = function() {
        Auth.mailCurrentUser = null;
        // clear the token
        AuthToken.setToken();
    };

    // check if a user is logged in
    // checks if there is a local token
    Auth.isLoggedIn = function(){
        if ( AuthToken.getToken() ){
            return true;
        }else{
            return false; 
        }
    };

    // get the logged in user
    Auth.getUser = function() {

        if ( AuthToken.getToken() ){
            return $http.post( '/api/me', { cache: true, email: Auth.mailCurrentUser } );
        }else{
            return $q.reject( { message: 'User has no token.' } );
        }
    };
    
    Auth.connectSoundcloud = function() {
        var url = '/api/auth/soundcloud',
            width = 1000,
            height = 650,
            top = (window.outerHeight - height) / 2,
            left = (window.outerWidth - width) / 2;

        window.open( url, 'twitter_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left );
    };
        
    Auth.authSuccess = function( userData ) {
        Auth.mailCurrentUser = userData;
    };
    return Auth;
}]);

authService.factory( 'AuthToken', function( $window, $location ) {
 
    var authTokenFactory = {};

    // get the token out of local storage
    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem( 'token' );
    };

    // function to set token or clear token
    // if a token is passed, set the token
    // if there is no token, clear it from local storage
    authTokenFactory.setToken = function (token ) {
        if ( token ){
            $window.localStorage.setItem( 'token', token );
        }else{
            $window.localStorage.removeItem( 'token' );
            $location.path( '/' );
        }
    };

    return authTokenFactory; 
 });
 
authService.factory('AuthInterceptor', function( $q, $location, AuthToken ) {
    var interceptorFactory = {};
    // this will happen on all HTTP requests   
    interceptorFactory.request = function( config ) {
        // grab the token
        var token = AuthToken.getToken();
        // if the token exists, add it to the header as x-access-token
        if (token){
            config.headers[ 'x-access-token' ] = token;
        }
        return config;
    };

    // happens on response errors
    interceptorFactory.responseError = function( response ) {
        // if our server returns a 403 forbidden response
        if ( response.status == 403 ) {
            AuthToken.setToken();
            $location.path( '/' );
        }
        // return the errors from the server as a promise
        return $q.reject( response );
    };

    return interceptorFactory;
});

 // var session = {
 //     init: function () {
 //         this.resetSession();
 //     },
 //     resetSession: function() {
 //         this.currentUser = 'unamed';
 //         this.isLoggedIn = false;
 //     },
 //     connectTwitter: function() {
 //         var url = '/api/auth/twitter',
 //             width = 1000,
 //             height = 650,
 //             top = (window.outerHeight - height) / 2,
 //             left = (window.outerWidth - width) / 2;
 // 
 //         window.open( url, 'twitter_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left );
 //     },
 //     connectSoundcloud: function() {
 //         var url = '/api/auth/soundcloud',
 //             width = 1000,
 //             height = 650,
 //             top = (window.outerHeight - height) / 2,
 //             left = (window.outerWidth - width) / 2;
 // 
 //         window.open( url, 'twitter_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left );
 //     },
 //     logout: function() {
 //         session.resetSession();
 //         $rootScope.$emit( 'session-changed' );
 //     },
 //     authSuccess: function( userData ) {
 //         this.currentUser = userData;
 //         this.isLoggedIn = true;
 //         $rootScope.$emit( 'session-changed' );
 //     },
 //     authFailed: function() {
 //         this.resetSession();
 //     }
 // };
 // session.init();