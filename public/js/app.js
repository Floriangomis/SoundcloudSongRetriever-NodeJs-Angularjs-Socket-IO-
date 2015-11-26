/*
* Entry point of the Angular Application
*/

'use strict';

angular.module( 'appFront', [ 'appControllers' ] )
    .config(function( $locationProvider, $httpProvider ){
        $httpProvider.interceptors.push('AuthInterceptor');
        $locationProvider.html5Mode( true );
    })

    .run( [ '$rootScope', 'Auth', function ( $rootScope, Auth ) {

        window.app = {
            authState: function( state, user ) {
                $rootScope.$apply(function() {
                    switch ( state ) {
                        case 'success':
                            Auth.authSuccess( user )
                        break;
                        case 'failure':
                            console.log( failure );
                        break;
                    }
                });
            }
        };
    } ] );