# -*- coding: utf-8 -*-
"""
HTML content scraper and text extractor.
Fetches websites and extracts the core textual content, removing scripts/styling/boilerplate.
"""
import urllib.request
import urllib.parse
import re

def scrape_url_content(url: str) -> dict:
    """
    Fetches the HTML of a URL and extracts readable plain text (title, headers, body).
    """
    # Normalise URL
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as response:
            html_bytes = response.read()
            # Detect charset
            content_type = response.headers.get_content_charset() or "utf-8"
            html_text = html_bytes.decode(content_type, errors="replace")
            redirected_url = response.geturl()
    except Exception as e:
        return {"success": False, "error": f"Failed to fetch URL: {str(e)}"}

    # Extract Page Title
    title_match = re.search(r"<title[^>]*>(.*?)</title>", html_text, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1).strip() if title_match else "No Title Found"
    # Unescape HTML entities in title
    title = re.sub(r"&[#a-zA-Z0-9]+;", " ", title)

    # Strip script and style tags
    clean_html = re.sub(r"<script[^>]*>.*?</script>", "", html_text, flags=re.DOTALL | re.IGNORECASE)
    clean_html = re.sub(r"<style[^>]*>.*?</style>", "", clean_html, flags=re.DOTALL | re.IGNORECASE)
    clean_html = re.sub(r"<!--.*?-->", "", clean_html, flags=re.DOTALL)

    # Extract headings (h1, h2, h3) and paragraphs (p)
    content_blocks = []
    
    # We find tags like h1, h2, h3, p, li
    tags = re.findall(r"<(h1|h2|h3|p|li)[^>]*>(.*?)</\1>", clean_html, re.DOTALL | re.IGNORECASE)
    
    for tag_name, inner_html in tags:
        # Strip internal tags inside heading/paragraph
        text = re.sub(r"<[^>]+>", "", inner_html)
        # Normalize whitespace
        text = " ".join(text.split())
        # Unescape basic html entities
        text = re.sub(r"&[#a-zA-Z0-9]+;", " ", text)
        text = text.strip()
        
        if len(text) > 15: # Filter out short noise/buttons
            if tag_name.startswith("h"):
                content_blocks.append(f"\n### {text}\n")
            else:
                content_blocks.append(text)

    full_text = "\n\n".join(content_blocks)
    
    # If no tags matched, do a generic regex-based text extraction
    if not full_text.strip():
        generic_text = re.sub(r"<[^>]+>", " ", clean_html)
        generic_text = "\n".join(line.strip() for line in generic_text.splitlines() if line.strip())
        generic_text = re.sub(r"\n{3,}", "\n\n", generic_text)
        full_text = generic_text[:3000] # Limit size

    return {
        "success": True,
        "url": redirected_url,
        "title": title,
        "extracted_text": full_text[:8000] # Cap text output to avoid context overflow
    }
