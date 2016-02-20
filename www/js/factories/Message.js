angular.module('factories')

.factory('Message', function() {
  var db = new PouchDB('lateral', {adapter: 'websql'});

  function Message(message) {
    this.id      = message.id;
    this.number  = message.number;
    this.content = message.content;
    this.sent    = message.sent || false;
    this.date    = message.date;
  }

  Message.removeFromList = function(messages, message) {
    return _.filter(messages, function(m) {
      return m.id !== message.id;
    });
  };

  Message.prototype.isFromReceiver = function() {
    return Message.isFromReceiver(this.number);
  }
  Message.isFromReceiver = function(number) {
    return _getReceivers().then(function(receivers) {
      return _.findWhere(receivers, {number: number});
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

  return Message;

});
