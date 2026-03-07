import os
import re

directory = '/Users/akshaythaman/Desktop/autowhat website'
html_files = [f for f in os.listdir(directory) if f.endswith('.html')]

for filename in html_files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content

    # Replace navigation and generic contact links
    content = content.replace('href="#contact"', 'href="contact-us.html"')
    content = content.replace('href="index.html#contact"', 'href="contact-us.html"')

    # The CTA is typically the last button before the footer
    # We can use regex to find the button inside a .cta-section or similar.
    # Actually, the user asked to change the bottom CTA buttons.
    # They usually have the class "btn-primary" or "btn btn-primary"
    # Let's target `<a ... class="btn-primary"...>Text</a>` or `class="btn btn-primary"`
    # But since we just globally changed href="#contact" to href="contact-us.html",
    # that alone will probably fix all the buttons because we used href="#contact" for most!
    
    # Just in case, let's explicitly find any `href="#" class="btn-primary"` 
    # near the bottom of the page (before footer).
    # Regex to find <a href="..." class="...btn-primary..."> and replace href.
    
    # Let's do a simple replace for all "btn-primary" that might have empty href="#"
    content = re.sub(
        r'<a\s+href="[^"]*"\s+(class="[^"]*btn-primary[^"]*")',
        r'<a href="contact-us.html" \1',
        content
    )

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated links in {filename}")
    else:
        print(f"No changes in {filename}")
