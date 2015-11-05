/*
* Service
* Main goal is to reach our NodeJs endpoint to retrieve songs
*/

'use strict';

var soundcloudService = angular.module('soundcloudService', []);

soundcloudService.service( 'soundcloudRetriever', [ '$http', '$q', function( $http, $q ){
    
    var baseUrl = '/soundcloudFavorites';
    var cacheFavorites = null;

    this.retrieveFavoritesSong = function(){
        var deferred = $q.defer();
        if( cacheFavorites ){
            deferred.resolve( cacheFavorites );
            return deferred.promise;
        } else {
            $http( {
                method: 'GET',
                url: baseUrl
            } ).success(function( data ){
                cacheFavorites = data;
                deferred.resolve( data );
            } ).error(function(){
                deferred.reject( 'There was an error' );
            } );
            return deferred.promise;
        }
    };

}]);