// models/BlockedIP.js
const mongoose = require('mongoose');

const BlockedIPSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BlockedIP', BlockedIPSchema);
