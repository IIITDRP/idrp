#!/usr/bin/env bash
# Points backend + frontend back at the previous release and restarts.
#   sudo -u idrp /opt/idrp/repo/deploy/rollback.sh
# NOTE: a release that added a Flyway migration has already changed the database;
# rolling the code back does not undo it. Restore from deploy/backup.sh output if needed.
set -euo pipefail
PREV_JAR=$(ls -1t /opt/idrp/backend/releases/*.jar | sed -n 2p)
PREV_WEB=$(ls -1dt /opt/idrp/frontend/releases/*/ | sed -n 2p)
[[ -n "$PREV_JAR" && -n "$PREV_WEB" ]] || { echo "No previous release found" >&2; exit 1; }
ln -sfn "$PREV_JAR" /opt/idrp/backend/current.jar
ln -sfn "${PREV_WEB%/}" /opt/idrp/frontend/current
sudo systemctl restart idrp-backend
echo "Rolled back to $(basename "$PREV_JAR" .jar)"
