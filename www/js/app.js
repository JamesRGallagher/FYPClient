
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'google.places'])

.run(function($ionicPlatform, $interval, UserLocation,$http) {
  $ionicPlatform.ready(function() {

    //Two global variables holding the lat/long of the android device.
    window.droidlat = 0;
    window.droidlng = 0;
    
    //Attempt to get location from the device to prompt the user to give location permissions 
    window.navigator.geolocation.getCurrentPosition(
        function(location) {
          console.log('Location from Phonegap');
        },
        function(error) {
          alert('The it is no fun without location :(');
        }
    );

    //Initialise the backgroundGeoLocation plugin
    var bgGeo = window.plugins.backgroundGeoLocation;

    //Executed every time a geolocation move is recorded in the background
    var callbackFn = function(location) {
        window.droidlat = location.latitude;
        window.droidlng = location.longitude;
        data = {
          'lat':location.latitude,
          'long':location.longitude
        }
        $http.put('https://fypserver-jamesgallagher.c9.io/api/users/'+document.getElementById('userid').innerHTML,data)
         bgGeo.finish();
    };

    var failureFn = function(error) {
        console.log('BackgroundGeoLocation error');
    }

    //The following 
    bgGeo.configure(callbackFn, failureFn, {
        url: 'https://fypserver-jamesgallagher.c9.io/api/users/'+document.getElementById('userid').innerHTML, 
        params: {
            'lat': window.droidlat,  
            'long': window.droidlng                             
        },
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        activityType: 'AutomotiveNavigation',
        debug: false, 
        stopOnTerminate: false 
    });

    bgGeo.start();


    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  //Configure some UI things.
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.views.transition('android');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.tabs.style('standard')


  //Routes - similar to the node/express stuff.
  $stateProvider
  .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl'
    })
    .state('review-image', {
      url: '/image',
      views: {
        'review-image': {
          templateUrl: 'templates/image-review.html',
          controller: 'ImageController'
        }
      }
    })
  

  //abstract state for the tabs 
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own history stack:
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.requests', {
      url: '/requests',
      views: {
        'tab-requests': {
          templateUrl: 'templates/tab-requests.html',
          controller: 'RequestsCtrl'
        }
      }
    })
    .state('tab.request-detail', {
      url: '/requests/:requestId',
      views: {
        'tab-requests': {
          templateUrl: 'templates/request-detail.html',
          controller: 'RequestDetailCtrl'
        }
      }
    })
  .state('tab.responses', {
      url: '/responses',
      views: {
        'tab-responses': {
          templateUrl: 'templates/tab-responses.html',
          controller: 'ResponsesCtrl'
        }
      }
    })
  .state('tab.response-list', {
      url: '/response/:requestId',
      views: {
        'tab-responses': {
          templateUrl: 'templates/response-list.html',
          controller: 'ResponseListCtrl'
        }
      }
    })
    .state('tab.response-detail', {
      url: '/responseDetail/:responseId',
      views: {
        'tab-responses': {
          templateUrl: 'templates/response-detail.html',
          controller: 'ResponseDetailCtrl'
        }
      }
    })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback, and get the user to log in 
  // again.
  $urlRouterProvider.otherwise('/sign-in');

});
