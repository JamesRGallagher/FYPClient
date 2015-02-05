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

.factory('Requests', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var requests = [{
    id: 0,
    name: 'James Gallagher',
    lastText: 'Is it busy?',
    lat: 0,
    lng: 0
  }, {
    id: 1,
    name: 'Someone Else',
    lastText: 'What is the weather like?',
    lat: 35.6895,
    lng: 139.6917
  }, {
    id: 2,
    name: 'Test User',
    lastText: 'Is there a queue?',
    lat: 51.5072,
    lng: 0.1275
  }, {
    id: 3,
    name: 'Real Person',
    lastText: 'Are there spare seats?',
    lat: 33.527625,
    lng: -112.262559
  }];

  return {
    all: function() {
      return requests;
    },
    remove: function(request) {
      requests.splice(requests.indexOf(request), 1);
    },
    get: function(requestId) {
      for (var i = 0; i < requests.length; i++) {
        if (requests[i].id === parseInt(requestId)) {
          return requests[i];
        }
      }
      return null;
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
