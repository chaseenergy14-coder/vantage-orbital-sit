#!/usr/bin/env python3
"""
Generate the 8 cinematic scene images for myunityventure.com via the
Google AI Studio Gemini image API (NOT Vertex AI).

Uses the current `google-genai` SDK. The legacy `google.generativeai`
package is deprecated and unreliable for IMAGE response modalities.

Run:
    GEMINI_API_KEY=... python generate_images.py
Images are written to ./images as JPEG.
"""
import os
import sys
import io
from pathlib import Path

from google import genai
from google.genai import types

try:
    from PIL import Image
    HAVE_PIL = True
except Exception:
    HAVE_PIL = False

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    sys.exit("GEMINI_API_KEY not set. Export it and re-run. (It is never printed.)")

# Model can be overridden if the account lacks access to the default.
MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-2.0-flash-exp-image-generation")

SCENES = [
    ("act1-phone.jpg",
     "Photorealistic hand holding iPhone showing a real estate app with a beachfront "
     "address typed in, ocean blurred in background, golden hour light, cinematic 85mm "
     "shallow depth of field, commercial photography quality"),
    ("act2-report.jpg",
     "Photorealistic mobile app screen showing a property feasibility report for a "
     "beachfront lot, clean UI, zoning data, flood zone status, build score, ocean "
     "visible through window behind phone, product photography"),
    ("act3-blueprint.jpg",
     "Photorealistic architectural blueprint of a modern 3 bedroom 2 bathroom coastal "
     "home, floor plan technical drawing, clean white paper, professional drafting "
     "quality, elevation drawings visible"),
    ("act4-factory.jpg",
     "Photorealistic cold-formed steel manufacturing facility interior, roll-forming "
     "machines processing steel coils into wall panels, workers in hard hats doing "
     "quality checks, industrial lighting, wide angle shot, no wood framing anywhere"),
    ("act5-truck.jpg",
     "Photorealistic flatbed truck loaded with bundled cold-formed steel wall panels and "
     "roof trusses driving along a coastal highway at golden hour, ocean visible, "
     "cinematic wide shot"),
    ("act6-build.jpg",
     "Photorealistic time-lapse style composite of a modern cold-formed steel home being "
     "erected on a beachfront lot, crane lifting steel wall panels into place, workers on "
     "site, ocean backdrop, morning light"),
    ("act7-interior.jpg",
     "Photorealistic interior of a finished modern coastal home, open plan living room "
     "with floor-to-ceiling windows looking directly at the ocean, clean modern "
     "furnishings, warm afternoon light flooding in, architectural photography"),
    ("act8-exterior.jpg",
     "Photorealistic exterior of a finished modern elevated coastal home at golden hour, "
     "3 bedroom design, large ocean-facing windows, steel and glass facade, elevated deck "
     "with ocean view, professional real estate photography"),
]

OUT = Path("images")
OUT.mkdir(exist_ok=True)
client = genai.Client(api_key=API_KEY)


def save_bytes(raw: bytes, filename: str):
    path = OUT / filename
    if HAVE_PIL:
        img = Image.open(io.BytesIO(raw)).convert("RGB")
        img.save(path, "JPEG", quality=90)
    else:
        path.write_bytes(raw)
    return path


def generate(prompt: str, filename: str) -> bool:
    resp = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(response_modalities=["TEXT", "IMAGE"]),
    )
    for part in resp.candidates[0].content.parts:
        inline = getattr(part, "inline_data", None)
        if inline and inline.data:
            data = inline.data
            if isinstance(data, str):  # some SDK paths return base64 text
                import base64
                data = base64.b64decode(data)
            p = save_bytes(data, filename)
            print(f"  saved {p}")
            return True
    return False


def main():
    failures = []
    for i, (filename, prompt) in enumerate(SCENES, 1):
        print(f"[{i}/8] {filename}")
        try:
            if not generate(prompt, filename):
                print("  no image part returned")
                failures.append(filename)
        except Exception as e:
            print(f"  ERROR: {e}")
            failures.append(filename)
    if failures:
        sys.exit(f"\nFailed: {', '.join(failures)}")
    print("\nAll 8 images generated.")


if __name__ == "__main__":
    main()
