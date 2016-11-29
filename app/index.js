var WebSocketServer = require('ws').Server;
var wsServer        = new WebSocketServer({port: 3000});

wsServer.broadcast = function (msg) {
  wsServer.clients.forEach(function (client) {
    client.send(JSON.stringify(msg));
  });
};

wsServer.on('connection', function (ws) {

  ws.on('message', function (message) {
    console.log('received: %s', message);

    var req = JSON.parse(message);
    var res = {
      type   : 'message',
      text   : req.text,
      success: true
    };

    /* ボットへのメンションかを判定 */
    var reg_result = null;
    if ((reg_result = req.text.match(/^(?:@bot)(?:\s|　)(.*)/)) != null ||
        (reg_result = req.text.match(/^(?:bot)(?:\s|　)(.*)/ )) != null ||
        (reg_result = req.text.match(/^(?:bot:)(.*)/         )) != null) {

      res.type = 'bot';
      switch (reg_result[reg_result.length - 1]) {
        case 'ping':
          res.text = 'pong';
          break;

        default:
          res.text = 'Oops!:O';
      }
    }

    wsServer.broadcast(res);

  });
});