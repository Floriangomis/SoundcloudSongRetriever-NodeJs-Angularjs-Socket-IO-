'use strict';

angular.module( 'appControllerLogin', [ 'AuthService' ] )

    .controller('LoginController', [ '$http', 'Auth', '$rootScope', '$location', LoginController ] );

    function LoginController( $http, Auth, $rootScope, $location ) {
        this.email = null;
        this.password = null;
        this.userData = null;

        this.loggedin = Auth.isLoggedIn();
        this.Auth = Auth;
        this.location = $location;

        $rootScope.$on( '$routeChangeStart', function(){
            this.loggedin = Auth.isLoggedIn();
            Auth.getUser().success( function( data ){
                this.userData = data;
            } );
        } );
        console.log( 'Controller Login' );
    }

    LoginController.prototype.login = function() {
        this.Auth.login( this.email, this.password )
        .success( function(){
            this.location.path( '/' );
        }.bind( this ) );
    };

    LoginController.prototype.logout = function() {
        this.Auth.logout();
        this.userData = {};
    };