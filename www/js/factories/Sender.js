angular.module('factories')

.factory('Sender', function(LocalData, ServerClient, FacadeSMS) {
  var db = new PouchDB('lateral', {adapter: 'websql'});
  var sms = new FacadeSMS();
  var MY_NUMBER = LocalData.MY_NUMBER;

  function Sender() {

  }

  Sender.startLateralMessaging = function(message) {
    console.log("Sender.startLateralMessaging");

    // try to relay once diretly to server
    return ServerClient.relayOwnMessage(message.content)
    .success(function(data, status, headers, config) {

      // do nothing, message was received by central server

    }).error(function(data, status, headers, config) {
      console.log("ERROR no connection possible");

      // get receivers list
      return _getReceivers()
      // get target receiver number
      .then(function(receivers) {
        return _getRandomFromReceiversList(receivers);
      })
      // send sms to receiver number
      .then(function(receiverNumber) {
        return _sendSMS(receiverNumber, message.content);
      });

    });

  };

  function _getReceivers() {
    return db.get('receivers').then(function(res) {
      var receivers = res.list;

      return receivers;
    }).catch(function (err) {
      console.log("Receivers list empty.", err);
    });
  }

  function _getRandomFromReceiversList(list) {
    var lastIndex = list.length - 1;

    var receiver = MY_NUMBER, receiverRandomIndex;
    while (receiver == MY_NUMBER) {
      // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      receiverRandomIndex = Math.floor(Math.random() * (lastIndex - 0 + 1)) + 0;
      receiver = list[receiverRandomIndex].number;
    }

    // TODO this should return an array
    return receiver;
  }

  function _sendSMS(number, content) {
    return sms.send(number, content);
  }

  return Sender;

});


