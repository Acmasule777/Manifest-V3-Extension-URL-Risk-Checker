const axios = require('axios');
const env = require('../config/env');

async function checkGoogleSafeBrowsing(url) {
  const source = 'Google Safe Browsing';

  if (!env.googleSafeBrowsingApiKey) {
    return { source, flagged: false, detail: 'No API key configured' };
  }

  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${env.googleSafeBrowsingApiKey}`;
  const body = {
    client: { clientId: 'url-risk-checker', clientVersion: '1.0.0' },
    threatInfo: {
      threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url }],
    },
  };

  try {
    const response = await axios.post(endpoint, body);
    const matches = response.data.matches || [];
    return {
      source,
      flagged: matches.length > 0,
      detail: matches.length
        ? `Flagged for: ${[...new Set(matches.map(m => m.threatType))].join(', ')}`
        : 'No known threats found',
    };
  } catch (error) {
    return { source, flagged: false, detail: `Request failed: ${error.message}` };
  }
}

module.exports = { checkGoogleSafeBrowsing };