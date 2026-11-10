"""Generate the Trust Expo logo mark and favicon set.

Mark: blue rounded square with a 3x3 grid of LED panels. White panels form a
"T"; the bottom-right panel is amber like a status LED.

Run: python -I images/source/make_icons.py <repo root>
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(sys.argv[1])

BLUE = "#1d4ed8"
WHITE = "#ffffff"
DIM = "#3563e2"
AMBER = "#f59e0b"

# Geometry on a 64-unit canvas.
SIZE = 64
RADIUS = 14
MARGIN = 10
GAP = 4
CELL = 12
CELL_R = 2.5
T_CELLS = {(0, 0), (1, 0), (2, 0), (1, 1), (1, 2)}
AMBER_CELL = (2, 2)


def cell_color(cx, cy):
    if (cx, cy) in T_CELLS:
        return WHITE
    if (cx, cy) == AMBER_CELL:
        return AMBER
    return DIM


def svg(background=True):
    parts = []
    if background:
        parts.append(f'<rect width="{SIZE}" height="{SIZE}" rx="{RADIUS}" fill="{BLUE}"/>')
    for cy in range(3):
        for cx in range(3):
            x = MARGIN + cx * (CELL + GAP)
            y = MARGIN + cy * (CELL + GAP)
            parts.append(f'<rect x="{x}" y="{y}" width="{CELL}" height="{CELL}" rx="{CELL_R}" fill="{cell_color(cx, cy)}"/>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}">' + "".join(parts) + "</svg>\n"


def render(px, full_bleed=False):
    """Render the mark at px x px using 8x supersampling."""
    ss = 8
    s = px * ss / SIZE
    img = Image.new("RGBA", (px * ss, px * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if full_bleed:
        d.rectangle((0, 0, px * ss, px * ss), fill=BLUE)
    else:
        d.rounded_rectangle((0, 0, px * ss - 1, px * ss - 1), radius=RADIUS * s, fill=BLUE)
    for cy in range(3):
        for cx in range(3):
            x = (MARGIN + cx * (CELL + GAP)) * s
            y = (MARGIN + cy * (CELL + GAP)) * s
            d.rounded_rectangle((x, y, x + CELL * s - 1, y + CELL * s - 1), radius=CELL_R * s, fill=cell_color(cx, cy))
    return img.resize((px, px), Image.LANCZOS)


(ROOT / "favicon.svg").write_text(svg(), encoding="utf-8")
render(256).save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
# Apple and Android masks crop their own corners, so these use a full-bleed background.
render(180, full_bleed=True).convert("RGB").save(ROOT / "apple-touch-icon.png", optimize=True)
render(192).save(ROOT / "icon-192.png", optimize=True)
render(512).save(ROOT / "icon-512.png", optimize=True)
render(512).save(ROOT / "images" / "logo-mark-512.png", optimize=True)
print("icons written")
