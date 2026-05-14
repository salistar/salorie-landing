# Salorie Landing — salorie.salistar.com

Landing page Next.js 15 + Tailwind 4 pour présenter l'app mobile Salorie.

## Architecture

```
salorie-landing/
├── app/
│   ├── layout.tsx        # Metadata SEO + html shell
│   ├── page.tsx          # Hero + Features + How it works + CTA
│   └── globals.css       # Tailwind 4 + variables couleur Salorie
├── public/               # Assets (logo, screenshots)
├── Dockerfile            # Multi-stage Node 20 alpine, standalone output
├── docker-compose.yml    # Service ghcr.io/salistar/salorie-landing:latest
├── next.config.ts        # output: 'standalone' pour container
└── .github/workflows/
    └── deploy.yml        # Build image → GHCR → SSH VPS Hetzner → Cloudflare purge
```

## Workflow CI/CD (identique à salistar.com)

1. `git push origin main` → GitHub Actions trigger
2. Build Docker image multi-stage → push sur GHCR
3. SSH sur VPS Hetzner → `docker compose pull` + `docker compose up -d`
4. Purge Cloudflare cache pour salorie.salistar.com
5. Health check `curl -I https://salorie.salistar.com`

## Setup VPS (à faire 1 fois)

```bash
# Sur le VPS Hetzner
mkdir -p ~/apps/salorie-landing
cd ~/apps/salorie-landing
git clone https://github.com/salistar/salorie-landing.git .

# Le docker-compose.yml utilise le network salistar-network deja existant
# (cree par salistar.com)
```

## Subdomain — cloudflared config

Ajouter dans `cloudflared-config.yml` du VPS (avant `service: http_status:404`) :

```yaml
- hostname: salorie.salistar.com
  service: http://localhost:4002
```

Puis `sudo systemctl restart cloudflared` sur le VPS.

DNS Cloudflare : record CNAME `salorie` → `<tunnel-id>.cfargotunnel.com` (proxied).

## Dev local

```bash
npm install
npm run dev
# http://localhost:3000
```

## Build local pour tester l'image Docker

```bash
docker build -t salorie-landing .
docker run -p 3000:3000 salorie-landing
```

## Secrets GitHub Actions requis

Identiques à salistar :
- `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` — accès SSH Hetzner
- `GHCR_PAT` — token GitHub pour pull image privée
- `CF_ZONE_ID`, `CF_API_TOKEN` — Cloudflare purge (optionnel)
