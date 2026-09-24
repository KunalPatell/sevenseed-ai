import os

target = """    var name = (document.getElementById('cf-name').value || '').trim();
    var from = (document.getElementById('cf-email').value || '').trim();
    var orgEl = document.getElementById('cf-org');
    var sizeEl = document.getElementById('cf-size');
    var org = orgEl ? (orgEl.value || '').trim() : '';
    var size = sizeEl ? (sizeEl.value || '').trim() : '';
    var typeEl = document.getElementById('cf-type');
    var type = typeEl ? (typeEl.value || '').trim() : '';
    var subj = (document.getElementById('cf-subject').value || '').trim() || ('Enquiry for ' + company);
    if (type) subj = '[' + type + '] ' + subj;
    var msg = (document.getElementById('cf-msg').value || '').trim();"""

replacement = """    var nameEl = document.getElementById('cf-name');
    var fromEl = document.getElementById('cf-email');
    var subjEl = document.getElementById('cf-subject');
    var msgEl = document.getElementById('cf-msg');
    var name = (nameEl ? nameEl.value : '') || '';
    name = name.trim();
    var from = (fromEl ? fromEl.value : '') || '';
    from = from.trim();
    var orgEl = document.getElementById('cf-org');
    var sizeEl = document.getElementById('cf-size');
    var org = orgEl ? (orgEl.value || '').trim() : '';
    var size = sizeEl ? (sizeEl.value || '').trim() : '';
    var typeEl = document.getElementById('cf-type');
    var type = typeEl ? (typeEl.value || '').trim() : '';
    var subj = (subjEl ? (subjEl.value || '').trim() : '') || ('Enquiry for ' + company);
    if (type) subj = '[' + type + '] ' + subj;
    var msg = (msgEl ? (msgEl.value || '').trim() : '');"""

count = 0
for root, dirs, files in os.walk('sites'):
    if 'app.js' in files:
        fp = os.path.join(root, 'app.js')
        with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        if target in content:
            content = content.replace(target, replacement)
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print(f"Patched: {fp}")

print(f"Total app.js files safely patched: {count}")
