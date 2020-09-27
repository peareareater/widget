const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const message = new Schema({
  message: { type: String },
  byWhom: { type: String },
  timestamp: { type: Number },
});

module.exports = mongoose.model("Message", message);
