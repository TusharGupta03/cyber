const geoip = require('geoip-lite');

const spoofingDetectionMiddleware = async (req, res, next) => {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  if (ip === '127.0.0.1' || ip === '::1') {
    return next(); 
  }

  const geoData = geoip.lookup(ip);

  if (!geoData || !geoData.country) {
    console.warn(`Suspicious or incomplete geo data for IP: ${ip}`);
    return res.status(403).json({ message: 'Access denied. IP appears suspicious.' });
  }

  console.log(`IP: ${ip}, GeoData: ${JSON.stringify(geoData)}`);

  next();
};

module.exports = spoofingDetectionMiddleware;
