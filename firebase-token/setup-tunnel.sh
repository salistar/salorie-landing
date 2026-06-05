#!/usr/bin/env bash
# One-time: expose the firebase-token endpoint at https://salorie-auth.salistar.com
# via the existing Cloudflare Tunnel. Run ON THE VPS:
#
#   bash ~/apps/salorie-landing/firebase-token/setup-tunnel.sh
#
# It is idempotent, backs up the config, validates BEFORE restarting, and rolls
# back on a bad config so it can't take the tunnel down.
set -euo pipefail

HOST="salorie-auth.salistar.com"
SERVICE="http://localhost:4004"

echo "==> Locating cloudflared config..."
CFG=""
# Prefer the --config passed to the systemd unit.
CFG="$(systemctl cat cloudflared 2>/dev/null | grep -oE -- '--config[ =][^ ]+' | sed -E 's/--config[ =]//' | tail -1 || true)"
if [ -z "$CFG" ]; then
  for c in /etc/cloudflared/config.yml "$HOME/.cloudflared/config.yml" /root/.cloudflared/config.yml /etc/cloudflared/config.yaml; do
    [ -f "$c" ] && CFG="$c" && break
  done
fi
[ -z "$CFG" ] && { echo "!! Could not find cloudflared config. Edit this script and set CFG manually."; exit 1; }
echo "    config: $CFG"
SUDO=""; [ -w "$CFG" ] || SUDO="sudo"

if grep -q "$HOST" "$CFG"; then
  echo "==> $HOST already present — skipping ingress insert."
else
  BAK="$CFG.bak.$(date +%s)"
  echo "==> Backing up to $BAK"
  $SUDO cp "$CFG" "$BAK"
  echo "==> Inserting ingress rule before the http_status:404 catch-all..."
  $SUDO awk -v h="$HOST" -v s="$SERVICE" '
    /^[[:space:]]*-[[:space:]]*service:[[:space:]]*http_status:404/ && !done {
      print "  - hostname: " h
      print "    service: " s
      done=1
    }
    { print }
  ' "$CFG" | $SUDO tee "$CFG.tmp" >/dev/null
  $SUDO mv "$CFG.tmp" "$CFG"

  if command -v cloudflared >/dev/null 2>&1; then
    echo "==> Validating config..."
    if ! $SUDO cloudflared tunnel ingress validate --config "$CFG"; then
      echo "!! Validation failed — restoring backup and aborting."
      $SUDO cp "$BAK" "$CFG"
      exit 1
    fi
  fi
fi

echo "==> Creating DNS route (proxied CNAME) for $HOST..."
TUNNEL="$(grep -E '^tunnel:' "$CFG" | awk '{print $2}' | head -1 || true)"
if [ -n "$TUNNEL" ] && command -v cloudflared >/dev/null 2>&1; then
  cloudflared tunnel route dns "$TUNNEL" "$HOST" 2>&1 || \
    echo "   (route may already exist, or add the CNAME 'salorie-auth' -> <tunnel-id>.cfargotunnel.com manually in Cloudflare)"
else
  echo "   Add the CNAME 'salorie-auth' -> <tunnel-id>.cfargotunnel.com manually in Cloudflare DNS."
fi

echo "==> Restarting cloudflared..."
$SUDO systemctl restart cloudflared
sleep 4
echo "==> Verifying..."
curl -fsS "https://$HOST/health" && echo "  <- LIVE ✅" || \
  echo "  (not reachable yet — DNS may take a minute to propagate; re-run the curl)"
