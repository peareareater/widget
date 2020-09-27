const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const WebSocket = require( "ws");
const http = require('http')
const User = require('./models/users');
const {v4} = require('uuid');

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });


webSocketServer.on('connection', async function connection(ws, request, client) {
    const userId = v4();
    // await createSecureServer(userId);

    webSocketServer.clients.forEach(client => {
        console.log(client.id)
    })
    ws.on('username', function(msg) {
        console.log(msg, 'USERNAME')
    })
  });
 server.listen(8888, () => console.log("Server started"))
