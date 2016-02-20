angular.module('lateral', [

  'ionic',

  'factories',

  'init',
  'dashboard',
  'sent',
  'received'

])

.run(function($ionicPlatform, Receiver) {
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // init local db
    var db = new PouchDB('lateral', {adapter: 'websql'});
    db.info().then(console.log.bind(console));

    Receiver.startUpdatingActiveList();

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'js/init.html',
      controller: 'InitCtrl'
    })

    // .state('app.dashboard', {
    //   url: '/dashboard',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'js/dashboard/dashboard.html',
    //       controller: 'DashboardCtrl'
    //     }
    //   }
    // })

    .state('app.sent', {
      url: '/sent',
      views: {
        'menuContent': {
          templateUrl: 'js/sent/sent.html',
          controller: 'SentCtrl'
        }
      }
    })

    .state('app.received', {
      url: '/received',
      views: {
        'menuContent': {
          templateUrl: 'js/received/received.html',
          controller: 'ReceivedCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/sent');

});
