const params = new URLSearchParams(window.location.search);
const url = params.get('url');
const score = params.get('score');
const status = params.get('status');
const findings = JSON.parse(params.get('findings') || '[]');

document.getElementById('title').textContent =
  status === 'malicious' ? '⛔ Blocked: Malicious Site' : '⚠ Warning: Suspicious Site';
document.getElementById('url').textContent = url;
document.getElementById('score').textContent = `Risk score: ${score}/100`;

const list = document.getElementById('findings');
findings.forEach(f => {
  const li = document.createElement('li');
  li.textContent = `${f.source}: ${f.detail}`;
  list.appendChild(li);
});

document.getElementById('back').addEventListener('click', () => {
  history.back(); // returns to whatever page you were on before
});

document.getElementById('proceed').addEventListener('click', async () => {
  const bypassKey = `bypass_${url}`;
  await chrome.storage.session.set({ [bypassKey]: true });
  window.location.href = url;
});