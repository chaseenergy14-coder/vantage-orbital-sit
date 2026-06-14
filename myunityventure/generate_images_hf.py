#!/usr/bin/env python3
"""
Generate the 8 cinematic scene images for myunityventure.com via the
FREE Hugging Face Inference API (no billing required, just a free read token).

Get a token: https://huggingface.co/settings/tokens  (role: Read)

Run:
    HF_TOKEN=hf_xxx python generate_images_hf.py
Images are written to ./images as JPEG. The prompts are identical to the
Gemini brief; only the backend changed (Gemini image output is paid-only).
"""
import os
import sys
import io
import time
import urllib.request
import urllib.error

try:
    from PIL import Image
    HAVE_PIL = True
except Exception:
    HAVE_PIL = False

TOKEN = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_TOKEN")
if not TOKEN:
    sys.exit("HF_TOKEN not set. Create a free read token at "
             "https://huggingface.co/settings/tokens and export it. (Never printed.)")

# Primary free text-to-image model; fallback if the first is cold/unavailable.
MODELS = [
    os.environ.get("HF_IMAGE_MODEL", "black-forest-labs/FLUX.1-schnell"),
    "stabilityai/stable-diffusion-xl-base-1.0",
]
ENDPOINT = "https://router.huggingface.co/hf-inference/models/{model}"

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

from pathlib import Path
OUT = Path("images")
OUT.mkdir(exist_ok=True)


def save(raw: bytes, filename: str):
    path = OUT / filename
    if HAVE_PIL:
        Image.open(io.BytesIO(raw)).convert("RGB").save(path, "JPEG", quality=90)
    else:
        path.write_bytes(raw)
    return path, path.stat().st_size


def request_image(model: str, prompt: str) -> bytes:
    body = ('{"inputs": %s, "parameters": {"width": 1280, "height": 720}}'
            % _json_str(prompt)).encode()
    req = urllib.request.Request(
        ENDPOINT.format(model=model), data=body,
        headers={"Authorization": f"Bearer {TOKEN}",
                 "Content-Type": "application/json",
                 "Accept": "image/jpeg"})
    with urllib.request.urlopen(req, timeout=180) as r:
        return r.read()


def _json_str(s: str) -> str:
    import json
    return json.dumps(s)


def generate(prompt: str, filename: str) -> bool:
    for model in MODELS:
        for attempt in range(4):
            try:
                raw = request_image(model, prompt)
                if raw[:2] == b"\xff\xd8" or raw[:8] == b"\x89PNG\r\n\x1a\n" or len(raw) > 5000:
                    p, size = save(raw, filename)
                    print(f"  saved {p} ({size//1024} KB) via {model}")
                    return True
            except urllib.error.HTTPError as e:
                msg = e.read().decode("utf-8", "ignore")[:160]
                if e.code == 503:  # model loading, wait and retry
                    print(f"  {model} warming up, retry in 20s ({msg[:60]})")
                    time.sleep(20); continue
                print(f"  {model} HTTP {e.code}: {msg}")
                break  # try next model
            except Exception as e:
                print(f"  {model} error: {str(e)[:120]}")
                time.sleep(5)
    return False


def main():
    failures = []
    for i, (filename, prompt) in enumerate(SCENES, 1):
        print(f"[{i}/8] {filename}")
        if not generate(prompt, filename):
            failures.append(filename)
    if failures:
        sys.exit(f"\nFailed: {', '.join(failures)}")
    print("\nAll 8 images generated.")


if __name__ == "__main__":
    main()
