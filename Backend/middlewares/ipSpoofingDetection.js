const geoip = require('geoip-lite');
const requestIp = require('request-ip');

const spoofingDetectionMiddleware = async (req, res, next) => {
  // Get the IP address from the 'X-Forwarded-For' header (for Netlify reverse proxy)
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(req.headers)
  // If there are multiple IPs in 'X-Forwarded-For', take the first one (real client IP)
  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  const geoData = geoip.lookup(ip);
  console.log('Real IP:', ip);

  // Detect spoofed IPs without valid geoData
  if (!geoData) {
    console.warn(`Spoofed IP detected: ${ip}`);
    return res.status(403).json({ message: 'Access denied. IP appears spoofed.' });
  }

  next();
};

module.exports = spoofingDetectionMiddleware;
