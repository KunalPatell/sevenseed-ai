import os

# Target directories across repository
TARGET_DIRS = [
    r'e:\main\apps\sevenseed\sites',
    r'e:\main\apps\sevenseed\apps\sevenseed\backend\static',
]

prev_order = "var models = ['gemini-flash-latest', 'gemini-3.6-flash', 'gemini-flash-lite-latest'];"
new_order = "var models = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.6-flash'];"

single_flash = "var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + encodeURIComponent(key);"
failover_block = """var models = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.6-flash'];
    function tryModel(idx){
      if(idx >= models.length) return Promise.reject(new Error('All Gemini endpoints busy'));
      var m = models[idx];
      var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + m + ':generateContent?key=' + encodeURIComponent(key);
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: sys + '\\n\\nVISITOR QUESTION: ' + q }] }] })
      })
      .then(function(res){
        if (!res.ok) return tryModel(idx + 1);
        return res.json().then(function(data){
          var text = data && data.candidates && data.candidates[0] && data.candidates[0].content &&
            data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
          if (!text) return tryModel(idx + 1);
          return text.trim();
        });
      })
      .catch(function(){ return tryModel(idx + 1); });
    }
    return tryModel(0);"""

count = 0
for base_dir in TARGET_DIRS:
    if not os.path.isdir(base_dir):
        continue
    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d != '_next']
        for f in files:
            if f.endswith(('.js', '.html')):
                fp = os.path.join(root, f)
                try:
                    with open(fp, 'r', encoding='utf-8') as fh:
                        c = fh.read()
                except Exception:
                    continue
                changed = False
                if prev_order in c:
                    c = c.replace(prev_order, new_order)
                    changed = True
                if changed:
                    with open(fp, 'w', encoding='utf-8') as fh:
                        fh.write(c)
                    count += 1
                    rel = os.path.relpath(fp, r'e:\main\apps\sevenseed')
                    print(f"Updated failover priority in {rel}")

print(f"Total files verified/updated: {count}")
