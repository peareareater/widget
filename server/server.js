const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const http = require("http");
const { v4 } = require("uuid");
const {
    createUser,
    createMessage,
    getMessages,
    getRandomColor,
    removeUser,
} = require("./helpers/index");

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });

mongoose.connect("mongodb://localhost:27017/chat-widget", {
    useNewUrlParser: true,
});

mongoose.connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});
const ws = new WebSocket("wss://echo.websocket.org/", {
    origin: "https://websocket.org",
});

webSocketServer.on("connection", async function connection(ws) {
    const userId = v4();
    await createUser(userId);
    const allMessages = await getMessages();
    const messagesWithInfo = allMessages.map((message) =>
        message.byWhom === userId ? { ...message, isItMe: true } : message
    );
    const message = {
        userId: userId.substr(userId.length - 5),
        color: getRandomColor(),
        type: "init",
        messages: messagesWithInfo,
    };
    ws.send(JSON.stringify(message));

    ws.on("message", async function (msg) {
        const message = await createMessage(msg, userId);
        webSocketServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify({
                        message: { ...message, isItMe: true },
                        type: "message",
                    })
                );
            }
        });
    });

    ws.on("close", async function close() {
        await removeUser(userId);
    });
});

server.listen(8888, () => console.log("Server started"));
