#!/bin/sh
# Batch-convert locale .js files (export default { ... }) to .json in a directory.
# Each file is processed by tools/convert_locale_js_to_json.py; source .js is removed on success.
#
# Usage (from repo root):
#   sh tools/convert_locale_js_dir.sh i18n/locales/en/vocal
#   sh tools/convert_locale_js_dir.sh /absolute/path/to/locale/dir

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONVERTER="$SCRIPT_DIR/convert_locale_js_to_json.py"

TARGET_DIR="${1:-}"

if [ -z "$TARGET_DIR" ]; then
  echo "Usage: $0 <directory>" >&2
  echo "  Example: $0 i18n/locales/en/vocal" >&2
  exit 1
fi

case "$TARGET_DIR" in
  /*) ;;
  *) TARGET_DIR="$REPO_ROOT/$TARGET_DIR" ;;
esac

if [ ! -d "$TARGET_DIR" ]; then
  echo "Not a directory: $TARGET_DIR" >&2
  exit 1
fi

count=0
# shellcheck disable=SC2044
for js in $(find "$TARGET_DIR" -type f -name '*.js' | sort); do
  rel="${js#"$REPO_ROOT"/}"
  python3 "$CONVERTER" "$rel"
  count=$((count + 1))
done

if [ "$count" -eq 0 ]; then
  echo "No .js files found under $TARGET_DIR" >&2
  exit 1
fi

echo "Done. Converted $count file(s)."
