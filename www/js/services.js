angular.module('starter.services', [])

.factory('UserLocation', function() {
  var getUserLocation = function(){
        navigator.geolocation.getCurrentPosition(function(position) {alert(position.coords.latitude)});
    }


 return {
    get: function() {
      alert('Yeah.')
      return location;
    },
  }
})

.factory('Map',function(){




})

.factory('Requests', function($http,$ionicLoading) {
  $ionicLoading.show({
      //template: 'SGe...',
      showBackdrop: true
  });
  // Might use a resource here that returns a JSON array


  return {
    get: function(callback) {
     return $http.get('https://fypserver-jamesgallagher.c9.io/api/requests/').success(callback);
    }
  }
   
})

/**
 * A simple example service that returns some data.
 */
.factory('Responses', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var responses = [{
    id: 0,
    name: 'A. User',
    notes: 'Test 1',
    image: 'http://www.webbaviation.co.uk/lancaster/lancaster-uk-ba13213.jpg'
  }, {
    id: 1,
    name: 'Test User',
    notes: 'Test 2',
    image: "http://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Judges'_Lodgings,_Lancaster_4.jpg/320px-Judges'_Lodgings,_Lancaster_4.jpg"
  }];


  return {
    all: function() {
      return responses;
    },
    get: function(responseId) {
      // Simple index lookup
      return responses[responseId];
    }
  }
});
