const express = require('express');
const server = require('http').createServer();
const app = express();


app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => {
  console.log('server started on port 3000');
});

const webSocketServer = require('ws').Server;

const wss = new webSocketServer({ server });

wss.on('connection', function connection(ws) {
 const numClient = wss.clients.size;
 console.log('Clients connected', numClient);
 wss.broadcast( `current visitors ${numClient}`);
  if(ws.readyState === ws.OPEN){
    ws.send('Welcome to my server');
  }

  ws.on('close', function close() {
    wss.broadcast(`current visitors ${wss.clients.size}`);
    console.log('a client has disconnected');
  })

});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
      client.send(data);
  });
}