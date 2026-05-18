#!/usr/bin/env bash
# Copy a TTS page Vue file and set page-slug to the target slug.
#
# Usage:
#   ./tools/copy_tts_page.sh <pages-dir> <source-slug> <target-slug>
#
# Example:
#   ./tools/copy_tts_page.sh pages/tts ai-girl-voice ai-voice-girl
#   -> copies pages/tts/ai-girl-voice.vue to pages/tts/ai-voice-girl.vue
#   -> page-slug="ai-voice-girl"

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

usage() {
  echo "Usage: $0 <pages-dir> <source-slug> <target-slug>"
  echo "Example: $0 pages/tts ai-girl-voice ai-voice-girl"
  exit 1
}

if [[ $# -ne 3 ]]; then
  usage
fi

PAGES_DIR_INPUT="$1"
SOURCE_SLUG="$2"
TARGET_SLUG="$3"

if [[ "$PAGES_DIR_INPUT" = /* ]]; then
  PAGES_DIR="$PAGES_DIR_INPUT"
else
  PAGES_DIR="$ROOT_DIR/$PAGES_DIR_INPUT"
fi

if [[ ! -d "$PAGES_DIR" ]]; then
  echo "Error: pages directory not found: $PAGES_DIR"
  exit 1
fi

if [[ "$SOURCE_SLUG" == "$TARGET_SLUG" ]]; then
  echo "Error: source and target slug must be different."
  exit 1
fi

SOURCE_FILE="$PAGES_DIR/${SOURCE_SLUG}.vue"
TARGET_FILE="$PAGES_DIR/${TARGET_SLUG}.vue"

if [[ ! -f "$SOURCE_FILE" ]]; then
  echo "Error: source file not found: $SOURCE_FILE"
  exit 1
fi

if [[ -f "$TARGET_FILE" ]]; then
  echo "Error: target file already exists: $TARGET_FILE"
  exit 1
fi

cp "$SOURCE_FILE" "$TARGET_FILE"

# Update page-slug (and any other occurrences of the source slug in the file)
if sed --version >/dev/null 2>&1; then
  sed -i "s/page-slug=\"${SOURCE_SLUG}\"/page-slug=\"${TARGET_SLUG}\"/g" "$TARGET_FILE"
else
  sed -i '' "s/page-slug=\"${SOURCE_SLUG}\"/page-slug=\"${TARGET_SLUG}\"/g" "$TARGET_FILE"
fi

if ! grep -q "page-slug=\"${TARGET_SLUG}\"" "$TARGET_FILE"; then
  echo "Error: failed to set page-slug in $TARGET_FILE"
  rm -f "$TARGET_FILE"
  exit 1
fi

echo "Created: $TARGET_FILE"
echo "  page-slug=\"${TARGET_SLUG}\""
