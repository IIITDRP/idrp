# Deploying IDRP to the Hostinger KVM 4 VPS

One VPS runs everything: **nginx** (HTTPS, serves the Vue build, proxies the API),
**Spring Boot** (systemd service, bound to `127.0.0.1:8080`) and **PostgreSQL 16**.
Everything is on one domain, so there is no CORS and no Vercel.

```
Browser ──HTTPS──> nginx :443 ─┬─ /            -> /opt/idrp/frontend/current  (static build)
                               ├─ /api/*       -> 127.0.0.1:8080 (Spring Boot) -> PostgreSQL :5432 (local only)
                               └─ /uploads/*   -> /var/idrp/uploads            (admin uploads)
```

Recommended order: **stage first on a test hostname** (for example `beta.idrp.in`, or
the VPS IP over plain HTTP for a quick look), check everything, then move the real domain
off Vercel (step 10).

Paths and names used below: OS user `idrp`, repo checkout `/opt/idrp/repo`, secrets in
`/etc/idrp/`, uploads in `/var/idrp/uploads`, backups in `/var/backups/idrp`.

---

## 1. Base system (Ubuntu 24.04 LTS, as root)

```bash
apt update && apt -y upgrade
apt -y install nginx postgresql-16 openjdk-21-jdk-headless git curl ufw certbot unattended-upgrades
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt -y install nodejs

ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable   # 5432 and 8080 stay closed
timedatectl set-timezone Asia/Kolkata
```

Use SSH keys and disable password login (`PasswordAuthentication no` in
`/etc/ssh/sshd_config`) before going live.

## 2. App user and folders

```bash
useradd --system --create-home --home-dir /opt/idrp --shell /bin/bash idrp
mkdir -p /opt/idrp/{backend/releases,frontend/releases} /var/idrp/uploads /var/backups/idrp /etc/idrp /var/www/certbot
chown -R idrp:idrp /opt/idrp /var/idrp /var/backups/idrp
# deploy.sh restarts the service; allow exactly that and nothing else:
echo 'idrp ALL=(root) NOPASSWD: /usr/bin/systemctl restart idrp-backend' > /etc/sudoers.d/idrp
chmod 440 /etc/sudoers.d/idrp
```

## 3. Database

```bash
sudo -u postgres psql <<'SQL'
CREATE ROLE idrp_app WITH LOGIN PASSWORD 'PUT-A-STRONG-PASSWORD-HERE';
CREATE DATABASE idrp_db OWNER idrp_app;
SQL
```

PostgreSQL listens on localhost only by default; keep it that way. Flyway creates all
tables on the first backend start. Do **not** create them by hand.

## 4. Code and secrets

```bash
sudo -u idrp git clone https://github.com/<org>/<repo>.git /opt/idrp/repo
cp /opt/idrp/repo/deploy/backend.env.example /etc/idrp/backend.env
nano /etc/idrp/backend.env          # DB password, JWT_SECRET (openssl rand -base64 64 | tr -d '\n'),
                                    # INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD, SEED_STATIC_DATA=true
echo 'VITE_WEB3FORMS_ACCESS_KEY=<your web3forms key>' > /etc/idrp/frontend.env
chown root:idrp /etc/idrp/*.env && chmod 640 /etc/idrp/*.env
```

## 5. Service and first release

```bash
cp /opt/idrp/repo/deploy/systemd/idrp-backend.service /etc/systemd/system/
systemctl daemon-reload && systemctl enable idrp-backend
chmod +x /opt/idrp/repo/deploy/*.sh
sudo -u idrp /opt/idrp/repo/deploy/deploy.sh origin/<branch-to-test>
```

`deploy.sh` runs the backend tests (they need Docker; set `SKIP_TESTS=1` if Docker is not
installed on the VPS, since CI runs them anyway), builds both apps, starts the backend,
waits for `/actuator/health` to report UP, and only then switches the website to the new
build. It keeps the last 5 releases; `deploy/rollback.sh` goes back one.

