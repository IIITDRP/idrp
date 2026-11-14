#!/usr/bin/env bash
# Builds and releases one git ref of the IDRP monorepo on the VPS.
#   sudo -u idrp /opt/idrp/repo/deploy/deploy.sh [git-ref]      (default: origin/main)
# Keeps the last 5 releases; roll back with deploy/rollback.sh.
set -euo pipefail

REF="${1:-origin/main}"
REPO=/opt/idrp/repo
RELEASES_BACKEND=/opt/idrp/backend/releases
RELEASES_FRONTEND=/opt/idrp/frontend/releases
STAMP=$(date +%Y%m%d-%H%M%S)

echo "==> Fetching $REF"
git -C "$REPO" fetch --all --prune
git -C "$REPO" checkout --detach "$REF"
SHA=$(git -C "$REPO" rev-parse --short HEAD)
NAME="$STAMP-$SHA"

echo "==> Backend: tests + package ($SHA)"
cd "$REPO/idrp-backend"
# Tests need Docker (Testcontainers). Set SKIP_TESTS=1 on a server without Docker;
# CI runs them on every push anyway.
if [[ "${SKIP_TESTS:-0}" == "1" ]]; then ./mvnw -B -q -DskipTests package; else ./mvnw -B -q package; fi
mkdir -p "$RELEASES_BACKEND"
cp target/idrp-backend-*.jar "$RELEASES_BACKEND/$NAME.jar"

echo "==> Frontend: install + build"
cd "$REPO/idrp-frontend"
npm ci --no-audit --no-fund
# Build-time secrets (Web3Forms fallback key) live outside the repo.
set -a; [[ -f /etc/idrp/frontend.env ]] && . /etc/idrp/frontend.env; set +a
npm run build
mkdir -p "$RELEASES_FRONTEND/$NAME"
cp -r dist/. "$RELEASES_FRONTEND/$NAME/"

echo "==> Switching to $NAME"
ln -sfn "$RELEASES_BACKEND/$NAME.jar" /opt/idrp/backend/current.jar
sudo systemctl restart idrp-backend

echo "==> Waiting for backend health"
for i in $(seq 1 60); do
  if curl -fsS http://127.0.0.1:8080/actuator/health | grep -q '"status":"UP"'; then
    ln -sfn "$RELEASES_FRONTEND/$NAME" /opt/idrp/frontend/current
    echo "==> Released $NAME"
    ls -1t "$RELEASES_BACKEND" | tail -n +6 | xargs -r -I{} rm -f "$RELEASES_BACKEND/{}"
    ls -1t "$RELEASES_FRONTEND" | tail -n +6 | xargs -r -I{} rm -rf "$RELEASES_FRONTEND/{}"
    exit 0
  fi
  sleep 2
done

echo "!! Backend did not become healthy. Frontend NOT switched. Check: journalctl -u idrp-backend -n 200" >&2
exit 1
