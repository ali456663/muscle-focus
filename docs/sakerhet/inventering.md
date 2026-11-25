# Inventering & sårbarhetsstatus

Senast uppdaterad: 2026-11-25. Uppdateras vid varje ändring av beroenden eller infrastruktur, och minst en gång per månad.

> En komponent vars senaste säkerhetsuppdatering är **äldre än 90 dagar** är en varningsflagga och ska kontrolleras.

## Arkitektur

```
Besökare ──HTTPS 443──► Netlify / nginx (statisk React-app)
                                │
                                └──HTTPS──► Render: backend-API (muscle-focus.onrender.com) ──► databas
                                └──redirect──► Stripe Checkout (betalning)
```

Backend-koden finns **inte** i det här repot och måste inventeras separat (språk, ramverk, databasversion, beroenden).

## Programvara – frontend

| Komponent | Version | Körs hos besökaren? | Kända sårbarheter (npm audit) |
| --- | --- | --- | --- |
| React / React DOM | 19.3.1 | Ja | Inga |
| React Router | 7.18.7 | Ja | Inga (uppgraderad från 7.17 – öppen omdirigering/XSS åtgärdad) |
| framer-motion | 12.43.0 | Ja | Inga |
| lucide-react | 1.80.0 | Ja | Inga |
| gifuct-js | 2.1.2 | Ja | Inga |
| @fontsource/inter, @fontsource/outfit | 5.3.0 | Ja (typsnitt) | Inga |
| Vite | 8.3.8 | Nej (byggverktyg) | Inga |
| ESLint | 10.15.0 | Nej (utvecklingsverktyg) | Inga |

Kontroll: `npm audit` → **0 sårbarheter** (2026-11-25).

## Programvara – drift

| Komponent | Version | Status |
| --- | --- | --- |
| Node.js (byggsteg i Docker) | 22 (alpine) | Stöds (LTS). Node 20 är end-of-life och har tagits bort. |
| nginx (Docker-imagen) | `nginx:alpine` (senaste) | Uppdateras vid varje ny build. Bygg om imagen minst en gång per månad. |
| Netlify | Hanterad tjänst | Leverantören patchar OS och webbserver. |
| Render (backend) | Hanterad tjänst | Leverantören patchar OS. **Backendens egna beroenden måste kontrolleras separat.** |

## Portar & brandvägg

| Port | Tjänst | Ska vara öppen mot internet? |
| --- | --- | --- |
| 443 | HTTPS | **Ja** |
| 80 | HTTP | Endast för omdirigering till 443 (hanteras av Netlify/Render). |
| 3389 (RDP), 445 (SMB), 22 (SSH), 23 (Telnet), 3306/5432 (databas) | – | **Aldrig.** Databasen ska bara nås från backend via privat nätverk. |

Netlify och Render exponerar bara 80/443. Om sajten flyttas till en egen server (VPS) gäller: brandvägg med *deny all* inkommande utom 443/80, SSH endast via nyckel och begränsat till kända IP-adresser, Telnet och SMBv1 avstängda.

## Härdning som är gjord i koden

- Säkerhetsheaders i `nginx.conf` och `netlify.toml`: HSTS, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP.
- nginx: `server_tokens off` (visar inte version), blockerar dolda filer (`/.env`, `/.git` → 404).
- `.env` borttagen från Git och tillagd i `.gitignore`. `.dockerignore` håller `.git` och `node_modules` utanför Docker-imagen.
- Typsnitt hostas lokalt – inga anrop till Google Fonts.

## Rutin

```bash
npm audit            # kända CVE:er i beroenden
npm outdated         # vad som har nyare versioner
npm update && npm run build   # uppdatera inom semver och verifiera
```

Aktivera **Dependabot alerts** och **Dependabot security updates** i GitHub (Settings → Code security) så att nya CVE:er rapporteras automatiskt.
