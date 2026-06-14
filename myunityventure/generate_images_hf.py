#!/usr/bin/env python3
"""
Generate the cinematic scene images for myunityventure.com with the FREE
Hugging Face Inference API (free read token, no billing).

Art direction (per client references):
  - Cinematic, full-bleed, premium 3D-render feel like RadiantNuclear.com
    for the hero / delivery / build scenes.
  - Documentary cold-formed steel (CFS) PANEL-SHOP imagery for the factory:
    workers in hi-vis assembling light-gauge steel stud panels on jigs.

Get a token (role: Read): https://huggingface.co/settings/tokens
Run:
    HF_TOKEN=hf_xxx python generate_images_hf.py
Images are written to ./images as JPEG, overwriting the stock placeholders.
"""
import os
import sys
from pathlib import Path

try:
    from huggingface_hub import InferenceClient
except Exception:
    sys.exit("pip install huggingface_hub first.")

TOKEN = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_TOKEN")
if not TOKEN:
    sys.exit("HF_TOKEN not set. Create a free Read token at "
             "https://huggingface.co/settings/tokens and export it. (Never printed.)")

MODEL = os.environ.get("HF_IMAGE_MODEL", "black-forest-labs/FLUX.1-schnell")
PROVIDER = os.environ.get("HF_PROVIDER", "auto")

CINE = ("cinematic, ultra detailed, dramatic golden hour light, volumetric, "
        "shallow depth of field, premium architectural visualization, 8k, photorealistic 3D render")

SCENES = [
    # filename, prompt
    ("act8-exterior.jpg",
     f"A modern elevated coastal beach house clad in cold-formed steel and glass, "
     f"floor-to-ceiling ocean-facing windows, elevated deck on piers, sitting on a "
     f"beachfront dune at golden hour with the ocean behind, 3 bedroom design. {CINE}"),
    ("act1-phone.jpg",
     f"Close up of a hand holding a smartphone at a beachfront, a clean real-estate "
     f"feasibility app on screen with a typed address, blurred ocean and dune grass "
     f"behind, 85mm. {CINE}"),
    ("act2-report.jpg",
     f"A smartphone held in hand showing a clean property feasibility report dashboard "
     f"with zoning, flood zone and a build score, ocean visible softly behind through a "
     f"window, product photography. {CINE}"),
    ("act3-blueprint.jpg",
     f"A precise architectural blueprint and floor plan of a modern 3 bedroom 2 bathroom "
     f"elevated coastal home, white drafting paper with elevation drawings and dimensions, "
     f"top-down, clean professional drafting. {CINE}"),
    ("act4-factory.jpg",
     f"Documentary photograph inside a bright cold-formed steel framing factory: workers "
     f"in hi-vis yellow vests and hard hats assembling light-gauge steel stud wall panels "
     f"flat on assembly jigs, an overhead green gantry crane, racks of galvanized steel "
     f"studs, no wood anywhere, wide angle, realistic industrial lighting"),
    ("act5-truck.jpg",
     f"A flatbed semi truck carrying large panelized cold-formed steel wall sections and a "
     f"modular house module wrapped and strapped down, driving along a coastal highway with "
     f"the ocean beside it at golden hour, wide cinematic shot. {CINE}"),
    ("act6-build.jpg",
     f"A crane lifting a large cold-formed steel wall panel into place onto an elevated pier "
     f"foundation on a beachfront lot, workers in hi-vis guiding it, half-assembled modern "
     f"steel-framed house, ocean backdrop, morning light. {CINE}"),
    ("act7-interior.jpg",
     f"Interior of a finished modern coastal home, open plan living room with floor-to-ceiling "
     f"glass facing directly onto the ocean, clean warm modern furnishings, afternoon light "
     f"flooding in, architectural photography. {CINE}"),
    # extra catalog exteriors
    ("catalog2.jpg",
     f"A modern two-story elevated coastal home in cold-formed steel and glass with a "
     f"wraparound deck, ocean-facing, dusk, warm interior lights on. {CINE}"),
    ("catalog3.jpg",
     f"A modern coastal home with rooftop deck and double-height glass facade beside the "
     f"water, palm landscaping, summer afternoon. {CINE}"),
]

OUT = Path("images")
OUT.mkdir(exist_ok=True)
client = InferenceClient(api_key=TOKEN, provider=PROVIDER)


def main():
    failures = []
    for i, (filename, prompt) in enumerate(SCENES, 1):
        print(f"[{i}/{len(SCENES)}] {filename}")
        try:
            image = client.text_to_image(prompt, model=MODEL, width=1280, height=768)
            image.convert("RGB").save(OUT / filename, "JPEG", quality=90)
            print(f"  saved images/{filename} ({(OUT/filename).stat().st_size//1024} KB)")
        except Exception as e:
            print(f"  ERROR: {str(e)[:200]}")
            failures.append(filename)
    if failures:
        sys.exit(f"\nFailed: {', '.join(failures)}")
    print("\nAll images generated.")


if __name__ == "__main__":
    main()
