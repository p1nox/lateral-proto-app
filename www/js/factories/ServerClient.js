angular.module('factories')

.factory('ServerClient', function(LocalData, $http) {

  var SERVER_URL   = LocalData.SERVER_URL;
  var APP_TOKEN    = 'f34fb8d0e97d9681875572ebb3a9a06642eaab74e8a16b1aaf41984c486f854be228d743396b522fbcafad4999237445bc8d0b2949eb9bf70425d1e8fbad2844ddb01de86c9b737e0a506305104c66799efece31ed68b1b2dc84f7238be43c6fee2d73f8326a234211d265c5947e3e0dbd4335f2ac34f98c824fa70c071627e1';
  var SECRET_TOKEN = '2e8e30fbd47735307e111f604f20e7d21090e7b36c3b0c0cecdc195424afbadb2c5fb328f1ebbfb1a68c937e1e2989fd3158af85f6ce9a3ec61fddf8fe7b8e87fc850c5b57fbc0e35efface8a98f27b6f1ba6c7cd78a4f81a179477895a8f4685cf7c5700bed34c6f8da89a9d2032288fc2a6ef132ca488f3ad4ec1a422a80fa';
  var MY_NUMBER    = LocalData.MY_NUMBER;
  var BEATING_INTERVAL = 30000; // 30 seconds

  var header = {
    headers: {
      'x-app-token':    APP_TOKEN,
      'x-secret-token': SECRET_TOKEN
    }
  };

  var nBeating;

  return {

    relaySMS: function(message) {
      var data = _.pick(message, ['number', 'content']);

      return $http.post(SERVER_URL + '/relay', data, header);
    },

    relayOwnMessage: function(content) {
      var data = {
        number: MY_NUMBER,
        content: content
      };

      return $http.post(SERVER_URL + '/relay', data, header);
    },

    sendHeartbeat: function() {
      console.log("ServerClient.sendHeartbeat");
      var data = {
        number: MY_NUMBER,
        sequence: moment().unix()
      };

      return $http.post(SERVER_URL + '/beats', data, header);
    },

    startBeating: function() {
      if (!nBeating) {
        this.sendHeartbeat();
        nBeating = setInterval(this.sendHeartbeat, BEATING_INTERVAL);
      }
    },

    stopBeating: function() {
      clearInterval(nBeating);
      nBeating = null;
    },

    getReceivers: function() {
      var data = {
        number: MY_NUMBER
      };

      return $http({
        url: SERVER_URL + '/receivers',
        method: 'GET',
        params: data,
        headers: header.headers
      }).then(function(res) {
        return res.data || [];
      });
    }

  };

});
