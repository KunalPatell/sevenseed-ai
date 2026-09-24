import os

old_const = "const models = ['gemini-flash-latest', 'gemini-3.6-flash', 'gemini-flash-lite-latest'];"
new_const = "const models = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.6-flash'];"

count = 0
for root, dirs, files in os.walk('sites'):
    for f in files:
        if f.endswith('.html'):
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8', errors='ignore') as fp_in:
                c = fp_in.read()
            if old_const in c:
                c = c.replace(old_const, new_const)
                with open(fp, 'w', encoding='utf-8') as fp_out:
                    fp_out.write(c)
                count += 1
                print(f"Updated HTML tool model order in: {fp}")

print(f"Total HTML tool files updated: {count}")
