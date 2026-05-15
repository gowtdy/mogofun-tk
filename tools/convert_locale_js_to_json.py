#!/usr/bin/env python3
"""
Convert i18n locale files from `export default { ... }` (.js) to JSON (.json).

The output basename replaces underscores with hyphens (e.g. first_page.js ->
first-page.json). Directory path is unchanged. On success, the source .js file
is removed.

Requires Node.js on PATH (same as the Nuxt project). No separate .js file is
committed; Node runs a short inline module to evaluate the source file.

Usage:
  python3 tools/convert_locale_js_to_json.py
  python3 tools/convert_locale_js_to_json.py i18n/locales/en/first_page.js
"""

from __future__ import annotations

import json
import subprocess
import sys
import time
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = REPO_ROOT / "i18n/locales/en/first_page.js"


def convert_one(inp: Path) -> None:
    inp = inp.resolve()
    if inp.suffix.lower() != ".js":
        raise SystemExit(f"Expected a .js file: {inp}")
    out = inp.with_name(f"{inp.stem.replace('_', '-')}.json")
    file_url = inp.as_uri()
    # Avoid stale dynamic import cache when re-running.
    import_url = f"{file_url}?t={int(time.time() * 1000)}"

    inline = f"""\
import {{ writeFileSync }} from 'node:fs';
const importUrl = {json.dumps(import_url)};
const outPath = {json.dumps(str(out))};
const m = await import(importUrl);
if (m.default === undefined) throw new Error('No default export: ' + importUrl);
writeFileSync(outPath, JSON.stringify(m.default, null, 2) + '\\n', 'utf8');
console.log('Wrote ' + outPath);
"""
    subprocess.run(
        ["node", "--input-type=module", "-e", inline],
        cwd=str(REPO_ROOT),
        check=True,
    )
    inp.unlink()
    print(f"Removed {inp}")


def main() -> None:
    paths = [Path(p) for p in sys.argv[1:]] if len(sys.argv) > 1 else [DEFAULT_INPUT]
    for p in paths:
        convert_one(REPO_ROOT / p if not p.is_absolute() else p)


if __name__ == "__main__":
    main()
