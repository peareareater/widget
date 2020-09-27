const User = require("../models/user");
const Message = require("../models/history");

async function createUser(id) {
    const user = await User.create({ id, timestamp: Date.now() });
    await user.save();
}

async function createMessage(message, userId) {
    const msg = JSON.parse(message);
    const _message = {
        message: msg.message,
        byWhom: userId,
        timestamp: Date.now(),
    };
    const doc = await Message.create(_message);
    await doc.save();
    return _message;
}

async function removeUser(id) {
    await User.find({ id }).remove().exec();
}

async function getMessages() {
    return await Message.find();
}

function getRandomColor() {
    return (
        "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
    );
}

module.exports = {
    createUser,
    createMessage,
    getMessages,
    getRandomColor,
    removeUser,
};
