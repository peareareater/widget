const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const history = new Schema({
  message: { type: String },
  byWhom: { type: string },
  timestamp: { type: number },
});

module.exports = mongoose.model("history", history);
