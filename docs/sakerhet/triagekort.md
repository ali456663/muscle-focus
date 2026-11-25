# 🚨 Triagekort – säkerhetsincident

*Skriv ut och sätt upp. Följ stegen i ordning.*

---

## 1. Identifiera – är det en incident?

Exempel på tecken:
- Larm om inloggning från okänd plats eller okänt land
- Larm om många misslyckade inloggningar eller ett nytt adminkonto
- Sajten är ändrad (defacement), konstiga omdirigeringar eller okända skript
- En kund rapporterar att hens konto eller uppgifter har missbrukats
- Mejl från GitHub/Netlify/Render/Stripe om ny inloggning eller ändrad behörighet som du inte gjort

**Är du osäker? Behandla det som en incident.**

## 2. Omedelbara steg (första 30 minuterna)

| ✓ | Åtgärd |
| --- | --- |
| ☐ | **Ring säkerhetsansvarig:** Ali Wafa, 070-036 12 89 |
| ☐ | **Spärra kontot** som är kapat. Byt lösenord och logga ut alla sessioner (GitHub, Netlify, Render, Stripe, Google och sajtens admin). Kontrollera att MFA fortfarande är på. |
| ☐ | **Isolera:** stäng av sajten eller API:t (Netlify: *Stop auto publishing* + återställ senaste kända bra deploy. Render: *Suspend service*). Vid egen server: koppla bort den från nätverket – **stäng inte av den** (minnet kan innehålla bevis). |
| ☐ | **Byt hemligheter** som kan ha läckt: API-nycklar, JWT-hemlighet, databaslösenord, Stripe-nycklar. |
| ☐ | **Notera tid** när incidenten upptäcktes. 72-timmarsfristen till IMY börjar nu. |

## 3. Rapportera och dokumentera

Skriv ned (datum och klockslag på allt):
- Vad som hände och hur det upptäcktes
- Vilka system och konton som berördes
- Vilka personuppgifter som kan ha påverkats (personnummer? hälsouppgifter?)
- Vilka åtgärder som togs och av vem

Om personuppgifter kan ha påverkats: **anmäl till IMY inom 72 timmar** (www.imy.se → Anmäl personuppgiftsincident). Vid hög risk informeras även de drabbade.

## 4. ❌ Gör INTE så här

- **Radera inte loggar, filer eller konton** som angriparen använt – de är bevis. Spara kopior.
- **Försök inte "jaga" eller kontakta angriparen** själv.
- **Återställ inte från backup** innan du vet hur angriparen kom in – annars kan hen komma tillbaka.
- **Betala aldrig lösensumma** utan att ha pratat med polisen.
- Prata inte offentligt (sociala medier) om incidenten innan den är bedömd.

## 5. Efteråt

- Återställ från en ren backup när orsaken är åtgärdad. Verifiera innan sajten öppnas igen.
- Polisanmäl vid brott (polisen.se).
- Gör en kort genomgång: vad hände, vad fungerade, vad ändrar vi? Uppdatera policyer och checklista.

---

**Kontakter**

| | |
| --- | --- |
| Säkerhetsansvarig | Ali Wafa · 070-036 12 89 · info.musclefocus@gmail.com |
| IMY (dataskydd) | www.imy.se · 08-657 61 00 |
| Polisen | 114 14 (ej akut) · 112 (akut) |
| CERT-SE (rådgivning) | www.cert.se · cert@cert.se |
