import sys
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw

img_dir = Path(sys.argv[1])
hero = Image.open(img_dir / "source" / "hero-orig.png").convert("RGB")

# Garbled AI-generated sign sits around x 222-292, y 118-156.
# Replace it with ceiling texture taken from the same rows further right.
box = (218, 114, 298, 160)
w, h = box[2] - box[0], box[3] - box[1]
src = hero.crop((310, 114, 310 + w, 114 + h))
mask = Image.new("L", (w, h), 0)
ImageDraw.Draw(mask).rectangle((4, 4, w - 5, h - 5), fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(3))
hero.paste(src, box[:2], mask)


# Web versions: upscale gently (image sits under a 80-95% dark overlay).
hero_web = hero.resize((1600, 1600), Image.LANCZOS)
# Crop to 16:9 around the wall for the wide hero background.
hero_wide = hero_web.crop((0, 250, 1600, 1150))
hero_wide.save(img_dir / "hero-led-wall.jpg", quality=82, optimize=True, progressive=True)

# Open Graph image 1200x630 (referenced in meta tags but missing on the live site).
og = hero_web.crop((0, 300, 1600, 1140)).resize((1200, 630), Image.LANCZOS)
og.save(img_dir.parent / "og-image.jpg", quality=85, optimize=True)

led = Image.open(img_dir / "source" / "led-closeup-orig.png").convert("RGB")
led.resize((1024, 1024), Image.LANCZOS).save(
    img_dir / "led-closeup.jpg", quality=82, optimize=True, progressive=True
)
print("ok")
