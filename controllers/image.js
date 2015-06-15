(
    function()
    {
        "use strict";

        angular.module('photoShow').controller('ImageCtrl', ['$scope', '$http', '$interval',
            function($scope, $http, $interval)
            {
                var showImage = function()
                {
                    // todo: show new ones first
                    // don't repeat

                    $scope.image = $scope.images[Math.floor(Math.random() * $scope.images.length)];
                };

                var getImages = function()
                {
                    $http.get('/getimages').then(function(result)
                    {
                        $scope.images = result.data.images;

                        showImage();
                    });
                };

                getImages();

                $interval(function()
                {
                    showImage();
                }, 60000);
            }
        ]);

    }()
);
