#!/bin/bash
set -euo pipefail

# cPanel runs this only after an explicit Deploy HEAD Commit or a direct push.
# The Python preflight requires private, commit-specific human approval before any public write.
if ! command -v python3 >/dev/null 2>&1; then
  printf '%s\n' 'STOP: Python 3.9+ CLI must already be available. No production files changed.' >&2
  exit 1
fi
exec python3 /home1/washbarc/repositories/WashbarV2/scripts/deploy_production.py --execute
