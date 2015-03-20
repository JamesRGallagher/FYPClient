angular.module('starter.controllers', ['ui.router'])



/************* Sign In Ctrl ************/
.controller('SignInCtrl', function($scope, $state, $http, $ionicPopup) {
    
    $scope.signIn = function(user) {
        var requestData = {
            'user_id': user.username,
            'pass': user.password
        }

        $http.post("https://fypserver-jamesgallagher.c9.io/api/auth", requestData).success(
        //If the server says we are successful
        function(responseData) {
            //Double check!
            if (responseData.length > 0) {
                //Set the user ID in the DOM. Behaves as a token before any real
                //authentication is implemented.
                document.getElementById('userid').innerHTML = responseData[0]._id;
                //Initalise the onNotifiction function.
                onNotification = function(e) {
                    switch (e.event) {
                        //The first event the device will recieive is the registered event
                        //This means we can update the user in the database with a gcmRedId
                        case 'registered':
                        if (e.regid.length > 0) {
                            var userID = document.getElementById('userid').innerHTML;
                            $http.put("https://fypserver-jamesgallagher.c9.io/api/users/" + userID, {
                                'gcmRegId': e.regid
                            })
                            
                        }
                        break;
                        case 'message':
                        if (e.foreground) {
                            //   alert('Push notificaiton while the app was open')
                            } else {
                            if (e.coldstart) {
                                //      alert('got coldstart')
                                } else {
                                "alert('Push notificaiton while the app was closed')"
                            }
                        }
                        break;
                        
                        case 'error':
                        alert('error')
                        break;
                        
                        default:
                        alert('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                        break;
                    }
                }
                //Go to the main screen.
                $state.go('tab.dash');
                } else {
                //Handle error
                alertPopup = $ionicPopup.alert({
                    title: 'Sorry..',
                    template: 'There has been an error:('
                });
            }
        })
        //Handle error
        .error(function() {
            alertPopup = $ionicPopup.alert({
                title: 'Sorry..',
                template: 'There has been an error:('
            });
        });
    }
})
/************* End of Sign In Ctrl ************/


/************* RegisterCtrl ************/
//Very simple.
.controller('RegisterCtrl', function($scope, $state, $http, $ionicPopup) {
    $scope.register = function(user) {
        $http.post('https://fypserver-jamesgallagher.c9.io/api/users', user).
        success(function(data, status, headers, config) {
            $state.go('signin');
        }).
        error(function(data, status, headers, config) {
            alert('error registering')
            
        });
    }
})
/************ End of RegisterCtrl ***********/



/************* DashCtrl ************/
/** Contains much of the Google maps stuff */
.controller('DashCtrl', function($scope, $ionicLoading, $compile, $http, $ionicPopup, $ionicModal) {
   
    //Global map object will hold native map.
    window.map;
    
    //Flag - reflects if the maps is active.
    window.mapClickableToggle = 1;

    //The usersLocation
    var userLocation;
   
    //When the device is ready
    document.addEventListener("deviceready", function() {
        
        //when the input is selected 
        $scope.$on('g-places-autocomplete:select', function(event, param) {
           
            //allow clicks on the map
            plugin.google.maps.Map.getMap(document.getElementById("map")).setClickable(true)
            
            //Geocode:
            
            var address = param.formatted_address;
            
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
                }, function(results, status) {
                
                pointLocation = new plugin.google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                
                plugin.google.maps.Map.getMap(document.getElementById("map")).animateCamera({
                    'target': pointLocation,
                    'tilt': 60,
                    'zoom': 10,
                    
                });
            });
        });
        

        
        navigator.geolocation.getCurrentPosition(function(pos) {
            
            //Set the users loation
            userLocation = new plugin.google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        
            var div = document.getElementById("map");
            
            //Init the map
            window.map = plugin.google.maps.Map.getMap(div, {
                'backgroundColor': 'white',
                'mapType': plugin.google.maps.MapTypeId.ROADMAP,
                'controls': {
                    'compass': true,
                    'myLocationButton': true,
                    'indoorPicker': true,
                    'zoom': true
                },
                'gestures': {
                    'scroll': true,
                    'tilt': true,
                    'rotate': true,
                    'zoom': true
                },
                'camera': {
                    'latLng': userLocation,
                    'tilt': 30,
                    'zoom': 15,
                    'bearing': 50
                }

                //Add events - such as long click
                }).on(plugin.google.maps.event.MAP_LONG_CLICK, function(latLng) {
                //On long ciick, shrink the map
                $('#map').animate({
                    height: '40%'
                }, 300);

                //And animate the camera to where was selected
                var thisMap = plugin.google.maps.Map.getMap(document.getElementById("map"));
                thisMap.animateCamera({
                    'target': latLng,
                    'zoom': 12,
                    'duration': 10
                })
                
                //Add a marker
                thisMap.addMarker({
                    'position': latLng
                })      
                
                //Hide the search UI and replase it with the form that slides up.
                $('#mapSearch').hide();
                $('#mapHolder').append('<span id = "reqForm"><div class="item range"><input id="radiusSlider" type="range" min="1100" max = "1500" name="volume"></div><label class="item item-input"> <input id="requestText" type="text" placeholder="Request"></label><label class="item item-input item-select"><div class="input-label">Timeframe</div><select><option>1 Hour</option><option selected>1 Day</option> <option>1 Week</option></select></label><button id = "reqSend" class="button button-full button-balanced">Send!</button><button id = "reqCancel" class="button button-full button-positive">Cancel</button></span>');
                
                //As the radius changes, the camera is animated
                $('#radiusSlider').on("input", function() {
                    thisMap.animateCamera({
                        'target': latLng,
                        'zoom': Math.abs((1100 + (1500 - $(this).val())) / 100),
                        'duration': 10
                    })
                });
                
                //On cancel, go back to how we were.
                $('#reqCancel').on("click", function() {
                    $("#reqForm").remove();
                    $("#map").animate({
                        height: '95%'
                    }, 300);
                    $('#mapSearch').show();     
                })
                

                //On send
                $('#reqSend').on("click", function() {
                    //Get the date
                    var d = new Date();
                    //Get the time
                    var time = d.getTime();
                    //Create a new object
                    var obj = new Object();
                    //Populare the object
                    obj.userid = document.getElementById('userid').innerHTML;
                    obj.state = "0";
                    obj.time = time;
                    obj.lat = latLng.lat;
                    obj.long = latLng.lng;
                    obj.ttl = null;
                    obj.message = document.getElementById('requestText').value;
                    
                    //and send it
                    $http.post('https://fypserver-jamesgallagher.c9.io/api/requests', obj).
                    //Show an alert on success, and revert.
                    success(function(data, status, headers, config) {
                        $ionicPopup.alert({
                            title: '<i class="ion-checkmark-circled"></i>',
                            template: 'Request Sent!'
                            }).then(function() {
                            $("#reqForm").remove();
                            $("#map").animate({
                                height: '95%'
                            }, 300);
                            $('#mapSearch').show();
                        });
                        
                    }).
                    //Show an alert on error, and revert.
                    error(function(data, status, headers, config) {
                        $ionicPopup.alert({
                            title: 'There hase been an error:(',
                            template: 'Request Not Sent'
                            }).then(function() {
                            $("#reqForm").remove();
                            $("#map").animate({
                                height: '95%'
                            }, 300);
                            $('#mapSearch').show();
                        });
                    });
                    
                })
                
            });
            //reset the map.
            $("#clearButton").on('click', function() {
                plugin.google.maps.Map.getMap(document.getElementById("map")).setClickable(true);
            })
        });
        var input = document.getElementById('pac-input');
        input.addEventListener("click", function() {
            plugin.google.maps.Map.getMap(document.getElementById("map")).setClickable(false)
        });
        
    }, false); 
    
    
})
/*************End of DashCtrl ************/




