// server.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');
const geoip = require('geoip-lite');
const axios = require('axios');

const BlockedIP = require('./models/BlockedIP');
const RequestLog = require('./models/RequestLog');
const spoofingDetectionMiddleware = require('./middlewares/ipSpoofingDetection');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const PRIMARY_SERVER = 'http://localhost:5000';
const SECONDARY_SERVER = 'http://localhost:5001';
let useSecondary = false;

const corsOptions = {
  origin: ['https://cyberfrontend.netlify.app', 'http://localhost:3000'], 
};



app.set('trust proxy', false); 

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(require('morgan')('dev'));
// Rate Limiter
const blockedIPs = new Set();
let serverDown = false 
const limiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 10, // Max 50 requests per IP
  handler: async (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }
    console.log("limiter ip ", ip)


    if (!blockedIPs.has(ip) && ip!="::1") {
      serverDown= true;
      blockedIPs.add(ip);
      await BlockedIP.create({ ip });
      io.emit('server-switch', serverDown ? 'Secondary' : 'Primary');
      io.emit('blocked-ip', ip);
    }
    res.status(429).json({ message: 'Too many requests. You are blocked!' });
  },
});

mongoose.connect('mongodb://127.0.0.1:27017/cybersecurity', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

app.use(spoofingDetectionMiddleware);
app.use(async (req, res, next) => {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  console.log("middle ip ", ip)
  if (blockedIPs.has(ip)) {
    return res.status(403).json({ message: 'Access denied. IP is blocked.' });
  }
  await RequestLog.create({
    ip,
    endpoint: req.url,
    method: req.method,
    server: useSecondary ? 'Secondary' : 'Primary',
  });
  next();
});

// Failover Logic
const handleRequest = async (req, res) => {
  const server = useSecondary ? SECONDARY_SERVER : PRIMARY_SERVER;
  try {
    res.json({ a: "response.data" });
  } catch (error) {
    console.log(blockedIPs)
    console.log(error)
    console.warn(`${server} is down. Switching to ${useSecondary ? 'Primary' : 'Secondary'} server.`);
    io.emit('server-switch', useSecondary ? 'Secondary' : 'Primary');
    res.status(503).json({ message: 'Failover in progress. Please retry.' });
  }
};

// Routes
app.get('/api/resource', limiter, handleRequest);
app.get('/api/logs', async (req, res) => {
  const logs = await RequestLog.find().sort({ createdAt: -1 });
  res.json(logs);
});
app.get('/api/blocked-ips', async (req, res) => {
  const ips = await BlockedIP.find();
  res.json(ips);
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected.');
  socket.on('disconnect', () => console.log('Client disconnected.'));
});

// Start Server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
