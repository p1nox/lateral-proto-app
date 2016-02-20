angular.module('factories')

.factory('FacadeSMS', function($q, Message) {

  function FacadeSMS(message) {
    message = message || {};

    this.number = message.number;
    this.content = message.content;

    this.lastId = 0;

    this.listening = false;
  }


  FacadeSMS.prototype.send = function(number, content) {
    number = number || this.number;
    content = content || this.content;

    return $q(function (resolve, reject) {

      if (!number) throw Error('SMS: phone number cant be blank');
      if (!content) throw Error('SMS: message content cant be blank');

      if (!SMS) {
        var error = new Error('SMS: sending plugin not ready');
        error.status = 404;

        return reject(error);
      }

      console.log("SMS: sending...");
      SMS.sendSMS(
        number,
        content,
        function success(status){
          console.log("SMS: sent to ", number, content, status);

          if (status === 'OK') {
            return resolve(200);
          }

          resolve(status);
        },
        function failure(error){
          console.log("SMS send error: ", error);
          reject(error);
        });

    });
  };

  FacadeSMS.prototype.startListen = function() {
    var that = this;

    return $q(function(resolve, reject) {

      if (!SMS) {
        var error = new Error('SMS: start receiving plugin problem');
        error.status = 404;

        return reject(error);
      }

      SMS.startWatch(function(status){
        console.log("SMS: startWatch suc");
        that.listening = true;
        resolve(200);
      }, function(error){
        console.log("SMS: startWatch err", error);
        that.listening = false;
        reject(error);
      });

    });
  };

  FacadeSMS.prototype.stopListen = function() {
    var that = this;

    return $q(function(resolve, reject) {

      if (!SMS) {
        var error = new Error('SMS: stop receiving plugin problem');
        error.status = 404;

        return reject(error);
      }

      SMS.stopWatch(function(){
        console.log("SMS: stopWatch suc");
        that.listening = false;
        resolve(200);
      }, function(error){
        console.log("SMS: stopWatch err", error);
        // TODO false positive ?
        that.listening = true;
        reject(error);
      });

    });
  };

  FacadeSMS.prototype.onMessageReceived = function(triggerReceived) {

    if (!SMS) {
      var error = new Error('SMS: on message receiving plugin problem');
      error.status = 404;

      throw error;
    }

    var that = this;

    document.addEventListener('onSMSArrive', function(ev){
      console.log("SMS: Message arraived", ev);
      var data = ev.data;

      var message = new Message({
        id:      that.lastId + 1, // TODO generate better id
        number:  data.address,
        content: data.body,
        date:    data.date
      });

      triggerReceived(message, ev);
    });

  };

  return FacadeSMS;

});

// Event from onSMSArrive
// {
//   bubbles: false
//   cancelBubble: false
//   cancelable: false
//   currentTarget: null
//   data: {
//     address: "+56982937526"
//     body: "---hola hola---"
//     date: 1448806771844
//     date_sent: 1448807026000
//     read: 0
//     seen: 0
//     service_center: "+5698890005"
//     status: 0
//     type: 1
//   }
//   __proto__: Object
//   defaultPrevented: false
//   eventPhase: 0
//   isTrusted: false
//   isTrusted: false
//   path: Array[2]
//   returnValue: true
//   srcElement: document
//   target: document
//   timeStamp: 1448806771846
//   type: "onSMSArrive"
// }
