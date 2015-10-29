'use strict';

angular.module( 'appControllerMix', [] )

    .controller('MixController', [ '$http', MixController ] );

    function MixController($http) {
        this.title = 'Mix Components';
    }

    MixController.prototype.activate = function() {
        return 'Active';
    };

    MixController.prototype.canDeactivate = function() {
        return 'Deactive';
    };