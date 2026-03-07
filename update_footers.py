import os
import re

directory = '/Users/akshaythaman/Desktop/autowhat website'

# The exact footer from index.html
new_footer = """    <footer>
        <div class="container footer-grid">
            <div class="footer-col">
                <h4 style="color:#ffffff;">AUTOWHAT AI</h4>
                <p style="color: var(--primary-color);">Innovating for a better tomorrow.</p>
            </div>
            <div class="footer-col">
                <h4 style="color:#ffffff;">Company</h4>
                <ul>
                    <li><a href="#" style="color:#ffffff;">Our Team</a></li>
                    <li><a href="#" style="color:#ffffff;">Careers</a></li>
                    <li><a href="#" style="color:#ffffff;">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 style="color:#ffffff;">Connect</h4>
                <div class="social-links">
                    <a href="#">Li</a>
                    <a href="#">Tw</a>
                    <a href="#">In</a>
                </div>
            </div>
        </div>
        <div class="container footer-bottom">
            <p>&copy; 2026 Autowhat AI. All rights reserved.</p>
        </div>
    </footer>"""

# Ensure we don't mess up index.html itself, although replacing it with the same string is harmless.
files = [f for f in os.listdir(directory) if f.endswith('.html')]

for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the footer element using regex. It handles attributes on <footer ...>
    # and matches up to </footer>
    # re.DOTALL makes '.' match newlines
    pattern = re.compile(r'<footer\b[^>]*>.*?</footer>', re.DOTALL | re.IGNORECASE)
    
    if pattern.search(content):
        # We also want to replace the preceding comment `<!-- Footer ... -->` if it exists.
        # But this is safer just to replace the footer tag directly.
        new_content = pattern.sub(new_footer, content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated footer in {filename}")
        else:
            print(f"No changes needed for {filename}")
    else:
        print(f"No footer found in {filename}")
