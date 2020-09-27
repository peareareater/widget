const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const users = new Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: Number },
});

module.exports = mongoose.model("users", users);