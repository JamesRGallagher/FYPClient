angular.module('starter.controllers', ['ui.router'])
    .controller('DashCtrl', function($scope, $ionicLoading, $compile) {
        function initialize() {
                $ionicLoading.show({
                    content: 'Getting current location...',
                    showBackdrop: false
                });
                var myLatlng;
                navigator.geolocation.getCurrentPosition(function(pos) {
                    myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                    var mapOptions = {
                        center: myLatlng,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                    var map = new google.maps.Map(document.getElementById("map"),
                        mapOptions);
                    $scope.map = map;
                    $scope.marker = null;
                    google.maps.event.addDomListener(window, 'load', initialize);
                    google.maps.event.addListener(map, 'click', function(e) {
                        console.log(e)
                        if ($scope.marker) {
                            $scope.marker.setVisible(false);
                            if ($scope.infowindow) {
                                $scope.infowindow.close()
                            }
                        }
                        var pos = e.latLng;
                        //Marker + infowindow + angularjs compiled ng-click
                        var contentString = "<div><textarea placeholder = 'Please enter your request'></textarea><a ng-click='sendRequest()'>Send!</a></div>";
                        var compiled = $compile(contentString)($scope);
                        $scope.sendRequest = function() {
                            alert('Request Sent!')
                        };
                        var infowindow = new google.maps.InfoWindow({
                            content: compiled[0]
                        });
                        var marker = new google.maps.Marker({
                            position: pos,
                            map: map,
                        });
                        $scope.marker = marker;
                        infowindow.open(map, marker);
                        $scope.infowindow = infowindow;
                    })
                    $ionicLoading.hide();
                }, function(error) {
                    alert('Unable to get location: ' + error.message);
                    myLatlng = new google.maps.LatLng(43.07493, -89.381388);
                });
                console.log('init')
                console.log(map)
            }
            //})
        initialize()
    })
    .controller('RequestsCtrl', function($scope, Requests,$ionicLoading,$http) {
         $scope.doRefresh = function() {
        $http.get('https://fypserver-jamesgallagher.c9.io/api/requests?user_id=54c5a9b7531157e769000001')
         .success(function(newItems) {
               $scope.requests = newItems;
         })
        .finally(function() {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
         // $scope.$apply();
         });
        };
        Requests.get(function(data) {
            $ionicLoading.hide()
            $scope.requests = data;
        });
        $scope.remove = function(request) {
            Requests.remove(request);
        }
    })
    .controller('RequestDetailCtrl', function($scope,$state,$ionicLoading, $stateParams, $window,Requests,$http) {
       
       
        $scope.request = Requests.get($stateParams.requestId);
        var pos = new google.maps.LatLng($scope.request.lat,$scope.request.lng)
         var mapOptions = {
            center:pos, 
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(document.getElementById("map2"),mapOptions);
        $scope.map = map;
        var marker = new google.maps.Marker({position: pos,map: map,});

     $scope.getPicture = function(){
        //console.log('Getting..');
       //  $state.transitionTo("review-image");
       
       // document.getElementById('imageHolder').innerHTML = '<div id="cover" style="background-color:grey"></div>'
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,destinationType: Camera.DestinationType.DATA_URL});

        function onSuccess(imageData) {
            $ionicLoading.show({
                    template: 'Sending your response...',
                    showBackdrop: true
            });

            //$http.post()
          

            //$state.go('the-state-name-in-quotes','{}')
            //$state.go("review-image");
           // document.getElementById('cover').innerHTML = '<img class="imgPreview" width= "100%" height = "90%" id="image"></img><button id="cancel" class="button subbutton"   style="width:49%:" onclick ="document.getElementById(\'cover\').style.display = \'none\'">Cancel</button><button id="send" class="button subbutton"  style="float:right; width:49%" onclick ="document.getElementById(\'cover\').style.display = \'none\'">Send</button>';
              
            //document.getElementById('cover').style.display = "block";
        }

        function onFail(message) {
             alert('Failed because: ' + message);
        
        }
    }
    })
    .controller('ResponsesCtrl', function($scope, Responses) {
        $scope.responses = Responses.all();
    })

    .controller('ResponseDetailCtrl', function($scope, $stateParams, Responses) {
        $scope.response = Responses.get($stateParams.responseId);
    })

    .controller('ImageController', function($scope, $stateParams) {
        alert('Here!')
    })

    .controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });