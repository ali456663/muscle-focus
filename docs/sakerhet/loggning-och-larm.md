# Loggning & larm

## Vad samlas in

| Källa | Vad | Var |
| --- | --- | --- |
| Webbserver (Netlify/nginx) | Förfrågningar, statuskoder, IP | Netlify-loggar / nginx access log |
| Backend-API (Render) | Inloggningar (lyckade/misslyckade), kontoskapande, adminåtgärder, fel | Render-loggar |
| Databas | Anslutningar, fel, schemaändringar | Databasleverantörens loggar |
| Konton (GitHub, Netlify, Render, Stripe, Google) | Inloggningar, behörighetsändringar | Respektive tjänsts säkerhetslogg |

**Centralisering:** Skicka Render- och Netlify-loggar till ett och samma ställe, t.ex. via *Log Streams* till Better Stack, Grafana Cloud eller Datadog, så att larm kan sättas över alla källor.

**Lagring:** högst 90 dagar (se integritetspolicyn). Logga **aldrig** lösenord, tokens, personnummer eller hälsouppgifter.

## Händelser som ska ge larm

Sajten körs på Linux och hanterade tjänster, inte Windows. Därför används inte Windows-händelserna 4625/4720 direkt, utan motsvarande händelser i backendens applikationslogg.

| Händelse | Windows-motsvarighet | Regel | Nivå |
| --- | --- | --- | --- |
| Misslyckad inloggning (`/api/admin/login`, `/api/clients/login` → 401) | 4625 | **≥ 5 misslyckade från samma IP inom 5 min** | Larm (trolig brute force) |
| Misslyckade inloggningar mot *många olika konton* från samma IP | 4625 | ≥ 10 konton inom 10 min | Larm (credential stuffing) |
| Nytt **admin**konto skapas | 4720 | Alltid | Larm |
| Nytt adminkonto **följt av lyckad inloggning** | 4720 + 4624 | Inom 24 h | **Akut larm** |
| Lyckad admininloggning från nytt land/okänd IP | 4624 | Alltid | Larm |
| Många 5xx-fel | – | > 20 på 5 min | Larm (driftstörning/attack) |
| MFA avstängt eller behörighet ändrad på GitHub/Netlify/Render/Stripe | 4738 | Alltid | Larm |

Larm skickas till e-post och mobil (push/SMS) hos säkerhetsansvarig.

> **Krav på backend:** För att reglerna ska fungera måste backend logga varje inloggningsförsök strukturerat, t.ex.
> `{"event":"login_failed","route":"/api/admin/login","ip":"…","user":"<hash>","ts":"…"}`.
> Backend bör dessutom själv begränsa antalet försök (rate limiting).

## Tolka rätt

- **Övertolka inte enstaka händelser.** En kund som skriver fel lösenord två gånger är inte en attack.
- **Titta på trender:** fler misslyckade inloggningar vecka för vecka, nya länder, ovanliga tider.
- **Automatisera:** ett schemalagt veckosammandrag (SIEM-verktygets rapportfunktion eller ett skript) med antal misslyckade inloggningar, nya konton, top-IP och 5xx-fel. Säkerhetsansvarig läser det varje måndag.
