// models/RequestLog.js
const mongoose = require('mongoose');

const RequestLogSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  server: { type: String, default: 'Primary' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RequestLog', RequestLogSchema);
