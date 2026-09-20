const axios = require('axios');
const env = require('../config/env');

function encodeUrlId(url) {
  return Buffer.from(url).toString('base64url'); // base64url = URL-safe, no padding
}

async function checkVirusTotal(url) {
  const source = 'VirusTotal';

  if (!env.virusTotalApiKey) {
    return { source, flagged: false, detail: 'No API key configured' };
  }

  const urlId = encodeUrlId(url);
  const endpoint = `https://www.virustotal.com/api/v3/urls/${urlId}`;

  try {
    const response = await axios.get(endpoint, {
      headers: { 'x-apikey': env.virusTotalApiKey },
    });
    const stats = response.data.data.attributes.last_analysis_stats;
    const flagged = stats.malicious > 0 || stats.suspicious > 0;
    return {
      source,
      flagged,
      detail: flagged
        ? `${stats.malicious} vendors flagged malicious, ${stats.suspicious} suspicious`
        : `Clean across ${stats.harmless + stats.undetected} vendors`,
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { source, flagged: false, detail: 'Not previously scanned by VirusTotal' };
    }
    return { source, flagged: false, detail: `Request failed: ${error.message}` };
  }
}

module.exports = { checkVirusTotal };