/************* RequestsCtrl ************/
.controller('RequestsCtrl', function($scope, Requests, $ionicLoading, $http) {

    //Screen refresh
    $scope.doRefresh = function() {     
        //Update users location sever side, to ensure accurate
        var onSuccess = function(position) {     
            data = {
                'lat': position.coords.latitude,
                'long': position.coords.longitude
            }
            $http.put('https://fypserver-jamesgallagher.c9.io/api/users/' + document.getElementById('userid').innerHTML, data).success(function(data, status, headers, config) {
            })
        }
        //Handle the error
        function onError(error) {
            alert('code: ' + error.code + 'n' +
            'message: ' + error.message + 'n');
        }
        
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        
        
        //Get new requests
        $http.get('https://fypserver-jamesgallagher.c9.io/api/requests?user_id=' + document.getElementById('userid').innerHTML)
        //Update the UI
        .success(function(newItems) {
            $scope.requests = newItems;
            Requests.set(newItems);
        })
        .finally(function() {    
            $scope.$broadcast('scroll.refreshComplete');   
        });
    };

    //Get new requests on navigation, rest is same as before.
    $http.get('https://fypserver-jamesgallagher.c9.io/api/requests?user_id=' + document.getElementById('userid').innerHTML)
    .success(function(newItems) {  
        $scope.requests = newItems;
        Requests.set(newItems)
        $ionicLoading.hide()
    })
    $scope.remove = function(request) {
        Requests.remove(request);
    }
})
/************* End Of RequestsCtrl ************/





