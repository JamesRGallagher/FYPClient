angular.module('starter.controllers', ['ui.router'])
.controller('SignInCtrl', function($scope, $state,$http,$ionicPopup) {
  ///  $scope.toRegister = function(user) {
   // }


  $scope.signIn = function(user) {
    var requestData = {'user_id':user.username, 'pass':user.password }
    $http.post("https://fypserver-jamesgallagher.c9.io/api/auth", requestData).success(
    function(responseData) {
        if(responseData.length > 0){
        document.getElementById('userid').innerHTML = responseData[0]._id;
        $state.go('tab.dash');
    } else {
        alertPopup = $ionicPopup.alert({
     title: 'Sorry..',
     template: 'There has been an error:('
   });
    }
    
    })
    .error(function(){
     alertPopup = $ionicPopup.alert({
     title: 'Sorry..',
     template: 'There has been an error:('
   });
    });
    
  }
})
    .controller('DashCtrl', function($scope, $ionicLoading, $compile,$http) {
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
                        console.log('pos2',pos)
                        //Marker + infowindow + angularjs compiled ng-click
                        var contentString = "<div><textarea id='reqText' placeholder = 'Please enter your request'></textarea><a onclick='sendRequest("+pos.k+","+pos.D+")'>Send!</a></div>";
                        var compiled = $compile(contentString)($scope);
                        console.log(compiled)
                        var user_id = document.getElementById('userid').innerHTML;
                        console.log(document.getElementById('reqText'))
                        sendRequest = function(latitude,longitude) {
                            console.log('posistion',pos)
                            var id = document.getElementById('userid').innerHTML;
                            var msg = document.getElementById('reqText').value
                            var d = new Date();
                            var time = d.getTime();
                            var obj = new Object();
                            console.log(latitude)
                            obj.userid = document.getElementById('userid').innerHTML;
                            obj.state = "0";
                            obj.time = time;
                            obj.lat = latitude;
                            obj.long = longitude;
                            obj.message = msg;
                            obj.ttl = null;

                            console.log(JSON.stringify(obj))
                           // $http.post('https://fypserver-jamesgallagher.c9.io/api/requests', obj)
                            $http.post('https://fypserver-jamesgallagher.c9.io/api/requests',obj).
                                success(function(data, status, headers, config) {
                                console.log("success")
                            }).
                            error(function(data, status, headers, config) {
                                //called asynchronously if an error occurs
                                // or server returns response with an error status.
                             });
                            
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

        var onSuccess = function(position) {
       

        data = {
          'lat':position.coords.latitude,
          'long':position.coords.longitude
        }
        $http.put('https://fypserver-jamesgallagher.c9.io/api/users/'+document.getElementById('userid').innerHTML,data).success(function(data, status, headers, config) {
                                console.log('https://fypserver-jamesgallagher.c9.io/api/users/'+document.getElementById('userid').innerHTML)

                            })
        }

        // onError Callback receives a PositionError object
    //
        function onError(error) {
         alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);



        $http.get('https://fypserver-jamesgallagher.c9.io/api/requests?user_id='+document.getElementById('userid').innerHTML)
         .success(function(newItems) {
               $scope.requests = newItems;
               Requests.set(newItems);
               console.log($scope.requests)
         })
        .finally(function() {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
         // $scope.$apply();
         });
        };
        Requests.get(function(data) {
            Requests.set(data);
            $ionicLoading.hide()
            $scope.requests = data;
            console.log('IN HERE')
        });
        $scope.remove = function(request) {
            Requests.remove(request);
        }
    })
    .controller('RequestDetailCtrl', function($scope,$state,$ionicLoading, $stateParams, $window,Requests,$http) { 
            var data = Requests.getLocal()
            console.log(data)
            for(i = 0; i< data.length; i++){
                if(data[i]._id==$stateParams.requestId){
                    $scope.request = data[i];
                    console.log(data[i])
                    
                }
            }
            function initialize() {
                console.log($scope.request)
         //   myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            var mapOptions = {
             zoom: 8,
            center: new google.maps.LatLng($scope.request.lat, $scope.request.long)
                 };
            map = new google.maps.Map(document.getElementById('map2'),
                 mapOptions);
            
                var marker = new google.maps.Marker({
      position: new google.maps.LatLng($scope.request.lat, $scope.request.long),
      map: map,
      title: $scope.request.message
  });

            }

           
            
initialize()
        
        console.log($scope.request.lat)
               
     
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
            var data = new Object;
            data.reqid =  $scope.request;
            data.userid = document.getElementById('userid').innerHTML;
            data.time = new Date().getTime();
            data.image = imageData;
            $http.post('https://fypserver-jamesgallagher.c9.io/api/response',data).success(function() {
               alert('success!')
             })
          

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