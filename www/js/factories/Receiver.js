angular.module('factories')

.factory('Receiver', function(LocalData, FacadeSMS, ServerClient) {
  var db = new PouchDB('lateral', {adapter: 'websql'});
  var sms = new FacadeSMS();

  var MY_NUMBER = LocalData.MY_NUMBER;
  var UPDATING_ACTIVE_LIST_INTERVAL = 60000;
  var DEFAULT_TTL = 2; // counting on this very first message

  function Receiver(receiver) {
    this.number  = message.number;
  }

  Receiver.requestAndUpdateActiveList = function() {
    return ServerClient.getReceivers().then(function(receivers) {
      return db.upsert('receivers', function (doc) {
        doc.list = receivers || [];
        return doc;
      }).then(function(dbRes) {
        console.log("Receiver.requestAndUpdateActiveList done:", receivers, dbRes);
      });
    });
  };

  Receiver.startUpdatingActiveList = function() {
    Receiver.requestAndUpdateActiveList();
    setInterval(Receiver.requestAndUpdateActiveList, UPDATING_ACTIVE_LIST_INTERVAL);
  };

  Receiver.startLateralRelayForDirect = function(message) {

    // get target receiver
    _getReceivers().then(function(receivers) {
      return _getRandomFromReceiversList(receivers);
    })
    // send sms
    .then(function(receiverNumber) {
      var number = receiverNumber;
      var content = message.number + '|' + DEFAULT_TTL + '|' + message.content;

      return sms.send(number, content);
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

  return Receiver;

});
