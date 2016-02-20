angular.module('sent', [])

.controller('SentCtrl', function($scope, $ionicPopup, Sender) {
  console.log("SentCtrl");

  $scope.Message = {};

  $scope.sendMessage = function(message) {

    $ionicPopup.alert({
      title: 'Success',
      template: 'Lateral messaging process started.'
    })
    .then(function() {
      // blank sms fields
      $scope.Message = {};
    });

    Sender.startLateralMessaging(message);


  };

});
