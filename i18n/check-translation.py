#!/usr/bin/env python3
"""Check English translations against i18n/TRANSLATING.md.

Usage: python3 i18n/check-translation.py [content/en/... files]   (no args: every file under content/en)
Exits non-zero when a file breaks the contract.
"""
import glob
import os
import re
import sys

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
VI_LEFTOVERS = re.compile(
    r"\b(Đọc nhanh|Bối cảnh|Từ điển nhanh|Hình dung trước|Tham khảo|Mở toàn màn hình|Hình \d+\.|Câu hỏi tự kiểm tra)\b"
)
VI_CHARS = re.compile(r"[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]", re.I)
WARN = []
KEEP_SAME = ("date", "series", "part", "code", "type", "level", "tags", "draft")


def split_fm(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    return (yaml.safe_load(m.group(1)), text[m.end():]) if m else (None, text)


def strip_code(body):
    return re.sub(r"```.*?```|`[^`\n]*`", "", body, flags=re.S)


def check(path):
    errs = []
    rel = os.path.relpath(path, CONTENT)  # en/posts/x.md
    vi_path = os.path.join(CONTENT, rel[len("en/"):])
    text = open(path, encoding="utf-8").read()
    fm, body = split_fm(text)
    if fm is None:
        return [f"{rel}: frontmatter missing or unparsable"]
    if os.path.exists(vi_path):
        vfm, _ = split_fm(open(vi_path, encoding="utf-8").read())
        for k in KEEP_SAME:
            if (vfm or {}).get(k) != fm.get(k):
                errs.append(f"{rel}: frontmatter '{k}' differs from Vietnamese ({(vfm or {}).get(k)!r} vs {fm.get(k)!r})")
    elif not rel.endswith("index.md"):
        errs.append(f"{rel}: no Vietnamese source at {os.path.relpath(vi_path, ROOT)}")
    if fm.get("lang") != "en":
        errs.append(f"{rel}: missing 'lang: en'")
    for k in ("title", "description", "region"):
        if isinstance(fm.get(k), str) and VI_CHARS.search(fm[k]):
            errs.append(f"{rel}: '{k}' still Vietnamese: {fm[k]!r}")
    for s in fm.get("stations") or []:
        if isinstance(s, dict) and VI_CHARS.search(str(s.get("name", ""))):
            errs.append(f"{rel}: station name still Vietnamese: {s.get('name')!r}")

    prose = strip_code(body)
    for m in re.finditer(r"\[\[([^\]|#\\]+)", prose):
        target = m.group(1).strip()
        if not target.startswith("en/"):
            errs.append(f"{rel}: wikilink without en/ prefix: [[{target}")
            continue
        if not os.path.exists(os.path.join(CONTENT, target[len("en/"):] + ".md")):
            errs.append(f"{rel}: wikilink target has no Vietnamese source: [[{target}")
    here = os.path.dirname(path)
    # Quartz ("shortest" link resolution) reads a markdown or href link "../x" as site-root "x" at any
    # depth, so English pages keep "../code/..." exactly like Vietnamese ones. data-archify is read by
    # the theme script relative to the page URL (/en/posts/<file>), so it needs "../../".
    for m in re.finditer(r'(\]\(|href="|data-archify=")(\.\./[^)"\s#]+)', prose):
        kind, link = m.group(1), m.group(2)
        if kind == 'data-archify="':
            if not link.startswith("../../"):
                errs.append(f"{rel}: data-archify must start with ../../ on English pages: {link}")
            target = os.path.normpath(os.path.join(here, link))
        else:
            if link.startswith("../../"):
                errs.append(f"{rel}: Quartz resolves '../' from the site root; use ../ not ../../: {link}")
            target = os.path.join(CONTENT, link[len("../"):].lstrip("./"))
        if not os.path.exists(target):
            errs.append(f"{rel}: relative link does not exist: {m.group(1)}")
        if "/diagrams/" in link and link.endswith(".html") and not link.endswith(".en.html"):
            errs.append(f"{rel}: diagram link must point at the .en.html viewer: {link}")
    for m in VI_LEFTOVERS.finditer(prose):
        errs.append(f"{rel}: Vietnamese section label left: {m.group(0)!r}")
    for l in prose.splitlines():
        if VI_CHARS.search(l):
            WARN.append(f"{rel}: Vietnamese letters (fine only if quoted on purpose): {l.strip()[:110]!r}")
    return errs


def main():
    files = sys.argv[1:] or sorted(glob.glob(os.path.join(CONTENT, "en", "**", "*.md"), recursive=True))
    allerr = []
    for f in files:
        if not os.path.isfile(f):
            allerr.append(f"{f}: file not found (expected an English file under content/en/)")
            continue
        allerr += check(os.path.abspath(f))
    for w in WARN:
        print("warn:", w)
    for e in allerr:
        print(e)
    print(f"checked {len(files)} file(s), {len(allerr)} problem(s), {len(WARN)} warning(s)")
    sys.exit(1 if allerr else 0)


if __name__ == "__main__":
    main()
