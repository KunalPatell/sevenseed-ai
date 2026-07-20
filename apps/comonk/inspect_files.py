import pandas as pd
import pdfplumber

# clean_hr_linkedin_list.csv
df1 = pd.read_csv('clean_hr_linkedin_list.csv', encoding='utf-8', encoding_errors='ignore')
print('=== clean_hr_linkedin_list.csv ===')
print('Shape:', df1.shape)
print('Columns:', list(df1.columns))
print(df1.head(5).to_string())
print()

# linkedin_profiles.csv
df2 = pd.read_csv('linkedin_profiles.csv', encoding='utf-8', encoding_errors='ignore')
print('=== linkedin_profiles.csv ===')
print('Shape:', df2.shape)
print('Columns:', list(df2.columns))
print(df2.head(5).to_string())
print()

# emails.csv
df3 = pd.read_csv('emails.csv', encoding='utf-8', encoding_errors='ignore')
print('=== emails.csv ===')
print('Shape:', df3.shape)
print('Columns:', list(df3.columns))
print(df3.head(5).to_string())
print()

# hr_mail_list.pdf
print('=== hr_mail_list.pdf ===')
try:
    with pdfplumber.open('hr_mail_list.pdf') as pdf:
        text = ''
        for page in pdf.pages[:3]:
            text += (page.extract_text() or '') + '\n'
    print(text[:2000])
except Exception as e:
    print('Error:', e)
print()

# Mail list (1).pdf
print('=== Mail list (1).pdf ===')
try:
    with pdfplumber.open('Mail list (1).pdf') as pdf:
        text = ''
        for page in pdf.pages[:3]:
            text += (page.extract_text() or '') + '\n'
    print(text[:2000])
except Exception as e:
    print('Error:', e)
