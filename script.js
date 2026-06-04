const commonPatterns = [
  { name: "Email Address", regex: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g", sample: "Contact us at hello@example.com or support@test.org" },
  { name: "Phone Number (India)", regex: "[6-9]\\d{9}", flags: "g", sample: "Call 9876543210 or 8123456789 for support" },
  { name: "URL", regex: "https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[\\/\\w\\-._~:?#[\\]@!$&'()*+,;=%]*", flags: "g", sample: "Visit https://github.com or http://example.com/page" },
  { name: "IP Address", regex: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g", sample: "Server IPs: 192.168.1.1 and 10.0.0.254" },
  { name: "Date (DD/MM/YYYY)", regex: "\\b\\d{2}\\/\\d{2}\\/\\d{4}\\b", flags: "g", sample: "Born on 15/08/2005, event on 01/01/2024" },
  { name: "Time (HH:MM)", regex: "\\b([01]?\\d|2[0-3]):[0-5]\\d\\b", flags: "g", sample: "Meeting at 09:30 and lunch at 13:00" },
  { name: "PIN Code (India)", regex: "\\b[1-9][0-9]{5}\\b", flags: "g", sample: "Rourkela PIN: 769001, Mumbai: 400001" },
  { name: "Hashtag", regex: "#[a-zA-Z_]\\w*", flags: "g", sample: "Trending: #coding #120DaysOfCode #NIT" },
  { name: "HTML Tag", regex: "<[^>]+>", flags: "g", sample: "<div class='main'><h1>Hello</h1></div>" },
  { name: "Hex Color", regex: "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b", flags: "g", sample: "Colors: #7c3aed #fff #10b981 #FF5733" },
  { name: "Integer Numbers", regex: "-?\\d+", flags: "g", sample: "Values: 42, -17, 0, 1000, -999" },
  { name: "Decimal Numbers", regex: "-?\\d+\\.\\d+", flags: "g", sample: "Pi is 3.14159, gravity is -9.81" },
  { name: "Words Only", regex: "\\b[a-zA-Z]+\\b", flags: "g", sample: "Hello World 123 foo bar 456" },
  { name: "Capitalized Words", regex: "\\b[A-Z][a-z]+\\b", flags: "g", sample: "John went to Mumbai and met Priya" },
  { name: "Empty Lines", regex: "^\\s*$", flags: "gm", sample: "Line one\n\nLine three\n\nLine five" },
  { name: "Duplicate Words", regex: "\\b(\\w+)\\s+\\1\\b", flags: "gi", sample: "This is is a test test of duplicates" },
  { name: "Credit Card", regex: "\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b", flags: "g", sample: "Card: 1234 5678 9012 3456" },
  { name: "Username (3-16 chars)", regex: "\\b[a-zA-Z][a-zA-Z0-9_]{2,15}\\b", flags: "g", sample: "Users: john_doe, Alice123, ab" },
  { name: "Strong Password", regex: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", flags: "", sample: "TestPass@123" },
  { name: "GitHub Username", regex: "\\b[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}\\b", flags: "g", sample: "GitHub: kishalayasarangi, john-doe, alice123" }
];

function renderPatterns() {
  const list = document.getElementById('patternsList');
  list.innerHTML = commonPatterns.map((p, i) => `
    <div class="pattern-item" onclick="loadPattern(${i})">
      <div class="pattern-name">${p.name}</div>
      <div class="pattern-regex">${p.regex.length > 40 ? p.regex.slice(0, 40) + '...' : p.regex}</div>
    </div>
  `).join('');
}

function loadPattern(index) {
  const p = commonPatterns[index];
  document.getElementById('regexInput').value = p.regex;
  document.getElementById('flagsInput').value = p.flags;
  document.getElementById('testInput').value = p.sample;
  validate();
}

function validate() {
  const regexStr = document.getElementById('regexInput').value;
  const flags = document.getElementById('flagsInput').value;
  const testStr = document.getElementById('testInput').value;
  const errorEl = document.getElementById('regexError');
  const countEl = document.getElementById('matchCount');
  const matchesList = document.getElementById('matchesList');
  const highlightEl = document.getElementById('highlightedOutput');

  if (!regexStr) {
    errorEl.textContent = '';
    countEl.textContent = 'Enter a regex and test string to see matches';
    countEl.className = 'result-stat';
    matchesList.innerHTML = '';
    highlightEl.textContent = testStr || 'Matches will be highlighted here...';
    return;
  }

  let regex;
  try {
    regex = new RegExp(regexStr, flags);
    errorEl.textContent = '';
  } catch (e) {
    errorEl.textContent = `❌ Invalid regex: ${e.message}`;
    countEl.textContent = '';
    matchesList.innerHTML = '';
    highlightEl.textContent = testStr;
    return;
  }

  if (!testStr) {
    countEl.textContent = 'Enter a test string to see matches';
    countEl.className = 'result-stat';
    matchesList.innerHTML = '';
    highlightEl.textContent = 'Matches will be highlighted here...';
    return;
  }

  const matches = [];
  let match;
  const safeRegex = new RegExp(regexStr, flags.includes('g') ? flags : flags + 'g');

  try {
    while ((match = safeRegex.exec(testStr)) !== null) {
      matches.push({
        value: match[0],
        index: match.index,
        end: match.index + match[0].length,
        groups: match.slice(1).filter(g => g !== undefined)
      });
      if (!flags.includes('g')) break;
      if (match[0].length === 0) safeRegex.lastIndex++;
    }
  } catch (e) {}

  if (matches.length === 0) {
    countEl.textContent = `❌ No matches found`;
    countEl.className = 'result-stat fail';
    matchesList.innerHTML = '';
    highlightEl.textContent = testStr;
    return;
  }

  countEl.textContent = `✅ ${matches.length} match${matches.length !== 1 ? 'es' : ''} found`;
  countEl.className = 'result-stat success';

  matchesList.innerHTML = matches.slice(0, 20).map((m, i) => `
    <div class="match-item">
      <span class="match-val">"${escapeHtml(m.value)}"</span>
      <span class="match-pos">Index ${m.index}–${m.end}</span>
      ${m.groups.length ? `<span class="match-groups">Groups: ${m.groups.map(g => `"${g}"`).join(', ')}</span>` : ''}
    </div>
  `).join('');

  if (matches.length > 20) {
    matchesList.innerHTML += `<div style="color:#606070;font-size:0.78rem;padding:6px 12px;">...and ${matches.length - 20} more</div>`;
  }

  // Highlight matches
  let highlighted = '';
  let lastIndex = 0;
  matches.forEach(m => {
    highlighted += escapeHtml(testStr.slice(lastIndex, m.index));
    highlighted += `<span class="highlight">${escapeHtml(m.value)}</span>`;
    lastIndex = m.end;
  });
  highlighted += escapeHtml(testStr.slice(lastIndex));
  highlightEl.innerHTML = highlighted;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br/>');
}

window.onload = () => {
  renderPatterns();
  loadPattern(0);
};