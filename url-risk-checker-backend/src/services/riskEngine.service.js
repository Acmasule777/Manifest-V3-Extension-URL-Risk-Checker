function heuristicPoints(url) {
  let points = 0;
  const findings = [];
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') { points += 10; findings.push('Not using HTTPS'); }
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(u.hostname)) { points += 15; findings.push('Host is a raw IP address'); }
    if (u.hostname.includes('xn--')) { points += 10; findings.push('Punycode/IDN hostname'); }
    if (url.includes('@')) { points += 15; findings.push('URL contains "@" character'); }
  } catch {
    // already validated upstream, but stay defensive
  }
  return { points, findings };
}

function evaluate(url, findings) {
  let score = 0;
  findings.forEach(f => { if (f.flagged) score += 55; });

  const heuristic = heuristicPoints(url);
  score += heuristic.points;
  score = Math.min(score, 100);

  let status = 'safe';
  if (score >= 55) status = 'malicious';
  else if (score >= 20) status = 'suspicious';

  return {
    url,
    score,
    status,
    findings,
    heuristics: heuristic.findings,
    checkedAt: new Date().toISOString(),
  };
}

module.exports = { evaluate };