# render_icons.py: regenerates the app icon PNGs (icon, adaptive Android layers, splash, favicon) from assets/icon/*.svg.
# Needs Google Chrome (CHROME_PATH) and Pillow; also writes a size/contrast preview sheet to a temp folder.

import os
import re
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

FRONT = Path(__file__).resolve().parent.parent
SRC = FRONT / "assets" / "icon"
OUT = FRONT / "assets" / "images"
WORK = Path(tempfile.mkdtemp(prefix="tonali-icons-"))
CHROME = os.environ.get("CHROME_PATH", r"C:\Program Files\Google\Chrome\Application\chrome.exe")
ADAPTIVE_SAFE_SCALE = 0.62
BACKGROUND = re.compile(r'<rect width="100" height="100" fill="#[0-9A-Fa-f]{6}"/>')


def svg(name: str) -> str:
    text = (SRC / name).read_text(encoding="utf8")
    return re.sub(r"<!--.*?-->\s*", "", text, flags=re.S)


def without_background(text: str) -> str:
    return BACKGROUND.sub("", text)


def scaled(text: str, factor: float) -> str:
    head = re.search(r"<svg[^>]*>", text).group(0)
    inner = re.search(r"<svg[^>]*>(.*)</svg>", text, flags=re.S).group(1)
    return f'{head}<g transform="translate(50 50.5) scale({factor}) translate(-50 -50.5)">{inner}</g></svg>'


def render(text: str, name: str, size: int = 1024) -> Image.Image:
    html = WORK / f"{name}.html"
    png = WORK / f"{name}.png"
    sized = text.replace("<svg ", f'<svg width="{size}" height="{size}" ', 1)
    html.write_text(
        "<!doctype html><html><head><style>html,body{margin:0;background:transparent}svg{display:block}</style>"
        f"</head><body>{sized}</body></html>",
        encoding="utf8",
    )
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
         f"--user-data-dir={WORK / ('profile-' + name)}", "--default-background-color=00000000",
         "--force-device-scale-factor=1", f"--window-size={size},{size}", f"--screenshot={png}", html.as_uri()],
        check=True, capture_output=True,
    )
    return Image.open(png).convert("RGBA").crop((0, 0, size, size))


def preview(main: Image.Image, foreground: Image.Image, light: Image.Image, mono: Image.Image) -> Path:
    sheet = Image.new("RGBA", (900, 760), "#FFFFFF")
    draw = ImageDraw.Draw(sheet)
    rows = [("#FBF6EE", main), ("#17110E", main), ("#FFFFFF", ImageOps.grayscale(main.convert("RGB")).convert("RGBA"))]
    for index, (background, art) in enumerate(rows):
        top = 20 + index * 160
        draw.rectangle((0, top - 10, 900, top + 140), fill=background)
        left = 20
        for size in (16, 24, 32, 48, 128):
            sheet.alpha_composite(art.resize((size, size), Image.LANCZOS), (left, top + (128 - size) // 2))
            left += size + 40
    adaptive = Image.new("RGBA", (256, 256), "#2B1A12")
    adaptive.alpha_composite(foreground.resize((256, 256), Image.LANCZOS))
    mask = Image.new("L", (256, 256), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, 255, 255), fill=255)
    sheet.paste(adaptive, (20, 490), mask)
    sheet.alpha_composite(light.resize((200, 200), Image.LANCZOS), (310, 518))
    sheet.alpha_composite(mono.resize((200, 200), Image.LANCZOS), (560, 518))
    path = WORK / "preview.png"
    sheet.save(path)
    return path


def main() -> None:
    icon = render(svg("icon.svg"), "main")
    icon.convert("RGB").save(OUT / "icon.png")
    icon.resize((48, 48), Image.LANCZOS).convert("RGB").save(OUT / "favicon.png")

    foreground = render(scaled(without_background(svg("icon.svg")), ADAPTIVE_SAFE_SCALE), "foreground")
    foreground.save(OUT / "android-icon-foreground.png")
    white = svg("icon-mono.svg").replace('color="#6E5A4E"', 'color="#FFFFFF"')
    render(scaled(white, ADAPTIVE_SAFE_SCALE), "monochrome").save(OUT / "android-icon-monochrome.png")

    render(without_background(svg("icon-light.svg")), "splash").resize((512, 512), Image.LANCZOS).save(OUT / "splash-icon.png")
    render(without_background(svg("icon.svg")), "splash-dark").resize((512, 512), Image.LANCZOS).save(OUT / "splash-icon-dark.png")

    sheet = preview(icon, foreground, render(svg("icon-light.svg"), "light"), render(svg("icon-mono.svg"), "mono"))
    print(f"Icons written to {OUT}; preview at {sheet}")


if __name__ == "__main__":
    main()
