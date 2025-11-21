"""
Utility script to generate PWA icons that match the official Krawl favicon.

Instead of rasterizing the SVG (which requires native Cairo libraries on
Windows), this script recreates the same geometry using Pillow primitives so
the output stays faithful to the provided vector design.
"""

from __future__ import annotations

from pathlib import Path
from typing import Iterable, Tuple

from PIL import Image, ImageDraw

ROOT_DIR = Path(__file__).resolve().parents[2]
ICONS_DIR = ROOT_DIR / "frontend" / "public" / "icons"
FAVICON_PATH = ROOT_DIR / "frontend" / "public" / "favicon.ico"

ICONS_DIR.mkdir(parents=True, exist_ok=True)

ICON_SIZES = {
    192: "icon-192.png",
    512: "icon-512.png",
    180: "apple-touch-icon.png",
}

BASE_SIZE = 32  # matches the SVG viewBox (0 0 32 32)

PRIMARY_GREEN = "#2D7A3E"
ACCENT_ORANGE = "#FF6B35"
WARM_YELLOW = "#F7B801"
BACKGROUND = "#F5F7FB"
TRAIL_COLOR = "#2D7A3E"

GEM_POINTS = [
    (5, 23, PRIMARY_GREEN),
    (13, 15, ACCENT_ORANGE),
    (21, 21, WARM_YELLOW),
    (27, 11, PRIMARY_GREEN),
]

PATH_POINTS = [
    (5, 23),
    (9, 19),
    (13, 15),
    (17, 18),
    (21, 21),
    (24, 16),
    (27, 11),
]


def scale_points(points: Iterable[Tuple[float, float]], scale: float) -> list[tuple[float, float]]:
    return [(x * scale, y * scale) for x, y in points]


def draw_icon(size: int) -> Image.Image:
    scale = size / BASE_SIZE
    image = Image.new("RGBA", (size, size), BACKGROUND)
    draw = ImageDraw.Draw(image)

    # Trail path approximated with a polyline based on the SVG control points.
    trail_points = scale_points(PATH_POINTS, scale)
    draw.line(
        trail_points,
        fill=TRAIL_COLOR,
        width=max(2, int(1.5 * scale)),
        joint="curve",
    )

    gem_radius = max(4, int(3 * scale))
    for x, y, color in GEM_POINTS:
        cx, cy = x * scale, y * scale
        draw.ellipse(
            (cx - gem_radius, cy - gem_radius, cx + gem_radius, cy + gem_radius),
            fill=color,
        )

    return image


def generate_png_icons() -> None:
    for size, filename in ICON_SIZES.items():
        icon = draw_icon(size)
        icon.save(ICONS_DIR / filename, optimize=True)


def generate_favicon() -> None:
    icon_64 = draw_icon(64)
    icon_32 = draw_icon(32)
    icon_64.save(
        FAVICON_PATH,
        format="ICO",
        sizes=[(32, 32), (64, 64)],
        append_images=[icon_32],
    )


def main() -> None:
    generate_png_icons()
    generate_favicon()
    print(f"PWA icons regenerated in {ICONS_DIR.relative_to(ROOT_DIR)}")


if __name__ == "__main__":
    main()


