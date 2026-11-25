# Säkerhetspolicyer

Gäller alla som administrerar www.musclefocusfitness.com, dess backend, databas och tillhörande konton (GitHub, Netlify, Render, Stripe, Google).

Fastställd: 2026-11-25 · Ägare: Ali Wafa · Ses över: årligen

---

## 1. IT-policy

**Konton och MFA**
- **MFA (tvåfaktorsautentisering) är obligatoriskt** på alla konton med administrativ åtkomst: GitHub, Netlify, Render, Stripe, Google/Gmail, domänregistrator och sajtens adminpanel (`/admin`).
- Använd en autentiseringsapp eller säkerhetsnyckel – inte SMS där det går att undvika.
- Inga delade konton. Varje person har ett eget, personligt konto.

**Minsta privilegium (Least Privilege)**
- Varje person/tjänst får bara den behörighet som behövs för uppgiften.
- Adminbehörighet till sajten ges endast till säkerhetsansvarig och ev. namngiven ersättare.
- API-nycklar och tokens ges minsta möjliga scope och läggs aldrig i Git. De lagras som miljövariabler hos Netlify/Render.
- Behörigheter gås igenom **var 6:e månad** och tas bort direkt när någon slutar.

**Standardkonton**
- Inga standardkonton som `admin`/`admin` får finnas. Adminkontot har ett personligt användarnamn.

**Hemligheter**
- `.env` får aldrig committas (styrs av `.gitignore`). Mall finns i `.env.example`.
- En hemlighet som har läckt (t.ex. i Git-historiken) räknas som komprometterad och ska **bytas omedelbart**.

## 2. Lösenordspolicy

- Minst **12 tecken**, med minst **en versal, en gemen och ett specialtecken**. Lösenfraser rekommenderas, t.ex. `Hantel-Knäböj-Vår-2026!`.
- Gäller både kunder och administratörer.
  - Klientsidan kontrollerar policyn i `src/utils/passwordPolicy.js` (registrering, ansökan, återställning).
  - **Backend måste kontrollera samma regler** – klientvalidering går att kringgå.
- Lösenord lagras endast som hash (bcrypt/argon2) – aldrig i klartext eller loggar.
- Byt inte lösenord på schema – byt vid misstanke om läcka.
- Administratörer använder lösenordshanterare och unika lösenord per tjänst.
- Inloggning ska ha skydd mot gissning: max 5 misslyckade försök per IP/konto inom 15 minuter, därefter fördröjning/spärr (backend).

## 3. Backup-policy

| Krav | Rutin |
| --- | --- |
| Frekvens | **Daglig** automatisk backup av databasen (kunder, ansökningar, träningsprogram). |
| Immutable kopia | Minst en kopia lagras **oföränderligt** (t.ex. S3/B2 med Object Lock, eller leverantörens låsta snapshots) så att den inte kan raderas eller krypteras av en angripare. |
| Separering | Backupen ligger hos en annan leverantör/konto än produktionsdatabasen och skyddas av eget MFA-konto. |
| Kryptering | Backuper krypteras eftersom de innehåller personnummer och hälsouppgifter. |
| Lagringstid | 30 dagliga + 12 månatliga kopior. Äldre raderas (GDPR – lagringsminimering). |
| Återläsningstest | **Minst en gång per år** återställs en backup till en testmiljö. Resultatet dokumenteras (datum, tid det tog, problem). |
| Källkod | Finns i GitHub. Ingen separat backup krävs, men en lokal klon hålls uppdaterad. |

## 4. Incidentpolicy

**Rapporteringsväg**
- Alla – personal, kunder och utomstående – rapporterar misstänkta incidenter till **info.musclefocus@gmail.com** med ämnet **"SÄKERHET"**, eller ringer **070-036 12 89** vid brådskande fall.
- Rekommendation: skapa adressen **security@musclefocusfitness.com** och vidarebefordra den till säkerhetsansvarig.

**Hantering**
- Följ [triagekort.md](triagekort.md).
- Varje incident dokumenteras: vad, när, hur den upptäcktes, vilka data som berördes och vilka åtgärder som togs.

**Personuppgiftsincident (GDPR art. 33–34)**
- Om personuppgifter kan ha läckt, ändrats eller förlorats: **anmäl till IMY inom 72 timmar** från upptäckt (www.imy.se), om det inte är osannolikt att incidenten medför risk.
- Om risken för de drabbade är **hög** (t.ex. personnummer eller hälsouppgifter har läckt) informeras de drabbade utan onödigt dröjsmål.
- Även incidenter som inte anmäls ska dokumenteras internt.

**Leverantörer**
- Personuppgiftsbiträdesavtal (DPA) ska finnas med Netlify, Render, Stripe och Google. Spara kopior/länkar i en gemensam mapp.
