import os
import glob
import re

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the exact nav logo string
    new_content = re.sub(
        r'<div class="logo">\s*<a href=".*?">Autowhat AI</a>\s*</div>',
        '<div class="logo">\n                <a href="index.html"><img src="logo.png" alt="Autowhat AI"></a>\n            </div>',
        content
    )
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
