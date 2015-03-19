angular.module('starter.services', [])

.factory('UserLocation', function() {
  var getUserLocation = function(){
        navigator.geolocation.getCurrentPosition(function(position) {alert(position.coords.latitude)});
    }
 return {
    get: function() {
      return location;
    },
  }
})

.factory('Map',function(){




})
.factory('Requests', function($http,$ionicLoading) {
  $ionicLoading.show({
      showBackdrop: true
  });
  var requests;

  return {
    set: function(data) {
        requests = data;
    },
    getLocal: function(){
      return requests;
    }
  } 
})

.factory('MyRequests', function($http,$ionicLoading) {
  $ionicLoading.show({
      showBackdrop: true
  });
  var requests;

  return {
    set: function(data) {
        requests = data;
    },
    getLocal: function(){
      return requests;
    },
    get: function(callback) {
      var returnData;
      console.log('!!')
      $ionicLoading.hide()
        $http.get('https://fypserver-jamesgallagher.c9.io/api/requests/'+document.getElementById('userid').innerHTML)
         .success(function(data) {
          console.log(':0')
             returnData = data;
       }) 
    
    return   returnData;
  }
  } 
})
.factory('Responses', function($http,$ionicLoading) {
  $ionicLoading.show({
      showBackdrop: true
  });
  var responses
  return {
    set: function(data) {
        console.log("setting responses to be:")
        console.log(data)
        responses = data;
        $ionicLoading.hide()
    },
    getLocal: function(){
      return responses;
    },
    get: function(callback) {

      console.log('!!')
     return $http.get('https://fypserver-jamesgallagher.c9.io/api/responses/'+document.getElementById('userid').innerHTML).success(callback);
    }
  }
   
})