/*************RequestsDetailCtrl ************/
.controller('RequestDetailCtrl', function($scope, $state, $ionicLoading, $stateParams, $window, Requests, $http) {
    
    //Get any cached data
    var data = Requests.getLocal()
    
    //Find the correct request
    for (i = 0; i < data.length; i++) {
        if (data[i]._id == $stateParams.requestId) {     
            $scope.request = data[i];
        }
    }
    
    //Initalise the map
    function initialize() {

        var mapOptions = {
            zoom: 16,
            center: new google.maps.LatLng($scope.request.lat, $scope.request.long)
        };

        map = new google.maps.Map(document.getElementById('map2'),mapOptions);
        
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.request.lat, $scope.request.long),
            map: map,
            title: $scope.request.message
        });     
    } 

    initialize()  
    
    //Call on the camera
    $scope.getPicture = function() {
        document.getElementById('imageHolder').innerHTML = '<div id="cover" style="background-color:grey"></div>'
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
        
        //If the image data is captured, send it as a base 64 String.
        function onSuccess(imageData) {
            $ionicLoading.show({
                template: 'Sending your response...',
                showBackdrop: true
            });
            var data = new Object;
            data.reqid = $scope.request._id;
            data.userid = document.getElementById('userid').innerHTML;
            data.recipId = $scope.request.userid;
            data.time = new Date().getTime();
            data.image = "data:image/png;base64," + imageData;
            $http.post('https://fypserver-jamesgallagher.c9.io/api/response', data).success(function() {
                $ionicLoading.hide()
            })
        }  
        function onFail(message) {
            alert('Failed because: ' + message);
        }
    }   
})
/************* End Of RequestsDetailCtrl ************/



/************* ResponsesCtrl ************/
//Very simple.
.controller('ResponsesCtrl', function($scope, MyRequests, $http, $ionicLoading) {   
    $scope.doRefresh = function() {
        $http.get('https://fypserver-jamesgallagher.c9.io/api/requests/' + document.getElementById('userid').innerHTML)
        .success(function(newItems) {
            $scope.myRequests = newItems;
            MyRequests.set(newItems);
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    
    $http.get('https://fypserver-jamesgallagher.c9.io/api/requests/' + document.getElementById('userid').innerHTML)
    .success(function(data) {
        MyRequests.set(data);
        $ionicLoading.hide()
        $scope.myRequests = data;
        MyRequests.set(data);
    })   
    $scope.remove = function(myRequests) {
        MyRequests.remove(myRequests);
    }
})
/************* End of ResponsesCtrl ************/


.controller('ResponseListCtrl', function($scope, MyRequests, $stateParams, Responses) {
    var data = MyRequests.getLocal()
    for (i = 0; i < data.length; i++) {
        if (data[i]._id == $stateParams.requestId) {
            $scope.responses = data[i].responses;
            Responses.set(data[i].responses)   
        }
    }
})

.controller('ResponseDetailCtrl', function($scope, $stateParams, MyRequests, Responses) {
    var data = Responses.getLocal()
    for (i = 0; i < data.length; i++) {
        if (data[i]._id == $stateParams.responseId)
            $scope.response = data[i];     
    }
})

.controller('ImageController', function($scope, $stateParams) {
    
})
.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});