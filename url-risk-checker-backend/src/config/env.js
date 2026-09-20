require('dotenv').config();

module.exports = {
  googleSafeBrowsingApiKey: process.env.GOOGLE_SAFE_BROWSING_API_KEY,
  virusTotalApiKey: process.env.VIRUSTOTAL_API_KEY,
  port: process.env.PORT || 3000,
};