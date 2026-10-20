from pathlib import Path
import re

root = Path(__file__).resolve().parent
html_path = root / "index.html"
draft_dir = root / "_drafts" / "mid"
html = html_path.read_text(encoding="utf-8")

drafts = sorted(
    p for p in draft_dir.glob("*.html") if p.is_file() and not p.name.startswith("_")
)
replaced = []
missing = []
for p in drafts:
    art = p.read_text(encoding="utf-8").strip()
    m = re.search(r'id="([^"]+)"', art)
    if not m:
        missing.append(p.name)
        continue
    aid = m.group(1)
    pattern = re.compile(
        rf'<article class="entry"[^>]*id="{re.escape(aid)}"[^>]*>.*?</article>',
        re.S,
    )
    if not pattern.search(html):
        # try id before class
        pattern = re.compile(
            rf'<article class="entry" id="{re.escape(aid)}"[^>]*>.*?</article>',
            re.S,
        )
    # replacement must be a function — re.sub treats \n etc. in strings as escapes
    new_html, n = pattern.subn(lambda _m: art, html, count=1)
    if n == 0:
        missing.append(aid)
    else:
        html = new_html
        replaced.append(aid)

html_path.write_text(html, encoding="utf-8")
print("replaced", len(replaced), replaced)
print("missing", missing)
