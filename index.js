let socket = null;
const apiUrl = "localhost:8888";

let userColor = "white";
let username = "";

function init() {
    const body = document.body;
    renderWidget();
    initSocket();
}

function initSocket() {
    if (window.WebSocket) {
        socket = new WebSocket(`ws://${apiUrl}`);
    } else {
        console.log("Your browser doesn't support websocket");
        return;
    }

    socket.onopen = function (e) {
        console.log(e, "DATA");
    };

    socket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (!data) {
            return;
        }
        switch (data.type) {
            case "init":
                appendMessages(data.messages);
                userColor = data.color;
                username = data.userId;
                break;
            case "message":
                appendMessages([data.message]);
                break;
        }
        const chatWindow = document.getElementById("chat-window");
        chatWindow.scrollTop = chatWindow.scrollHeight;
        console.log(e, "message");
    };
    socket.onclose = function () {
        console.log("socket is closed");
    };
}

function renderWidget() {
    const container = getContainer();
    const chatWindow = getChatWindow();
    const inputContainer = getInputContainer();
    container.appendChild(chatWindow);
    container.appendChild(inputContainer);
    document.body.appendChild(container);
}

function getContainer() {
    const container = document.createElement("div");
    container.style.width = "250px";
    container.style.position = "absolute";
    container.style.height = "450px";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.display = "flex";
    container.style["flex-direction"] = "column";
    container.style["box-shadow"] = "0px 12px 29px -8px rgba(0,0,0,0.75)";
    return container;
}

function getChatWindow() {
    const chatWindow = document.createElement("div");
    chatWindow.id = "chat-window";
    chatWindow.style.height = "415px";
    chatWindow.style.overflow = "auto";
    chatWindow.style.background = "rgb(199 198 198 / 1)";
    chatWindow.style.display = "flex";
    chatWindow.style["flex-direction"] = "column";

    return chatWindow;
}

function getInputContainer() {
    const inputContainer = document.createElement("div");
    inputContainer.id = "container-main";
    inputContainer.style.display = "flex";
    const input = document.createElement("textarea");
    const sendButton = document.createElement("button");
    appendButtonStyles(sendButton);
    appendInputStyles(input);
    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    return inputContainer;
}

function appendButtonStyles(sendButton) {
    sendButton.style.padding = "5px 15px";
    sendButton.style.background = "#3397d2";
    sendButton.style.border = "none";
    sendButton.style.color = "white";
    sendButton.style["border-radius"] = "3px";
    sendButton.innerHTML = "Send";

    sendButton.onclick = function () {
        const input = document.getElementById("chat-widget-input");
        if (!input.value) {
            return;
        }
        const chatWindow = document.getElementById("chat-window");
        const request = { message: input.value };
        chatWindow.scrollTop = chatWindow.scrollHeight;
        socket.send(JSON.stringify(request), "username");
        input.value = "";
    };
}

function appendInputStyles(input) {
    input.id = "chat-widget-input";
    input.style.width = "80%";
    input.placeholder = "Send...";
}

function appendMessages(messages) {
    const chatWindow = document.getElementById("chat-window");
    messages.forEach((message) => {
        const messageEl = getMessageEl(message);
        chatWindow.appendChild(messageEl);
    });
}

function getMessageEl(message) {
    const messageContainer = document.createElement("div");
    const messageBox = document.createElement("div");
    const text = document.createElement("span");
    const userString = document.createElement("span");
    messageContainer.className = "message-container";
    text.innerHTML = message.message;
    userString.innerHTML = message.byWhom.substr(message.byWhom.length - 6);

    messageBox.appendChild(userString);
    messageBox.appendChild(text);
    messageContainer.appendChild(messageBox);

    messageContainer.style.display = "flex";
    messageBox.style.display = "flex";
    messageBox.style.color = 'red';
    messageBox.style['flex-direction'] = "column";
    messageBox.style["border-radius"] = "5px";
    messageBox.style["min-width"] = "120px";
    messageBox.style["max-width"] = "1800px";
    messageBox.style["min-height"] = "25px";
    messageBox.style.margin = "5px";
    messageBox.style.padding = "5px";

    if (message.isItMe) {
        messageContainer.style["justify-content"] = "flex-end";
        messageBox.style.background = "#6bc36b";
    } else {
        messageBox.style.background = "#b0b0da";
    }

    text.style.color = "white";
    return messageContainer;
}

setTimeout(() => {
    init();
}, 500);