On this **first** start the backend creates the schema, imports the website content
(`SEED_STATIC_DATA=true`) and creates the super-admin. Check the log:

```bash
journalctl -u idrp-backend -n 100 | grep -E "Migrating|Seeded|Started"
```

Then **edit `/etc/idrp/backend.env`**: set `SEED_STATIC_DATA=false`, delete the two
`INITIAL_ADMIN_*` lines, and `systemctl restart idrp-backend`. Log in to `/admin` and
change the admin password.

## 6. HTTPS certificate

The domain (or test hostname) must already point at the VPS IP (A record).

```bash
systemctl stop nginx
certbot certonly --standalone -d www.idrp.in -d idrp.in --agree-tos -m <admin-email> --no-eff-email
systemctl start nginx
# renewals use the webroot so nginx can stay up:
certbot renew --dry-run --webroot -w /var/www/certbot
```

For a staging hostname, request a certificate for that name and replace `www.idrp.in` /
`idrp.in` in the nginx file accordingly.

## 7. nginx

```bash
cp /opt/idrp/repo/deploy/nginx/idrp.conf /etc/nginx/sites-available/idrp.conf
ln -s /etc/nginx/sites-available/idrp.conf /etc/nginx/sites-enabled/idrp.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## 8. Backups

```bash
echo '30 2 * * * idrp /opt/idrp/repo/deploy/backup.sh' > /etc/cron.d/idrp-backup
sudo -u idrp /opt/idrp/repo/deploy/backup.sh      # run once now to confirm it works
```

Also enable Hostinger's VPS snapshots, and copy `/var/backups/idrp` somewhere off the
server. A backup on the same disk does not help if the VPS is lost.

Restore: `pg_restore -h 127.0.0.1 -U idrp_app -d idrp_db --clean db-YYYY-MM-DD.dump` and
`tar -xzf uploads-YYYY-MM-DD.tar.gz -C /var/idrp`.

## 9. Test checklist (before switching the domain)

- [ ] `https://<host>/actuator/health` returns `{"status":"UP"...}`
- [ ] Home, Startups, Events, Resources, Partners, Mentors, Team pages show content
- [ ] Startups: stage and domain chips filter; "View details" opens the modal; Esc closes it
- [ ] Contact form: organisation is required; a submission appears in **Admin → Inquiries**
- [ ] Edit a startup or event in the admin panel, then reload the public page: the change shows
- [ ] Upload an image in the admin panel; it loads from `/uploads/...`
- [ ] Consent banner appears; Clarity loads only after "Allow analytics"
- [ ] `/sitemap.xml`, `/robots.txt`, `/privacy-policy`, `/facilities` load
- [ ] `systemctl stop idrp-backend`: pages still show (static fallback); a contact form
      submission still goes through (Web3Forms fallback). Then start the backend again.

## 10. Moving the domain off Vercel

1. Lower the DNS TTL for `idrp.in` / `www.idrp.in` to 300 s a day ahead.
2. Change the A records to the VPS IP (remove the Vercel CNAME/ALIAS records).
3. Run step 6 for the real domain as soon as DNS resolves to the VPS.
4. Run the checklist again on `https://www.idrp.in`.
5. Only then remove the domain from the Vercel project, and delete `idrp-frontend/vercel.json`.

## Day-to-day

| Task | Command |
|---|---|
| Release | `sudo -u idrp /opt/idrp/repo/deploy/deploy.sh origin/main` |
| Roll back | `sudo -u idrp /opt/idrp/repo/deploy/rollback.sh` |
| Backend logs | `journalctl -u idrp-backend -f` |
| nginx logs | `tail -f /var/log/nginx/error.log` |
| Re-import website content | set `SEED_STATIC_DATA=true`, restart, set back to `false` (updates in place, never duplicates) |

Schema changes go in a new `idrp-backend/src/main/resources/db/migration/V<n>__what.sql`.
Flyway applies it on the next start. Never edit a migration that has already run.
