// Sevenforce landing page — "Try Maya" live AI demo widget.
// Public, unauthenticated, server-side rate-limited (5/hr per IP, 200/hr
// global — see backend/app/ratelimit.py + the /api/tools/content-demo route
// in backend/features.py).
//
// Security note: the AI response rendered below is untrusted text (model
// output, not developer-authored). This app is vanilla JS with no React
// escaping safety net, so renderResult() NEVER uses innerHTML for it — it
// builds real DOM nodes/elements via document.createElement/createTextNode,
// same rule Phase 1 established for apps/sevenseed's AIDemoWidget.
(function () {
  var API_BASE = "/sevenforce";

  var form = document.getElementById('demoForm');
  if (!form) return; // widget isn't on this page

  var topicInput = document.getElementById('demoTopic');
  var btn = document.getElementById('demoBtn');
  var btnLbl = document.getElementById('demoBtnLbl');
  var btnIcon = btn.querySelector('i');
  var errorEl = document.getElementById('demoError');
  var resultEl = document.getElementById('demoResult');
  var resultBody = document.getElementById('demoResultBody');
  var chips = document.querySelectorAll('.demo-chip');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      topicInput.value = chip.getAttribute('data-topic') || '';
      topicInput.focus();
    });
  });

  // Turn "...**bold**..." markdown-ish text into real <strong> elements,
  // line by line, using only text nodes / createElement — no innerHTML.
  function renderResult(container, text) {
    while (container.firstChild) container.removeChild(container.firstChild);
    var lines = String(text || '').split('\n');
    lines.forEach(function (line) {
      if (!line.trim()) {
        var gap = document.createElement('p');
        gap.className = 'demo-line-gap';
        container.appendChild(gap);
        return;
      }
      var p = document.createElement('p');
      var parts = line.split(/\*\*(.+?)\*\*/g);
      parts.forEach(function (part, i) {
        if (i % 2 === 1) {
          var strong = document.createElement('strong');
          strong.textContent = part;
          p.appendChild(strong);
        } else if (part) {
          p.appendChild(document.createTextNode(part));
        }
      });
      container.appendChild(p);
    });
  }

  function setLoading(loading) {
    btn.disabled = loading;
    if (btnLbl) btnLbl.textContent = loading ? 'Maya is writing…' : 'Generate with Maya';
    if (btnIcon) btnIcon.className = loading ? 'fas fa-spinner fa-spin' : 'fas fa-wand-magic-sparkles';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var topic = (topicInput.value || '').trim();
    if (!topic || btn.disabled) return;

    errorEl.textContent = '';
    resultEl.style.display = 'none';
    setLoading(true);

    fetch(API_BASE + '/api/tools/content-demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topic.slice(0, 120) })
    })
      .then(function (res) {
        if (res.status === 429) {
          return res.json().catch(function () { return null; }).then(function (data) {
            throw new Error((data && data.detail) || 'This demo is popular right now — please try again in a moment.');
          });
        }
        if (!res.ok) {
          return res.json().catch(function () { return null; }).then(function (data) {
            throw new Error((data && (data.detail || data.error)) || 'Something went wrong. Please try again.');
          });
        }
        return res.json();
      })
      .then(function (data) {
        renderResult(resultBody, data && data.result);
        resultEl.style.display = 'block';
      })
      .catch(function (err) {
        errorEl.textContent = (err && err.message) ? err.message : "Couldn't reach the AI right now. Please try again shortly.";
      })
      .finally(function () {
        setLoading(false);
      });
  });
})();
