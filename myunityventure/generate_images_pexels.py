#!/usr/bin/env python3
"""
Fetch the 8 cinematic scene images for myunityventure.com from the FREE
Pexels stock-photography API (free key, no billing).

Get a key: https://www.pexels.com/api/

Run:
    PEXELS_KEY=xxxx python generate_images_pexels.py
Images are written to ./images as landscape JPEGs. Because Pexels returns
real photographs (not prompt generation), each act maps to a curated set of
search queries; the first high-resolution landscape hit is used.
"""
import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path

KEY = os.environ.get("PEXELS_KEY") or os.environ.get("PEXELS_API_KEY")
if not KEY:
    sys.exit("PEXELS_KEY not set. Get a free key at https://www.pexels.com/api/")

# (filename, [ordered search queries], min_width)
SCENES = [
    ("act1-phone.jpg", ["hand holding phone beach", "smartphone ocean sunset", "phone in hand seaside"], 1200),
    ("act2-report.jpg", ["person using smartphone closeup", "hand holding phone app", "smartphone screen hand"], 1200),
    ("act3-blueprint.jpg", ["architecture blueprint house plan", "house floor plan drawing", "architect blueprint desk"], 1200),
    ("act4-factory.jpg", ["steel factory manufacturing", "metal fabrication factory worker", "industrial steel warehouse"], 1400),
    ("act5-truck.jpg", ["flatbed truck highway", "semi truck coastal road", "cargo truck sunset highway"], 1400),
    ("act6-build.jpg", ["construction crane building site", "house construction crane", "building site crane sky"], 1400),
    ("act7-interior.jpg", ["modern living room ocean view window", "beach house interior large windows", "luxury living room sea view"], 1400),
    ("act8-exterior.jpg", ["modern beach house exterior", "luxury coastal house ocean", "modern house glass facade sunset"], 1400),
]

OUT = Path("images")
OUT.mkdir(exist_ok=True)


def search(query: str):
    url = ("https://api.pexels.com/v1/search?query=%s&per_page=5&orientation=landscape&size=large"
           % urllib.parse_quote(query))
    req = urllib.request.Request(url, headers={
        "Authorization": KEY,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def download(url: str, path: Path):
    req = urllib.request.Request(url, headers={"User-Agent": "uvg-build"})
    with urllib.request.urlopen(req, timeout=120) as r:
        path.write_bytes(r.read())
    return path.stat().st_size


# small shim so we don't import urllib.parse at top awkwardly
import urllib.parse
urllib.parse_quote = urllib.parse.quote


def fetch(filename: str, queries, min_w: int):
    """Return a credit string on success, or None on failure."""
    for q in queries:
        try:
            data = search(q)
        except urllib.error.HTTPError as e:
            print(f"  query '{q}' HTTP {e.code}: {e.read().decode('utf-8','ignore')[:120]}")
            if e.code in (401, 403, 429):
                raise  # auth/quota: abort the whole run
            continue
        except Exception as e:
            print(f"  query '{q}' error: {str(e)[:100]}"); continue
        for photo in data.get("photos", []):
            if photo.get("width", 0) < min_w:
                continue
            src = photo["src"].get("landscape") or photo["src"].get("large2x") or photo["src"].get("large")
            try:
                size = download(src, OUT / filename)
                cred = photo.get("photographer", "?")
                print(f"  saved images/{filename} ({size//1024} KB) | '{q}' | (c) {cred}")
                return f"{filename}: {q} -- photo by {cred} ({photo.get('url','')})"
            except Exception as e:
                print(f"  download failed: {str(e)[:100]}"); continue
    return None


def main():
    failures, credits = [], []
    for filename, queries, min_w in SCENES:
        print(f"-> {filename}")
        credit = fetch(filename, queries, min_w)
        if credit:
            credits.append(credit)
        else:
            failures.append(filename)
    (OUT / "CREDITS.txt").write_text("Pexels photo credits (free license)\n\n" + "\n".join(credits) + "\n")
    print("\nCredits written to images/CREDITS.txt")
    if failures:
        sys.exit(f"Failed: {', '.join(failures)}")
    print("All 8 images fetched.")


if __name__ == "__main__":
    main()
