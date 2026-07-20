import re

def parse_vcf(fname):
    contacts = []
    with open(fname, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    for card in content.split('BEGIN:VCARD'):
        card = card.strip()
        if not card: continue
        fn,phone,email,org = '','','',''
        for line in card.splitlines():
            line = line.strip()
            if line.startswith('FN:'):   fn   = line[3:].strip()
            elif line.startswith('TEL') and ':' in line and not phone:
                phone = line.split(':',1)[1].strip()
            elif line.startswith('EMAIL') and ':' in line and not email:
                email = line.split(':',1)[1].strip()
            elif line.startswith('ORG:') and not org:
                org = line[4:].strip()
        contacts.append({'fn':fn,'phone':phone,'email':email,'org':org})
    return contacts

contacts = parse_vcf('hr_vcards_15-6-26.vcf')
for i,c in enumerate(contacts,1):
    fn = c['fn'][:45]
    ph = c['phone'][:18]
    em = c['email'][:32]
    print(f"{i:3d}. FN={fn:45s} | PH={ph:18s} | EM={em}")
