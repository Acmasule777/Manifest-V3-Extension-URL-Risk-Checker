const { checkGoogleSafeBrowsing } = require('../providers/googleSafeBrowsing.provider');
const { checkVirusTotal } = require('../providers/virusTotal.provider');

async function getFindings(url) {
  const results = await Promise.allSettled([
    checkGoogleSafeBrowsing(url),
    checkVirusTotal(url),
  ]);

  return results.map((result, index) => {
    if (result.status === 'fulfilled') return result.value;
    const source = index === 0 ? 'Google Safe Browsing' : 'VirusTotal';
    return { source, flagged: false, detail: `Source unavailable: ${result.reason}` };
  });
}

module.exports = { getFindings };