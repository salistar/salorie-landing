# firebase-token endpoint — deployment (same VPS as the landing)

Deploys the Clerk→Firebase custom-token endpoint next to `salorie.salistar.com`,
same pattern (GHCR image + Cloudflare Tunnel). Public URL target:
**`https://salorie-auth.salistar.com/firebase-token`**.

## What auto-deploys (GitHub Actions → VPS) — DONE ✅
`docker-compose.firebase-token.yml` + `.github/workflows/firebase-token-deploy.yml`:
**Run workflow** (manual) → GitHub Actions SSHes to the VPS, writes
`firebase-token.env` from the `FIREBASE_TOKEN_ENV` secret, **builds the image from
`./firebase-token` on the VPS** (no registry/auth), and runs it in an isolated
compose project (`-p salorie-firebase-token`) so it never touches the landing.
The container listens on `127.0.0.1:4004` (→ container `:8787`).

Status: deployed & healthy — `curl 127.0.0.1:4004/health` → `{"ok":true}`.
The `FIREBASE_TOKEN_ENV` secret is already set (uses the current SA key).
`VPS_HOST/VPS_USER/VPS_SSH_KEY` reused from `deploy.yml`.

## Two one-time VPS/Cloudflare steps (manual — they touch the shared tunnel)

These are intentionally NOT automated: editing the tunnel config affects every
hostname on the VPS, so do them by hand once.

**1. Cloudflare Tunnel ingress** — on the VPS, edit the cloudflared config
(same file the landing uses), add BEFORE the `service: http_status:404` line:
```yaml
  - hostname: salorie-auth.salistar.com
    service: http://localhost:4004
```
then:
```bash
sudo systemctl restart cloudflared
```

**2. DNS** — in Cloudflare, add a CNAME `auth` → `<tunnel-id>.cfargotunnel.com`
(proxied), exactly like the `salorie` record.

## Verify
```bash
curl -s https://salorie-auth.salistar.com/health         # -> {"ok":true}
```

## Then wire the app + cut over rules (in the salistar/salorie repo)
1. App `.env`: `EXPO_PUBLIC_FIREBASE_TOKEN_URL=https://salorie-auth.salistar.com/firebase-token` → rebuild APK/AAB.
2. **After the new build is released to users**, switch `firebase.json` to
   `firestore.secured.rules` and `firebase deploy --only firestore:rules`.
   (Cutting over earlier breaks already-installed apps that lack the bridge.)

> 🔐 Regenerate the Firebase service-account key (it was shared in chat) and use
> the fresh one in `FIREBASE_TOKEN_ENV`.
