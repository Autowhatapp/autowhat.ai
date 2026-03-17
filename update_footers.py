import os
import re

directory = '/Users/akshaythaman/Desktop/Autowhat /autowhat website'

# Updated footer with Company column linking to About Us
new_footer = """    <footer>
        <div class="container footer-grid">
            <div class="footer-col">
                <h4 style="color:#ffffff;">AUTOWHAT AI</h4>
                <p style="color: var(--primary-color);">Innovating for a better tomorrow.</p>
            </div>
            <div class="footer-col">
                <h4 style="color:#ffffff;">Offerings</h4>
                <ul>
                    <li><a href="gate-module.html">AutoGate</a></li>
                    <li><a href="vehicle-fleet-management.html">Vehicle Fleet Management</a></li>
                    <li><a href="vendor-payable.html">Vendor Payable Software</a></li>
                    <li><a href="algo-trading.html">Algo Trading</a></li>
                    <li><a href="pms-data-scraping.html">PMS Data Scraping Automation</a></li>
                    <li><a href="chat-with-database.html">Chat with Database</a></li>
                    <li><a href="content-ai.html">Content AI</a></li>
                    <li><a href="mgrow.html">MGrow</a></li>
                    <li><a href="learnpro.html">LearnPro</a></li>
                    <li><a href="ai-consulting.html">AI Consulting</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 style="color:#ffffff;">Company</h4>
                <ul>
                    <li><a href="about-us.html">About Us</a></li>
                    <li><a href="who-we-are.html">Who We Are</a></li>
                    <li><a href="contact-us.html">Contact Us</a></li>
                </ul>
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
