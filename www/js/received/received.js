angular.module('received', [])

.controller('ReceivedCtrl', function($scope, LocalData, FacadeSMS, Receiver, ServerClient, Message) {
  console.log("ReceivedCtrl");

  var sms = new FacadeSMS();
  var RELAY_INTERVAL = 60000; // every minute sms will be sent to server

  var listeningLabels = {
    'on':  'Listening On',
    'off': 'Listening Off'
  };

  $scope.MY_NUMBER = LocalData.MY_NUMBER;
  $scope.messages = [];
  $scope.listeningLabel = listeningLabels['off'];
  $scope.listening = false;

  $scope.changeListeningStatus = function(status) {
    $scope.listeningLabel = listeningLabels[( status ? 'on': 'off' )];

    if (status && !sms.listening) {
      sms.startListen();
      ServerClient.startBeating();
    }
    else if (!status && sms.listening) {
      sms.stopListen();
      ServerClient.stopBeating();
    }

  };

  sms.onMessageReceived(function(message) {
    console.log("onMessageReceived", message);

    // clasify message by sender
    message.isFromReceiver().then(function(_isFromReceiver) {

      // message from a receiver
      if (_isFromReceiver){
        // TODO
      }

      // direct message from user
      else {

        _addMessageToMessages($scope, message);

        function _relaySMS(){
          return ServerClient.relaySMS(message)
          .success(function(data, status, headers, config) {

            console.log("Message sent to relay!");
            message.sent = true;
            _updateMessages($scope, $scope.messages);

          }).error(function(data, status, headers, config) {
            setTimeout(_relaySMS, RELAY_INTERVAL);
          });
        }

        _relaySMS().error(function(data, status, headers, config) {
          console.log("ERROR", arguments);

          Receiver.startLateralRelayForDirect(message);
        });

      }


    });

  });


    function _addMessageToMessages($s, message) {
      $s.messages.push(message);
      $s.$apply();
    }

    function _updateMessages($s, messages) {
      $s.messages = messages;
      // $s.$apply();
    }

});
