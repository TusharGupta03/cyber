// middlewares/ipSpoofingDetection.js
const geoip = require('geoip-lite');

const spoofingDetectionMiddleware = async (req, res, next) => {
  const ip = req.ip;
  const geoData = geoip.lookup(ip);
  console.log(ip)
  // Detect spoofed IPs without valid geoData
  if (!geoData) {
    console.warn(`Spoofed IP detected: ${ip}`);
    return res.status(403).json({ message: 'Access denied. IP appears spoofed.' });
  }

  next();
};

module.exports = spoofingDetectionMiddleware;
