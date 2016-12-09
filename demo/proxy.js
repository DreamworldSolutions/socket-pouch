var PouchDB = require('pouchdb');
var socketPouchServer = require('../lib/server');

socketPouchServer.listen(8008, {
  pouchCreator : function(dbName) {
    return Promise.resolve().then(function() {
      return {
        pouch : new PouchDB('http://192.168.0.44:5984/' + dbName)
      };
    });
  }
}, function() {
  console.log("Socket Pouch Server is started...");
});
