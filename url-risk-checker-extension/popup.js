const API_URL = 'http://localhost:3000/api/security/check-url';

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url || !tab.url.startsWith('http')) {
    document.getElementById('url').textContent = 'Not a checkable page';
    document.getElementById('status').textContent = '—';
    return;
  }

  document.getElementById('url').textContent = tab.url;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: tab.url }),
    });

    const assessment = await response.json();
    render(assessment);
  } catch (error) {
    document.getElementById('status').textContent = 'Error: could not reach backend';
  }
}

function render(assessment) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = assessment.status.toUpperCase();
  statusEl.className = 'status ' + assessment.status;

  document.getElementById('score').textContent = `Risk score: ${assessment.score}/100`;

  const list = document.getElementById('findings');
  list.innerHTML = '';

  assessment.findings.forEach(f => {
    const li = document.createElement('li');
    li.textContent = `${f.source}: ${f.detail}`;
    list.appendChild(li);
  });

  (assessment.heuristics || []).forEach(h => {
    const li = document.createElement('li');
    li.textContent = `⚠ ${h}`;
    list.appendChild(li);
  });
}

init();