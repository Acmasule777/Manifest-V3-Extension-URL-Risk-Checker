const { isValidUrl } = require('../validators/url.validator');
const { getFindings } = require('../services/urlIntelligence.service');
const riskEngine = require('../services/riskEngine.service');

async function checkUrl(req, res) {
  const { url } = req.body;

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'A valid http(s) URL is required' });
  }

  const findings = await getFindings(url);
  const assessment = riskEngine.evaluate(url, findings);

  res.json(assessment);
}

module.exports = { checkUrl };