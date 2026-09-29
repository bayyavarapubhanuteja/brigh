#!/usr/bin/env bash
# Start the Brightix static site server.
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -d .venv ]; then
  python3 -m venv .venv
  ./.venv/bin/pip install --quiet --upgrade pip
  ./.venv/bin/pip install --quiet -r requirements.txt
fi
exec ./.venv/bin/uvicorn main:app --host 127.0.0.1 --port "${PORT:-4321}" --reload
