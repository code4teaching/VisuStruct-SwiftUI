#!/usr/bin/env python3
"""
VisuStruct-Logo: modern, Nassi–Shneiderman-konform (Verzweigung mit Dreieckspfad wie im Editor).
Ausgabe: src/main/resources/icons/logostr.png
"""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SIZE = 640
W = H = SIZE
# Hintergrund (moderner Teal-Verlauf – ang VisuStruct)
BG_TOP = (15, 118, 110)
BG_BOTTOM = (6, 78, 74)
# UI aus VisuStructTheme (hell)
CANVAS = (255, 255, 255)
GRID = (229, 231, 235)
BORDER = (55, 65, 81)
TEXT = (17, 24, 39)
TEXT_MUTED = (107, 114, 128)
ACCENT = (59, 130, 246)
ACCENT_SOFT = (219, 234, 254)
SURFACE = (249, 250, 251)
BEZEL = (31, 41, 55)
BEZEL_DEEP = (17, 24, 39)
WHITE = (255, 255, 255)


def try_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    paths = []
    if bold:
        paths += [
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
    paths += [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                pass
    return ImageFont.load_default()


def vertical_gradient(im: Image.Image, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> None:
    px = im.load()
    w, h = im.size
    for y in range(h):
        t = y / max(1, h - 1)
        r = int(top[0] * (1 - t) + bottom[0] * t)
        g = int(top[1] * (1 - t) + bottom[1] * t)
        b = int(top[2] * (1 - t) + bottom[2] * t)
        for x in range(w):
            px[x, y] = (r, g, b)


def draw_soft_grid(d: ImageDraw.ImageDraw, box: tuple[int, int, int, int], step: int = 14) -> None:
    x0, y0, x1, y1 = box
    for x in range(x0, x1, step):
        d.line([(x, y0), (x, y1)], fill=GRID, width=1)
    for y in range(y0, y1, step):
        d.line([(x0, y), (x1, y)], fill=GRID, width=1)


def draw_modern_struktogram(
    d: ImageDraw.ImageDraw,
    area: tuple[int, int, int, int],
    font_s: ImageFont.ImageFont,
    font_xs: ImageFont.ImageFont,
) -> None:
    """Ein kompaktes Struktogramm: Anweisung → Verzweigung (Dreieckkopf + zwei Spalten) → While mit linkem Rand."""
    x0, y0, x1, y1 = area
    pad = 10
    cx0, cy0 = x0 + pad, y0 + pad
    cx1, cy1 = x1 - pad, y1 - pad
    draw_soft_grid(d, (cx0, cy0, cx1, cy1))

    x, y = cx0 + 8, cy0 + 8
    bw = cx1 - cx0 - 16

    def rect_block(y0_: int, h: int, fill: tuple[int, int, int], label: str) -> int:
        d.rounded_rectangle(
            [x, y0_, x + bw, y0_ + h],
            radius=4,
            fill=fill,
            outline=BORDER,
            width=2,
        )
        try:
            bb = d.textbbox((0, 0), label, font=font_xs)
            tw, th = bb[2] - bb[0], bb[3] - bb[1]
            d.text((x + (bw - tw) // 2, y0_ + (h - th) // 2), label, fill=TEXT, font=font_xs)
        except Exception:
            d.text((x + 6, y0_ + 4), label, fill=TEXT, font=font_xs)
        return y0_ + h

    y = rect_block(y, 30, SURFACE, "x einlesen")

    # —— Verzweigung (wie Fallauswahl: zwei Linien von oben links/rechts zum Apex unter dem Dreieck) ——
    h_head = 34
    y_split = y + h_head
    xm = x + bw // 2
    # Dreiecksförmiger Bedingungskopf: Spitze zeigt nach unten
    tri = [(x, y), (x + bw, y), (xm, y_split)]
    d.polygon(tri, fill=ACCENT_SOFT, outline=BORDER)
    d.line([(x, y), (xm, y_split)], fill=BORDER, width=2)
    d.line([(x + bw, y), (xm, y_split)], fill=BORDER, width=2)
    try:
        lab = "x < 0"
        bb = d.textbbox((0, 0), lab, font=font_xs)
        tw = bb[2] - bb[0]
        d.text((x + (bw - tw) // 2, y + 8), lab, fill=TEXT, font=font_xs)
    except Exception:
        pass

    y_body_top = y_split
    y_body_bot = y_split + 78
    d.line([(xm, y_body_top), (xm, y_body_bot)], fill=BORDER, width=2)
    d.line([(x, y_body_top), (x + bw, y_body_top)], fill=BORDER, width=2)
    d.line([(x, y_body_bot), (x + bw, y_body_bot)], fill=BORDER, width=2)
    d.line([(x, y_body_top), (x, y_body_bot)], fill=BORDER, width=2)
    d.line([(x + bw, y_body_top), (x + bw, y_body_bot)], fill=BORDER, width=2)

    col_gap = 6
    mid = xm
    lx0, lx1 = x + col_gap, mid - col_gap // 2
    rx0, rx1 = mid + col_gap // 2, x + bw - col_gap
    rh = 26
    yy = y_body_top + 8
    for lab, fill, x_a, x_b in (
        ("true", SURFACE, lx0, lx1),
        ("false", SURFACE, rx0, rx1),
    ):
        d.rounded_rectangle([x_a, yy, x_b, yy + 16], radius=3, fill=WHITE, outline=TEXT_MUTED)
        d.text((x_a + 4, yy + 2), lab, fill=TEXT_MUTED, font=font_xs)
    yy += 20
    d.rounded_rectangle([lx0, yy, lx1, yy + rh], radius=3, fill=SURFACE, outline=BORDER, width=1)
    d.text((lx0 + 6, yy + rh // 2 - 6), "y := 1", fill=TEXT, font=font_xs)
    d.rounded_rectangle([rx0, yy, rx1, yy + rh], radius=3, fill=SURFACE, outline=BORDER, width=1)
    d.text((rx0 + 6, yy + rh // 2 - 6), "y := 2", fill=TEXT, font=font_xs)

    y = y_body_bot + 10

    # —— While-Schleife: äußerer Rahmen, Kopfzeile, Rumpf mit linkem Einzug (≈ Schleife.linkerRand) ——
    loop_h = 86
    inset = 14
    d.rounded_rectangle([x, y, x + bw, y + loop_h], radius=5, fill=WHITE, outline=BORDER, width=2)
    d.rectangle([x + 2, y + 2, x + bw - 2, y + 26], fill=ACCENT_SOFT)
    d.line([(x, y + 28), (x + bw, y + 28)], fill=BORDER, width=2)
    try:
        d.text((x + 10, y + 6), "while x ≠ 0", fill=TEXT, font=font_xs)
    except Exception:
        pass
    inner_x0 = x + inset
    inner_y0 = y + 34
    inner_x1 = x + bw - 8
    inner_y1 = y + loop_h - 8
    d.rounded_rectangle(
        [inner_x0, inner_y0, inner_x1, inner_y1],
        radius=3,
        fill=SURFACE,
        outline=BORDER,
        width=1,
    )
    d.text((inner_x0 + 10, inner_y0 + 12), "Anweisungen", fill=TEXT, font=font_xs)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    out_dir = root / "src" / "main" / "resources" / "icons"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "logostr.png"

    font_brand = try_font(52, bold=True)
    font_s = try_font(15)
    font_xs = try_font(12)

    im = Image.new("RGB", (W, H))
    vertical_gradient(im, BG_TOP, BG_BOTTOM)
    d = ImageDraw.Draw(im)

    # Tablet + einfacher Schatten
    tx0, ty0, tx1, ty1 = 118, 72, W - 118, H - 118
    d.rounded_rectangle([tx0 + 5, ty0 + 5, tx1 + 5, ty1 + 5], radius=22, fill=(4, 45, 42))
    # Bezel
    d.rounded_rectangle([tx0, ty0, tx1, ty1], radius=22, fill=BEZEL, outline=BEZEL_DEEP, width=2)
    # „Kamera“-Punkt
    d.ellipse([tx0 + (tx1 - tx0) // 2 - 4, ty0 + 10, tx0 + (tx1 - tx0) // 2 + 4, ty0 + 18], fill=BEZEL_DEEP)

    scr_in = 16
    sx0, sy0, sx1, sy1 = tx0 + scr_in, ty0 + 34, tx1 - scr_in, ty1 - scr_in
    d.rounded_rectangle([sx0, sy0, sx1, sy1], radius=12, fill=CANVAS, outline=BORDER)

    draw_modern_struktogram(d, (sx0, sy0, sx1, sy1), font_s, font_xs)

    # Schreibstift (minimal, modern)
    pen = [
        (sx1 - 8, sy0 + 40),
        (sx1 + 42, sy0 + 120),
        (sx1 + 34, sy0 + 128),
        (sx1 - 14, sy0 + 50),
    ]
    d.polygon(pen, fill=(243, 244, 246), outline=BORDER)
    d.polygon([(sx1 + 34, sy0 + 118), (sx1 + 42, sy0 + 120), (sx1 + 38, sy0 + 126)], fill=ACCENT)

    brand = "VisuStruct"
    try:
        bb = d.textbbox((0, 0), brand, font=font_brand)
        bw = bb[2] - bb[0]
        bx = (W - bw) // 2
        d.text((bx, H - 64), brand, fill=WHITE, font=font_brand)
    except Exception:
        d.text((W // 2 - 90, H - 58), brand, fill=WHITE, font=font_brand)

    im.save(out_path, "PNG")
    print("OK", out_path)


if __name__ == "__main__":
    main()
