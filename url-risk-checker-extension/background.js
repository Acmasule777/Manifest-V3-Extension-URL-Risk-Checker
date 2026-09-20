const API_URL = 'http://localhost:3000/api/security/check-url';

chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId !== 0) return;          // only the main page, not iframes
  if (!details.url.startsWith('http')) return; // skip chrome://, etc.

  const url = details.url;

  // If the user just clicked "Proceed anyway" for this exact URL, skip the check once.
  const bypassKey = `bypass_${url}`;
  const bypass = await chrome.storage.session.get(bypassKey);
  if (bypass[bypassKey]) {
    await chrome.storage.session.remove(bypassKey);
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const assessment = await response.json();

    updateBadge(details.tabId, assessment.status);

    if (assessment.status === 'malicious' || assessment.status === 'suspicious') {
      const warningUrl = chrome.runtime.getURL('warning.html') +
        `?url=${encodeURIComponent(url)}&score=${assessment.score}&status=${assessment.status}` +
        `&findings=${encodeURIComponent(JSON.stringify(assessment.findings))}`;
      chrome.tabs.update(details.tabId, { url: warningUrl });
    }
  } catch (error) {
    console.error('Risk check failed:', error);
  }
});

function updateBadge(tabId, status) {
  const colors = { safe: '#4CAF50', suspicious: '#F9A825', malicious: '#D32F2F' };
  chrome.action.setBadgeText({ tabId, text: status === 'safe' ? '' : '!' });
  chrome.action.setBadgeBackgroundColor({ tabId, color: colors[status] || '#999' });
}