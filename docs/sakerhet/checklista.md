# Checklista för en säker hemsida

Status per 2026-11-25. ✅ = klart och verifierat · 🟡 = delvis / kräver åtgärd utanför koden · ❌ = ej gjort

## Innan lansering

| Status | Punkt | Kommentar |
| --- | --- | --- |
| ✅ | **GDPR:** Integritetspolicy finns | `/integritetspolicy` med ändamål, laglig grund, lagringstid, mottagare och rättigheter. Länkad i footer, cookie-banner och registrering. |
| ✅ | **GDPR:** Cookie-banner finns | Neka är lika enkelt som att acceptera, inga förkryssade rutor, valet sparas med datum i 12 månader och kan ändras via "Cookie-inställningar" i footern. |
| ✅ | **GDPR:** Ingen onödig överföring till tredje part | Google Fonts ersatt med självhostade typsnitt. |
| 🟡 | **GDPR:** Uppgifter raderas när de inte behövs | Lagringstider står i policyn. **Backend måste faktiskt radera** (t.ex. ett schemalagt jobb för ansökningar äldre än 12 månader). |
| ✅ | **GDPR:** Uttryckligt samtycke för hälsouppgifter | Separat kryssruta (art. 9.2 a) visas när skador/allergier anges och måste kryssas i för att skicka. `healthDataConsent` + tidpunkt skickas med ansökan som bevis. **Backend bör spara dessa fält.** |
| ✅ | **Härdning:** Säkerhetsheaders | HSTS, CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy i `nginx.conf` + `netlify.toml`. Testat med nginx 1.24. |
| ✅ | **Härdning:** Endast 443 öppen | Netlify/Render exponerar bara 80→443. |
| 🟡 | **Härdning:** Standardkonton borttagna | Kontrollera i backend att inget konto heter `admin` med standardlösenord. |
| ✅ | **Härdning:** Inga hemligheter i Git | `.env` borttagen och ignorerad. |
| ❌ | **Härdning:** Läckta nycklar bytta | MuscleWiki-nycklarna har legat publikt på GitHub och **måste bytas** hos MuscleWiki. |
| 🟡 | **Policy:** MFA på alla adminkonton | Slå på MFA på GitHub, Netlify, Render, Stripe och Google. Sajtens egen admininloggning saknar MFA (kräver backendändring). |
| 🟡 | **Policy:** Lösenordspolicy 12 tecken | Klar i frontend (registrering, ansökan, återställning). **Backend måste kontrollera samma regel.** |
| ✅ | **Skanning:** Inga kända kritiska CVE:er (frontend) | `npm audit`: 0 sårbarheter. React Router uppgraderad (öppen omdirigering/XSS). |
| ❌ | **Skanning:** Backend | Backend-repot behöver granskas på samma sätt. |

## Under drift

| Status | Punkt | Kommentar |
| --- | --- | --- |
| 🟡 | **Patchning:** Rutin finns (inga patchar > 90 dagar) | Rutin beskriven i [inventering.md](inventering.md). Aktivera Dependabot i GitHub så det sker automatiskt. |
| ❌ | **Backup:** Daglig, immutable kopia, årligt återläsningstest | Krav beskrivna i [policyer.md](policyer.md#3-backup-policy). Måste sättas upp hos databasleverantören. |
| ❌ | **Loggning:** Misslyckade inloggningar loggas och ger larm | Regler i [loggning-och-larm.md](loggning-och-larm.md). Kräver strukturerad loggning i backend + loggtjänst. |
| ✅ | **Incidentberedskap:** Triagekort finns | [triagekort.md](triagekort.md) – skriv ut och sätt upp. Rapporteringsväg i `SECURITY.md`. |

## Övriga fynd att åtgärda

- ✅ **Åtgärdat: känsliga uppgifter sparades i webbläsaren vid serverfel.** Ansökningar (personnummer, hälsouppgifter) sparas inte längre i `localStorage` – användaren får i stället ett tydligt felmeddelande och kan försöka igen. Ansökningar som redan låg sparade skickas till servern och rensas när den svarar.
- ✅ **Åtgärdat: lösenordet skickades med i ansökan.** Vid gratis provperiod följde lösenordet med i ansökan till `/leads` (och i klartext till `localStorage` vid serverfel). Nu skickas det endast till registreringen. **Kontrollera i backend/databasen att inga gamla ansökningar innehåller ett `password`-fält – radera i så fall det fältet.**
- ✅ Det lokalt sparade träningsprogrammet (`client_program_data`) innehåller inte längre personnummer, vårdnadshavare, signatur eller hälsodetaljer.
- **Inloggningstoken i `localStorage`.** Den kan läsas av skript vid en eventuell XSS. Säkrare är en `HttpOnly`-cookie som backend sätter. CSP:n minskar risken under tiden.
- **Adminsidan `/admin` länkas från footern.** Det är inte farligt i sig om backend kontrollerar behörighet, men att ta bort länken minskar exponeringen.
