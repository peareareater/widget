const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const user = new Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: Number },
});

module.exports = mongoose.model("User", user);