# Säkerhetsarbete – Muscle & Focus

Den här mappen beskriver hur vi skyddar www.musclefocusfitness.com och kunddata.

| Dokument | Innehåll |
| --- | --- |
| [policyer.md](policyer.md) | IT-, lösenords-, backup- och incidentpolicy |
| [inventering.md](inventering.md) | Programvara, versioner, portar och risk |
| [loggning-och-larm.md](loggning-och-larm.md) | Vad som loggas och vad som ska ge larm |
| [triagekort.md](triagekort.md) | Vad man gör när något har hänt – skriv ut och sätt upp |
| [checklista.md](checklista.md) | Checklista före lansering och under drift, med aktuell status |

## 1. Ägarskap

| Roll | Person |
| --- | --- |
| Säkerhetsansvarig (äger processen) | Ali Wafa |
| Personuppgiftsansvarig (GDPR) | Muscle & Focus / Ali Wafa |
| Kontakt vid incident | info.musclefocus@gmail.com (ämne "SÄKERHET"), 070-036 12 89 |

Den säkerhetsansvarige går igenom [checklista.md](checklista.md) **en gång per månad** och efter varje större ändring.

## 2. Arbetsflöde: Identifiera → Bedöma → Åtgärda → Verifiera

1. **Identifiera** – `npm audit`, GitHub Dependabot-larm, genomgång av [inventering.md](inventering.md), rapporter via `SECURITY.md`.
2. **Bedöma** – Sätt CVSS-poäng och väg in *exponering* (se nedan).
3. **Åtgärda** – Uppdatera, konfigurera om eller ta bort. Varje åtgärd blir en commit/PR med beskrivning.
4. **Verifiera** – Kör om `npm audit`, testa sajten och kontrollera att headers/regler gäller i produktion. Bocka av först då.

> Sluta inte vid analysen – en sårbarhet räknas som hanterad först när steg 4 är klart.

## 3. Riskbaserad prioritering

CVSS säger hur allvarlig en brist är *i sig*. Vi justerar efter var den finns:

| Var finns bristen? | CVSS 9.0–10 | CVSS 7.0–8.9 | CVSS 4.0–6.9 | CVSS < 4 |
| --- | --- | --- | --- | --- |
| Publik sajt / API (internet) **och** når besökaren | **Akut** – inom 24 h | **Kritisk** – inom 7 dagar | **Hög** – inom 14 dagar | Nästa ordinarie uppdatering |
| Admin / inloggat läge | Kritisk – 7 dagar | Hög – 14 dagar | Medel – 30 dagar | Nästa uppdatering |
| Endast utvecklingsverktyg (körs inte i produktion) | Medel – 30 dagar | Nästa uppdatering | Nästa uppdatering | Nästa uppdatering |

Exempel: en CVSS 6.5 i `react-router` (som körs i besökarens webbläsare) prioriteras högre än en CVSS 9.0 i ett byggverktyg som bara körs på utvecklarens dator.

## 4. Lagar

- **GDPR** – se integritetspolicyn på `/integritetspolicy` (källkod: `src/pages/Privacy.jsx`). Laglig grund och lagringstid per ändamål står där. Ändras insamlingen ska policyn uppdateras samtidigt.
- **Lagen om elektronisk kommunikation (cookies)** – cookie-bannern (`src/components/CookieBanner.jsx`) frågar innan icke-nödvändiga cookies används. Analys/marknadsföring får bara laddas när `hasConsent('analytics' | 'marketing')` är sant.
- **NIS2** – Muscle & Focus är en liten verksamhet inom personlig träning och omfattas i dagsläget inte av NIS2 (ingen samhällsviktig sektor som sjukvård eller energi). Vi följer ändå samma grundrutiner för incidentrapportering och leverantörsavtal. Om vi blir leverantör till en verksamhet som omfattas kan kunden kräva dokumenterade rutiner – de finns i den här mappen.
