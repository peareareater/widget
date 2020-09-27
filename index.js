let socket = null;
const apiUrl = "localhost:8888";

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
  socket.onopen = function () {
    socket.send("message to send");
    console.log("message is sent");
  };
  socket.onmessage = function (e) {
    const message = e.data;
    console.log(message, "message");
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
  chatWindow.style.height = "93%";
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
    const request = {message: input.value};
    socket.send(JSON.stringify(request), 'username');
  };
}
function appendInputStyles(input) {
  input.id = "chat-widget-input";
  input.style.width = "80%";
  input.placeholder = "Send...";
}
setTimeout(() => {
  init();
}, 500);
