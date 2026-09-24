import os, shutil

pairs = [
    ('decode-forest-pharmacy', 'pharmacy'),
    ('breakdown-factor', 'breakdown'),
    ('comonk', 'comonk-ai'),
    ('avp-charitable-trust', 'trust')
]

for src, dst in pairs:
    src_dir = os.path.join('sites', src)
    dst_dir = os.path.join('sites', dst)
    if not os.path.exists(dst_dir):
        os.makedirs(dst_dir, exist_ok=True)
    
    for item in os.listdir(src_dir):
        src_path = os.path.join(src_dir, item)
        dst_path = os.path.join(dst_dir, item)
        if os.path.isfile(src_path):
            shutil.copy2(src_path, dst_path)
            print(f"Copied {src_path} -> {dst_path}")

print("All mirror directories synchronized successfully!")
