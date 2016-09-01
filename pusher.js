// Run node build/js/pusher to run this (while hz serve --dev is also running)

var r = require('rethinkdb');
var http = require('http');
var request = require('request');

console.log('connecting to port ', process.argv[2])
r.connect({host: 'localhost', port: process.argv[2], db: 'collaboration'}, function(err, connection){
  if (err) {
    throw err;
  }
  console.log('connected');
  r.table('directMessages').changes().run(connection, function(err, cursor) {
    if (err) {
      console.error(err)
    } else {
      cursor.each(function(err, row) {
        if (err) throw err;
        var text = row.new_val.text;
//      var bothUserIds = row.new_val.chatRoomId.split('-');
//      var userId = bothUserIds[0] === row.new_val.fromUserId ? bothUserIds[1] : bothUserIds[0];
        var userId = row.new_val.toUserId;
        console.log('recieved message of '+text.length+' characters to user '+userId);
        r.table('users').get(userId).run(connection, function(err, result) {
          if (err) {
            console.error(err);
          } else {
            if (result.pushEndpoint) {
              var senderId = result.pushEndpoint.substr('https://android.googleapis.com/gcm/send/'.length);
              console.log('sending push message to ', senderId);
              request.post({
                url: 'https://android.googleapis.com/gcm/send',
                headers: {
                  'Authorization': 'key=AIzaSyAs5kl1lntUFNYeP_83yxydOBzaBf_bu-c',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  registration_ids: [senderId]
                })
              }, function(error, response, body) {
                if (err) {
                  console.error(err);
                } else {
                  console.log(body);
                }
              });
            }
          }
        });
      });
    }
  });
});
