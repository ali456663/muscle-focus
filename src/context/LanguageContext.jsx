import React, { createContext, useState, useContext, useEffect } from 'react'

export const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'sv'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    // Handle RTL for Persian
    if (language === 'fa') {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'fa'
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = language
    }
  }, [language])

  const translations = {
    sv: {
      // Navbar
      home: 'Hem',
      packages: 'Träningspaket',
      hittaKompis: 'Hitta träningskompis',
      apply: 'Bli Klient',
      admin: 'Admin',
      licenses: 'Licenser & Certifikat',
      
      // Home Hero
      heroTagline: 'Boka kostnadsfri konsultation idag',
      heroTitle: 'Din väg till snabbare resultat!',
      heroWelcome: 'Varmt välkommen till Muscle & Focus – ',
      heroText: 'Är du redo att bli starkare, friskare och lyckligare – både mentalt och fysiskt? Med Muscle & Focus hybridprogram för personlig träning bygger du inte bara din kropp, utan skärper även ditt sinne och når dina mål. Vårt skräddarsydda tränings- och kostupplägg, med löpande coachning både på plats och online, är designat för att ge dig konkreta resultat – oavsett om du vill forma kroppen, gå ner i vikt eller bygga muskler.',
      btnPackages: 'Utforska träningspaket',
      btnConsultation: 'Boka konsultation',
      
      // Home Health Step
      healthTitle: 'Är du redo att ta steget mot bättre hälsa?',
      healthText: 'Låt oss skapa en starkare, friskare och mer självsäker version av dig! Boka en kostnadsfri konsultation idag, där vi diskuterar dina mål och hur Muscle & Focus kan hjälpa dig att nå dem. Oavsett om du föredrar att svettas på gymmet eller träna hemifrån, har vi lösningen för dig.',
      healthOnlinePlats: 'Online eller på plats: Välj det som passar dig bäst – eller kombinera båda!',
      healthLanguage: 'Flerspråkig coaching: Erbjuder flerspråkiga träningsprogram och kostrådgivning.',
      healthContact: 'Kontakta oss: Skicka ett mejl till info.musclefocus@gmail.com eller fyll i formuläret.',

      // Home Why Choose Me
      whyTitle: 'Varför välja mig?',
      whySubtitle: 'Därför Muscle & Focus',
      whyCommitment: 'Engagemang',
      whyCommitmentText: 'Jag är genuint engagerad i mina klienters framgång och lägger ner all min energi på att hjälpa dem att nå sina mål.',
      whyExpertise: 'Expertis',
      whyExpertiseText: 'Jag har gedigen kunskap och erfarenhet inom träning, kost och hälsa.',
      whyResults: 'Resultat',
      whyResultsText: 'Mina klienter uppnår fantastiska resultat och känner sig starkare, friskare och mer självsäkra.',
      whyFlexibility: 'Flexibilitet',
      whyFlexibilityText: 'Jag erbjuder flexibla träningsalternativ som passar din livsstil och dina behov.',
      whyLanguageText: 'Erbjuder flerspråkiga träningsprogram och kostrådgivning.',
      whyTailoredText: 'Individuellt anpassad träning, oavsett din nivå eller livsstil. Träna hemma, ute eller på gym.',

      // Home About
      aboutSubtitle: 'Möt din coach',
      aboutTitle: 'Om Mig',
      aboutGreeting: 'Jag heter Ali Wafa',
      aboutDesc1: 'Min passion är att hjälpa människor att skapa en starkare, friskare och mer balanserad livsstil. För mig handlar träning inte bara om muskler eller uthållighet – det handlar också om mental styrka, fokus och välbefinnande i vardagen.',
      aboutDesc2: 'Med över 8 års erfarenhet inom styrketräning, viktminskning och konditionsträning har jag utvecklat en träningsfilosofi där hälsa och resultat går hand i hand. Min bakgrund inom flera olika idrotter – bland annat taekwondo, boxning, fotboll och yoga – har gett mig en bred förståelse för rörelse, explosivitet, smidighet och kroppskontroll.',
      
      // Loyalty
      loyaltyBadge: 'Lojalitetsprogram',
      loyaltyTitle: 'Investera i dig själv – vi belönar ditt engagemang!',
      loyaltyText1: 'När du köper vårt program PT-Online-paket ser vi det som starten på en fantastisk resa. Vi vill stötta dig inte bara nu, utan även i framtiden.',
      loyaltyText2: 'Därför får alla som slutför programmet en exklusiv lojalitetsrabatt på 25% på sitt nästa valfria PT-paket.',
      loyaltyNote: 'Vänligen notera: Lojalitetsrabatten gäller på ordinarie pris och kan inte kombineras med andra kampanjer eller specialerbjudanden.',

      // Home Support & Motivation
      supportMotivation: 'Stöd & Motivation',
      supportMotivationText: 'Jag finns vid din sida under hela din utvecklingsresa.',
      
      // Home PT vs Self Comparison
      compareSubtitle: 'Jämförelse',
      compareTitle: 'Träna själv vs. Med en PT',
      compareSelfTitle: 'Träna själv',
      comparePtTitle: 'Träna med en personlig tränare',
      comparePtBadge: 'Rekommenderas',
      compareSelfFeatures: [
        'Risk för skador: Felaktig form vid tunga lyft kan skada din kropp.',
        'Brist på struktur: Svårt att hålla uppe planeringen, vilket bromsar dina resultat.',
        'Motivationsproblem: Enkelt att skippa pass när det blir jobbigt.',
        'Ingen feedback: Ingen som kan korrigera eller utveckla din teknik.'
      ],
      comparePtFeatures: [
        'Expertis: Helt skräddarsydda kost- och träningsprogram.',
        'Motivation: Din coach håller dig accountable hela vägen.',
        'Säkerhet: Korrigering av form i realtid för att undvika skador.',
        'Snabbare resultat: Strukturerad progression som ger maximal utdelning.'
      ],

      // Home Benefits
      benefitsSubtitle: 'Varför styrketräna?',
      benefitsTitle: 'Fördelar för Kropp & Sinne',
      benefitsFysiskTitle: 'Fysiska fördelar',
            benefitsFysiskFeatures: [
        'Bygger muskler och ökar styrka: Styrketräning gör dig starkare, vilket underlättar vardagliga aktiviteter som att lyfta matkassar, bära barn eller klättra i trappor. Ökad muskelmassa förbättrar kroppens utseende och hållning.',
        'Ökar fettförbränning och ämnesomsättning: Muskler förbränner mer kalorier i vila än fett, vilket höjer din vilometabolism. Styrketräning i kombination med kondition kan påskynda viktminskning och hjälpa till att bibehålla en hälsosam kroppsvikt.',
        'Förbättrar benhälsa: Regelbunden styrketräning ökar bentätheten och minskar risken för benskörhet (osteoporos), särskilt viktigt när du blir äldre.',
        'Förbättrar hjärt- och kärlhälsa: Styrketräning kan sänka blodtrycket, förbättra kolesterolvärden och minska risken för hjärt-kärlsjukdomar, särskilt i kombination med konditionsträning.'
      ],
      benefitsMentalTitle: 'Mentala fördelar',
            benefitsMentalFeatures: [
        'Ökar självförtroendet: Att se fysiska framsteg, som ökad styrka eller en mer tonad kropp, boostar självkänslan.',
        'Minskar stress och förbättrar humöret: Styrketräning frisätter endorfiner, kroppens "må-bra-hormoner", vilket kan lindra stress, ångest och depression. Regelbunden träning kan också förbättra sömnkvaliteten.',
        'Långsiktig hälsa och självständighet: Styrketräning gör dig mer motståndskraftig mot åldersrelaterade besvär, som muskelförlust (sarkopeni), och hjälper dig att behålla självständighet längre.'
      ],

      // Home Certifications
      certSubtitle: 'Trygg träning',
      certTitle: 'Licenser & Certifikat',
      certList: [
        { title: 'IntensivePT', subtitle: 'Licensed Personal Trainer', desc: 'Internationell licens för personlig träning och kostrådgivning.' },
        { title: 'IPT Advanced', subtitle: 'Avancerad träningslära', desc: 'Fördjupad kunskap inom programmering, anatomi och periodisering.' },
        { title: 'EREPS Level 4', subtitle: 'EQF Level 4 Personal Trainer', desc: 'Registrerad i European Register of Exercise Professionals för garanterad kvalité.' }
      ],

      // Home CTA
      ctaTitle: 'Är du redo att starta din resa?',
      ctaText: 'Boka en kostnadsfri konsultation idag, så skapar vi en skräddarsydd plan utifrån dina unika mål.',
      ctaButton: 'Skicka intresseanmälan',

      // New Sections Translations
      whyStrengthIntro: 'Styrketräning är en av de bästa investeringarna du kan göra för din hälsa och ditt välmående. Det handlar inte bara om att bygga muskler, utan om att stärka hela kroppen och skärpa sinnet för att möta vardagen med energi.',
      
      idealSubtitle: 'Vår Målgrupp',
      idealTitle: 'Vem vänder sig Muscle & Focus till? (Ideal kund)',
      idealIntro: 'För att ge bästa möjliga resultat fokuserar vi på att förstå våra klienters vardag, utmaningar och mål. Möt "Sofie" – en beskrivning av vår typiska klient, vars behov och livspussel vi har designat våra program för.',
      idealName: 'Namn: Sofie',
      idealAge: 'Ålder: 20-45 år',
      idealJob: 'Yrke: Småföretagare',
      idealSituation: 'Livssituation: ***',
      idealGoalsTitle: 'Mål',
      idealGoals: [
        'Viktnedgång, ökad energi, minska stress, förbättra kondition, få en hälsosammare livsstil.'
      ],
      idealChallengesTitle: 'Utmaningar',
      idealChallenges: [
        'Tidsbrist, brist på motivation, osäkerhet kring träning och kost, har provat dieter och träningsprogram tidigare utan långsiktiga resultat.'
      ],
      idealValuesTitle: 'Värderingar',
      idealValues: [
        'Hälsa, välmående, balans i livet, personlig utveckling.'
      ],
      idealPainTitle: 'Smärtpunkter',
      idealPain: [
        'Känner sig trött och orkeslös.',
        'Missnöjd med sin kropp.',
        'Har svårt att hitta tid för träning.',
        'Känner sig överväldigad av all information om kost och träning.',
        'Behöver någon som kan guida och motivera henne.'
      ],
      idealSearchTitle: 'Vad hon söker',
      idealSearch: [
        'En personlig tränare som är kunnig, engagerad och förstår hennes utmaningar.',
        'Ett träningsprogram som är effektivt, roligt och anpassat efter hennes behov.',
        'Kostråd som är enkla att följa och hållbara.',
        'Stöd och motivation för att hålla sig på rätt spår.'
      ],
      idealOnlineTitle: 'Var hon befinner sig online',
      idealOnline: [
        'Sociala medier (Instagram, Facebook)',
        'Hälsorelaterade bloggar och forum',
        'Lokala evenemang och grupper.'
      ],

      termsSubtitle: 'Köpvillkor & Information',
      termsTitle: 'Villkor och köpinformation för hybrid PT-träning',
      termsIntro: 'Vårt hybridprogram för individuell personlig träning kombinerar fysiska PT-pass på plats med digitala träningspass och löpande coachning via en onlineplattform. Programmet inkluderar ett skräddarsytt tränings- och kostupplägg, optimerat för dina mål – oavsett om du vill forma kroppen, gå ner i vikt eller bygga muskler. Här följer detaljerade villkor och köpinformation för att säkerställa en trygg och flexibel upplevelse.',
      termsSections: [
        {
          title: '1. Ångerrätt (14 dagar)',
          content: 'Enligt lagen om distansavtal och avtal utanför affärslokaler (2005:59) har du rätt att ångra ditt köp inom 14 dagar från det att avtalet ingås (t.ex. när du får din första bekräftelse, tränings-/kostschema eller tillgång till onlineplattformen). Detta gäller både för online- och på-plats-tjänster som köps via distans (t.ex. webb, e-post eller SMS).'
        },
        {
          title: 'Undantag för påbörjade tjänster',
          content: 'Om du har påbörjat tjänsten inom ångerfristen (t.ex. genomfört ett fysiskt PT-pass, fått tillgång till ett digitalt träningsprogram eller använt kostschemat), kan en proportionerlig kostnad debiteras för den del av tjänsten som utnyttjats. Om ett fysiskt PT-pass eller en fullständig onlinekurs redan har levererats, förlorar du ångerrätten för den specifika tjänsten.'
        },
        {
          title: 'Hur du ångrar dig',
          content: 'Meddela oss skriftligen via e-post till info.musclefocus@gmail.com inom 14 dagar från köp. Ange ditt namn, ordernummer och att du vill utnyttja ångerrätten.'
        },
        {
          title: 'Återbetalning',
          content: 'Vid ånger återbetalas beloppet (minus kostnader för redan utförda tjänster) inom 14 dagar från mottagandet av ditt ångermeddelande. Återbetalning sker med samma betalningsmetod som vid köpet (t.ex. Swish, kort) utan extra avgifter.'
        },
        {
          title: '2. Inga löpande kostnader & bindningstider',
          content: 'Engångsbetalning för paket: Våra hybridpaket (t.ex. 10, 20 eller 30 pass) är engångsköp utan automatiska förlängningar eller dolda avgifter. När ditt paket är slutfört avslutas tjänsten automatiskt om du inte väljer att köpa ett nytt paket. Inga bindningstider: Varken fysiska eller digitala tjänster har bindningstider, vilket ger dig maximal flexibilitet.'
        },
        {
          title: '3. Pausa tjänsten vid behov',
          content: 'Fysiska pass: Oanvända PT-pass pausas och kan användas inom 12 månader från köpdatum, så länge du meddelar oss innan passens giltighetstid löper ut. Online-tjänster: Tillgång till digitala träningsprogram, kostscheman och coachning pausas utan extra kostnad och kan användas inom 12 månader från köpdatum, och återaktiveras när du är redo.'
        },
        {
          title: '4. Priser & Betalning',
          content: 'Prisstruktur: Alla priser anges exklusive moms för transparens. Gällande moms (t.ex. 6 % för idrott/PT och 25 % för vissa digitala tjänster) läggs till vid köp och visas tydligt på kvittot eller i orderbekräftelsen. Betalningsalternativ: Betalning kan göras via kort, Swish, faktura eller delbetalning (via tredjepartsleverantör, t.ex. Klarna). Delbetalning kan medföra extra avgifter, som anges vid köptillfället.'
        },
        {
          title: '5. Support & Svarstider',
          content: 'Fysisk support: Din PT är tillgänglig under bokade pass och via e-post/telefon för uppföljning. Online-support: Tillgänglig via appen, e-post eller videosamtal, med svar inom 24–48 timmar på vardagar. Vid helger eller röda dagar kan svarstiden vara upp till 72 timmar.'
        },
        {
          title: '6. Personuppgifter och datalagring (GDPR)',
          content: 'Insamling av personuppgifter: We samlar in och behandlar personuppgifter (t.ex. namn, e-post, telefonnummer, betalningsuppgifter, träningsmål, hälsodata och kroppsmätningar) för att leverera och anpassa ditt tränings- och kostupplägg. Detta sker i enlighet med GDPR (EU:s dataskyddsförordning). Vi lämnar aldrig ut några meddelanden, information eller annan persondata till obehöriga.'
        }
      ],
      
      partnersTitle: 'Några Samarbetspartners',
      partnersSubtitle: 'Vårt nätverk',

      // Packages Page
      packagesSubtitle: 'Vårt utbud',
      packagesTitle: 'Tränings- & Kostpaket',
      packagesIntro: 'Välj det paket som passar din livsstil och dina mål bäst. Alla online-paket inkluderar skräddarsydd kost och träning med personlig coachning.',
      packagesBtnBook: 'Ansök nu',
      packagesCategories: {
        all: 'Alla paket',
        campaign: 'Kampanjer',
        'online-long': 'PT Online (Långa)',
        'online-short': 'PT Online (Korta)',
        'physical-nutrition': 'Kost & Fysiska pass'
      },
      conditionsTitle: 'Köpinformation & Villkor',
      conditionsItems: [
        { title: '14 Dagars Ångerrätt', desc: 'Du har rätt att ångra ditt köp inom 14 dagar från beställning. Om tjänsten påbörjats dras en proportionell kostnad.' },
        { title: 'Inga Bindningstider', desc: 'Alla priser är engångsbetalningar. Inga dolda avgifter eller löpande månadskostnader tillkommer efter avslutat paket.' },
        { title: 'Pausa vid behov', desc: 'Både fysiska PT-pass och onlinetjänster kan pausas utan extra kostnad och sparas i upp till 12 månader.' }
      ],

      // Packages Data
      packagesData: {
        summer: { 
          title: 'Sommarkampanj', 
          duration: '3 Månader', 
          price: '1856 kr', 
          subPrice: 'Halva priset!', 
          badge: 'Sommar-deal', 
          features: ['För alla nivåer', 'Personligt anpassat träningsprogram', 'Anpassat kostschema utifrån dina mål', 'Kontinuerlig uppföljning och coachning', 'Teknikanpassad träning för att undvika skador', 'Gäller t.o.m. 31/8 - Säljstart 1 maj', '14 dagars ångerrätt'],
          readMoreFeatures: [
            'Personligt anpassat träningsprogram',
            'Ett anpassat kostschema utifrån dina mål',
            'Kontinuerlig uppföljning och coachning',
            'Säker och Teknikanpassad träning för att undvika skador',
            'Flexibla träning',
            'Rekommendationer för vitaminer/mineraler och kosttillskott',
            'Feedback'
          ],
          importantHeader: 'VIKTIG INFORMATION: SÄLJSTART 1 MAJ!',
          importantText: 'Observera: Denna sommarkampanj är exklusiv och går endast att köpa från och med den 1 maj. Sätt en påminnelse i kalendern så att du inte missar chansen att säkra din plats!'
        },
        'black-friday': { 
          title: 'Black Friday Transformation', 
          duration: '12 Veckor', 
          price: '1919 kr', 
          subPrice: 'Du sparar 65%', 
          badge: 'Oslagbart pris', 
          features: ['För alla nivåer', '100% skräddarsytt träningsprogram', 'Skräddarsytt kostschema', 'Kontinuerlig uppföljning & coachning', 'Instruktionsvideor för övningar', 'Säljstart 20 november', 'Begränsat antal platser'],
          modalTitle: 'Allt Detta Ingår För Att Bygga Din Drömkropp:',
          readMoreFeatures: [
            'Personligt Anpassat Träningsprogram: En 100% skräddarsydd plan för att skulptera din kropp mot dina specifika mål, oavsett om det är bodybuilding eller din personliga idealform.',
            'Skräddarsytt Kostschema: Rätt bränsle för din förvandling, anpassat för att maximera muskeluppbyggnad och/eller fettförbränning.',
            'Kontinuerlig Uppföljning och Coachning: Din personliga guide på resan som ser till att du håller dig på rätt spår mot din drömfysik.',
            'Träna Säkert med Tydliga Instruktionsvideor: Bemästra tekniken i varje övning för att bygga säkert och effektivt.',
            'Expertråd om Vitaminer & Kosttillskott: Optimera dina resultat med professionella rekommendationer.',
            'Löpande Feedback och Justeringar: Vi finjusterar planen för att säkerställa att du hela tiden fortsätter att utvecklas.'
          ],
          importantHeader: 'VIKTIGT: SÄLJSTART 20 NOVEMBER!',
          importantText: 'Observera: Detta unika erbjudande släpps måndagen den 20 november. Antalet platser är starkt begränsat för att garantera högsta kvalitet. Sätt ett larm och var redo!'
        },
        christmas: { 
          title: 'Julerbjudande', 
          duration: '16 Veckor', 
          price: '1999 kr', 
          subPrice: 'Bästa julklappen till dig själv', 
          badge: 'Jul-deal', 
          features: ['För alla nivåer', 'Anpassat träningsprogram (gym eller hemma)', 'Skräddarsytt och flexibelt kostschema', 'Regelbundna check-ins med coach', 'Videoguide för säker teknik', 'Säljstart 1 december', 'Gåva som varar långt efter jul'],
          modalTitle: 'Allt Detta Ingår i Ditt Julpaket: PT-Online Julerbjudande – Den Bästa Julklappen Till Dig Själv (eller någon du tycker om!)',
          readMoreIntro: 'Starta det nya året starkare än någonsin! Glöm prylarna under granen och investera i det som verkligen betyder något – din hälsa. Vårt exklusiva julerbjudande är den perfekta starten för dig som vill nå dina mål med en professionell och personligt anpassad plan. Detta är en gåva som varar långt efter att julen är över och ger dig verktygen för en hållbar livsstilsförändring.',
          readMoreFeatures: [
            'Personligt Anpassat Träningsprogram: Du får ett 100 % skräddarsytt träningsschema designat för att hjälpa dig nå dina specifika mål, oavsett om det är att bygga muskler, öka styrkan eller forma kroppen. Anpassat för gym eller hemmaträning.',
            'Skräddarsytt och Flexibelt Kostschema: Vi skapar en hållbar kostplan baserad på mat du gillar. Schemat anpassas helt efter din vardag och dina mål, vilket gör det enkelt och njutbart att äta hälsosamt.',
            'Kontinuerlig Uppföljning och Coachning: Du är aldrig ensam! Genom regelbundna check-ins och tät kontakt med din coach ser vi till att du håller dig motiverad, är på rätt spår och justerar planen när det behövs.',
            'Videoguide för Säker Träning: Känn dig helt trygg med tekniken. Alla övningar i ditt program kommer med tydliga instruktionsvideor för att maximera dina resultat och minimera skaderisken.',
            'Expertråd om Kosttillskott & Vitaminer: För att optimera din hälsa och dina resultat får du personliga rekommendationer kring vilka vitaminer, mineraler och kosttillskott som kan vara värdefulla för just dig.',
            'Löpande Feedback och Justeringar: Din utveckling är vårt fokus. Du får kontinuerlig återkoppling på dina framsteg, vilket säkerställer att programmet alltid är anpassat för att du ska fortsätta utmanas och utvecklas.'
          ],
          importantHeader: 'VIKTIG INFORMATION: SÄLJSTART 1 DECEMBER!',
          importantText: 'Detta är den perfekta julklappen som fortsätter att ge långt in på det nya året. Säkra din plats eller köp ett presentkort idag!'
        },
        'pt-online-26': { 
          title: 'Komplett PT-paket', 
          duration: '26 Veckor', 
          price: '4699 kr', 
          subPrice: 'Student/Ungdom/Pensionär: 4250 kr', 
          badge: 'Mest prisvärt', 
          features: ['För alla nivåer', 'Skräddarsydd träning & kost efter dina mål', 'Progressiv belastningsjustering varje månad', 'Detaljerade övningar med videoklipp', 'Regelbundna check-ins (vecko/månadsvis)', 'Helhetsperspektiv (sömn, återhämtning, kondition)', 'Support via WhatsApp & e-post'],
          modalTitle: 'Komplett PT-paket - PT Online (26 Veckor)',
          readMoreIntro: 'Ett personligt tränings- och kostupplägg med löpande coachning under 26 veckor är en omfattande och effektiv metod för att uppnå specifika hälsomål, oavsett om det handlar om att forma kroppen, gå ner i vikt eller bygga muskler. För att nå bästa möjliga resultat är programmet uppbyggt kring skräddarsydda planer, kontinuerlig uppföljning och anpassning efter individens framsteg och livssituation.\n\nGrundstenarna i ett 26-veckorsprogram:\nEtt framgångsrikt program som sträcker sig över sex månader bygger på ett nära samarbete mellan dig och din coach. Processen inleds vanligtvis med en grundlig konsultation och hälsodeklaration för att kartlägga dina mål, förutsättningar, preferenser och eventuella hinder.',
          readMoreFeatures: [
            'Skräddarsytt träningsupplägg med fokus på styrketräning: Ditt träningsprogram anpassas helt efter dina mål och erfarenheter (gym, hemma eller utomhus). Programmet inkluderar detaljerade övningar med videoklipp, progressiv belastning och ett helhetsperspektiv på kondition, sömn och återhämtning.',
            'Anpassat kostschema: Personlig kostplan baserad på preferenser, allergier eller vegansk kost. Varierade, enkla och hållbara recept utan strikta förbud för att garantera långsiktiga resultat.',
            'Löpande coachning för optimala resultat: Tät uppföljning och feedback genom regelbundna vecko- eller månadsvisa check-ins för att hålla motivationen uppe och anpassa planen efter dina framsteg.'
          ]
        },
        'next-level-26': { 
          title: 'Next Level 26', 
          duration: '26 Veckor', 
          price: '4105 kr', 
          subPrice: 'Student/Ungdom/Pensionär: 3828 kr', 
          badge: 'Flerspråkig', 
          features: ['För alla nivåer', 'Skräddarsytt träningsprogram & kost', 'Flerspråkigt stöd (coaching på modersmål)', 'Stöd för Arabiska, Turkiska, Persiska, Tyska m.fl.', 'Obegränsad support via WhatsApp/e-post', 'Regelbundna uppdateringar och anpassningar', '100% trygghet och tydligare kommunikation'],
          modalTitle: 'Next Level 26 - Multilingual Coaching (26 Veckor)',
          readMoreIntro: 'Detta är ett omfattande 26-veckors online-coachingpaket som erbjuder personligt anpassad träning och kost med en unik inriktning på flerspråkig support. Detta innebär en stor möjlighet för dig som inte känner dig helt bekväm med svenska eller engelska. Att kunna få ditt träningsprogram, dina kostråd och all löpande coachning på ditt eget modersmål kan göra en enorm skillnad för dina resultat. Fördelarna med coaching på ditt modersmål inkluderar:',
          readMoreFeatures: [
            'Tydligare kommunikation: Du kan vara säker på att du förstår alla instruktioner korrekt, vilket minimerar risken för missförstånd och felaktigt utförda övningar.',
            'Ökad trygghet: Det kan kännas tryggare och mer personligt att kommunicera med en coach på det språk du är mest bekväm med.',
            'Bättre resultat: När språkbarriärer tas bort blir det enklare att ställa frågor, ge feedback och få ut det mesta av din coachning, vilket leder till effektivare och säkrare träning.'
          ],
          importantHeader: 'VÅR FLERSPRÅKIGA COACHING / OUR MULTILINGUAL COACHING',
          importantText: '🇸🇪 Att få coaching på sitt eget modersmål gör stor skillnad för dina resultat.\n\n🇸🇦 إن القدرة على الحصول على برنامجك التدريبي، ونصائحك الغذائية، وجميع التدريبات المستمرة بلغتك الأم يمكن أن تحدث فرقًا هائلاً في نتائجك.\n\n🇹🇷 Antrenman programınızı, beslenme tavsiyelerinizi ve tüm koçluk sürecini kendi ana dilinizde alabilmek, sonuçlarınızda muazzam bir fark yaratabilir.\n\n🇮🇷 اینکه بتوانید برنامه تمرینی، توصیههای غذایی و تمام مربیگریهای مستمر خود را به زبان مادری خود دریافت کنید، میتواند تفاوت بزرگی در نتایج شما ایجاد کند.\n\n🇩🇪 Ihren Trainingsplan, Ihre Ernährungsempfehlungen und das gesamte laufende Coaching in Ihrer eigenen Muttersprache erhalten zu können, kann einen enormen Unterschied für Ihre Ergebnisse machen.\n\n🇪🇸 Poder recibir tu programa de entrenamiento, tus consejos de nutrición y todo el coaching continuo en tu propio idioma puede marcar una diferencia enorme en tus resultados.\n\n🇫🇷 Pouvoir obtenir votre programme d\'entraînement, vos conseils nutritionnels et tout le coaching en continu dans votre propre langue maternelle peut faire une énorme différence pour vos résultats.\n\n🇷🇺 Возможность получать вашу программу тренировок, рекомендации по питанию и все текущее сопровождение на вашем родном языке может иметь огромное значение для ваших результатов.'
        },
        'body-reboot-26': { 
          title: 'Body Reboot 26', 
          duration: '26 Veckor', 
          price: '3850 kr', 
          subPrice: 'Student/Ungdom/Pensionär: 3250 kr', 
          badge: 'För erfarna', 
          features: ['För medel eller avancerade motionärer', 'Kräver god grundläggande kunskap i teknik', 'Professionellt utformad progressionsplan', 'Löpande expertstöd för kost & träning', 'Hållbara vanor utan strikta dieter eller förbud', 'Regelbundna check-ins för optimala resultat'],
          modalTitle: 'Body Reboot 26 - PT Online (26 Veckor)',
          readMoreIntro: 'Detta är ett online-coachingpaket som sträcker sig över 26 veckor och är utformat för en specifik målgrupp. Vem passar paketet för?',
          readMoreFeatures: [
            'Idealisk för erfarna: Detta paket är idealiskt för dig som redan har god grundläggande kunskap i träningsteknik och är erfaren (”proffs”) när det gäller att bygga muskler eller minska i fett.',
            'Inte för nybörjare: Det är alltså inte ett paket för nybörjare som behöver lära sig grunderna från början.',
            'Självständig utveckling: Detta 26-veckorspaket är ett prisvärt alternativ för den självständiga och erfarna motionären som inte behöver hjälp med grundläggande teknik, men som vill ha en professionellt utformad plan och löpande expertstöd för att strukturera sin träning och kost över en längre period.'
          ]
        },
        'lifestyle-16': { 
          title: 'Livsstilsstarten', 
          duration: '16 Veckor', 
          price: '3105 kr', 
          subPrice: 'Student/Ungdom/Pensionär: 2840 kr', 
          badge: 'Populär', 
          features: ['För alla nivåer', 'Skräddarsytt tränings- & kostprogram', 'Optimal näringsbalans (protein, fiber, vitaminer)', 'Enkla & varierade recept (anpassat för veggan/allergier)', 'Videoinstruktioner på alla styrkeövningar', 'Löpande feedback och justeringar', 'Sömn- och återhämtningsrådgivning'],
          modalTitle: 'Allt Detta Ingår i Ditt 16-Veckorspaket',
          readMoreFeatures: [
            'Detaljerade övningar: Tydliga instruktioner, ofta med videoklipp, för att säkerställa att du tränar säkert och effektivt.',
            'Progressiv belastning: Planen justeras kontinuerligt för att du ska fortsätta utmanas och utvecklas. Många upplägg uppdateras varje månad för att anpassas efter din utveckling.',
            'Helhetsperspektiv: Förutom styrketräning kan programmet även inkludera konditionsträning och råd kring återhämtning och sömn för att maximera resultaten.',
            'Anpassat kostschema: För att nå dina mål är kosten en avgörande faktor. Ett personligt kostschema tas fram baserat på din livsstil, dina preferenser och ditt kaloribehov. Målet är att skapa hållbara vanor utan strikta dieter eller förbud. Kostschemat innefattar ofta:',
            'Varierade och enkla recept: För att göra det lättare att följa planen i längden.',
            'Anpassning efter preferenser och allergier eller veggan: Kosten ska fungera för dig och din vardag.',
            'Löpande coachning och anpassning för optimala resultat',
            'Regelbunden uppföljning och feedback: Du har regelbunden kontakt med din coach, vanligtvis genom veckovisa eller månadsvisa "check-ins". Under dessa avstämningar analyseras dina framsteg och du får personlig feedback, vilket hjälper dig att hålla dig på rätt spår.',
            'Optimal Näringsbalans – Varje Dag:',
            'Protein: Säkerställ att du får i dig tillräckligt med protein för muskeluppbyggnad och återhämtning.',
            'Fibrer: Maximera ditt fiberintag för en god mättnadskänsla, stabil blodsockernivå och en frisk matsmältning.',
            'Vitaminer & Mineraler: Recepten är framtagna för att naturligt förse dig med ett brett spektrum av viktiga vitaminer och mineraler för att stötta din hälsa och ditt välbefinnande.'
          ]
        },
        'glute-leg-16': { 
          title: 'Glute & Leg Specialisten', 
          duration: '16 Veckor', 
          price: '3000 kr', 
          subPrice: 'Student/Ungdom/Pensionär: 2810 kr', 
          badge: 'För tjejer', 
          features: [
            'Endast för tjejer (För Alla Nivåer)', 
            'Fokus på träning av rumpa och ben', 
            'Inkluderar även träning för resten av kroppen', 
            'Komplett kostschema med optimal näringsbalans', 
            'Obegränsad support via chatt', 
            'Regelbundna programuppdateringar'
          ],
          modalTitle: 'Skräddarsytt Träningsprogram med Fokus på Underkroppen',
          readMoreFeatures: [
            'Skräddarsytt Träningsprogram med Fokus på Underkroppen: Du får ett personligt utformat träningsprogram som är 100 % anpassat efter dina mål, din erfarenhet och din vardag. Programmet är specialiserat för att maximera resultaten för rumpa och ben, men inkluderar även träning för resten av kroppen för en balanserad och stark fysik.',
            'Optimal Näringsbalans – Varje Dag:',
            'Protein: Säkerställ att du får i dig tillräckligt med protein för muskeluppbyggnad och återhämtning.',
            'Fibrer: Maximera ditt fiberintag för en god mättnadskänsla, stabil blodsockernivå och en frisk matsmältning.',
            'Vitaminer & Mineraler: Recepten är framtagna för att naturligt förse dig med ett brett spektrum av viktiga vitaminer och mineraler för att stötta din hälsa och ditt välbefinnande.',
            'Obegränsad support: Tillgång till din coach via chatt för snabba frågor och extra pepp när du behöver det.',
            'Regelbundna programuppdateringar: Träningsprogrammet justeras och utvecklas i takt med att du blir starkare.'
          ]
        },
        'fokus-12': { 
          title: 'Fokus 12', 
          duration: '12 Veckor', 
          price: '2469 kr', 
          subPrice: 'Student/Ungdom/Pensionär: 2215 kr', 
          badge: 'Standard', 
          features: [
            'För alla nivåer', 
            'Personligt anpassat träningsprogram', 
            'Hållbart kostschema (utan krångliga dieter)', 
            'Kontinuerlig uppföljning och coachning', 
            'Instruktionsvideor för alla styrkeövningar', 
            'Expertråd om vitaminer och kosttillskott', 
            'Löpande feedback och schemajusteringar'
          ],
          modalTitle: 'Fokus 12 – Allt detta ingår i ditt paket:',
          readMoreIntro: 'Detta paket ger dig en komplett grund för en lyckad och hållbar livsstilsförändring. Investera i dig själv och låt oss hjälpa dig att nå din fulla potential.',
          readMoreFeatures: [
            '1. Personligt Anpassat Träningsprogram: Glöm generiska scheman. Du får ett program som är 100 % skräddarsytt efter dina mål, din nuvarande nivå och dina förutsättningar. Oavsett om du tränar på gym eller hemma, designar vi en effektiv och hållbar plan för just dig.',
            '2. Skräddarsytt Kostschema: Vi skapar en hållbar och njutbar kostplan baserad på mat du faktiskt gillar. Schemat anpassas helt efter din vardag och dina mål, utan krångliga dieter eller förbud. Målet är att ge dig verktygen för att äta hälsosamt på ett sätt som fungerar för dig.',
            '3. Kontinuerlig Uppföljning och Coachning: Din coach finns med dig hela vägen. Genom regelbundna check-ins håller vi koll på dina framsteg, justerar planen vid behov och ser till att du håller motivationen uppe. Du har alltid ett bollplank och en expert att vända dig till.',
            '4. Instruktionsvideor för Alla Styrkeövningar: Känn dig trygg och säker i din träning. Alla övningar i ditt program kommer med tydliga videoinstruktioner som visar korrekt teknik. Detta minimerar skaderisken och maximerar effekten av varje repetition.',
            '5. Expertråd om Vitaminer och Kosttillskott: För att optimera dina resultat och ditt allmänna välmående får du personliga rekommendationer kring vilka vitaminer, mineraler och kosttillskott som kan vara fördelaktiga för just dig, baserat på din kost och dina mål.',
            '6. Löpande Feedback och Justeringar: Din utveckling är i fokus. Du får kontinuerlig feedback på din prestation och dina resultat, och vi är redo att justera programmet för att säkerställa att du fortsätter att göra framsteg under hela resans gång.'
          ]
        },
        'health-8': { 
          title: 'Styrka & Hälsa', 
          duration: '8 Veckor', 
          price: '1829 kr', 
          subPrice: 'Student/Ungdom/Pensionär: 1499 kr', 
          badge: 'Intensiv', 
          features: [
            'För alla nivåer', 
            'Snabb 8-veckors transformation', 
            'Skräddarsytt träningsprogram (gym eller hemma)', 
            'Anpassat kostschema baserat på mat du gillar', 
            'Veckovisa check-ins för att hålla motivationen uppe', 
            'Instruktionsvideor för säker teknik', 
            'Komplett guide för att nå dina drömresultat'
          ],
          modalTitle: 'Allt Detta Ingår i Ditt 8-Veckorspaket:',
          readMoreIntro: 'Detta paket är den perfekta lösningen för dig som är redo att satsa helhjärtat under 8 veckor och vill ha en komplett, professionell guide för att nå dina drömresultat.',
          readMoreFeatures: [
            '1. Personligt Anpassat Träningsprogram: Vi utformar ett träningsprogram helt och hållet baserat på dina mål, din erfarenhetsnivå och din vardag. Programmet fokuserar på att bygga styrka och förbättra din fysik på ett effektivt och säkert sätt, oavsett om du tränar hemma eller på gym.',
            '2. Skräddarsytt Kostschema: Nå dina mål snabbare med ett kostschema som är anpassat för dig. Vi tar hänsyn till dina preferenser, din livsstil och dina mål för att skapa en plan som är både god, näringsrik och enkel att följa.',
            '3. Kontinuerlig Uppföljning och Coachning: Du är aldrig ensam på din resa. Med regelbundna check-ins ser vi till att du är på rätt spår, håller motivationen uppe och justerar planen vid behov. Din coach finns tillgänglig för att svara på frågor och ge dig det stöd du behöver för att lyckas.',
            '4. Instruktionsvideor för Alla Styrkeövningar: Träna med självförtroende! Varje övning i ditt program kommer med en tydlig instruktionsvideo som visar korrekt teknik. Detta är avgörande för att maximera dina resultat och minimera risken för skador.',
            '5. Expertråd om Vitaminer och Kosttillskott: För att ge din kropp de bästa förutsättningarna får du personliga rekommendationer om vilka vitaminer, mineraler och kosttillskott som kan komplettera din kost och hjälpa dig att nå dina mål ännu effektivare.',
            '6. Löpande Feedback: Vi följer din utveckling noggrant och ger dig kontinuerlig feedback. Detta hjälper dig att förstå dina framsteg och vad som krävs för att ta nästa steg mot dina mål.'
          ]
        },
        'kickstart-4': { 
          title: 'Projekt 4 Veckor', 
          duration: '4 Veckor', 
          price: 'Ordinarie: 1129 kr', 
          subPrice: 'Ungdom/student/pensionär: 856 kr', 
          badge: 'Kickstart', 
          features: [
            'För alla nivåer', 
            'Kraftfull kickstart eller för att bryta en platå', 
            'Intensiv träningsplan anpassad för alla nivåer', 
            'Enkelt och hållbart kostschema', 
            'Kontakt med din coach', 
            'Instruktionsvideor för alla övningar', 
            'Snabb återkoppling på dina framsteg'
          ],
          modalTitle: 'Detta ingår i paketet',
          readMoreIntro: '',
          readMoreFeatures: [
            'Personligt anpassat träningsprogram',
            'Ditt kostschema anpassas efter just dig, din vardag och ditt mål.',
            'Kontinuerlig uppföljning och coachning',
            'Video på styrkeövningarna för att undvika skador',
            'Rekommendationer för vitaminer/mineraler och kosttillskott',
            'Feedback'
          ]
        },
        nutrition: { 
          title: 'Avancerat Kostschema', 
          duration: 'Engångsköp', 
          price: '2458 kr', 
          subPrice: 'Komplett måltidsplan', 
          badge: 'Bara kost', 
          features: [
            'För alla nivåer', 
            '20 unika och funktionella måltidsrecept', 
            'Fördelat på 5 näringsrika måltider per dag', 
            'Anpassat efter din livsstil och dina matpreferenser', 
            'Optimal näringsbalans (protein, fiber, vitaminer)', 
            'Lättlagad mat som ger stabil blodsockernivå', 
            'Guide till att äta smartare och må bättre'
          ],
          modalTitle: 'Avancerat Kostschema: Din Nyckel till Optimal Näring och Resultat',
          readMoreIntro: 'Med detta avancerade kostschema får du inte bara en plan, utan en guide till att äta smartare, må bättre och prestera optimalt.',
          readMoreFeatures: [
            'Vem passar detta kostschema för?',
            'Dig som vill ta din kost till nästa nivå.',
            'Dig som söker inspiration och variation i din matlagning.',
            'Dig som vill säkerställa att du får i dig alla nödvändiga näringsämnen.',
            'Dig som vill ha ett tydligt upplägg för att nå specifika hälso- eller träningsmål.'
          ]
        },
        'tech-60': { 
          title: 'Teknikträning (60) Minuter', 
          duration: '60 Minuter', 
          price: 'Ordinarie: 499 kr', 
          subPrice: 'Ungdom/student/pensionär: 340 kr', 
          badge: 'Fysiskt pass', 
          features: [
            'För alla nivåer', 
            'Session för korrekt teknik i specifika övningar', 
            'Fokus på marklyft, knäböj och bänkpress', 
            'Möjlighet att välja specifika övningar själv', 
            'Session uppdelad i uppvärmning & teknikfokus', 
            'Tydliga instruktioner för att undvika skador', 
            'Nedvarvning och feedback ingår'
          ],
          modalTitle: 'Teknikträning (60) Minuter',
          readMoreIntro: 'Teknikträningssession fokuserad på att förbättra korrekt teknik i specifika övningar. Sessionen är uppdelad i uppvärmning, teknikfokus och nedvarvning, med tydliga instruktioner för att säkerställa korrekt utförande. Jag antar att du vill ha en generell session som täcker några vanliga styrkeövningar (marklyft, knäböj, bänkpress), men om du har specifika övningar i åtanke, meddela mig!',
          readMoreFeatures: [
            'Förbättra din teknik i specifika övningar',
            'Sessionen är uppdelad i uppvärmning, teknikfokus och nedvarvning',
            'Tydliga instruktioner för att säkerställa korrekt utförande',
            'Täcker vanliga basövningar som marklyft, knäböj och bänkpress',
            'Möjlighet att anpassa efter dina egna valda övningar'
          ]
        },
        'individual-pt': { 
          title: 'Individuell PT-träning 60 min', 
          duration: '60 Minuter / pass', 
          price: '499 kr', 
          subPrice: 'Boka 20 pass för 7850 kr (392 kr/pass)', 
          badge: 'Fysisk PT', 
          features: [
            'För alla nivåer', 
            'Fysiska träningspass anpassade efter dina mål', 
            'Inkluderar även personligt anpassat träningsprogram', 
            'Kopplat kostschema anpassat efter din vardag', 
            'Kontinuerlig uppföljning och coachning ingår', 
            'Teknikanpassad träning på gymmet', 
            'Flexibla träningstider'
          ],
          modalTitle: 'Vad ingår i programmet?',
          readMoreIntro: 'Med vårt 60-minutersprogram för personlig träning får du en helhetslösning som kombinerar skräddarsydd styrketräning, kostplanering och kontinuerlig coachning. Oavsett om ditt mål är att forma kroppen, gå ner i vikt, bygga muskler eller förbättra din allmänna hälsa, är detta program designat för att maximera dina resultat och hålla dig motiverad.',
          readMoreFeatures: [
            'Skräddarsytt träningsupplägg (20 pass eller fler)',
            'Personlig analys: Vi börjar med en djupgående konsultation där vi kartlägger din nuvarande nivå, mål, livsstil och eventuella begränsningar (t.ex. skador eller tidsbrist).',
            'Fokus på styrketräning: Träningsprogrammet utformas med en mix av styrketräning för att optimera muskeluppbyggnad, fettförbränning eller funktionell fitness, beroende på dina mål. Vi inkluderar variationer som fria vikter, maskiner, kroppsvikt och funktionella övningar.',
            'Progression och variation: Programmet uppdateras var 4–6:e vecka för att säkerställa kontinuerlig utveckling och undvika platåer.',
            'Tillgänglighet: Träningspassen kan utföras på gym, hemma eller utomhus, beroende på dina preferenser och resurser.',
            'Anpassat kostschema',
            'Individuell kostplan: Baserat på dina mål (viktminskning, muskelbygge eller prestation) skapar vi en kostplan som är realistisk och hållbar. Vi tar hänsyn till dina matpreferenser, allergier och livsstil (t.ex. vegetarisk, vegan eller flexitarian).',
            'Makronutrientbalans: Vi optimerar fördelningen av protein, kolhydrater och fett för att stödja dina träningsmål.',
            'Måltidsförslag och recept: Få konkreta förslag på måltider, mellanmål och eventuellt tillskott (t.ex. proteinpulver eller vitaminer) för att förenkla din vardag.',
            'Flexibilitet: Kostschemat justeras löpande baserat på din utveckling, energinivå och feedback.',
            'Löpande coachning och uppföljning',
            'Veckovis uppföljning: Regelbundna check-ins (via digitala möten, app eller e-post) för att utvärdera framsteg, ge feedback och justera tränings- och kostupplägg.',
            'Motivation och ansvar: Din PT fungerar som din personliga coach och håller dig accountable med pepp och strategier för att övervinna hinder.',
            'Obegränsad support: Tillgång till din coach via WhatsApp eller e-post för snabba frågor och extra pepp när du behöver det.',
            'Anpassning i realtid: Om livsstilsförändringar, skador eller andra faktorer påverkar din träning, anpassar vi programmet direkt för att hålla dig på rätt spår.'
          ]
        }
      },

      // Apply Page
      applySubtitle: 'Ta första steget',
      applyTitle: 'Skicka din intresseanmälan',
      applyIntro: 'Fyll i formuläret så noggrant du kan. Det hjälper oss att förbereda och skräddarsy ditt upplägg. Detta är en helt kostnadsfri och icke-bindande intresseanmälan.',
      applyContactEmailTitle: 'E-post för frågor',
      applyContactPhoneTitle: 'Telefon / WhatsApp',
      applyContactLocationTitle: 'Plats',
      applyContactLocationText: 'Träna online eller på plats i gymmiljö',
      applyDisclaimer: '14 dagars ångerrätt gäller enligt lag för alla distansköp.',
      applyLabelFullName: 'Fullständigt namn *',
      applyPlaceholderFullName: 'För- och efternamn',
      applyLabelGender: 'Kön *',
      applyOptionFemale: 'Kvinna',
      applyOptionMale: 'Man',
      applyOptionOther: 'Annat / Vill ej uppge',
      applyLabelAge: 'Ålder *',
      applyPlaceholderAge: 'År',
      applyLabelCity: 'Stad *',
      applyPlaceholderCity: 'T.ex. Stockholm',
      applyLabelEmail: 'E-postadress *',
      applyPlaceholderEmail: 'namn@epost.se',
      applyLabelPhone: 'Telefonnummer *',
      applyPlaceholderPhone: '07X-XXX XX XX',
      applyLabelWish: 'Önskemål om träning (Paket) *',
      applyPlaceholderWish: '-- Välj ett träningspaket --',
      applyLabelMessage: 'Meddelande / Tidigare erfarenhet (Frivilligt)',
      applyPlaceholderMessage: 'Beskriv kort din nuvarande form, dina mål eller om du har några skador...',
      applyBtnSubmit: 'Skicka intresseanmälan (Gratis Konsultation)',
      applyBtnPayWithStripe: 'Betala direkt med Stripe (Köp nu) 💳',
      applyLabelStudentDiscount: 'Jag är student, ungdom eller pensionär (Få reducerat pris)',
      paymentSuccessTitle: 'Betalning Mottagen! 🎉',
      paymentSuccessText: 'Tack {name}! Din betalning för {wish} har registrerats.',
      paymentSuccessSubtext: 'Vi har skickat en bekräftelse till {email} och Ali kommer att kontakta dig på {phone} inom kort för att starta din träningsresa.',
      paymentSuccessBack: 'Tillbaka till startsidan',
      paymentCancelTitle: 'Betalning avbruten ❌',
      paymentCancelText: 'Betalningen slutfördes inte. Om du stötte på problem eller vill välja ett annat paket kan du gå tillbaka till träningspaketen.',
      paymentCancelBack: 'Tillbaka till träningspaket',
      applyBtnSending: 'Skickar...',
      applyErrorFields: 'Vänligen fyll i alla obligatoriska fält.',
      applySuccessTitle: 'Tack för din ansökan!',
      applySuccessText: 'Hej {name}. Vi har tagit emot din intresseanmälan för paket {wish}.',
      applySuccessSubtext: 'Lic. PT Ali Wafa kommer att kontakta dig via e-post ({email}) eller telefon ({phone}) inom 24 timmar för att diskutera ditt upplägg.',
      applySuccessBack: 'Tillbaka till startsidan',
      
      // Footer & Partners Extra Links
      idealLink: 'Ideal kund',
      termsLink: 'Köpvillkor & Info',
      whyStrengthLink: 'Varför styrketräna?',
      visitPartner: 'Besök hemsida',
      partnerWeightworldDesc: 'Premium kosttillskott och hälsoprodukter för viktminskning och energi.',
      partnerStaybeautifulDesc: 'Skönhets- och hudvårdsprodukter för ett sundare och fräschare liv.',
      partnerApulsDesc: 'Träningsredskap och professionell gymutrustning för hemmaträning.',
      partnerMindlyDesc: 'Verktyg för mental träning, självhjälp och personlig utveckling.',
      partnerMusclepainDesc: 'Massagepistoler och återhämtningsprodukter för trötta muskler.',
      partnerSskbutikenDesc: 'Hälsoprodukter, bekväma skor och stöd för vårdpersonal och motionärer.',
      
      // Footer specific translations
      footerTagline: 'Vi bygger inte bara ett starkare yttre – vi utvecklar också styrkan och fokuset inom dig.',
      footerNavTitle: 'Navigation',
      footerInfoTitle: 'Information',
      footerContactTitle: 'Kontakt & Support',
      footerSupportHours: 'Svarstid: 24–48 timmar under vardagar. Helger upp till 72 timmar.',

      // BMI Calculator Page
      bmiCalculator: 'BMI-räknare',
      bmiTagline: 'BMI-räknare – räkna ut och tolka ditt BMI',
      bmiWeightLabel: 'Vikt (kg)',
      bmiHeightLabel: 'Längd (cm)',
      bmiDecimalTip: 'Tips! För ett mer exakt resultat kan du ange decimaler.',
      bmiBtnCalculate: 'Räkna ut BMI',
      bmiBtnClear: 'Rensa information',
      bmiBtnCalculating: 'Räknar ut...',
      bmiResultTitle: 'Ditt BMI är',
      bmiClassTitle: 'Din viktklass',
      bmiUnderweight: 'Undervikt',
      bmiNormalweight: 'Normalvikt',
      bmiOverweight: 'Övervikt',
      bmiObesity: 'Fetma (obesitas)',
      
      bmiWhatIsTitle: 'Vad är BMI?',
      bmiWhatIsDesc: 'BMI är en förkortning för Body Mass Index, eller kroppsmassindex som det heter på svenska. Det är ett mått som jämför din vikt med din längd och resulterar i ett BMI-värde. Hälso- och sjukvården använder ofta BMI som ett av verktygen för att se om din vikt anses vara hälsosam.',
      bmiGroupsIntro: 'BMI delas in i olika grupper:',
      
      bmiHowToInterpretTitle: 'Så tolkar du ditt BMI',
      bmiHowToInterpretDesc1: 'Det finns internationella gränsvärden för BMI som kan ge en första fingervisning om din vikt ligger på en hälsosam nivå. För att sedan få en mer komplett bild av din hälsa brukar man också mäta midjemåttet och ta exempelvis blodtryck och blodprover.',
      bmiHowToInterpretDesc2: 'Med andra ord bör du inte låta BMI-värdet bli det enda du utgår ifrån men du kan använda det som en del av helhetsbilden för hur din kropp mår.',
      
      bmiGuidelinesTitle: 'Riktlinjer för BMI och viktklass',
      bmiTableBmi: 'BMI',
      bmiTableClass: 'Viktklass',
      bmiTableUnder185: 'Under 18,5',
      bmiTable185_249: '18,5 - 24,9',
      bmiTable25_299: '25 - 29,9',
      bmiTable30More: '30 eller mer',
      
      bmiRememberTitle: 'Kom ihåg!',
      bmiRememberDesc1: 'BMI är ett grovt mått som inte tar hänsyn till kön, muskelmassa, ålder eller kroppsform. Kvinnor har exempelvis naturligt högre andel kroppsfett än män och äldre personer tappar ofta muskelmassa.',
      bmiRememberDesc2: 'BMI visar inte heller hur kroppsfettet är fördelat. Fett runt magen, även kallat bukfett, innebär ofta större hälsorisker än fett som sitter på andra delar av kroppen.',
      
      bmiHowToAffectTitle: 'Så kan du påverka ditt BMI',
      bmiHowToAffectDesc: 'För att hålla ett hälsosamt BMI och en stabil vikt över tid behöver du hitta en balans mellan tre grundpelare: mat, rörelse och återhämtning. Äter du lagom mycket näringsrik mat, rör på dig varje dag och sover gott om nätterna ger du kroppen de bästa förutsättningarna för att må bra.',
      
      bmiPreventObesityTitle: 'För att förebygga övervikt kan du:',
      bmiTips: [
        'Äta näringsrikt och fiberrikt',
        'Röra på dig varje dag, minst 30 minuter',
        'Sova tillräckligt – helst 7–9 timmar per natt',
        'Minska stress och ta hand om dig själv',
        'Dricka alkohol med måtta och undvika rökning'
      ],

      // Testimonials (Trustpilot)
      trustpilotSubtitle: 'Kundomdömen',
      trustpilotTitle: 'Trustpilot – Upplev effekten av kundomdömen',
      trustpilotExcellent: 'Utmärkt',
      trustpilotBasedOn: 'baserat på kundomdömen från riktiga klienter',
      reviews: [
        {
          name: 'Nöjd kund',
          text: 'Jag är väldigt nöjd med min träningsresa hos Muscle&Focus. Träningsschemat har varit tydligt, inspirerande och gett mig en trygg grund. Rekommenderas varmt till alla som vill utvecklas inom träning och hälsa. 💪🏼 Alltid bra bemötande samt förklaringar!! Mycket tydligt träningsprogram och kostprogram.'
        },
        {
          name: 'David K.',
          text: 'Grymt personligt upplägg! Ali är extremt kunnig och hans instruktioner på gymmet har hjälpt mig att lyfta med perfekt teknik. Redan efter 12 veckor märker jag stor skillnad i styrka och rörlighet.'
        },
        {
          name: 'Amir H.',
          text: 'PT-Online-paketet är det bästa jag har testat. Enkelt att följa kostschemat och träningsappen gör det smidigt att logga passen. Alis veckoavstämningar håller motivationen på topp hela vägen!'
        }
      ],
      resultsSubtitle: 'Resultat',
      resultsTitle: 'Före & Efter Resultat',
      resultsIntro: 'Se fantastiska kropps- och hälsotransformationer från riktiga personer som har tränat med Muscle & Focus.',
      resultsMale: 'Viktnedgång & Styrka (6 månader)',
      resultsFemale: 'Hälsosammare livsstil & Fettförbränning (4 månader)',

      // BMI Risks Page Content
      bmiRisksTitle: 'Riskerna med övervikt och obesitas',
      bmiRisksIntro1: 'Övervikt ökar risken för flera olika sjukdomar. Ju högre vikten blir desto större blir riskerna.',
      bmiRisksIntro2: 'När vi har mer kroppsfett än vad kroppen mår bra av kan det påverka hur effektivt den reglerar viktiga funktioner. Det kan störa hormonbalansen och ämnesomsättningen vilket gör det svårare för kroppen att hålla koll på blodtryck, blodsocker och blodfetter.',
      bmiRisksIntro3: 'Fett i kroppen är inte bara något som ”sitter där”. Det beter sig faktiskt som ett aktivt organ. Vid obesitas kan fettet släppa ifrån sig ämnen som skapar en låg och ständig inflammation i kroppen.',
      bmiRisksIntro4: 'Allt detta kan i sin ur öka riskerna för sjukdomar som:',
      bmiRisksList: [
        { title: 'Hjärt-kärlsjukdomar och diabetes', desc: 'Obesitas gör att blodtrycket, blodsocker och blodfetterna påverkas negativt. Det gör att riskerna ökar för bland annat högt blodtryck, höga blodfetter, diabetes typ 2, åderförfettning, hjärtinfarkt och stroke.' },
        { title: 'Gallsten och fettlever', desc: 'Övervikt kan göra att gallsten bildas och att fett lagras i levern. Båda kan i sin tur leda till ytterligare problem om de inte behandlas.' },
        { title: 'Andningsbesvär', desc: 'Personer med obesitas drabbas oftare av astma eller försämrade andningsbesvär. Övervikt leder också ofta till snarkningar och sömnapné vilket kan belasta hjärtat och kroppen i längden.' },
        { title: 'Ledproblem', desc: 'Den höga vikten belastar skelett och leder och kan orsaka ledsmärta och förslitningar. Många med obesitas utvecklar med tiden problem i knän, höfter eller rygg på grund av övervikten.' },
        { title: 'Graviditetsbesvär och infertilitet', desc: 'Fetma vid graviditet ökar risken för komplikationer under graviditeten och förlossningen. Dessutom kan övervikten försämra fertiliteten och göra det svårare att bli gravid.' },
        { title: 'Cancer', desc: 'Överviktiga har högre risk att drabbas av flera cancersjukdomar som exempelvis cancer i livmodern, äggstockarna, brösten och prostatan.' },
        { title: 'Demens', desc: 'Obesitas kan också öka risken för demenssjukdomar senare i livet, till exempel Alzheimers sjukdom.' }
      ],
      bmiFaqBtnShow: 'Visa Frågor & Svar',
      bmiFaqBtnHide: 'Dölj Frågor & Svar',
      bmiFaqTitle: 'Frågor och svar',
      faqList: [
        {
          id: 1,
          q: 'Vad är obesitas?',
          a: 'Obesitas, eller fetma, är en sjukdom som innebär att kroppen har en onormalt hög andel fett vilket ökar risken för flera olika följdsjukdomar.'
        },
        {
          id: 2,
          q: 'Vad är skillnaden mellan övervikt och obesitas?',
          a: 'Övervikt betyder att man har lite mer kroppsfett än vad kroppen vanligtvis mår bra av. Obesitas innebär en högre nivå av fett som påverkar hälsan mer allvarligt.'
        },
        {
          id: 3,
          q: 'Är obesitas alltid farligt?',
          a: 'Obesitas ökar risken för flera sjukdomar, men hur farligt det är beror på andra faktorer som livsstil, kost och aktivitet.'
        },
        {
          id: 4,
          q: 'Hur många kalorier per dag? (Kroppens energibehov)',
          a: 'Så fungerar kroppens energibehov: Varje dag förbrukar kroppen energi för att hålla igång allt från hjärtslag till tankar som snurrar i huvudet. Maten vi äter är bränslet som får oss att orka. Så här fungerar energibehov och kalorier.\n\nHur många kalorier ska man äta per dag?\nAntalet kalorier som behövs varje dag beror på kön, ålder, kroppsstorlek och aktivitetsnivå. Enligt Livsmedelsverket kan du utgå från dessa riktlinjer för ett dagligt energiintag:'
        },
        {
          id: 5,
          q: 'Så mycket innehåller olika näringsämnen',
          a: 'Olika näringsämnen i maten ger olika mycket energi. Kroppen får sina kalorier från protein, kolhydrater, kostfibrer, fett och alkohol. Så här mycket energi får du per gram av varje näringsämne:'
        },
        {
          id: 6,
          q: 'Skillnader i energi och näring för olika livsmedel',
          a: 'Olika livsmedel har olika kalorimängd och det kan vara skillnader mellan hur mycket näring de ger kroppen i förhållande till mängden energi.\n\nEnergi är kalorier som kommer från kolhydrater, fett, protein och alkohol. Näring är vitaminer och mineraler som inte ger energi men däremot behövs i kroppen för att alla funktioner ska fungera och vi ska må bra.\n\nNäringstäta livsmedel: Ger mycket näring per kalori. Det kan exempelvis vara grönsaker, baljväxter, fisk och fullkornsprodukter. Det är mat som mättar bra och ger kroppen näring.\n\nEnergitäta livsmedel: Innehåller många kalorier per gram men kan variera i kvalitet. Godis, läsk och snabbmat är exempel på livsmedel som ger mycket energi men lite näring. Däremot finns det också energitäta och näringsrika livsmedel. Nötter, oljor och feta mejeriprodukter är exempel som ger kroppen både mycket energi och många viktiga näringsämnen.\n\nExempel: Tänk till exempel på skillnaden mellan en tallrik frukt och en bit pizza där båda kan innehålla ungefär 300 kcal. Frukten ger mycket volym, vitaminer och fibrer som mättar. Medan pizzan ger lika många kalorier men betydligt mindre näring och mättnad.\n\nFör att må bra och hålla en stabil vikt är det smart att låta näringstäta livsmedel vara grunden i kosten och äta energität och näringsfattig mat mer sällan. Då får kroppen det den behöver utan att få i sig för mycket energi i onödan. Det är också bra att äta varierat eftersom det ökar chansen att du får i dig viktiga näringsämnen.'
        },
        {
          id: 7,
          q: 'Så kan du mäta ditt energiintag',
          a: 'Du kan mäta ditt energiintag genom att uppskatta hur många kalorier du får i dig. Det finns olika sätt att göra det på där två exempel är att läsa näringsdeklarationen på matförpackningen eller använda appar för att registrera ditt energiintag.\n\nLivsmedelsetiketter och näringsdeklarationer\nPå nästan alla förpackade livsmedel finns en näringsdeklaration som visar hur mycket energi och näring produkten innehåller. Informationen anges oftast i kilokalorier (kcal) per 100 gram och ibland även per portion.\n\nGenom att jämföra mängden du faktiskt äter med den angivna mängden på etiketten kan du räkna ut hur mycket energi du får i dig. Det är också viktigt att titta på fördelningen mellan protein, fett och kolhydrater eftersom dessa påverkar både energimängden och mättnadskänslan.\n\nKaloriräkning i appar\nDet finns även appar som kan hjälpa dig att registrar ditt energiintag. Dessa appar har stora databaser med livsmedel och kan automatiskt beräkna kaloriinnehållet i en måltid. Det kan vara ett bra verktyg i början för att lära sig förstå hur mycket energi maten innehåller. Du kan i många fall skanna streckkoder, söka upp livsmedel eller lägga in egna recept. Apparna ger ofta även översikter om dagens totala energiintag och hur mycket av energin som kommer från kolhydrater, fett och protein.\n\nBra att tänka på vid mätning av energiintag\nTrots att det finns bra hjälpmedel kan det vara svårt att mäta sitt energiintag helt exakt. Ett vanligt misstag är att man underskattar sin portionsstorlek och hur mycket man faktiskt äter. Om du i början mäter din mat med hjälp av mått eller våg lär du dig och kan med tiden göra en bättre uppskattning.\n\nÄven hur maten tillagas spelar roll eftersom kokning, stekning eller ugnsbakning kan ändra både vikten och näringsinnehållet. Dessutom fungerar alla kroppar olika. Hur mycket energi man faktiskt tar upp från maten beror bland annat på ämnesomsättningen och hur aktiv man är i vardagen.'
        },
        {
          id: 8,
          q: 'Då kan kroppen må bra av en förändring',
          a: 'Ibland säger kroppen ifrån och visar att det är dags att göra en förändring. Du kanske märker att orken inte räcker till som tidigare, du sover sämre eller blir andfådd vid lätt ansträngning. Det kan vara tecken på att din kropp belastas för mycket.\n\nOm dina nuvarande vanor påverkar din hälsa negativt kan det vara bra att fundera på att göra vissa förändringar i hur du lever. Ibland kan det innebära att du behöver gå ner i vikt för att må bättre. Om du har ett BMI eller midjemått som innebär en ökad risk för sjukdomar kan en viktnedgång vara ett viktigt steg för att få kroppen att må bra.\n\nÖvervikt och fetma kan påverka kroppen på många sätt, det kan exempelvis öka risken för bland annat hjärt-kärlsjukdom, diabetes typ-2 och högt blodtryck.'
        },
        {
          id: 9,
          q: 'Om du går ner i vikt snabbt',
          a: 'Om du har bestämt dig för att gå ner i vikt är det lätt att vilja se snabba resultat. Samtidigt handlar hälsa om mer än bara siffror på vågen. Det viktigaste är att hitta vanor och en balans som du mår bra av.\n\nOm du går ner i vikt snabbt kan kroppen lätt gå in i ett ”sparläge” där ämnesomsättningen saktar ner. Det gör det svårare att fortsätta gå ner i vikt och lättare att gå upp igen.\n\nEtt bra mål är att gå ner ungefär 0,5–1 kilo i veckan. Det motsvarar vanligtvis ett lagom kaloriunderskott på cirka 500–1000 kalorier per dag. Det kan låta långsamt men det är en takt som kroppen brukar klara av utan stress.'
        }
      ],
      buddyFinderTitle: 'Hitta din träningskompis',
      buddyFinderDesc: 'Här kan du komma i kontakt med andra som också letar efter någon att träna med. Skriv upp dig i listan för att synas, eller sök bland befintliga träningskompisar!',
      buddyFormTitle: 'Skapa din profil',
      buddyFormFullName: 'Fullständigt namn',
      buddyFormAge: 'Ålder (år)',
      buddyFormCity: 'Stad',
      buddyFormGym: 'Vilket gym tränar du på?',
      buddyFormContact: 'Kontaktuppgift (t.ex. E-post, Instagram, Snapchat eller Telefon)',
      buddyFormMessage: 'Meddelande (berätta lite om dig själv och din träning)',
      buddyFormSubmit: 'Hitta träningskompis',
      buddyFormSuccess: 'Din profil har publicerats! Lycka till med att hitta din träningskompis.',
      buddyListTitle: 'Träningskompisar i närheten',
      buddyListEmpty: 'Inga träningskompisar har skrivit upp sig än. Bli den första!',
      buddySearchPlaceholder: 'Sök på stad eller gym...',
      buddyContactBtn: 'Kontakta',
      buddyAgeLabel: 'år',
      buddyGymLabel: 'Klubb/Gym',

      // 404 Not Found
      notFoundTitle: 'Sidan hittades inte',
      notFoundText: 'Sidan du letar efter verkar inte finnas. Den kan ha flyttats eller tagits bort.',
      notFoundBtn: 'Tillbaka till startsidan'
    },
    en: {
      // Navbar
      home: 'Home',
      packages: 'Training Packages',
      hittaKompis: 'Find Buddy',
      apply: 'Become Client',
      admin: 'Admin',
      licenses: 'Licenses & Certificates',
      
      // Home Hero
      heroTagline: 'Book a free consultation today',
      heroTitle: 'Your path to faster results!',
      heroWelcome: 'A warm welcome to Muscle & Focus – ',
      heroText: 'Are you ready to become stronger, healthier, and happier – both mentally and physically? With the Muscle & Focus hybrid personal training program, you not only build your body, but also sharpen your mind and reach your goals. Our tailored training and nutrition program, with continuous coaching both on-site and online, is designed to give you concrete results – whether you want to shape your body, lose weight, or build muscle.',
      btnPackages: 'Explore Packages',
      btnConsultation: 'Book Consultation',
      
      // Home Health Step
      healthTitle: 'Are you ready to take the step towards better health?',
      healthText: 'Let\'s create a stronger, healthier, and more confident version of you! Book a free consultation today, where we discuss your goals and how Muscle & Focus can help you reach them. Whether you prefer to sweat at the gym or train from home, we have the solution for you.',
      healthOnlinePlats: 'Online or on-site: Choose what suits you best – or combine both!',
      healthLanguage: 'Multilingual coaching: We offer training programs and nutritional advice in several languages.',
      healthContact: 'Contact us: Send an email to info.musclefocus@gmail.com or fill out the form.',

      // Home Why Choose Me
      whyTitle: 'Why choose me?',
      whySubtitle: 'Why Muscle & Focus',
      whyCommitment: 'Commitment',
      whyCommitmentText: 'I am genuinely committed to my clients\' success and put all my energy into helping them reach their goals.',
      whyExpertise: 'Expertise',
      whyExpertiseText: 'I have solid knowledge and experience in training, nutrition, and health.',
      whyResults: 'Results',
      whyResultsText: 'My clients achieve fantastic results and feel stronger, healthier, and more confident.',
      whyFlexibility: 'Flexibility',
      whyFlexibilityText: 'I offer flexible training options that fit your lifestyle and needs.',
      whyLanguageText: 'Offers multilingual training programs and nutritional advice.',
      whyTailoredText: 'Individually tailored training, regardless of your level or lifestyle. Train at home, outdoors, or at the gym.',

      // Home About
      aboutSubtitle: 'Meet your coach',
      aboutTitle: 'About Me',
      aboutGreeting: 'My name is Ali Wafa',
      aboutDesc1: 'My passion is to help people create a stronger, healthier, and more balanced lifestyle. For me, training is not just about muscles or endurance – it is also about mental strength, focus, and daily well-being.',
      aboutDesc2: 'With over 8 years of experience in strength training, weight loss, and cardio conditioning, I have developed a training philosophy where health and results go hand in hand. My background in several sports – including taekwondo, boxing, football, and yoga – has given me a broad understanding of movement, explosiveness, flexibility, and body control.',
      
      // Loyalty
      loyaltyBadge: 'Loyalty Program',
      loyaltyTitle: 'Invest in yourself – we reward your commitment!',
      loyaltyText1: 'When you purchase our PT-Online package, we see it as the start of an amazing journey. We want to support you not only now, but also in the future.',
      loyaltyText2: 'Therefore, everyone who completes the program receives an exclusive 25% loyalty discount on their next PT package of choice.',
      loyaltyNote: 'Please note: The loyalty discount applies to regular prices and cannot be combined with other campaigns or special offers.',

      // Home Focus/Support
      supportMotivation: 'Support & Motivation',
      supportMotivationText: 'I am by your side throughout your entire development journey.',
      
      // Home PT vs Self Comparison
      compareSubtitle: 'Comparison',
      compareTitle: 'Train on your own vs. With a PT',
      compareSelfTitle: 'Train on your own',
      comparePtTitle: 'Train with a Personal Trainer',
      comparePtBadge: 'Recommended',
      compareSelfFeatures: [
        'Injury risk: Incorrect form during heavy lifts can damage your body.',
        'Lack of structure: Hard to maintain planning, which slows down your results.',
        'Motivation issues: Easy to skip sessions when it gets tough.',
        'No feedback: No one to correct or develop your technique.'
      ],
      comparePtFeatures: [
        'Expertise: Fully customized nutrition and training programs.',
        'Motivation: Your coach holds you accountable the whole way.',
        'Safety: Real-time form correction to avoid injuries.',
        'Faster results: Structured progression that gives maximum payout.'
      ],

      // Home Benefits
      benefitsSubtitle: 'Why strength train?',
      benefitsTitle: 'Benefits for Body & Mind',
      benefitsFysiskTitle: 'Physical benefits',
            benefitsFysiskFeatures: [
        'Build muscle and increase strength: Strength training makes you stronger, which facilitates daily activities like lifting groceries, carrying children, or climbing stairs. Increased muscle mass improves body shape and posture.',
        'Increase fat burning and metabolism: Muscle burns more calories at rest than fat, raising your resting metabolic rate. Strength training combined with cardio can accelerate weight loss and help maintain a healthy body weight.',
        'Improve bone health: Regular strength training increases bone density and reduces the risk of osteoporosis, particularly important as you age.',
        'Improve cardiovascular health: Strength training can lower blood pressure, improve cholesterol levels, and reduce the risk of cardiovascular diseases, especially when combined with cardio training.'
      ],
      benefitsMentalTitle: 'Mental benefits',
            benefitsMentalFeatures: [
        'Boost self-confidence: Seeing physical progress, like increased strength or a more toned body, boosts self-esteem.',
        "Reduce stress and improve mood: Strength training releases endorphins, the body's \"feel-good hormones\", which can relieve stress, anxiety, and depression. Regular exercise can also improve sleep quality.",
        'Long-term health and independence: Strength training makes you more resistant to age-related problems, like muscle loss (sarcopenia), and helps you maintain independence longer.'
      ],

      // Home Certifications
      certSubtitle: 'Safe training',
      certTitle: 'Licenses & Certificates',
      certList: [
        { title: 'IntensivePT', subtitle: 'Licensed Personal Trainer', desc: 'International license for personal training and nutritional advice.' },
        { title: 'IPT Advanced', subtitle: 'Advanced Training Theory', desc: 'In-depth knowledge of programming, anatomy and periodization.' },
        { title: 'EREPS Level 4', subtitle: 'EQF Level 4 Personal Trainer', desc: 'Registered in the European Register of Exercise Professionals for guaranteed quality.' }
      ],

      // Home CTA
      ctaTitle: 'Are you ready to start your journey?',
      ctaText: 'Book a free consultation today, and we will create a tailored plan based on your unique goals.',
      ctaButton: 'Submit Application',

      // New Sections Translations
      whyStrengthIntro: 'Strength training is one of the best investments you can make for your health and well-being. It is not just about building muscle, but about strengthening your entire body and sharpening your mind to meet daily life with energy.',
      
      idealSubtitle: 'Our Target Audience',
      idealTitle: 'Who is Muscle & Focus for? (Ideal Client)',
      idealIntro: 'To provide the best possible results, we focus on understanding our clients\' daily lives, challenges, and goals. Meet "Sofie" – a description of our typical client, whose needs and lifestyle puzzle we have designed our programs for.',
      idealName: 'Name: Sofie',
      idealAge: 'Age: 20-45 years',
      idealJob: 'Profession: Small Business Owner',
      idealSituation: 'Life Situation: ***',
      idealGoalsTitle: 'Goals',
      idealGoals: [
        'Weight loss, increased energy, reduced stress, improved fitness, achieving a healthier lifestyle.'
      ],
      idealChallengesTitle: 'Challenges',
      idealChallenges: [
        'Lack of time, lack of motivation, uncertainty about exercise and diet, has tried diets and workout programs in the past without long-term results.'
      ],
      idealValuesTitle: 'Values',
      idealValues: [
        'Health, wellness, life balance, personal development.'
      ],
      idealPainTitle: 'Pain Points',
      idealPain: [
        'Feels tired and sluggish.',
        'Dissatisfied with her body.',
        'Difficulty finding time for training.',
        'Overwhelmed by all the information about diet and exercise.',
        'Needs someone to guide and motivate her.'
      ],
      idealSearchTitle: 'What she looks for',
      idealSearch: [
        'A personal trainer who is knowledgeable, committed, and understands her challenges.',
        'A workout program that is effective, fun, and tailored to her needs.',
        'Simple, followable, and sustainable diet advice.',
        'Support and motivation to stay on track.'
      ],
      idealOnlineTitle: 'Where she is online',
      idealOnline: [
        'Social media (Instagram, Facebook)',
        'Health-related blogs and forums',
        'Local events and groups.'
      ],

      termsSubtitle: 'Terms & Conditions',
      termsTitle: 'Terms and Purchase Information for Hybrid PT Training',
      termsIntro: 'Our hybrid program for individual personal training combines physical on-site PT sessions with digital training and continuous coaching via an online platform. The program includes a tailored training and nutrition setup, optimized for your goals – whether you want to shape your body, lose weight, or build muscle. Below are detailed terms and purchase information to ensure a safe and flexible experience.',
      termsSections: [
        {
          title: '1. Right of Withdrawal (14 days)',
          content: 'According to the Distance Contracts Act (2005:59), you have the right to cancel your purchase within 14 days of entering into the contract (e.g., when you receive your first confirmation, training/diet plan, or access to the online platform). This applies to both online and on-site services purchased remotely (e.g., via web, email, or SMS).'
        },
        {
          title: 'Exceptions for started services',
          content: 'If you have started the service within the cancellation period (e.g., completed a physical PT session, received access to a digital training program, or used the diet plan), a proportional cost may be charged for the part of the service utilized. If a physical PT session or a full online course has already been delivered, you lose the right of withdrawal for that specific service.'
        },
        {
          title: 'How to cancel',
          content: 'Notify us in writing via email to info.musclefocus@gmail.com within 14 days of purchase. State your name, order number, and that you wish to exercise your right of withdrawal.'
        },
        {
          title: 'Refund',
          content: 'Upon withdrawal, the amount (minus costs for services already performed) will be refunded within 14 days of receiving your cancellation notice. Refund is made using the same payment method as the purchase (e.g., card, Swish) with no extra fees.'
        },
        {
          title: '2. No recurring costs & commitment periods',
          content: 'One-time payment for packages: Our hybrid packages (e.g., 10, 20, or 30 sessions) are one-time purchases with no automatic renewals or hidden fees. When your package is completed, the service terminates automatically unless you choose to purchase a new package. No commitment periods: Neither physical nor digital services have commitment periods, giving you maximum flexibility.'
        },
        {
          title: '3. Pause the service when needed',
          content: 'Physical sessions: Unused PT sessions are paused and can be used within 12 months from the purchase date, as long as you notify us before the sessions expire. Online services: Access to digital training programs, diet plans, and coaching is paused at no extra cost and can be used within 12 months of purchase date, to be reactivated when you are ready.'
        },
        {
          title: '4. Prices & Payment',
          content: 'Price structure: All prices are stated excluding VAT for transparency. Applicable VAT (e.g., 6% for sports/PT and 25% for certain digital services) is added at purchase and clearly displayed on the receipt or order confirmation. Payment options: Payment can be made via card, Swish, invoice, or installment payments (via third-party provider, e.g., Klarna).'
        },
        {
          title: '5. Support & Response Times',
          content: 'Physical support: Your PT is available during booked sessions and via email/phone for follow-up. Online support: Available via the app, email, or video call, with replies within 24–48 hours on weekdays. On weekends or public holidays, the response time may be up to 72 hours.'
        },
        {
          title: '6. Personal Data and Storage (GDPR)',
          content: 'Collection of personal data: We collect and process personal data (e.g., name, email, phone number, payment details, training goals, health data, and body measurements) to deliver and customize your training and nutrition plan. This is done in accordance with GDPR. We never share any messages, information, or other personal data with unauthorized parties.'
        }
      ],
      
      partnersTitle: 'Our Partners',
      partnersSubtitle: 'Our Network',

      // Packages Page
      packagesSubtitle: 'Our packages',
      packagesTitle: 'Training & Nutrition Packages',
      packagesIntro: 'Choose the package that best fits your lifestyle and goals. All online packages include tailored nutrition and training with personal coaching.',
      packagesBtnBook: 'Apply now',
      packagesCategories: {
        all: 'All packages',
        campaign: 'Campaigns',
        'online-long': 'PT Online (Long)',
        'online-short': 'PT Online (Short)',
        'physical-nutrition': 'Nutrition & Gym Sessions'
      },
      conditionsTitle: 'Purchase Information & Terms',
      conditionsItems: [
        { title: '14-Day Right of Withdrawal', desc: 'You have the right to cancel your purchase within 14 days of ordering. If the service has begun, a proportional fee will apply.' },
        { title: 'No Commitment Periods', desc: 'All prices are one-time payments. No hidden fees or recurring monthly costs will be added after package completion.' },
        { title: 'Pause when needed', desc: 'Both physical PT sessions and online services can be paused at no extra cost and saved for up to 12 months.' }
      ],

      // Packages Data
      packagesData: {
        summer: { 
          title: 'Summer Campaign', 
          duration: '3 Months', 
          price: '1856 SEK', 
          subPrice: 'Half price!', 
          badge: 'Summer Deal', 
          features: ['For all levels', 'Personalized training program', 'Tailored diet plan based on your goals', 'Continuous follow-up and coaching', 'Technique adjustment to avoid injury', 'Valid until 31/8 - Sales start May 1', '14-day cancellation policy'],
          readMoreFeatures: [
            'Personalized training program',
            'A customized nutrition plan based on your goals',
            'Continuous follow-up and coaching',
            'Safe and technique-adapted training to prevent injuries',
            'Flexible training',
            'Recommendations for vitamins/minerals and dietary supplements',
            'Feedback'
          ],
          importantHeader: 'IMPORTANT INFORMATION: SALES START MAY 1!',
          importantText: 'Please note: This summer campaign is exclusive and can only be purchased starting May 1. Set a reminder in your calendar so you don\'t miss the chance to secure your spot!'
        },
        'black-friday': { 
          title: 'Black Friday Transformation', 
          duration: '12 Weeks', 
          price: '1919 SEK', 
          subPrice: 'You save 65%', 
          badge: 'Unbeatable Price', 
          features: ['For all levels', '100% customized training program', 'Customized nutrition plan', 'Continuous follow-up & coaching', 'Instructional exercise videos', 'Sales start November 20', 'Limited availability'],
          modalTitle: 'Everything Included To Build Your Dream Body:',
          readMoreFeatures: [
            'Personalized Training Program: A 100% tailored plan to sculpt your body towards your specific goals, whether it is bodybuilding or your personal ideal shape.',
            'Customized Nutrition Plan: The right fuel for your transformation, adapted to maximize muscle building and/or fat loss.',
            'Continuous Follow-up and Coaching: Your personal guide on the journey who makes sure you stay on track towards your dream physique.',
            'Train Safely with Clear Instruction Videos: Master the technique of each exercise to build safely and effectively.',
            'Expert Advice on Vitamins & Supplements: Optimize your results with professional recommendations.',
            'Ongoing Feedback and Adjustments: We fine-tune the plan to ensure you keep progressing all the time.'
          ],
          importantHeader: 'IMPORTANT: SALES START NOVEMBER 20!',
          importantText: 'Please note: This unique offer is released on Monday, November 20. The number of spots is strictly limited to guarantee the highest quality. Set an alarm and be ready!'
        },
        christmas: { 
          title: 'Christmas Offer', 
          duration: '16 Weeks', 
          price: '1999 SEK', 
          subPrice: 'The best gift to yourself', 
          badge: 'Christmas Deal', 
          features: ['For all levels', 'Tailored training program (gym or home)', 'Tailored and flexible diet plan', 'Regular check-ins with coach', 'Video guide for safe technique', 'Sales start December 1', 'A gift that lasts long after Christmas'],
          modalTitle: 'Everything Included in Your Christmas Package: PT-Online Christmas Offer – The Best Christmas Gift to Yourself (or someone you care about!)',
          readMoreIntro: 'Start the new year stronger than ever! Forget the things under the tree and invest in what really matters – your health. Our exclusive Christmas offer is the perfect start for you who want to reach your goals with a professional and personally customized plan. This is a gift that lasts long after Christmas is over and gives you the tools for a sustainable lifestyle change.',
          readMoreFeatures: [
            'Personalized Training Program: You get a 100% customized workout schedule designed to help you reach your specific goals, whether it is to build muscle, increase strength, or shape your body. Adapted for gym or home training.',
            'Customized and Flexible Diet Plan: We create a sustainable nutrition plan based on food you like. The plan adapts completely to your daily life and goals, making eating healthy simple and enjoyable.',
            'Continuous Follow-up and Coaching: You are never alone! Through regular check-ins and close contact with your coach, we make sure you stay motivated, stay on track, and adjust the plan when needed.',
            'Video Guide for Safe Training: Feel completely secure with your technique. All exercises in your program come with clear instructional videos to maximize your results and minimize the risk of injury.',
            'Expert Advice on Supplements & Vitamins: To optimize your health and results, you receive personal recommendations on which vitamins, minerals, and supplements could be valuable for you.',
            'Ongoing Feedback and Adjustments: Your progress is our focus. You get continuous feedback on your achievements, ensuring the program is always adapted to keep you challenged and developing.'
          ],
          importantHeader: 'IMPORTANT INFORMATION: SALES START DECEMBER 1!',
          importantText: 'This is the perfect Christmas gift that keeps on giving long into the new year. Secure your spot or buy a gift card today!'
        },
        'pt-online-26': { 
          title: 'Complete PT Package', 
          duration: '26 Weeks', 
          price: '4699 SEK', 
          subPrice: 'Student/Youth/Senior: 4250 SEK', 
          badge: 'Best Value', 
          features: ['For all levels', 'Tailored training & diet according to goals', 'Progressive loading adjustment every month', 'Detailed exercises with videos', 'Regular check-ins (weekly/monthly)', 'Holistic view (sleep, recovery, cardio)', 'Support via WhatsApp & email'],
          modalTitle: 'Complete PT Package - PT Online (26 Weeks)',
          readMoreIntro: 'A personalized training and nutrition plan with continuous coaching for 26 weeks is a comprehensive and effective method to achieve specific health goals, whether it is shaping the body, losing weight, or building muscle. To achieve the best possible results, the program is built around tailored plans, continuous follow-up, and adaptation based on the individual\'s progress and life situation.\n\nThe foundations of a 26-week program:\nA successful program spanning six months is built on close cooperation between you and your coach. The process usually begins with a thorough consultation and health declaration to map your goals, conditions, preferences, and any obstacles.',
          readMoreFeatures: [
            'Customized workout plan with focus on strength training: Your workout program is fully adapted to your goals and experience (gym, home, or outdoors). It includes detailed exercises with video clips, progressive loading, and a holistic view of cardio, sleep, and recovery.',
            'Tailored nutrition plan: Personalized diet plan based on your preferences, allergies, or vegan diet. Varied, simple, and sustainable recipes without strict restrictions to guarantee long-term results.',
            'Continuous coaching for optimal results: Close follow-up and personal feedback through regular weekly or monthly check-ins to keep motivation high and adapt the plan based on your progress.'
          ]
        },
        'next-level-26': { 
          title: 'Next Level 26', 
          duration: '26 Weeks', 
          price: '4105 SEK', 
          subPrice: 'Student/Youth/Senior: 3828 SEK', 
          badge: 'Multilingual', 
          features: ['For all levels', 'Tailored training program & diet', 'Multilingual support (coaching in mother tongue)', 'Support for Arabic, Turkish, Persian, German, etc.', 'Unlimited support via WhatsApp/email', 'Regular updates and adjustments', '100% security and clearer communication'],
          modalTitle: 'Next Level 26 - Multilingual Coaching (26 Weeks)',
          readMoreIntro: 'This is a comprehensive 26-week online coaching package that offers personalized training and nutrition with a unique focus on multilingual support. This represents a great opportunity for those who do not feel completely comfortable with Swedish or English. Being able to receive your training program, nutrition advice, and all ongoing coaching in your own mother tongue can make a huge difference in your results. The benefits of coaching in your mother tongue include:',
          readMoreFeatures: [
            'Clearer communication: You can be sure you understand all instructions correctly, which minimizes the risk of misunderstandings and incorrectly performed exercises.',
            'Increased security: It can feel safer and more personal to communicate with a coach in the language you are most comfortable with.',
            'Better results: When language barriers are removed, it becomes easier to ask questions, give feedback, and get the most out of your coaching, leading to more effective and safer training.'
          ],
          importantHeader: 'MULTILINGUAL COACHING / SUPPORTED LANGUAGES',
          importantText: '🇸🇪 Att få coaching på sitt eget modersmål gör stor skillnad för dina resultat.\n\n🇸🇦 إن القدرة على الحصول على برنامجك التدريبي، ونصائحك الغذائية، وجميع التدريبات المستمرة بلغتك الأم يمكن أن تحدث فرقًا هائلاً في نتائجك.\n\n🇹🇷 Antrenman programınızı, beslenme tavsiyelerinizi ve tüm koçluk sürecini kendi ana dilinizde alabilmek, sonuçlarınızda muazzam bir fark yaratabilir.\n\n🇮🇷 اینکه بتوانید برنامه تمرینی، توصیههای غذایی و تمام مربیگریهای مستمر خود را به زبان مادری خود دریافت کنید، میتواند تفاوت بزرگی در نتایج شما ایجاد کند.\n\n🇩🇪 Ihren Trainingsplan, Ihre Ernährungsempfehlungen und das gesamte laufende Coaching in Ihrer eigenen Muttersprache erhalten zu können, kann einen enormen Unterschied für Ihre Ergebnisse machen.\n\n🇪🇸 Poder recibir tu programa de entrenamiento, tus consejos de nutrición y todo el coaching continuo en tu propio idioma puede marcar una diferencia enorme en tus resultados.\n\n🇫🇷 Pouvoir obtenir votre programme d\'entraînement, vos conseils nutritionnels et tout le coaching en continu dans votre propre langue maternelle peut faire une énorme différence pour vos résultats.\n\n🇷🇺 Возможность получать вашу программу тренировок, рекомендации по питанию и все текущее сопровождение на вашем родном языке может иметь огромное значение для ваших результатов.'
        },
        'body-reboot-26': { 
          title: 'Body Reboot 26', 
          duration: '26 Weeks', 
          price: '3850 SEK', 
          subPrice: 'Student/Youth/Senior: 3250 SEK', 
          badge: 'For Experienced', 
          features: ['For intermediate or advanced exercisers', 'Requires good basic technique knowledge', 'Professionally designed progression plan', 'Ongoing expert diet & training support', 'Sustainable habits without strict diets', 'Regular check-ins for optimal results'],
          modalTitle: 'Body Reboot 26 - PT Online (26 Weeks)',
          readMoreIntro: 'This is a 26-week online coaching package designed for a specific target audience. Who is this package for?',
          readMoreFeatures: [
            'Ideal for experienced: This package is ideal for those who already have good basic knowledge in training technique and are experienced ("pros") when it comes to building muscle or reducing fat.',
            'Not for beginners: It is therefore not a package for beginners who need to learn the basics from scratch.',
            'Independent progress: This 26-week package is an affordable option for the independent and experienced trainee who does not need help with basic technique, but wants a professionally designed plan and ongoing expert support to structure their training and diet over a longer period.'
          ]
        },
        'lifestyle-16': { 
          title: 'Lifestyle Start', 
          duration: '16 Weeks', 
          price: '3105 SEK', 
          subPrice: 'Student/Youth/Senior: 2840 SEK', 
          badge: 'Popular', 
          features: ['For all levels', 'Tailored training & nutrition program', 'Optimal nutritional balance (protein, fiber, vitamins)', 'Simple & varied recipes (adapted for vegans/allergies)', 'Video instructions for all strength exercises', 'Ongoing feedback and adjustments', 'Sleep and recovery advice'],
          modalTitle: 'Everything Included in Your 16-Week Package',
          readMoreFeatures: [
            'Detailed exercises: Clear instructions, often with video clips, to ensure you train safely and effectively.',
            'Progressive overload: The plan is adjusted continuously so you keep being challenged and developing. Many programs are updated monthly to adapt to your progress.',
            'Holistic view: In addition to strength training, the program can also include cardio training and advice on recovery and sleep to maximize results.',
            'Customized nutrition plan: Nutrition is a crucial factor to reach your goals. A personalized diet plan is developed based on your lifestyle, preferences, and calorie needs. The goal is to create sustainable habits without strict diets or restrictions. The nutrition plan often includes:',
            'Varied and simple recipes: To make it easier to follow the plan in the long run.',
            'Adapted to preferences, allergies, or vegan diet: The nutrition plan must work for you and your daily life.',
            'Continuous coaching and adjustment for optimal results',
            'Regular follow-up and feedback: You have regular contact with your coach, usually through weekly or monthly check-ins. During these, your progress is analyzed and you receive personalized feedback to help you stay on track.',
            'Optimal Nutritional Balance – Every Day:',
            'Protein: Ensure you get enough protein for muscle building and recovery.',
            'Fiber: Maximize your fiber intake for good satiety, stable blood sugar levels, and healthy digestion.',
            'Vitamins & Minerals: Recipes are designed to naturally provide a wide range of essential vitamins and minerals to support your health and well-being.'
          ]
        },
        'glute-leg-16': { 
          title: 'Glute & Leg Specialist', 
          duration: '16 Weeks', 
          price: '3000 SEK', 
          subPrice: 'Student/Youth/Senior: 2810 SEK', 
          badge: 'For Girls', 
          features: [
            'Only for girls (For All Levels)', 
            'Focus on glutes and legs', 
            'Includes training for the rest of the body', 
            'Complete diet plan with optimal nutrition', 
            'Unlimited support via chat', 
            'Regular program updates'
          ],
          modalTitle: 'Customized Workout Program with Focus on the Lower Body',
          readMoreFeatures: [
            'Customized Workout Program with Focus on the Lower Body: You receive a personally designed training program that is 100% adapted to your goals, your experience, and your daily life. The program is specialized to maximize results for glutes and legs, but also includes training for the rest of the body for a balanced and strong physique.',
            'Optimal Nutritional Balance – Every Day:',
            'Protein: Ensure you get enough protein for muscle building and recovery.',
            'Fiber: Maximize your fiber intake for good satiety, stable blood sugar levels, and healthy digestion.',
            'Vitamins & Minerals: The recipes are designed to naturally provide a wide range of essential vitamins and minerals to support your health and well-being.',
            'Unlimited Support: Access to your coach via chat for quick questions and extra motivation whenever you need it.',
            'Regular Program Updates: The training program is adjusted and developed as you get stronger.'
          ]
        },
        'fokus-12': { 
          title: 'Focus 12', 
          duration: '12 Weeks', 
          price: '2469 SEK', 
          subPrice: 'Student/Youth/Senior: 2215 SEK', 
          badge: 'Standard', 
          features: [
            'For all levels', 
            'Personalized training program', 
            'Sustainable diet plan (no complicated diets)', 
            'Continuous follow-up and coaching', 
            'Instructional videos for all strength exercises', 
            'Expert advice on vitamins & supplements', 
            'Ongoing feedback and schedule adjustments'
          ],
          modalTitle: 'Focus 12 – Everything included in your package:',
          readMoreIntro: 'This package gives you a complete foundation for a successful and sustainable lifestyle change. Invest in yourself and let us help you reach your full potential.',
          readMoreFeatures: [
            '1. Personalized Workout Program: Forget generic programs. You receive a program that is 100% tailored to your goals, your current level, and your capabilities. Whether you train at the gym or at home, we design an effective and sustainable plan just for you.',
            '2. Tailored Nutrition Plan: We create a sustainable and enjoyable nutrition plan based on food you actually like. The plan is fully adapted to your everyday life and your goals, without complicated diets or restrictions. The goal is to give you the tools to eat healthily in a way that works for you.',
            '3. Continuous Follow-up and Coaching: Your coach is with you all the way. Through regular check-ins, we track your progress, adjust the plan if necessary, and make sure you stay motivated. You always have a sounding board and an expert to turn to.',
            '4. Instructional Videos for All Strength Exercises: Feel safe and secure in your training. All exercises in your program come with clear video instructions showing correct technique. This minimizes injury risk and maximizes the effect of each repetition.',
            '5. Expert Advice on Vitamins and Supplements: To optimize your results and your overall well-being, you receive personal recommendations regarding which vitamins, minerals, and supplements could be beneficial for you, based on your diet and goals.',
            '6. Ongoing Feedback and Adjustments: Your development is in focus. You get continuous feedback on your performance and results, and we are ready to adjust the program to ensure you keep making progress throughout your journey.'
          ]
        },
        'health-8': { 
          title: 'Strength & Health', 
          duration: '8 Weeks', 
          price: '1829 SEK', 
          subPrice: 'Student/Youth/Senior: 1499 SEK', 
          badge: 'Intensive', 
          features: [
            'For all levels', 
            'Fast 8-week transformation', 
            'Customized training program (gym or home)', 
            'Tailored diet plan based on food you like', 
            'Weekly check-ins to maintain motivation', 
            'Instructional videos for safe technique', 
            'Complete guide to reach your dream results'
          ],
          modalTitle: 'Everything Included in Your 8-Week Package:',
          readMoreIntro: 'This package is the perfect solution for you if you are ready to invest fully for 8 weeks and want a complete, professional guide to reach your dream results.',
          readMoreFeatures: [
            '1. Personalized Workout Program: We design a training program entirely based on your goals, your experience level, and your daily life. The program focuses on building strength and improving your physique in an effective and safe way, whether you train at home or in the gym.',
            '2. Tailored Diet Plan: Reach your goals faster with a nutrition plan that is customized for you. We take your preferences, lifestyle, and goals into account to create a plan that is tasty, nutritious, and easy to follow.',
            '3. Continuous Follow-up and Coaching: You are never alone on your journey. With regular check-ins, we make sure you are on the right track, keep your motivation high, and adjust the plan as needed. Your coach is available to answer questions and give you the support you need to succeed.',
            '4. Instructional Videos for All Strength Exercises: Train with confidence! Every exercise in your program comes with a clear instructional video showing correct technique. This is crucial for maximizing your results and minimizing the risk of injury.',
            '5. Expert Advice on Vitamins and Supplements: To give your body the best conditions, you receive personal recommendations on which vitamins, minerals, and supplements can complement your diet and help you reach your goals even more effectively.',
            '6. Ongoing Feedback: We follow your development closely and give you continuous feedback. This helps you understand your progress and what is required to take the next step toward your goals.'
          ]
        },
        'kickstart-4': { 
          title: 'Project 4 Weeks', 
          duration: '4 Weeks', 
          price: 'Regular: 1129 SEK', 
          subPrice: 'Youth/student/senior: 856 SEK', 
          badge: 'Kickstart', 
          features: [
            'For all levels', 
            'Powerful kickstart or to break a plateau', 
            'Intense training plan adapted for all levels', 
            'Simple and sustainable diet plan', 
            'Contact with your coach', 
            'Instructional videos for all exercises', 
            'Fast feedback on your progress'
          ],
          modalTitle: 'Included in the package',
          readMoreIntro: '',
          readMoreFeatures: [
            'Personalized training program',
            'Your nutrition plan is tailored to you, your daily life, and your goals.',
            'Continuous follow-up and coaching',
            'Videos of strength exercises to avoid injury',
            'Recommendations for vitamins/minerals and dietary supplements',
            'Feedback'
          ]
        },
        nutrition: { 
          title: 'Advanced Diet Plan', 
          duration: 'One-time purchase', 
          price: '2458 SEK', 
          subPrice: 'Complete meal plan', 
          badge: 'Diet only', 
          features: [
            'For all levels', 
            '20 unique and functional meal recipes', 
            'Distributed over 5 nutrient-rich meals per day', 
            'Adapted to your lifestyle and food preferences', 
            'Optimal nutritional balance (protein, fiber, vitamins)', 
            'Easy-to-cook food providing stable blood sugar', 
            'Guide to eating smarter and feeling better'
          ],
          modalTitle: 'Advanced Diet Plan: Your Key to Optimal Nutrition and Results',
          readMoreIntro: 'With this advanced diet plan, you get not just a plan, but a guide to eating smarter, feeling better, and performing optimally.',
          readMoreFeatures: [
            'Who is this diet plan suitable for?',
            'Those who want to take their nutrition to the next level.',
            'Those who seek inspiration and variation in their cooking.',
            'Those who want to ensure they get all necessary nutrients.',
            'Those who want a clear structure to reach specific health or fitness goals.'
          ]
        },
        'tech-60': { 
          title: 'Technique Training (60) Minutes', 
          duration: '60 Minutes', 
          price: 'Regular: 499 SEK', 
          subPrice: 'Youth/student/senior: 340 SEK', 
          badge: 'Physical pass', 
          features: [
            'For all levels', 
            'Session for correct technique in specific exercises', 
            'Focus on deadlift, squat, and bench press', 
            'Option to select specific exercises yourself', 
            'Session split into warm-up & technique focus', 
            'Clear instructions to avoid injuries', 
            'Cool-down and feedback included'
          ],
          modalTitle: 'Technique Training (60) Minutes',
          readMoreIntro: 'Technique training session focused on improving correct technique in specific exercises. The session is divided into warm-up, technique focus, and cool-down, with clear instructions to ensure correct execution. I assume you want a general session covering some common strength exercises (deadlift, squat, bench press), but if you have specific exercises in mind, let me know!',
          readMoreFeatures: [
            'Improve your technique in specific exercises',
            'Session is divided into warm-up, technique focus, and cool-down',
            'Clear instructions to ensure correct execution',
            'Covers common compound exercises like deadlift, squat, and bench press',
            'Option to customize according to your own chosen exercises'
          ]
        },
        'individual-pt': { 
          title: 'Individual PT Training 60 min', 
          duration: '60 Minutes / session', 
          price: '499 SEK', 
          subPrice: 'Book 20 sessions for 7850 SEK (392 SEK/session)', 
          badge: 'Physical PT', 
          features: [
            'For all levels', 
            'Physical sessions customized to your goals', 
            'Includes personalized training program', 
            'Connected diet plan adapted to your daily life', 
            'Continuous follow-up and coaching included', 
            'Technique adjustment at the gym', 
            'Flexible training times'
          ],
          modalTitle: 'What is included in the program?',
          readMoreIntro: 'With our 60-minute personal training program, you get a comprehensive solution that combines tailored strength training, nutrition planning, and continuous coaching. Whether your goal is to shape your body, lose weight, build muscle, or improve your overall health, this program is designed to maximize your results and keep you motivated.',
          readMoreFeatures: [
            'Tailored workout program (20 sessions or more)',
            'Personal analysis: We start with an in-depth consultation where we map your current level, goals, lifestyle, and any limitations (e.g. injuries or lack of time).',
            'Focus on strength training: The workout program is designed with a mix of strength training to optimize muscle building, fat loss, or functional fitness, depending on your goals. We include variations such as free weights, machines, bodyweight, and functional exercises.',
            'Progression and variation: The program is updated every 4–6 weeks to ensure continuous development and avoid plateaus.',
            'Availability: The training sessions can be performed in the gym, at home, or outdoors, depending on your preferences and resources.',
            'Tailored nutrition plan',
            'Individual diet plan: Based on your goals (weight loss, muscle building, or performance), we create a realistic and sustainable diet plan, taking into account food preferences, allergies, and lifestyle (e.g. vegetarian, vegan, or flexitarian).',
            'Macronutrient balance: We optimize the distribution of protein, carbohydrates, and fat to support your training goals.',
            'Meal suggestions and recipes: Get concrete suggestions for meals, snacks, and any supplements to simplify your everyday life.',
            'Flexibility: The nutrition plan is adjusted continuously based on your progress, energy level, and feedback.',
            'Ongoing coaching and follow-up',
            'Weekly follow-up: Regular check-ins (via digital meetings, app, or email) to evaluate progress, give feedback, and adjust layouts.',
            'Motivation and accountability: Your PT acts as your personal coach and keeps you accountable with encouragement and strategies to overcome obstacles.',
            'Unlimited support: Access to your coach via WhatsApp or email for quick questions and extra pep.',
            'Real-time adjustment: If lifestyle changes, injuries, or other factors affect your training, we adapt the program immediately to keep you on track.'
          ]
        }
      },

      // Apply Page
      applySubtitle: 'Take the first step',
      applyTitle: 'Submit your application',
      applyIntro: 'Fill in the form as carefully as you can. It helps us prepare and customize your program. This is a completely free and non-binding application.',
      applyContactEmailTitle: 'Email for questions',
      applyContactPhoneTitle: 'Phone / WhatsApp',
      applyContactLocationTitle: 'Location',
      applyContactLocationText: 'Train online or on-site in a gym environment',
      applyDisclaimer: '14-day right of withdrawal applies by law to all distance purchases.',
      applyLabelFullName: 'Full Name *',
      applyPlaceholderFullName: 'First and last name',
      applyLabelGender: 'Gender *',
      applyOptionFemale: 'Female',
      applyOptionMale: 'Male',
      applyOptionOther: 'Other / Prefer not to say',
      applyLabelAge: 'Age *',
      applyPlaceholderAge: 'Years',
      applyLabelCity: 'City *',
      applyPlaceholderCity: 'e.g. London',
      applyLabelEmail: 'Email Address *',
      applyPlaceholderEmail: 'name@email.com',
      applyLabelPhone: 'Phone Number *',
      applyPlaceholderPhone: 'e.g. +46 70-000 00 00',
      applyLabelWish: 'Preferred Training (Package) *',
      applyPlaceholderWish: '-- Choose a training package --',
      applyLabelMessage: 'Message / Previous Experience (Optional)',
      applyPlaceholderMessage: 'Briefly describe your current fitness level, goals, or any injuries...',
      applyBtnSubmit: 'Submit Application (Free Consultation)',
      applyBtnPayWithStripe: 'Pay securely with Stripe (Buy Now) 💳',
      applyLabelStudentDiscount: 'I am a student, youth or senior (Get discounted price)',
      paymentSuccessTitle: 'Payment Received! 🎉',
      paymentSuccessText: 'Thank you {name}! Your payment for {wish} has been processed successfully.',
      paymentSuccessSubtext: 'A confirmation has been sent to {email} and Ali will contact you at {phone} shortly to kickstart your journey.',
      paymentSuccessBack: 'Back to Home',
      paymentCancelTitle: 'Payment Cancelled ❌',
      paymentCancelText: 'The payment was not completed. If you encountered any issues or want to select a different package, you can go back to packages.',
      paymentCancelBack: 'Back to Packages',
      applyBtnSending: 'Sending...',
      applyErrorFields: 'Please fill in all required fields.',
      applySuccessTitle: 'Thank you for your application!',
      applySuccessText: 'Hi {name}. We have received your application for package {wish}.',
      applySuccessSubtext: 'Lic. PT Ali Wafa will contact you via email ({email}) or phone ({phone}) within 24 hours to discuss your plan.',
      applySuccessBack: 'Back to home page',
      
      // Footer & Partners Extra Links
      idealLink: 'Ideal Client',
      termsLink: 'Terms & Info',
      whyStrengthLink: 'Why Strength Train?',
      visitPartner: 'Visit website',
      partnerWeightworldDesc: 'Premium food supplements and health products for weight loss and energy.',
      partnerStaybeautifulDesc: 'Beauty and skincare products for a healthier and fresher life.',
      partnerApulsDesc: 'Exercise equipment and professional gym equipment for home training.',
      partnerMindlyDesc: 'Tools for mental training, self-help, and personal development.',
      partnerMusclepainDesc: 'Massage guns and recovery products for sore muscles.',
      partnerSskbutikenDesc: 'Health products, comfortable shoes, and supports for health staff and exercisers.',
      
      // Footer specific translations
      footerTagline: 'We do not just build a stronger exterior – we also develop the strength and focus within you.',
      footerNavTitle: 'Navigation',
      footerInfoTitle: 'Information',
      footerContactTitle: 'Contact & Support',
      footerSupportHours: 'Response time: 24–48 hours on weekdays. Weekends up to 72 hours.',

      // BMI Calculator Page
      bmiCalculator: 'BMI Calculator',
      bmiTagline: 'BMI Calculator – calculate and interpret your BMI',
      bmiWeightLabel: 'Weight (kg)',
      bmiHeightLabel: 'Height (cm)',
      bmiDecimalTip: 'Tip! For a more precise result, you can specify decimals.',
      bmiBtnCalculate: 'Calculate BMI',
      bmiBtnClear: 'Clear information',
      bmiBtnCalculating: 'Calculating...',
      bmiResultTitle: 'Your BMI is',
      bmiClassTitle: 'Your weight category',
      bmiUnderweight: 'Underweight',
      bmiNormalweight: 'Normal weight',
      bmiOverweight: 'Overweight',
      bmiObesity: 'Obesity',
      
      bmiWhatIsTitle: 'What is BMI?',
      bmiWhatIsDesc: 'BMI stands for Body Mass Index. It is a measurement that compares your weight with your height, resulting in a BMI value. Healthcare providers often use BMI as one of the tools to determine if your weight is considered healthy.',
      bmiGroupsIntro: 'BMI is divided into different groups:',
      
      bmiHowToInterpretTitle: 'How to interpret your BMI',
      bmiHowToInterpretDesc1: 'There are international guidelines for BMI that can give an initial indication of whether your weight is at a healthy level. To get a more complete picture of your health, waist circumference is also typically measured, and blood pressure and blood tests may be taken.',
      bmiHowToInterpretDesc2: 'In other words, you should not let your BMI value be the only indicator you rely on, but you can use it as part of the overall picture of how your body is doing.',
      
      bmiGuidelinesTitle: 'Guidelines for BMI and weight category',
      bmiTableBmi: 'BMI',
      bmiTableClass: 'Weight Category',
      bmiTableUnder185: 'Under 18.5',
      bmiTable185_249: '18.5 - 24.9',
      bmiTable25_299: '25 - 29.9',
      bmiTable30More: '30 or more',
      
      bmiRememberTitle: 'Remember!',
      bmiRememberDesc1: 'BMI is a rough measurement that does not take into account gender, muscle mass, age, or body shape. For example, women naturally have a higher percentage of body fat than men, and older people often lose muscle mass.',
      bmiRememberDesc2: 'BMI also does not show how body fat is distributed. Fat around the stomach, also known as visceral fat, often carries greater health risks than fat located on other parts of the body.',
      
      bmiHowToAffectTitle: 'How you can influence your BMI',
      bmiHowToAffectDesc: 'To maintain a healthy BMI and a stable weight over time, you need to find a balance between three core pillars: nutrition, movement, and recovery. Eating a balanced diet of nutrient-rich food, moving every day, and sleeping well at night gives your body the best conditions to thrive.',
      
      bmiPreventObesityTitle: 'To prevent overweight, you can:',
      bmiTips: [
        'Eat nutrient-dense and fiber-rich foods',
        'Move every day, at least 30 minutes',
        'Sleep sufficiently – preferably 7–9 hours per night',
        'Reduce stress and take care of yourself',
        'Drink alcohol in moderation and avoid smoking'
      ],

      // Testimonials (Trustpilot)
      trustpilotSubtitle: 'Customer Reviews',
      trustpilotTitle: 'Trustpilot – Experience the impact of customer reviews',
      trustpilotExcellent: 'Excellent',
      trustpilotBasedOn: 'based on customer reviews from real clients',
      reviews: [
        {
          name: 'Satisfied Customer',
          text: 'I am very happy with my training journey at Muscle&Focus. The training schedule has been clear, inspiring, and given me a secure foundation. Warmly recommended to anyone who wants to develop in fitness and health. 💪🏼 Always great support and explanations!! Very clear training program and nutrition program.'
        },
        {
          name: 'David K.',
          text: 'Awesome personal program! Ali is extremely knowledgeable and his guidance in the gym has helped me lift with perfect form. Already after 12 weeks I notice a huge difference in strength and mobility.'
        },
        {
          name: 'Amir H.',
          text: 'The PT Online package is the best I have tried. Easy to follow the diet plan and the training app makes it convenient to log workouts. Ali\'s weekly check-ins keep motivation at its peak!'
        }
      ],
      resultsSubtitle: 'Results',
      resultsTitle: 'Before & After Results',
      resultsIntro: 'See amazing body and health transformations from real people who have trained with Muscle & Focus.',
      resultsMale: 'Weight Loss & Strength (6 months)',
      resultsFemale: 'Healthier Lifestyle & Fat Loss (4 months)',

      // BMI Risks Page Content
      bmiRisksTitle: 'The Risks of Overweight and Obesity',
      bmiRisksIntro1: 'Being overweight increases the risk of several different diseases. The higher the weight, the greater the risks.',
      bmiRisksIntro2: 'When we have more body fat than is healthy for the body, it can affect how efficiently it regulates vital functions. It can disrupt the hormonal balance and metabolism, making it harder for the body to keep track of blood pressure, blood sugar, and blood lipids.',
      bmiRisksIntro3: 'Fat in the body is not just something that ”not just sits there”. It actually behaves like an active organ. In obesity, fat cells can release substances that create a low-grade, chronic inflammation in the body.',
      bmiRisksIntro4: 'All of this, in turn, can increase the risk of diseases such as:',
      bmiRisksList: [
        { title: 'Cardiovascular Diseases and Diabetes', desc: 'Obesity negatively affects blood pressure, blood sugar, and blood lipids. This increases the risks of high blood pressure, high blood lipids, type 2 diabetes, atherosclerosis, heart attack, and stroke.' },
        { title: 'Gallstones and Fatty Liver', desc: 'Being overweight can cause gallstones to form and fat to accumulate in the liver. Both can lead to further complications if left untreated.' },
        { title: 'Breathing Difficulties', desc: 'People with obesity suffer more frequently from asthma or worsened respiratory issues. Overweight also often leads to snoring and sleep apnea, which can strain the heart and body in the long run.' },
        { title: 'Joint Problems', desc: 'Heavy weight strains the skeleton and joints, causing joint pain and wear. Many with obesity eventually develop issues in the knees, hips, or back due to the excess weight.' },
        { title: 'Pregnancy Complications and Infertility', desc: 'Obesity during pregnancy increases the risk of complications during pregnancy and childbirth. Additionally, being overweight can impair fertility and make it harder to get pregnant.' },
        { title: 'Cancer', desc: 'Overweight individuals have a higher risk of developing several cancers, such as cancer of the uterus, ovaries, breasts, and prostate.' },
        { title: 'Dementia', desc: 'Obesity can also increase the risk of dementia later in life, such as Alzheimer\'s disease.' }
      ],
      bmiFaqBtnShow: 'Show Q&A',
      bmiFaqBtnHide: 'Hide Q&A',
      bmiFaqTitle: 'Questions & Answers',
      faqList: [
        {
          id: 1,
          q: 'What is obesity?',
          a: 'Obesity is a disease characterized by an abnormally high proportion of body fat, which increases the risk of several secondary diseases.'
        },
        {
          id: 2,
          q: 'What is the difference between overweight and obesity?',
          a: 'Overweight means having slightly more body fat than what is healthy for the body. Obesity involves a higher level of fat that affects health more severely.'
        },
        {
          id: 3,
          q: 'Is obesity always dangerous?',
          a: 'Obesity increases the risk of several diseases, but how dangerous it is depends on other factors such as lifestyle, diet, and physical activity.'
        },
        {
          id: 4,
          q: 'How many calories per day? (The body\'s energy needs)',
          a: 'How the body\'s energy needs work: Every day, the body consumes energy to sustain everything from heartbeats to thoughts spinning in the mind. The food we eat is the fuel that keeps us going. Here is how energy needs and calories work.\n\nHow many calories should you eat per day?\nThe number of calories needed daily depends on gender, age, body size, and activity level. According to health guidelines, you can use these guidelines for daily energy intake:'
        },
        {
          id: 5,
          q: 'This is how much energy nutrients contain per gram',
          a: 'Different nutrients in food provide different amounts of energy. The body gets its calories from protein, carbohydrates, dietary fiber, fat, and alcohol. Here is how much energy you get per gram of each nutrient:'
        },
        {
          id: 6,
          q: 'Differences in energy and nutrition for different foods',
          a: 'Different foods have different calorie content, and there can be differences between how much nutrition they give the body in relation to the amount of energy.\n\nEnergy is calories coming from carbohydrates, fat, protein, and alcohol. Nutrition refers to vitamins and minerals that do not provide energy but are needed for the body\'s functions to work and for us to feel well.\n\nNutrient-dense foods: Provide high amounts of nutrients per calorie. Examples include vegetables, legumes, fish, and whole grain products. This is food that fills you up well and nourishes the body.\n\nEnergy-dense foods: Contain many calories per gram but vary in quality. Sweets, sodas, and fast food are examples of foods that provide plenty of energy but little nutrition. However, there are also energy-dense and nutrient-dense options. Nuts, oils, and full-fat dairy products are examples that provide both high energy and many vital nutrients.\n\nExample: Think about the difference between a plate of fruit and a slice of pizza where both may contain about 300 kcal. The fruit provides volume, vitamins, and fiber that keep you full, while the pizza provides the same calories but significantly less nutrition and satiety.\n\nTo feel good and maintain a stable weight, it is smart to base your diet on nutrient-dense foods and eat energy-dense and nutrient-poor foods less often. This way, the body gets what it needs without taking in unnecessary energy. It is also good to eat a variety of foods to increase your chance of getting all vital nutrients.'
        },
        {
          id: 7,
          q: 'How to measure your energy intake',
          a: 'You can measure your energy intake by estimating the calories you consume. Two examples of how to do this are reading the nutrition labels on food packaging or using apps to log your intake.\n\nFood labels and nutrition facts\nAlmost all packaged foods have a nutrition declaration showing the energy and nutrients the product contains. The information is typically stated in kilocalories (kcal) per 100 grams, and sometimes per serving.\n\nBy comparing the amount you actually eat with the stated amount on the label, you can calculate your energy intake. It is also important to look at the distribution of protein, fat, and carbohydrates, as these affect both energy content and satiety.\n\nCalorie counting in apps\nThere are apps available to help you track your energy intake. These apps have large food databases and automatically calculate the calorie content of a meal. This can be a great tool in the beginning to learn about food energy. In many cases, you can scan barcodes, search for foods, or enter your own recipes. The apps often also provide daily summaries of total energy intake and macronutrient distribution.\n\nGood things to keep in mind when tracking energy intake\nDespite helpful tools, it can be hard to measure energy intake completely accurately. A common mistake is underestimating portion size. If you weigh or measure your food in the beginning, you will learn to estimate better over time.\n\nHow food is prepared also plays a role, as boiling, frying, or baking can change both weight and nutrient content. Furthermore, all bodies function differently. How much energy you actually absorb depends on metabolism and daily activity levels.'
        },
        {
          id: 8,
          q: 'When the body can benefit from a change',
          a: 'Sometimes the body speaks up, showing it is time to make a change. You might notice that your energy levels are not what they used to be, you sleep poorly, or get winded by light exertion. These can be signs of physical strain.\n\nIf your current habits affect your health negatively, it may be time to consider changes. Sometimes this means losing weight. If your BMI or waist circumference carries an increased risk of disease, weight loss can be an important step for body wellness.\n\nOverweight and obesity can affect the body in many ways, increasing risks for cardiovascular disease, type 2 diabetes, and high blood pressure.'
        },
        {
          id: 9,
          q: 'If you lose weight quickly',
          a: 'If you have decided to lose weight, it is natural to want fast results. However, health is about more than just scale numbers. The most important thing is finding sustainable habits and balance.\n\nIf you lose weight too quickly, the body can enter a "starvation mode" where metabolism slows down. This makes it harder to continue losing weight and easier to regain it.\n\nA good target is to lose about 0.5–1 kg per week. This usually corresponds to a moderate calorie deficit of about 500–1000 calories per day. It might seem slow, but it is a pace the body can handle without stress.'
        }
      ],
      buddyFinderTitle: 'Find Your Training Buddy',
      buddyFinderDesc: 'Here you can get in touch with others who are also looking for someone to train with. Write your name in the list to be visible, or search among existing training buddies!',
      buddyFormTitle: 'Create Your Profile',
      buddyFormFullName: 'Full Name',
      buddyFormAge: 'Age (years)',
      buddyFormCity: 'City',
      buddyFormGym: 'Which gym do you train at?',
      buddyFormContact: 'Contact Info (e.g., Email, Instagram, Snapchat, or Phone)',
      buddyFormMessage: 'Message (tell us a bit about yourself and your training)',
      buddyFormSubmit: 'Find Training Buddy',
      buddyFormSuccess: 'Your profile has been published! Good luck finding your training buddy.',
      buddyListTitle: 'Training Buddies Nearby',
      buddyListEmpty: 'No training buddies have signed up yet. Be the first!',
      buddySearchPlaceholder: 'Search by city or gym...',
      buddyContactBtn: 'Contact',
      buddyAgeLabel: 'years old',
      buddyGymLabel: 'Gym/Club',

      // 404 Not Found
      notFoundTitle: 'Page Not Found',
      notFoundText: 'The page you are looking for does not seem to exist. It may have been moved or removed.',
      notFoundBtn: 'Back to Home'
    },
    fa: {
      // Navbar
      home: 'خانه',
      packages: 'پکیج‌های تمرینی',
      hittaKompis: 'یافتن هم‌تمرینی',
      apply: 'ثبت نام',
      admin: 'مدیر',
      licenses: 'مجوزها و مدرک‌ها',
      
      // Home Hero
      heroTagline: 'امروز یک مشاوره رایگان رزرو کنید',
      heroTitle: 'راه شما برای نتایج سریع‌تر!',
      heroWelcome: 'به Muscle & Focus خوش آمدید – ',
      heroText: 'آیا آماده‌اید که از نظر روحی و جسمی قوی‌تر، سالم‌تر و شادتر شوید؟ با برنامه تمرینی هیبریدی Muscle & Focus، شما نه تنها بدن خود را می‌سازید، بلکه ذهن خود را نیز تقویت کرده و به اهداف خود می‌رسید. پکیج‌های تمرینی و برنامه‌های غذایی اختصاصی ما، به همراه کوچینگ آنلاین و حضوری، برای ارائه نتایج واقعی طراحی شده‌اند – چه بخواهید به بدن خود شکل دهید، وزن کم کنید یا عضله‌سازی کنید.',
      btnPackages: 'مشاهده پکیج‌ها',
      btnConsultation: 'رزرو مشاوره',
      
      // Home Health Step
      healthTitle: 'آیا آماده‌اید قدمی به سوی سلامتی بهتر بردارید؟',
      healthText: 'بیایید نسخه‌ای قوی‌تر، سالم‌تر و با اعتماد به نفس‌تر از شما بسازیم! امروز یک مشاوره رایگان رزرو کنید، جایی که در مورد اهداف شما و نحوه کمک Muscle & Focus برای رسیدن به آن‌ها صحبت می‌کنیم. چه ترجیح می‌دهید در باشگاه تمرین کنید یا در خانه، ما راه حلی برای شما داریم.',
      healthOnlinePlats: 'آنلاین یا حضوری: آنچه برای شما مناسب‌تر است را انتخاب کنید – یا هر دو را ترکیب کنید!',
      healthLanguage: 'کوچینگ چندزبانه: ارائه برنامه‌های تمرینی و مشاوره‌های غذایی به چندین زبان مختلف.',
      healthContact: 'تماس با ما: یک ایمیل به info.musclefocus@gmail.com ارسال کنید یا فرم را پر کنید.',

      // Home Why Choose Me
      whyTitle: 'چرا من را انتخاب کنید؟',
      whySubtitle: 'چرا Muscle & Focus',
      whyCommitment: 'تعهد و دلسوزی',
      whyCommitmentText: 'من صمیمانه به موفقیت مشتریانم متعهد هستم و تمام انرژی خود را برای کمک به آنها جهت رسیدن به اهدافشان می‌گذارم.',
      whyExpertise: 'تخصص و تجربه',
      whyExpertiseText: 'من دانش و تجربه بسیار بالایی در زمینه تمرین، تغذیه و سلامت دارم.',
      whyResults: 'نتایج درخشان',
      whyResultsText: 'مشتریان من به نتایج فوق‌العاده‌ای دست می‌یابند و احساس قدرت، سلامت و اعتماد به نفس بیشتری می‌کنند.',
      whyFlexibility: 'انعطاف‌پذیری',
      whyFlexibilityText: 'من گزینه‌های تمرینی انعطاف‌پذیری را ارائه می‌دهم که با سبک زندگی و نیازهای شما سازگار است.',
      whyLanguageText: 'ارائه برنامه‌های تمرینی و مشاوره‌های غذایی به زبان‌های مختلف.',
      whyTailoredText: 'تمرینات کاملاً اختصاصی، بدون توجه به سطح یا سبک زندگی شما. تمرین در خانه، فضای باز یا باشگاه.',

      // Home About
      aboutSubtitle: 'ملاقات با مربی',
      aboutTitle: 'درباره من',
      aboutGreeting: 'نام من علی وفا است',
      aboutDesc1: 'اشتیاق من کمک به مردم برای ایجاد یک سبک زندگی قوی‌تر، سالم‌تر و متعادل‌تر است. برای من، تمرین فقط مربوط به عضلات یا استقامت نیست – بلکه به قدرت ذهنی، تمرکز و رفاه روزانه نیز مربوط می‌شود.',
      aboutDesc2: 'با بیش از ۸ سال تجربه در تمرینات قدرتی، کاهش وزن و آمادگی قلبی عروقی، من یک فلسفه تمرینی ایجاد کرده‌ام که در آن سلامت و نتایج دست به دست هم می‌دهند. سوابق ورزشی من در چندین رشته – از جمله تکواندو، بوکس، فوتبال و یوگا – درک وسیعی از حرکت، چابکی، انعطاف‌پذیری و کنترل بدن به من داده است.',
      
      // Loyalty
      loyaltyBadge: 'برنامه وفاداری',
      loyaltyTitle: 'روی خودتان سرمایه‌گذاری کنید – ما به تعهد شما پاداش می‌دهیم!',
      loyaltyText1: 'وقتی پکیج PT-Online ما را خریداری می‌کنید، ما آن را به عنوان شروع یک سفر شگفت‌انگیز می‌بینیم. ما می‌خواهیم نه تنها اکنون، بلکه در آینده نیز از شما حمایت کنیم.',
      loyaltyText2: 'بنابراین، هرکسی که برنامه را با موفقیت به پایان برساند، ۲۵٪ تخفیف وفاداری انحصاری برای پکیج بعدی خود دریافت می‌کند.',
      loyaltyNote: 'لطفاً توجه داشته باشید: تخفیف وفاداری برای قیمت‌های معمولی اعمال می‌شود و با سایر جشنواره‌ها یا پیشنهادهای ویژه قابل ترکیب نیست.',

      // Home Focus/Support
      supportMotivation: 'پشتیبانی و انگیزه',
      supportMotivationText: 'من در طول تمام مسیر پیشرفت و توسعه‌ات در کنار تو خواهم بود.',
      
      // Home PT vs Self Comparison
      compareSubtitle: 'مقایسه',
      compareTitle: 'تمرین تنهایی در مقابل تمرین با مربی شخصی',
      compareSelfTitle: 'تمرین به تنهایی',
      comparePtTitle: 'تمرین با مربی شخصی (PT)',
      comparePtBadge: 'پیشنهاد مربی',
      compareSelfFeatures: [
        'خطر آسیب‌دیدگی: فرم ناصحیح در وزنه‌های سنگین می‌تواند به بدن شما آسیب جدی بزند.',
        'کمبود ساختار و برنامه: دشواری در حفظ و اجرای مداوم برنامه، که نتایج شما را بسیار کند می‌کند.',
        'مشکل انگیزه: بسیار ساده است که وقتی تمرینات سخت می‌شود، آنها را نیمه‌کاره رها کنید.',
        'بدون بازخورد فنی: کسی نیست که تکنیک شما را اصلاح کند یا بهبود بخشد.'
      ],
      comparePtFeatures: [
        'تخصص: برنامه‌های کاملاً اختصاصی تمرین و تغذیه متناسب با ژنتیک و اهداف شما.',
        'انگیزه بالا: مربی شما را در کل مسیر متعهد و باانگیزه نگه می‌دارد.',
        'امنیت و سلامت: اصلاح فرم حرکت در لحظه برای جلوگیری از مصدومیت.',
        'نتایج سریع‌تر: پیشرفت سازمان‌یافته که بیشترین بازدهی را به همراه دارد.'
      ],

      // Home Benefits
      benefitsSubtitle: 'چرا بدنسازی و تمرینات قدرتی؟',
      benefitsTitle: 'فواید تمرین برای جسم و ذهن',
      benefitsFysiskTitle: 'فواید جسمانی',
            benefitsFysiskFeatures: [
        'ساخت عضلات و افزایش قدرت: تمرینات قدرتی شما را قوی‌تر می‌کند و کارهای روزانه مانند حمل خریدهای خانه، بغل کردن کودکان یا بالا رفتن از پله‌ها را تسهیل می‌کند. افزایش حجم عضلانی فرم و ایستادگی بدن را بهبود می‌بخشد.',
        'افزایش چربی‌سوزی و متابولیسم: عضلات در زمان استراحت کالری بیشتری نسبت به چربی می‌سوزانند که باعث افزایش متابولیسم پایه شما می‌شود. تمرینات قدرتی همراه با هوازی می‌تواند کاهش وزن را سرعت بخشیده و به حفظ وزن سالم کمک کند.',
        'بهبود سلامت استخوان‌ها: افزایش تراکم استخوانی و پیشگیری از پوکی استخوان، به ویژه با افزایش سن.',
        'بهبود سلامت قلب و عروق: کاهش فشار خون، بهبود سطح کلسترول خون و کاهش خطر بیماری‌های قلبی، به ویژه در ترکیب با تمرینات هوازی.'
      ],
      benefitsMentalTitle: 'فواید ذهنی و روانی',
            benefitsMentalFeatures: [
        'افزایش اعتماد به نفس: دیدن پیشرفت‌های فیزیکی، مانند افزایش قدرت یا بدنی ورزیده‌تر، عزت نفس را بالا می‌برد.',
        'کاهش استرس و بهبود خلق و خو: تمرینات قدرتی اندورفین (هورمون‌های حال خوب بدن) ترشح می‌کند که می‌تواند استرس، اضطراب و افسردگی را کاهش دهد. تمرین منظم همچنین کیفیت خواب را بهبود می‌بخشد.',
        'سلامت طولانی‌مدت و استقلال فردی: تمرینات قدرتی شما را در برابر مشکلات ناشی از افزایش سن مانند تحلیل رفتن عضلات (سارکوپنی) مقاوم‌تر می‌کند و به حفظ استقلال فردی در طولانی‌مدت کمک می‌کند.'
      ],

      // Home Certifications
      certSubtitle: 'آموزش ایمن',
      certTitle: 'مجوزها و مدرک‌های معتبر',
      certList: [
        { title: 'IntensivePT', subtitle: 'Licensed Personal Trainer', desc: 'مدرک معتبر بین‌المللی برای مربیگری شخصی و مشاوره تخصصی تغذیه.' },
        { title: 'IPT Advanced', subtitle: 'Advanced Training Theory', desc: 'دانش پیشرفته در برنامه‌نویسی تمرینی، آناتومی و دوره‌بندی تمرینات.' },
        { title: 'EREPS Level 4', subtitle: 'EQF Level 4 Personal Trainer', desc: 'ثبت شده در انجمن حرفه‌ای مربیان ورزشی اروپا جهت تضمین بالاترین کیفیت آموزش.' }
      ],

      // Home CTA
      ctaTitle: 'آیا برای شروع سفر خود آماده‌اید؟',
      ctaText: 'همین امروز یک مشاوره رایگان رزرو کنید تا بر اساس اهداف منحصر به فرد شما برنامه‌ای اختصاصی طراحی کنیم.',
      ctaButton: 'ارسال درخواست مشاوره',

      // New Sections Translations
      whyStrengthIntro: 'تمرینات قدرتی یکی از بهترین سرمایه‌گذاری‌هایی است که می‌توانید برای سلامت و تندرستی خود انجام دهید. این تمرینات نه تنها برای عضله‌سازی، بلکه برای تقویت کل بدن و افزایش تمرکز ذهنی جهت مواجهه با زندگی روزمره با انرژی مضاعف طراحی شده‌اند.',
      
      idealSubtitle: 'مخاطبان هدف ما',
      idealTitle: 'Muscle & Focus برای چه کسانی است؟ (مشتری ایده‌آل)',
      idealIntro: 'برای ارائه بهترین نتایج ممکن، ما بر درک زندگی روزمره، چالش‌ها و اهداف مشتریان خود تمرکز می‌کنیم. با "سوفی" آشنا شوید – توصیفی از مشتری نمونه ما، که برنامه‌های خود را با توجه به نیازها و پازل زندگی او طراحی کرده‌ایم.',
      idealName: 'نام: سوفی',
      idealAge: 'سن: ۲۰ تا ۴۵ سال',
      idealJob: 'شغل: صاحب کسب‌وکار کوچک',
      idealSituation: 'وضعیت زندگی: ***',
      idealGoalsTitle: 'اهداف',
      idealGoals: [
        'کاهش وزن، افزایش انرژی، کاهش استرس، بهبود آمادگی بدنی، دستیابی به سبک زندگی سالم‌تر.'
      ],
      idealChallengesTitle: 'چالش‌ها',
      idealChallenges: [
        'کمبود زمان، کمبود انگیزه، سردرگمی درباره تمرین و تغذیه، سابقه امتحان رژیم‌ها و برنامه‌های مختلف بدون نتایج طولانی‌مدت.'
      ],
      idealValuesTitle: 'ارزش‌ها',
      idealValues: [
        'سلامت، تندرستی، تعادل در زندگی، توسعه فردی.'
      ],
      idealPainTitle: 'دغدغه‌ها و نقاط ضعف',
      idealPain: [
        'احساس خستگی و بی‌حالی.',
        'نارضایتی از وضعیت بدنی خود.',
        'دشواری در پیدا کردن زمان برای ورزش کردن.',
        'احساس سردرگمی در میان کوهی از اطلاعات ضد و نقیض درباره تغذیه و ورزش.',
        'نیاز به کسی که او را راهنمایی و تشویق کند.'
      ],
      idealSearchTitle: 'آنچه او جستجو می‌کند',
      idealSearch: [
        'یک مربی شخصی با دانش بالا و متعهد که چالش‌های او را درک کند.',
        'یک برنامه تمرینی کارآمد، جذاب و متناسب با نیازهایش.',
        'توصیه‌های غذایی ساده و قابل اجرا در زندگی روزمره.',
        'حمایت و انگیزه مداوم برای ماندن در مسیر صحیح.'
      ],
      idealOnlineTitle: 'فعالیت‌های آنلاین',
      idealOnline: [
        'شبکه‌های اجتماعی (اینستاگرام، فیس‌بوک)',
        'وبلاگ‌ها و انجمن‌های مرتبط با سلامت',
        'رویدادها و گروه‌های محلی.'
      ],
      
      packagesData: {
        summer: { 
          title: 'جشنواره تابستانی', 
          duration: '۳ ماه', 
          price: '۱۸۵۶ کرون', 
          subPrice: 'نصف قیمت!', 
          badge: 'جشنواره تابستانی', 
          features: ['برای تمامی سطوح', 'برنامه تمرینی کاملاً اختصاصی', 'برنامه غذایی اختصاصی بر اساس اهداف شما', 'پیگیری مداوم و مربیگری هفتگی', 'تمرینات ایمن و متناسب با تکنیک‌های صحیح جهت جلوگیری از آسیب‌دیدگی', 'معتبر تا ۳۱ اوت - شروع فروش از ۱ مه', 'حق انصراف ۱۴ روزه (طبق قانون خرید از راه دور)'],
          readMoreFeatures: [
            'برنامه تمرینی کاملاً اختصاصی و متناسب با فیزیک شما',
            'برنامه غذایی اختصاصی بر اساس اهداف شما',
            'پیگیری مداوم و مربیگری هفتگی',
            'تمرینات ایمن و متناسب با تکنیک‌های صحیح جهت جلوگیری از آسیب‌دیدگی',
            'امکان تمرین انعطاف‌پذیر (در خانه یا باشگاه)',
            'توصیه‌های تخصصی برای ویتامین‌ها، مواد معدنی و مکمل‌های غذایی',
            'ارائه بازخورد و اصلاح مستمر برنامه‌ها'
          ],
          importantHeader: 'اطلاعات مهم: شروع فروش از ۱ مه (اردیبهشت)!',
          importantText: 'توجه: این کمپین تابستانی فوق‌العاده انحصاری است و فقط از تاریخ ۱ مه قابل خرید خواهد بود. همین حالا در تقویم خود یادداشت کنید تا شانس حضور را از دست ندهید!'
        },
        'black-friday': { 
          title: 'تغییر و تحول بلک فرایدی', 
          duration: '۱۲ هفته', 
          price: '۱۹۱۹ کرون', 
          subPrice: '۶۵٪ صرفه‌جویی', 
          badge: 'قیمت بی‌نظیر', 
          features: ['برای تمامی سطوح', 'برنامه تمرینی ۱۰۰٪ اختصاصی', 'برنامه غذایی سفارشی', 'پیگیری مداوم و مربیگری هفتگی', 'ویدیوهای آموزشی برای حرکات ورزشی', 'شروع فروش از ۲۰ نوامبر', 'ظرفیت به شدت محدود'],
          modalTitle: 'همه آنچه برای ساختن بدن رویایی خود نیاز دارید:',
          readMoreFeatures: [
            'برنامه تمرینی اختصاصی: برنامه ۱۰۰٪ شخصی‌سازی شده برای تراشیدن بدن شما به سمت اهداف خاص خود، اعم از بدنسازی یا فرم ایده‌آل شخصی شما.',
            'برنامه غذایی سفارشی: سوخت مناسب برای تغییر بدنی شما، هماهنگ شده برای به حداکثر رساندن عضله‌سازی و/یا چربی‌سوزی.',
            'پیگیری و مربیگری مداوم: راهنمای شخصی شما در این مسیر که اطمینان حاصل می‌کند در راه رسیدن به فیزیک بدنی رویایی خود باقی می‌مانید.',
            'تمرین ایمن با ویدیوهای آموزشی واضح: تسلط بر تکنیک هر حرکت برای ساختن بدنی قوی به صورت ایمن و موثر.',
            'توصیه‌های تخصصی ویتامین‌ها و مکمل‌ها: نتایج خود را با توصیه‌های حرفه‌ای بهینه‌سازی کنید.',
            'بازخورد و اصلاحات مستمر: ما برنامه را به دقت تنظیم می‌کنیم تا مطمئن شویم که همیشه در حال پیشرفت هستید.'
          ],
          importantHeader: 'مهم: شروع فروش از ۲۰ نوامبر (۲۹ آبان)!',
          importantText: 'توجه: این پیشنهاد بی‌نظیر از دوشنبه ۲۰ نوامبر عرضه می‌شود. تعداد ظرفیت برای تضمین بالاترین کیفیت به شدت محدود است. زنگ هشدار خود را تنظیم کنید و آماده باشید!'
        },
        christmas: { 
          title: 'پیشنهاد ویژه کریسمس', 
          duration: '۱۶ هفته', 
          price: '۱۹۹۹ کرون', 
          subPrice: 'بهترین هدیه کریسمس به خودتان', 
          badge: 'جشنواره کریسمس', 
          features: ['برای تمامی سطوح', 'برنامه تمرینی اختصاصی (باشگاه یا خانه)', 'برنامه غذایی سفارشی و انعطاف‌پذیر', 'بررسی‌های منظم با مربی', 'ویدیوهای آموزشی برای تکنیک ایمن', 'شروع فروش از ۱ دسامبر', 'هدیه‌ای ماندگار پس از کریسمس'],
          modalTitle: 'همه آنچه در بسته کریسمس شما گنجانده شده است: پیشنهاد ویژه کریسمس PT-Online – بهترین هدیه کریسمس به خودتان (یا کسی که دوستش دارید!)',
          readMoreIntro: 'سال جدید را قوی‌تر از همیشه شروع کنید! وسایل زیر درخت کریسمس را فراموش کنید و روی چیزی که واقعاً ارزش دارد سرمایه‌گذاری کنید – سلامتی شما. پیشنهاد انحصاری کریسمس ما شروعی ایده‌آل برای شماست که می‌خواهید با برنامه‌ای حرفه‌ای و کاملاً شخصی‌سازی شده به اهداف خود برسید. این هدیه‌ای است که مدت‌ها پس از پایان کریسمس باقی می‌ماند و ابزارهای لازم برای یک تغییر سبک زندگی پایدار را در اختیارتان قرار می‌دهد.',
          readMoreFeatures: [
            'برنامه تمرینی اختصاصی و شخصی‌سازی شده: شما یک برنامه تمرینی ۱۰۰٪ شخصی‌سازی شده دریافت می‌کنید که برای دستیابی به اهداف خاص شما طراحی شده است، اعم از عضله‌سازی، افزایش قدرت یا فرم‌دهی به بدن. مناسب برای باشگاه یا خانه.',
            'برنامه غذایی سفارشی و انعطاف‌پذیر: ما یک برنامه غذایی پایدار بر اساس غذاهایی که دوست دارید ایجاد می‌کنیم. این برنامه کاملاً با زندگی روزمره و اهداف شما تطبیق می‌یابد تا خوردن غذای سالم آسان و لذت‌بخش باشد.',
            'پیگیری و مربیگری مداوم: شما هرگز تنها نیستید! از طریق بررسی‌های منظم و ارتباط نزدیک با مربی خود، مطمئن می‌شویم که انگیزه خود را حفظ می‌کنید، در مسیر درست هستید و در صورت نیاز برنامه را اصلاح می‌کنیم.',
            'ویدیوهای آموزشی برای تمرین ایمن: از تکنیک‌های صحیح خود کاملاً مطمئن باشید. تمام تمرینات برنامه شما با ویدیوهای آموزشی واضح همراه است تا نتایج را به حداکثر رسانده و خطر آسیب را به حداقل برساند.',
            'توصیه‌های تخصصی مکمل‌ها و ویتامین‌ها: برای بهینه‌سازی سلامت و نتایج خود، توصیه‌های شخصی درباره ویتامین‌ها، مواد معدنی و مکمل‌هایی که برای شما مفید هستند دریافت می‌کنید.',
            'بازخورد و اصلاحات مستمر: پیشرفت شما تمرکز ماست. شما بازخوردهای مداوم درباره دستاوردهای خود دریافت می‌کنید تا مطمئن شویم برنامه همیشه به گونه‌ای تنظیم شده که شما را به چالش کشیده و رشد دهد.'
          ],
          importantHeader: 'اطلاعات مهم: شروع فروش از ۱ دسامبر (۱۰ آذر)!',
          importantText: 'این هدیه کریسمس ایده‌آلی است که تا سال جدید همراه شما خواهد بود. همین امروز جای خود را رزرو کنید یا یک کارت هدیه بخرید!'
        },
        'pt-online-26': { 
          title: 'بسته کامل شخصی (PT Online)', 
          duration: '۲۶ هفته', 
          price: '۴۶۹۹ کرون', 
          subPrice: 'دانشجو/جوانان/بازنشستگان: ۴۲۵۰ کرون', 
          badge: 'بهترین ارزش', 
          features: ['برای تمامی سطوح', 'تمرین و تغذیه کاملاً اختصاصی متناسب با اهداف شما', 'تنظیم تدریجی فشار تمرین به صورت ماهانه', 'تمرینات دقیق همراه با ویدیوهای آموزشی', 'بررسی‌های منظم هفتگی و ماهانه', 'دیدگاه همه‌جانبه (خواب، ریکاوری، هوازی)', 'پشتیبانی از طریق واتس‌اپ و ایمیل'],
          modalTitle: 'بسته کامل شخصی – پی‌تی آنلاین (۲۶ هفته)',
          readMoreIntro: 'یک برنامه تمرینی و غذایی شخصی همراه با کوچینگ مداوم در طول ۲۶ هفته، روشی جامع و موثر برای دستیابی به اهداف خاص سلامتی است، چه کاهش وزن، چه عضله‌سازی و چه فرم‌دهی به بدن. برای رسیدن به بهترین نتایج ممکن، این برنامه بر پایه برنامه‌های شخصی‌سازی شده، پیگیری مستمر و هماهنگی با پیشرفت و شرایط زندگی فرد طراحی شده است.\n\nپایه‌های یک برنامه ۲۶ هفته‌ای:\nیک برنامه موفق شش ماهه بر اساس همکاری نزدیک بین شما و مربی‌تان ساخته می‌شود. این فرآیند معمولاً با یک مشاوره دقیق و ارزیابی وضعیت سلامت شروع می‌شود تا اهداف، توانایی‌ها، ترجیحات و هرگونه مانع احتمالی شما مشخص گردد.',
          readMoreFeatures: [
            'برنامه تمرینی اختصاصی با تمرکز بر تمرینات قدرتی: برنامه ورزشی شما کاملاً با اهداف و تجربه شما (باشگاه، خانه یا فضای باز) سازگار است. این برنامه شامل تمرینات دقیق همراه با ویدیوهای آموزشی، افزایش تدریجی شدت تمرین و دیدگاهی جامع نسبت به تمرینات هوازی، خواب و ریکاوری است.',
            'برنامه غذایی سفارشی: برنامه غذایی شخصی‌سازی شده بر اساس ترجیحات شما، آلرژی‌ها یا رژیم‌های گیاه‌خواری. دستورالعمل‌های متنوع، ساده و پایدار بدون محدودیت‌های شدید برای تضمین نتایج طولانی‌مدت.',
            'کوچینگ مداوم برای نتایج بهینه: پیگیری نزدیک و بازخورد شخصی از طریق بررسی‌های منظم هفتگی یا ماهانه برای حفظ انگیزه و هماهنگ کردن برنامه بر اساس پیشرفت شما.'
          ]
        },
        'next-level-26': { 
          title: 'نکست لول ۲۶ (Next Level)', 
          duration: '۲۶ هفته', 
          price: '۴۱۰۵ کرون', 
          subPrice: 'دانشجو/جوانان/بازنشستگان: ۳۸۲۸ کرون', 
          badge: 'چندزبانه', 
          features: ['برای تمامی سطوح', 'برنامه تمرینی و غذایی کاملاً شخصی‌سازی شده', 'پشتیبانی چندزبانه (کوچینگ به زبان مادری شما)', 'پشتیبانی از زبان‌های عربی، ترکی، فارسی، آلمانی و غیره', 'پشتیبانی نامحدود از طریق واتس‌اپ و ایمیل', 'بروزرسانی‌ها و اصلاحات منظم برنامه‌ها', 'حس امنیت ۱۰۰٪ و ارتباط شفاف‌تر'],
          modalTitle: 'نکست لول ۲۶ – کوچینگ چندزبانه (۲۶ هفته)',
          readMoreIntro: 'این یک بسته جامع کوچینگ آنلاین ۲۶ هفته‌ای است که تمرینات و برنامه‌های غذایی کاملاً شخصی‌سازی شده را با تمرکز ویژه بر پشتیبانی چندزبانه ارائه می‌دهد. این فرصتی بزرگ برای کسانی است که با زبان‌های سوئدی یا انگلیسی کاملاً راحت نیستند. دریافت برنامه تمرینی، توصیه‌های غذایی و تمام مربیگری‌های مستمر به زبان مادری خودتان می‌تواند تفاوت بزرگی در نتایج شما ایجاد کند. مزایای مربیگری به زبان مادری عبارتند از:',
          readMoreFeatures: [
            'ارتباط شفاف‌تر: مطمئن خواهید بود که تمام دستورالعمل‌ها را به درستی درک کرده‌اید، که ریسک سوءتفاهم و انجام نادرست حرکات را به حداقل می‌رساند.',
            'حس امنیت بیشتر: صحبت و ارتباط با مربی به زبانی که بیشترین تسلط را روی آن دارید، حس امنیت و صمیمیت بیشتری ایجاد می‌کند.',
            'نتایج بهتر: با حذف موانع زبانی، پرسیدن سوال، ارائه بازخورد و استفاده حداکثری از کوچینگ آسان‌تر شده و منجر به تمرینات موثرتر و ایمن‌تر می‌شود.'
          ],
          importantHeader: 'کوچینگ چندزبانه / زبان‌های پشتیبانی‌شده',
          importantText: '🇸🇪 Att få coaching på sitt eget modersmål gör stor skillnad för dina resultat.\n\n🇸🇦 إن القدرة على الحصول على برنامجك التدريبي، ونصائحك الغذائية، وجميع التدريبات المستمرة بلغتك الأم يمكن أن تحدث فرقًا هائلاً في نتائجك.\n\n🇹🇷 Antrenman programınızı, beslenme tavsiyelerinizi ve tüm koçluk sürecini kendi ana dilinizde alabilmek, sonuçlarınızda muazzam bir fark yaratabilir.\n\n🇮🇷 اینکه بتوانید برنامه تمرینی، توصیههای غذایی و تمام مربیگریهای مستمر خود را به زبان مادری خود دریافت کنید، میتواند تفاوت بزرگی در نتایج شما ایجاد کند.\n\n🇩🇪 Ihren Trainingsplan, Ihre Ernährungsempfehlungen und das gesamte laufende Coaching in Ihrer eigenen Muttersprache erhalten zu können, kann einen enormen Unterschied für Ihre Ergebnisse machen.\n\n🇪🇸 Poder recibir tu programa de entrenamiento, tus consejos de nutrición y todo el coaching continuo en tu propio idioma puede marcar una diferencia enorme en tus resultados.\n\n🇫🇷 Pouvoir obtenir votre programme d\'entraînement, vos conseils nutritionnels et tout le coaching en continu dans votre propre langue maternelle peut faire une énorme différence pour vos résultats.\n\n🇷🇺 Возможность получать вашу программу тренировок, рекомендации по питанию и все текущее сопровождение на вашем родном языке может иметь огромное значение для ваших результатов.'
        },
        'body-reboot-26': { 
          title: 'بادی ریبوت ۲۶', 
          duration: '۲۶ هفته', 
          price: '۳۸۵۰ کرون', 
          subPrice: 'دانشجو/جوانان/بازنشستگان: ۳۲۵۰ کرون', 
          badge: 'برای ورزشکاران باسابقه', 
          features: ['مناسب برای ورزشکاران متوسط یا پیشرفته', 'نیاز به دانش پایه خوب در تکنیک‌های تمرینی', 'برنامه پیشرفت طراحی شده به صورت حرفه‌ای', 'پشتیبانی مداوم تخصصی در زمینه تغذیه و تمرین', 'عادت‌های پایدار بدون رژیم‌ها یا محدودیت‌های سخت', 'بررسی‌های منظم هفتگی/ماهانه برای نتایج بهینه'],
          modalTitle: 'بادی ریبوت ۲۶ – پی‌تی آنلاین (۲۶ هفته)',
          readMoreIntro: 'این یک بسته کوچینگ آنلاین ۲۶ هفته‌ای است که برای مخاطبان خاصی طراحی شده است. این بسته برای چه کسانی مناسب است؟',
          readMoreFeatures: [
            'ایده‌آل برای افراد باسابقه: این بسته برای کسانی که از قبل دانش پایه خوبی در تکنیک‌های تمرینی دارند و در زمینه عضله‌سازی یا کاهش چربی باسابقه ("حرفه‌ای") هستند، ایده‌آل است.',
            'نامناسب برای مبتدیان: بنابراین این برنامه برای افراد مبتدی که نیاز به یادگیری اصول اولیه از صفر دارند، مناسب نیست.',
            'پیشرفت مستقل: این بسته ۲۶ هفته‌ای گزینه‌ای عالی و مقرون‌به‌صرفه برای ورزشکاران مستقل و با‌تجربه‌ای است که نیازی به آموزش تکنیک‌های پایه ندارند، اما می‌خواهند برنامه‌ای حرفه‌ای و پشتیبانی مداوم کارشناسان را برای سازماندهی تمرینات و تغذیه خود در طولانی‌مدت داشته باشند.'
          ]
        },
        'lifestyle-16': { 
          title: 'شروع سبک زندگی جدید (Livsstilsstarten)', 
          duration: '۱۶ هفته', 
          price: '۳۱۰۵ کرون', 
          subPrice: 'دانشجو/جوانان/بازنشستگان: ۲۸۴۰ کرون', 
          badge: 'محبوب', 
          features: ['برای تمامی سطوح', 'برنامه تمرینی و غذایی کاملاً اختصاصی', 'تعادل بهینه مواد مغذی (پروتئین، فیبر، ویتامین‌ها)', 'دستورالعمل‌های غذایی ساده و متنوع (مناسب برای گیاه‌خواران/آلرژی‌ها)', 'ویدیوهای آموزشی برای تمام تمرینات قدرتی', 'بازخورد مستمر و اصلاح برنامه‌ها', 'مشاوره خواب و ریکاوری'],
          modalTitle: 'همه آنچه در بسته ۱۶ هفته‌ای شما گنجانده شده است',
          readMoreFeatures: [
            'تمرینات دقیق: دستورالعمل‌های واضح، اغلب همراه با ویدیوهای آموزشی، برای اطمینان از اینکه به طور ایمن و مؤثر تمرین می‌کنید.',
            'اضافه‌بار تدریجی: برنامه به طور مداوم تنظیم می‌شود تا شما همچنان به چالش کشیده شوید و پیشرفت کنید. بسیاری از برنامه‌ها ماهانه بروزرسانی می‌شوند تا با پیشرفت شما هماهنگ گردند.',
            'دیدگاه همه‌جانبه: علاوه بر تمرینات قدرتی، برنامه می‌تواند شامل تمرینات هوازی و توصیه‌هایی در مورد ریکاوری و خواب برای به حداکثر رساندن نتایج باشد.',
            'برنامه غذایی سفارشی: برای دستیابی به اهداف شما، تغذیه یک عامل حیاتی است. یک برنامه غذایی شخصی بر اساس سبک زندگی، ترجیحات و نیازهای کالری شما تهیه می‌شود. هدف، ایجاد عادت‌های پایدار بدون رژیم‌ها یا محدودیت‌های سخت است. برنامه غذایی معمولاً شامل موارد زیر است:',
            'دستورالعمل‌های متنوع و ساده: برای اینکه پیروی از برنامه در طولانی‌مدت آسان‌تر شود.',
            'هماهنگی با ترجیحات، آلرژی‌ها یا رژیم‌های گیاه‌خواری: تغذیه باید برای شما و زندگی روزمره‌تان کارآمد باشد.',
            'کوچینگ و هماهنگی مداوم برای نتایج بهینه',
            'پیگیری منظم و بازخورد: شما ارتباط منظمی با مربی خود دارید، معمولاً از طریق بررسی‌های هفتگی یا ماهانه. در این جلسات پیشرفت شما بررسی شده و بازخوردهای شخصی دریافت می‌کنید که به شما کمک می‌کند در مسیر درست بمانید.',
            'تعادل مغذی بهینه – هر روز:',
            'پروتئین: اطمینان حاصل کنید که پروتئین کافی برای عضله‌سازی و ریکاوری دریافت می‌کنید.',
            'فیبر: مصرف فیبر خود را به حداکثر برسانید برای احساس سیری خوب، سطح قند خون پایدار و گوارش سالم.',
            'ویتامین‌ها و مواد معدنی: دستورالعمل‌های غذایی برای تامین طبیعی طیف وسیعی از ویتامین‌ها و مواد معدنی ضروری جهت حمایت از سلامت و شادابی شما طراحی شده‌اند.'
          ]
        },
        'glute-leg-16': { 
          title: 'متخصص باسن و پا (Glute & Leg)', 
          duration: '۱۶ هفته', 
          price: '۳۰۰۰ کرون', 
          subPrice: 'دانشجو/جوانان/بازنشستگان: ۲۸۱۰ کرون', 
          badge: 'مخصوص بانوان', 
          features: [
            'فقط برای بانوان (برای تمامی سطوح)', 
            'تمرکز بر تمرینات باسن و ران', 
            'شامل تمرینات برای سایر بخش‌های بدن', 
            'برنامه غذایی کامل با تعادل مغذی بهینه', 
            'پشتیبانی نامحدود از طریق چت', 
            'بروزرسانی منظم برنامه‌ها'
          ],
          modalTitle: 'برنامه تمرینی اختصاصی با تمرکز بر پایین‌تنه',
          readMoreFeatures: [
            'برنامه تمرینی اختصاصی با تمرکز بر پایین‌تنه: شما یک برنامه تمرینی با طراحی شخصی دریافت می‌کنید که ۱۰۰٪ با اهداف، تجربه و زندگی روزمره شما سازگار است. این برنامه برای به حداکثر رساندن نتایج برای باسن و پاها تخصصی شده است، اما شامل تمریناتی برای بقیه بدن نیز می‌شود تا فیزیکی متعادل و قوی ایجاد کند.',
            'تعادل مغذی بهینه – هر روز:',
            'پروتئین: اطمینان حاصل کنید که پروتئین کافی برای عضله‌سازی و ریکاوری دریافت می‌کنید.',
            'فیبر: مصرف فیبر خود را به حداکثر برسانید برای احساس سیری خوب، سطح قند خون پایدار و گوارش سالم.',
            'ویتامین‌ها و مواد معدنی: دستورالعمل‌های غذایی برای تامین طبیعی طیف وسیعی از ویتامین‌ها و مواد معدنی ضروری جهت حمایت از سلامت و شادابی شما طراحی شده‌اند.',
            'پشتیبانی نامحدود: دسترسی به مربی خود از طریق چت برای سوالات سریع و انگیزه بیشتر هر زمان که به آن نیاز داشتید.',
            'بروزرسانی منظم برنامه‌ها: برنامه تمرینی همزمان با قوی‌تر شدن شما تنظیم شده و توسعه می‌یابد.'
          ]
        },
        'fokus-12': { 
          title: 'تمرکز ۱۲ (Fokus 12)', 
          duration: '۱۲ هفته', 
          price: '۲۴۶۹ کرون', 
          subPrice: 'دانشجو/جوانان/بازنشستگان: ۲۲۱۵ کرون', 
          badge: 'استاندارد', 
          features: [
            'برای تمامی سطوح', 
            'برنامه تمرینی شخصی‌سازی شده', 
            'برنامه غذایی پایدار (بدون رژیم‌های سخت و پیچیده)', 
            'پیگیری و مربیگری مداوم', 
            'ویدیوهای آموزشی برای تمامی تمرینات قدرتی', 
            'توصیه‌های تخصصی برای ویتامین‌ها و مکمل‌ها', 
            'بازخورد مستمر و اصلاح برنامه‌ها'
          ],
          modalTitle: 'تمرکز ۱۲ – همه آنچه در بسته شما گنجانده شده است:',
          readMoreIntro: 'این بسته به شما یک پایه کامل برای تغییر سبک زندگی موفق و پایدار می‌دهد. روی خودتان سرمایه‌گذاری کنید و اجازه دهید به شما کمک کنیم تا به پتانسیل کامل خود برسید.',
          readMoreFeatures: [
            '۱. برنامه تمرینی شخصی‌سازی شده: برنامه‌های عمومی را فراموش کنید. شما برنامه‌ای دریافت می‌کنید که ۱۰۰٪ متناسب با اهداف، سطح فعلی و شرایط شما طراحی شده است. چه در باشگاه تمرین کنید و چه در خانه، ما برنامه‌ای موثر و پایدار برای شما طراحی می‌کنیم.',
            '۲. برنامه غذایی اختصاصی: ما یک برنامه غذایی پایدار و لذت‌بخش بر اساس غذاهایی که واقعاً دوست دارید ایجاد می‌کنیم. این برنامه کاملاً با زندگی روزمره و اهداف شما بدون رژیم‌های پیچیده یا محدودیت‌ها سازگار است. هدف این است که به شما ابزارهایی بدهیم تا به شیوه‌ای که برایتان کارساز است سالم غذا بخورید.',
            '۳. پیگیری و مربیگری مداوم: مربی شما در تمام طول مسیر همراه شماست. از طریق بررسی‌های منظم، پیشرفت شما را رصد می‌کنیم، برنامه را در صورت نیاز تغییر می‌دهیم و از حفظ انگیزه شما اطمینان حاصل می‌کنیم. شما همیشه یک مشاور و متخصص در کنار خود دارید.',
            '۴. ویدیوهای آموزشی برای تمامی تمرینات قدرتی: در تمرینات خود احساس امنیت و اطمینان کنید. تمام تمرینات برنامه شما همراه با ویدیوهای آموزشی واضح است که تکنیک صحیح را نشان می‌دهند. این کار خطر مصدومیت را به حداقل می‌رساند و تاثیر هر تکرار را به حداکثر می‌رساند.',
            '۵. توصیه‌های تخصصی برای ویتامین‌ها و مکمل‌ها: برای بهینه‌سازی نتایج و سلامت عمومی خود، توصیه‌های شخصی درباره ویتامین‌ها، مواد معدنی و مکمل‌هایی که بر اساس رژیم غذایی و اهداف شما برایتان مفید هستند دریافت می‌کنید.',
            '۶. بازخورد مستمر و اصلاح برنامه‌ها: پیشرفت شما در مرکز توجه است. شما بازخورد مستمری از عملکرد و نتایج خود دریافت می‌کنید و ما آماده‌ایم تا برنامه را تنظیم کنیم تا مطمئن شویم در طول کل مسیر به پیشرفت خود ادامه می‌دهید.'
          ]
        },
        'health-8': { 
          title: 'قدرت و سلامت', 
          duration: '۸ هفته', 
          price: '۱۸۲۹ کرون', 
          subPrice: 'دانشجو/جوانان/بازنشستگان: ۱۴۹۹ کرون', 
          badge: 'فشرده', 
          features: [
            'برای تمامی سطوح', 
            'تغییر و تحول سریع ۸ هفته‌ای', 
            'برنامه تمرینی اختصاصی (باشگاه یا خانه)', 
            'برنامه غذایی متناسب با غذاهای مورد علاقه شما', 
            'بررسی‌های هفتگی برای حفظ انگیزه', 
            'ویدیوهای آموزشی برای تکنیک‌های ایمن', 
            'راهنمای کامل برای دستیابی به نتایج دلخواه'
          ],
          modalTitle: 'همه آنچه در بسته ۸ هفته‌ای شما گنجانده شده است:',
          readMoreIntro: 'این بسته راهکار کاملی برای کسانی است که آماده‌اند در طول ۸ هفته تمام تلاش خود را به کار گیرند و به دنبال یک راهنمای کامل و حرفه‌ای برای دستیابی به نتایج دلخواه خود هستند.',
          readMoreFeatures: [
            '۱. برنامه تمرینی شخصی‌سازی شده: ما یک برنامه تمرینی را کاملاً بر اساس اهداف، سطح تجربه و زندگی روزمره شما طراحی می‌کنیم. تمرکز این برنامه بر ساخت قدرت و بهبود فیزیک شما به روشی موثر و ایمن است، چه در خانه تمرین کنید و چه در باشگاه.',
            '۲. برنامه غذایی اختصاصی: با برنامه غذایی شخصی‌سازی شده سریع‌تر به اهداف خود برسید. ما ترجیحات، سبک زندگی و اهداف شما را برای ایجاد برنامه‌ای که هم خوشمزه، هم مغذی و هم پیروی از آن آسان باشد در نظر می‌گیریم.',
            '۳. پیگیری و مربیگری مداوم: شما در مسیر خود هرگز تنها نیستید. با بررسی‌های منظم، اطمینان حاصل می‌کنیم که در مسیر درست هستید، انگیزه شما را بالا نگه می‌داریم و برنامه را در صورت نیاز تغییر می‌دهیم. مربی شما برای پاسخ به سوالات و ارائه پشتیبانی لازم برای موفقیت در دسترس است.',
            '۴. ویدیوهای آموزشی برای تمامی تمرینات قدرتی: با اعتماد به نفس تمرین کنید! هر تمرین در برنامه شما همراه با یک ویدیوی آموزشی واضح است که تکنیک صحیح را نشان می‌دهد. این امر برای به حداکثر رساندن نتایج و به حداقل رساندن خطر مصدومیت بسیار حیاتی است.',
            '۵. توصیه‌های تخصصی برای ویتامین‌ها و مکمل‌ها: برای ایجاد بهترین شرایط برای بدن، توصیه‌های شخصی درباره ویتامین‌ها، مواد معدنی و مکمل‌هایی که می‌توانند رژیم غذایی شما را تکمیل کنند و به شما در رسیدن به اهداف کمک کنند دریافت می‌کنید.',
            '۶. بازخورد مستمر: ما پیشرفت شما را از نزدیک دنبال می‌کنیم و بازخورد مستمر به شما ارائه می‌دهیم. این به شما کمک می‌کند پیشرفت خود را درک کنید و بدانید برای برداشتن قدم بعدی به سمت اهداف خود چه چیزی لازم است.'
          ]
        },
        'kickstart-4': { 
          title: 'پروژه ۴ هفته (Projekt 4 Veckor)', 
          duration: '۴ هفته', 
          price: 'عادی: ۱۱۲۹ کرون', 
          subPrice: 'جوانان/دانشجو/بازنشسته: ۸۵۶ کرون', 
          badge: 'شروع سریع', 
          features: [
            'برای تمامی سطوح', 
            'شروع سریع قدرتمند یا شکستن استپ وزنی', 
            'برنامه تمرینی فشرده متناسب با تمام سطوح', 
            'برنامه غذایی ساده و پایدار', 
            'ارتباط با مربی', 
            'ویدیوهای آموزشی برای تمام تمرینات', 
            'بازخورد سریع در مورد پیشرفت شما'
          ],
          modalTitle: 'موارد گنجانده شده در این بسته',
          readMoreIntro: '',
          readMoreFeatures: [
            'برنامه تمرینی شخصی‌سازی شده',
            'برنامه غذایی شما دقیقاً متناسب با شما، زندگی روزمره و هدفتان تنظیم می‌شود.',
            'پیگیری و مربیگری مداوم',
            'ویدیوهای تمرینات قدرتی برای جلوگیری از آسیب‌دیدگی',
            'توصیه‌ها برای ویتامین‌ها/مواد معدنی و مکمل‌های غذایی',
            'بازخورد'
          ]
        },
        nutrition: { 
          title: 'برنامه غذایی پیشرفته', 
          duration: 'خرید یک‌باره', 
          price: '۲۴۵۸ کرون', 
          subPrice: 'برنامه کامل غذایی', 
          badge: 'فقط تغذیه', 
          features: [
            'برای تمامی سطوح', 
            '۲۰ دستور غذایی منحصربه‌فرد و کاربردی', 
            'تقسیم شده به ۵ وعده مغذی در روز', 
            'متناسب با سبک زندگی و ترجیحات غذایی شما', 
            'تعادل مغذی بهینه (پروتئین، فیبر، ویتامین‌ها)', 
            'غذاهای آسان‌پز برای حفظ ثبات سطح قند خون', 
            'راهنمایی برای تغذیه هوشمندانه‌تر و حس بهتر'
          ],
          modalTitle: 'برنامه غذایی پیشرفته: کلید شما برای تغذیه و نتایج بهینه',
          readMoreIntro: 'با این برنامه غذایی پیشرفته، شما نه تنها یک برنامه، بلکه راهنمایی برای هوشمندانه‌تر غذا خوردن، احساس بهتر و عملکرد بهینه دریافت می‌کنید.',
          readMoreFeatures: [
            'این برنامه غذایی برای چه کسانی مناسب است؟',
            'کسانی که می‌خواهند تغذیه خود را به سطح بعدی ببرند.',
            'کسانی که به دنبال الهام و تنوع در آشپزی خود هستند.',
            'کسانی که می‌خواهند از دریافت تمام مواد مغذی ضروری اطمینان حاصل کنند.',
            'کسانی که برای دستیابی به اهداف خاص سلامتی یا ورزشی خود، به دنبال یک ساختار واضح هستند.'
          ]
        },
        'tech-60': { 
          title: 'آموزش تکنیک (۶۰) دقیقه', 
          duration: '۶۰ دقیقه', 
          price: 'عادی: ۴۹۹ کرون', 
          subPrice: 'جوانان/دانشجو/بازنشسته: ۳۴۰ کرون', 
          badge: 'جلسه حضوری', 
          features: [
            'برای تمامی سطوح', 
            'جلسه حضوری برای آموزش تکنیک صحیح حرکات', 
            'تمرکز بر ددلیفت، اسکات و پرس سینه', 
            'امکان انتخاب حرکات خاص توسط خودتان', 
            'جلسه تقسیم شده به گرم کردن و تمرکز بر تکنیک', 
            'دستورالعمل‌های واضح برای جلوگیری از مصدومیت', 
            'شامل سرد کردن و ارائه بازخورد'
          ],
          modalTitle: 'جلسه آموزش تکنیک (۶۰ دقیقه‌ای)',
          readMoreIntro: 'جلسه آموزش تکنیک متمرکز بر بهبود تکنیک صحیح در تمرینات خاص. این جلسه به گرم کردن، تمرکز بر تکنیک و سرد کردن تقسیم می‌شود، همراه با دستورالعمل‌های واضح برای اطمینان از اجرای صحیح حرکات. فرض من بر این است که شما یک جلسه عمومی می‌خواهید که برخی از تمرینات قدرتی رایج (ددلیفت، اسکوات، پرس سینه) را پوشش دهد، اما اگر تمرینات خاصی در نظر دارید، به من اطلاع دهید!',
          readMoreFeatures: [
            'بهبود تکنیک شما در تمرینات خاص',
            'جلسه به بخش‌های گرم کردن، تمرکز بر تکنیک و سرد کردن تقسیم می‌شود',
            'دستورالعمل‌های واضح برای اطمینان از اجرای صحیح حرکات',
            'پوشش تمرینات پایه رایج مانند ددلیفت، اسکوات و پرس سینه',
            'امکان شخصی‌سازی بر اساس تمرینات انتخابی خودتان'
          ]
        },
        'individual-pt': { 
          title: 'مربیگری شخصی حضوری ۶۰ دقیقه', 
          duration: '۶۰ دقیقه برای هر جلسه', 
          price: '۴۹۹ کرون', 
          subPrice: 'رزرو ۲۰ جلسه به مبلغ ۷۸۵۰ کرون (۳۹۲ کرون/جلسه)', 
          badge: 'مربیگری حضوری', 
          features: [
            'برای تمامی سطوح', 
            'جلسات تمرین حضوری متناسب با اهداف شما', 
            'شامل برنامه تمرینی کاملاً شخصی‌سازی شده', 
            'برنامه غذایی متناسب با زندگی روزمره شما', 
            'شامل پیگیری مداوم و مربیگری مستمر', 
            'تمرینات متناسب با تکنیک در باشگاه', 
            'ساعات تمرین انعطاف‌پذیر'
          ],
          modalTitle: 'چه مواردی در این برنامه گنجانده شده است؟',
          readMoreIntro: 'با برنامه ۶۰ دقیقه‌ای مربیگری شخصی ما، شما یک راهکار جامع دریافت می‌کنید که ترکیبی از تمرینات قدرتی شخصی‌سازی شده، برنامه‌ریزی غذایی و مربیگری مداوم است. چه هدف شما فرم‌دهی به بدن، کاهش وزن، عضله‌سازی یا بهبود سلامت عمومی باشد، این برنامه برای به حداکثر رساندن نتایج و باانگیزه نگه داشتن شما طراحی شده است.',
          readMoreFeatures: [
            'برنامه تمرینی شخصی‌سازی شده (۲۰ جلسه یا بیشتر)',
            'آنالیز شخصی: ما با یک مشاوره عمیق شروع می‌کنیم که در آن سطح فعلی، اهداف، سبک زندگی و هرگونه محدودیت شما (به عنوان مثال آسیب‌دیدگی یا کمبود وقت) را ترسیم می‌کنیم.',
            'تمرکز بر تمرینات قدرتی: برنامه تمرینی با ترکیبی از تمرینات قدرتی برای بهینه‌سازی عضله‌سازی، چربی‌سوزی یا آمادگی جسمانی عملکردی بسته به اهداف شما طراحی شده است. ما تنوعی مانند وزنه‌های آزاد، دستگاه‌ها، وزن بدن و تمرینات عملکردی را شامل می‌شویم.',
            'پیشرفت و تنوع: برنامه هر ۴ تا ۶ هفته یک‌بار به روز می‌شود تا از توسعه مداوم اطمینان حاصل شود و از استپ وزنی جلوگیری شود.',
            'دسترسی: جلسات تمرینی بسته به ترجیحات و منابع شما می‌تواند در باشگاه، خانه یا فضای باز انجام شود.',
            'برنامه غذایی اختصاصی',
            'برنامه غذایی اختصاصی: بر اساس اهداف شما (کاهش وزن، عضله‌سازی یا عملکرد ورزشی) یک برنامه غذایی واقعی و پایدار ایجاد می‌کنیم که ترجیحات غذایی، آلرژی‌ها و سبک زندگی (مانند گیاهخواری، وگان یا فکسیتارین) را در نظر می‌گیرد.',
            'تعادل درشت‌مغذی‌ها: ما تقسیم پروتئین، کربوهیدرات و چربی را برای حمایت از اهداف تمرینی شما بهینه می‌کنیم.',
            'پیشنهادات غذایی و دستورالعمل‌ها: پیشنهادات مشخصی برای وعده‌های غذایی، میان‌وعده‌ها و مکمل‌ها دریافت کنید تا زندگی روزمره شما ساده‌تر شود.',
            'انعطاف‌پذیری: برنامه غذایی به طور مداوم بر اساس پیشرفت، سطح انرژی و بازخورد شما تنظیم می‌شود.',
            'مربیگری و پیگیری مستمر',
            'مربیگری و پیگیری مستمر: پیگیری‌های هفتگی و بررسی‌های منظم برای ارزیابی پیشرفت، ارائه بازخورد و تنظیم برنامه‌ها.',
            'انگیزه و مسئولیت‌پذیری: مربی شخصی شما به عنوان مربی شما عمل می‌کند و شما را با تشویق و استراتژی‌هایی برای غلبه بر موانع مسئولیت‌پذیر نگه می‌دارد.',
            'پشتیبانی نامحدود: دسترسی به مربی خود از طریق واتس‌اپ یا ایمیل برای سوالات سریع و انگیزه بیشتر.',
            'تنظیم در لحظه: اگر تغییرات سبک زندگی، آسیب‌دیدگی‌ها یا عوامل دیگر بر تمرین شما تأثیر بگذارد، ما برنامه را بلافاصله تغییر می‌دهیم تا شما را در مسیر درست نگه داریم.'
          ]
        }
      },

      // Apply Page
      applySubtitle: 'Ta första steget',
      applyTitle: 'Skicka din intresseanmälan',
      applyIntro: 'Fyll i formuläret så noggrant du kan. Det hjälper oss att förbereda och skräddarsy ditt upplägg. Detta är en helt kostnadsfri och icke-bindande intresseanmälan.',
      applyContactEmailTitle: 'E-post för frågor',
      applyContactPhoneTitle: 'Telefon / WhatsApp',
      applyContactLocationTitle: 'Plats',
      applyContactLocationText: 'Träna online eller på plats i gymmiljö',
      applyDisclaimer: '14 dagars ångerrätt gäller enligt lag för alla distansköp.',
      applyLabelFullName: 'Fullständigt namn *',
      applyPlaceholderFullName: 'För- och efternamn',
      applyLabelGender: 'Kön *',
      applyOptionFemale: 'Kvinna',
      applyOptionMale: 'Man',
      applyOptionOther: 'Annat / Vill ej uppge',
      applyLabelAge: 'Ålder *',
      applyPlaceholderAge: 'År',
      applyLabelCity: 'Stad *',
      applyPlaceholderCity: 'T.ex. Stockholm',
      applyLabelEmail: 'E-postadress *',
      applyPlaceholderEmail: 'namn@epost.se',
      applyLabelPhone: 'Telefonnummer *',
      applyPlaceholderPhone: '07X-XXX XX XX',
      applyLabelWish: 'Önskemål om träning (Paket) *',
      applyPlaceholderWish: '-- Välj ett träningspaket --',
      applyLabelMessage: 'Meddelande / Tidigare erfarenhet (Frivilligt)',
      applyPlaceholderMessage: 'Beskriv kort din nuvarande form, dina mål eller om du har några skador...',
      applyBtnSubmit: 'ارسال درخواست (مشاوره رایگان)',
      applyBtnPayWithStripe: 'پرداخت امن با استرایپ (خرید مستقیم) 💳',
      applyLabelStudentDiscount: 'من دانشجو، جوان یا بازنشسته هستم (دریافت تخفیف)',
      paymentSuccessTitle: 'پرداخت با موفقیت انجام شد! 🎉',
      paymentSuccessText: 'با تشکر {name}! پرداخت شما برای {wish} با موفقیت ثبت شد.',
      paymentSuccessSubtext: 'تأییدیه به {email} و علی به زودی با شماره {phone} با شما تماس خواهد گرفت تا مسیر تمرینی شما را آغاز کند.',
      paymentSuccessBack: 'بازگشت به خانه',
      paymentCancelTitle: 'پرداخت لغو شد ❌',
      paymentCancelText: 'پرداخت انجام نشد. اگر مشکلی پیش آمده یا می‌خواهید پکیج دیگری انتخاب کنید، می‌توانید به بخش پکیج‌ها بازگردید.',
      paymentCancelBack: 'بازگشت به پکیج‌ها',
      applyBtnSending: 'Skickar...',
      applyErrorFields: 'Vänligen fyll i alla obligatoriska fält.',
      applySuccessTitle: 'Tack för din ansökan!',
      applySuccessText: 'Hej {name}. Vi har tagit emot din intresseanmälan för paket {wish}.',
      applySuccessSubtext: 'Lic. PT Ali Wafa kommer att kontakta dig via e-post ({email}) eller telefon ({phone}) inom 24 timmar för att diskutera ditt upplägg.',
      applySuccessBack: 'Tillbaka till startsidan',
      
      // Footer & Partners Extra Links
      idealLink: 'Ideal kund',
      termsLink: 'Köpvillkor & Info',
      whyStrengthLink: 'Varför styrketräna?',
      visitPartner: 'Besök hemsida',
      partnerWeightworldDesc: 'Premium kosttillskott och hälsoprodukter för viktminskning och energi.',
      partnerStaybeautifulDesc: 'Skönhets- och hudvårdsprodukter för ett sundare och fräschare liv.',
      partnerApulsDesc: 'Träningsredskap och professionell gymutrustning för hemmaträning.',
      partnerMindlyDesc: 'Verktyg för mental träning, självhjälp och personlig utveckling.',
      partnerMusclepainDesc: 'Massagepistoler och återhämtningsprodukter för trötta muskler.',
      partnerSskbutikenDesc: 'Hälsoprodukter, bekväma skor och stöd för vårdpersonal och motionärer.',
      
      // Footer specific translations
      footerTagline: 'Vi bygger inte bara ett starkare yttre – vi utvecklar också styrkan och fokuset inom dig.',
      footerNavTitle: 'Navigation',
      footerInfoTitle: 'Information',
      footerContactTitle: 'Kontakt & Support',
      footerSupportHours: 'Svarstid: 24–48 timmar under vardagar. Helger upp till 72 timmar.',

      // BMI Calculator Page
      bmiCalculator: 'محاسبه‌گر BMI',
      bmiTagline: 'محاسبه‌گر BMI – محاسبه و تفسیر شاخص توده بدنی شما',
      bmiWeightLabel: 'وزن (کیلوگرم)',
      bmiHeightLabel: 'قد (سانتی‌متر)',
      bmiDecimalTip: 'نکته! برای نتیجه دقیق‌تر می‌توانید از اعشار استفاده کنید.',
      bmiBtnCalculate: 'محاسبه BMI',
      bmiBtnClear: 'پاک کردن اطلاعات',
      bmiBtnCalculating: 'در حال محاسبه...',
      bmiResultTitle: 'شاخص توده بدنی (BMI) شما',
      bmiClassTitle: 'رده وزنی شما',
      bmiUnderweight: 'کمبود وزن (لاغری)',
      bmiNormalweight: 'وزن نرمال',
      bmiOverweight: 'اضافه وزن',
      bmiObesity: 'چاقی (مفرط)',
      
      bmiWhatIsTitle: 'شاخص توده بدنی (BMI) چیست؟',
      bmiWhatIsDesc: 'شاخص توده بدنی (BMI) مخفف Body Mass Index است. این معیاری است که وزن شما را با قدتان مقایسه می‌کند و منجر به یک مقدار عددی می‌شود. ارائه‌دهندگان خدمات بهداشتی اغلب از BMI به عنوان یکی از ابزارها برای بررسی سالم بودن وزن شما استفاده می‌کنند.',
      bmiGroupsIntro: 'شاخص توده بدنی به گروه‌های مختلف تقسیم می‌شود:',
      
      bmiHowToInterpretTitle: 'چگونه BMI خود را تفسیر کنید',
      bmiHowToInterpretDesc1: 'محدوده‌های بین‌المللی برای BMI وجود دارد که می‌تواند اولین نشانه‌ها را از قرار داشتن وزن شما در سطح سالم ارائه دهد. برای دریافت تصویر کامل‌تر از سلامتی، معمولاً اندازه دور کمر نیز سنجیده می‌شود و آزمایش‌هایی مانند فشار خون و آزمایش خون انجام می‌گیرد.',
      bmiHowToInterpretDesc2: 'به عبارت دیگر، نباید اجازه دهید مقدار BMI تنها چیزی باشد که به آن متکی هستید، اما می‌توانید از آن به عنوان بخشی از تصویر کلی سلامت بدن خود استفاده کنید.',
      
      bmiGuidelinesTitle: 'جدول راهنمای شاخص توده بدنی و رده وزنی',
      bmiTableBmi: 'شاخص BMI',
      bmiTableClass: 'رده وزنی',
      bmiTableUnder185: 'کمتر از ۱۸.۵',
      bmiTable185_249: '۱۸.۵ - ۲۴.۹',
      bmiTable25_299: '۲۵ - ۲۹.۹',
      bmiTable30More: '۳۰ یا بیشتر',
      
      bmiRememberTitle: 'به یاد داشته باشید!',
      bmiRememberDesc1: 'BMI یک معیار کلی است که جنسیت، توده عضلانی، سن یا شکل بدن را در نظر نمی‌گیرد. به عنوان مثال، زنان به طور طبیعی درصد چربی بدن بالاتری نسبت به مردان دارند و افراد مسن اغلب توده عضلانی خود را از دست می‌دهند.',
      bmiRememberDesc2: 'شاخص توده بدنی همچنین نشان نمی‌دهد که چربی‌های بدن چگونه توزیع شده‌اند. چربی‌های اطراف شکم که چربی احشایی نیز نامیده می‌شوند، اغلب خطرات سلامتی بیشتری نسبت به چربی‌های بخش‌های دیگر بدن به همراه دارند.',
      
      bmiHowToAffectTitle: 'چگونه می‌توانید بر BMI خود تأثیر بگذارید',
      bmiHowToAffectDesc: 'برای حفظ یک BMI سالم و وزن پایدار در طول زمان، باید تعادلی بین سه رکن اصلی پیدا کنید: تغذیه، تحرک و ریکاوری. خوردن غذای مغذی به اندازه کافی، تحرک روزانه و خواب خوب شبانه بهترین شرایط را برای حفظ سلامت بدن فراهم می‌کند.',
      
      bmiPreventObesityTitle: 'برای پیشگیری از اضافه وزن می‌توانید:',
      bmiTips: [
        'غذاهای مغذی و غنی از فیبر مصرف کنید',
        'هر روز حداقل ۳۰ دقیقه تحرک داشته باشید',
        'به اندازه کافی بخوابید – ترجیحاً ۷ تا ۹ ساعت در شب',
        'استرس را کاهش دهید و از خود مراقبت کنید',
        'مصرف الکل را محدود کرده و از دخانیات دوری کنید'
      ],

      // Testimonials (Trustpilot)
      trustpilotSubtitle: 'نظرات مشتریان',
      trustpilotTitle: 'تراست‌پایلوت – تأثیر نظرات مشتریان ما را تجربه کنید',
      trustpilotExcellent: 'عالی',
      trustpilotBasedOn: 'بر اساس نظرات مشتریان واقعی',
      reviews: [
        {
          name: 'مشتری راضی',
          text: 'من از سفر ورزشی خود با Muscle&Focus بسیار راضی هستم. برنامه تمرینی واضح، الهام‌بخش بوده و پایه امنی برای من ایجاد کرده است. به هر کسی که می‌خواهد در تمرین و سلامت پیشرفت کند، به شدت توصیه می‌شود. 💪🏼 همیشه برخورد خوب و توضیحات عالی!! برنامه تمرینی و برنامه غذایی بسیار واضح.'
        },
        {
          name: 'دیوید ک.',
          text: 'برنامه شخصی فوق‌العاده! علی بسیار باتجربه است و راهنمایی‌های او در باشگاه به من کمک کرد تا با تکنیک عالی وزنه بزنم. بعد از ۱۲ هفته تغییرات بزرگی در قدرت و انعطاف‌پذیری خودم احساس می‌کنم.'
        },
        {
          name: 'امیر ه.',
          text: 'پکیج آنلاین بهترین برنامه‌ای است که تا به حال امتحان کرده‌ام. دنبال کردن برنامه غذایی بسیار ساده است و اپلیکیشن ثبت تمرینات کار را راحت کرده است. بررسی‌های هفتگی علی انگیزه‌ام را در تمام طول مسیر حفظ کرد!'
        }
      ],
      resultsSubtitle: 'نتایج مراجعین',
      resultsTitle: 'نتایج قبل و بعد از دوره تمرینی',
      resultsIntro: 'تغییرات فوق‌العاده اندام و سلامت افراد واقعی را ببینید که با Muscle & Focus تمرین کرده‌اند.',
      resultsMale: 'کاهش وزن و افزایش قدرت (۶ ماه)',
      resultsFemale: 'سبک زندگی سالم‌تر و چربی‌سوزی (۴ ماه)',

      // BMI Risks Page Content
      bmiRisksTitle: 'خطرات اضافه وزن و چاقی مفرط',
      bmiRisksIntro1: 'اضافه وزن خطر ابتلا به چندین بیماری مختلف را افزایش می‌دهد. هر چه وزن بالاتر برود، خطرات بیشتر می‌شوند.',
      bmiRisksIntro2: 'وقتی چربی بدن بیش از حدی باشد که برای بدن مناسب است، می‌تواند بر کارایی تنظیم عملکردهای حیاتی تأثیر بگذارد. این امر می‌تواند تعادل هورمونی و متابولیسم را مختل کند و کنترل فشار خون، قند خون و چربی خون را برای بدن سخت‌تر سازد.',
      bmiRisksIntro3: 'چربی در بدن فقط چیزی نیست که «آنجا نشسته باشد»، بلکه در واقع مانند یک اندام فعال رفتار می‌کند. در چاقی مفرط، چربی‌ها می‌توانند موادی آزاد کنند که باعث ایجاد التهاب خفیف و مداوم در بدن می‌شود.',
      bmiRisksIntro4: 'همه این موارد به نوبه خود می‌توانند خطر ابتلا به بیماری‌هایی نظیر موارد زیر را افزایش دهند:',
      bmiRisksList: [
        { title: 'بیماری‌های قلبی-عروقی و دیابت', desc: 'چاقی مفرط باعث می‌شود فشار خون، قند خون و چربی خون تحت تأثیر منفی قرار گیرند. این امر خطر ابتلا به فشار خون بالا، چربی خون بالا، دیابت نوع ۲، تصلب شرایین (آترواسکلروز)، حمله قلبی و سکته مغزی را افزایش می‌دهد.' },
        { title: 'سنگ کیسه صفرا و کبد چرب', desc: 'اضافه وزن می‌تواند باعث تشکیل سنگ کیسه صفرا و تجمع چربی در کبد شود. هر دوی این موارد در صورت عدم درمان می‌توانند منجر به مشکلات بیشتری شوند.' },
        { title: 'مشکلات تنفسی', desc: 'افراد مبتلا به چاقی مفرط بیشتر به آسم یا مشکلات تنفسی شدیدتر دچار می‌شوند. اضافه وزن همچنین اغلب منجر به خروپف و آپنه خواب می‌شود که می‌تواند در درازمدت به قلب و بدن فشار وارد کند.' },
        { title: 'مشکلات مفصلی', desc: 'وزن بالا به اسکلت و مفاصل فشار می‌آورد و باعث درد و ساییدگی مفاصل می‌شود. بسیاری از افراد مبتلا به چاقی مفرط به مرور زمان به دلیل اضافه وزن دچار مشکلاتی در زانو، لگن یا کمر می‌شوند.' },
        { title: 'عوارض بارداری و ناباروری', desc: 'چاقی در دوران بارداری خطر بروز عوارض در حین بارداری و زایمان را افزایش می‌دهد. علاوه بر این، اضافه وزن می‌تواند باروری را کاهش داده و باردار شدن را سخت‌تر کند.' },
        { title: 'سرطان', desc: 'افراد دارای اضافه وزن در معرض خطر بیشتری برای ابتلا به چندین بیماری سرطانی مانند سرطان رحم، تخمدان، سینه و پروستات قرار دارند.' },
        { title: 'زوال عقل (دمانس)', desc: 'چاقی مفرط همچنین می‌تواند خطر ابتلا به بیماری‌های زوال عقل مانند آلزایمر را در سنین بالاتر افزایش دهد.' }
      ],
      bmiFaqBtnShow: 'نمایش سوالات و پاسخ‌ها',
      bmiFaqBtnHide: 'پنهان کردن سوالات و پاسخ‌ها',
      bmiFaqTitle: 'سوالات و پاسخ‌ها',
      faqList: [
        {
          id: 1,
          q: 'چاقی مفرط (obesitas) چیست؟',
          a: 'چاقی مفرط یک بیماری است که در آن بدن درصد چربی غیرطبیعی و بسیار بالایی دارد که خطر ابتلا به چندین بیماری ثانویه دیگر را افزایش می‌دهد.'
        },
        {
          id: 2,
          q: 'تفاوت بین اضافه وزن و چاقی مفرط چیست؟',
          a: 'اضافه وزن به این معنی است که فرد کمی بیشتر از چربی مناسب برای بدن دارد. اما چاقی مفرط به سطح بالاتری از تجمع چربی اطلاق می‌شود که سلامت را به طور جدی‌تری تحت تأثیر قرار می‌دهد.'
        },
        {
          id: 3,
          q: 'آیا چاقی مفرط همیشه خطرناک است؟',
          a: 'چاقی مفرط خطر ابتلا به چندین بیماری را افزایش می‌دهد، اما میزان خطر آن به عوامل دیگری مانند سبک زندگی، رژیم غذایی و میزان فعالیت بدنی بستگی دارد.'
        },
        {
          id: 4,
          q: 'کالری مورد نیاز روزانه چقدر است؟ (نیاز انرژی بدن)',
          a: 'نحوه عملکرد نیازهای انرژی بدن: هر روز بدن برای حفظ فعالیت‌های خود از ضربان قلب گرفته تا افکاری که در ذهن می‌چرخند، انرژی مصرف می‌کند. غذایی که می‌خوریم سوختی است که ما را سرپا نگه می‌دارد. در اینجا نحوه عملکرد انرژی و کالری توضیح داده شده است.\n\nچه تعداد کالری باید در روز مصرف کنید؟\nتعداد کالری مورد نیاز روزانه به جنسیت، سن، اندازه بدن و سطح فعالیت بستگی دارد. بر اساس دستورالعمل‌های بهداشتی، می‌توانید از این راهنما برای دریافت انرژی روزانه استفاده کنید:'
        },
        {
          id: 5,
          q: 'میزان انرژی مواد مغذی مختلف در هر گرم چقدر است؟',
          a: 'مواد مغذی مختلف موجود در غذا مقادیر متفاوتی از انرژی را تأمین می‌کنند. بدن کالری خود را از پروتئین، کربوهیدرات‌ها، فیبر رژیمی، چربی و الکل دریافت می‌کند. در اینجا میزان انرژی دریافتی در هر گرم از هر ماده مغذی آورده شده است:'
        },
        {
          id: 6,
          q: 'تفاوت در انرژی و ارزش غذایی برای مواد خوراکی مختلف',
          a: 'مواد غذایی مختلف دارای مقادیر متفاوتی کالری هستند و تفاوت‌هایی بین میزان مواد مغذی که به بدن می‌دهند در مقایسه با میزان انرژی وجود دارد.\n\nانرژی همان کالری است که از کربوهیدرات‌ها، چربی، پروتئین و الکل به دست می‌آید. مواد مغذی به ویتامین‌ها و مواد معدنی گفته می‌شود که انرژی تولید نمی‌کنند اما برای عملکرد صحیح بدن و سلامت ما ضروری هستند.\n\nمواد غذایی با ارزش غذایی بالا: مقادیر زیادی مواد مغذی به ازای هر کالری تأمین می‌کنند. نمونه‌ها شامل سبزیجات، حبوبات، ماهی و محصولات غلات کامل است. این غذاها شما را به خوبی سیر نگه می‌دارند و بدن را تغذیه می‌کنند.\n\nمواد غذایی با انرژی بالا: حاوی کالری زیادی در هر گرم هستند اما کیفیت متفاوتی دارند. شیرینی‌ها، نوشابه‌ها و فست‌فودها نمونه‌هایی از غذاهایی هستند که انرژی زیادی اما مواد مغذی کمی دارند. با این حال، گزینه‌های پرانرژی و مغذی نیز وجود دارند. آجیل‌ها، روغن‌ها و لبنیات پرچرب نمونه‌هایی هستند که هم انرژی بالا و هم مواد مغذی حیاتی زیادی را تأمین می‌کنند.\n\nمثال: به تفاوت بین یک بشقاب میوه و یک تکه پیتزا فکر کنید که هر دو ممکن است حاوی حدود ۳۰۰ کیلوکالری باشند. میوه حجم، ویتامین‌ها و فیبر زیادی را فراهم می‌کند که شما را سیر نگه می‌دارد، در حالی که پیتزا همان میزان کالری را تأمین می‌کند اما ارزش غذایی و سیری بسیار کمتری به همراه دارد.\n\nبرای داشتن احساس خوب و حفظ وزن پایدار، عاقلانه است که مواد غذایی با ارزش غذایی بالا را اساس رژیم غذایی خود قرار دهید و کمتر از غذاهای پرانرژی و کم‌ارزش استفاده کنید. به این ترتیب، بدن بدون دریافت انرژی اضافی و غیرضروری، نیازهای خود را برآورده می‌کند. همچنین مصرف غذاهای متنوع برای دریافت تمام مواد مغذی حیاتی توصیه می‌شود.'
        },
        {
          id: 7,
          q: 'چگونه می‌توانید میزان انرژی دریافتی خود را اندازه‌گیری کنید؟',
          a: 'شما می‌توانید با تخمین کالری مصرفی، انرژی دریافتی خود را اندازه‌گیری کنید. دو نمونه از روش‌های انجام این کار خواندن برچسب‌های ارزش غذایی روی بسته‌بندی مواد غذایی یا استفاده از اپلیکیشن‌ها برای ثبت برنامه غذایی است.\n\nبرچسب‌های مواد غذایی و اطلاعات ارزش غذایی\nتقریباً روی همه مواد غذایی بسته‌بندی شده جدولی وجود دارد که انرژی و مواد مغذی موجود در محصول را نشان می‌دهد. این اطلاعات معمولاً بر اساس کیلوکالری (kcal) در هر ۱۰۰ گرم و گاهی به ازای هر وعده ذکر می‌شود.\n\nبا مقایسه مقداری که واقعاً می‌خورید با مقدار ذکر شده روی برچسب، می‌توانید کالری دریافتی خود را محاسبه کنید. همچنین بررسی سهم پروتئین، چربی و کربوهیدرات‌ها مهم است، زیرا این موارد بر میزان انرژی و احساس سیری تأثیر می‌گذارند.\n\nثبت کالری در اپلیکیشن‌ها\nاپلیکیشن‌هایی برای کمک به پیگیری انرژی دریافتی شما وجود دارند. این برنامه‌ها دارای پایگاه‌های داده بزرگی از مواد غذایی هستند و به طور خودکار کالری یک وعده غذایی را محاسبه می‌کنند. این می‌تواند ابزار بسیار خوبی در ابتدا برای درک انرژی غذاها باشد. در بسیاری از موارد می‌توانید بارکدها را اسکن کنید، غذاها را جستجو کنید یا دستورالعمل‌های خود را ثبت کنید.\n\nنکات مهم در اندازه‌گیری انرژی دریافتی\nبا وجود ابزارهای مفید، اندازه‌گیری دقیق انرژی دریافتی می‌تواند دشوار باشد. یک اشتباه رایج دست‌کم گرفتن اندازه وعده غذایی است. اگر در ابتدا غذای خود را وزن یا اندازه‌گیری کنید، به مرور زمان یاد خواهید گرفت که تخمین بهتری داشته باشید.\n\nنحوه آماده‌سازی غذا نیز نقش دارد، زیرا آب‌پز کردن، سرخ کردن یا پختن می‌تواند وزن و محتوای مغذی را تغییر دهد. علاوه بر این، متابولیسم و سطح فعالیت روزانه افراد متفاوت است که بر میزان جذب واقعی انرژی تأثیر می‌گذارد.'
        },
        {
          id: 8,
          q: 'چه زمانی بدن ممکن است از یک تغییر بهره‌مند شود؟',
          a: 'گاهی اوقات بدن پیام می‌دهد که زمان تغییر فرا رسیده است. ممکن است متوجه شوید که سطح انرژی شما مثل قبل نیست، خواب کیفیت خوبی ندارد یا با فعالیت سبک دچار تنگی نفس می‌شوید. این‌ها می‌توانند نشانه‌های فشار فیزیکی به بدن باشند.\n\nاگر عادات فعلی شما بر سلامتی‌تان تأثیر منفی می‌گذارد، زمان آن است که تغییراتی را در زندگی ایجاد کنید. گاهی اوقات این به معنای کاهش وزن است. اگر شاخص BMI یا اندازه دور کمر شما خطر ابتلا به بیماری‌ها را افزایش داده است، کاهش وزن گام مهمی برای سلامت بدن خواهد بود.\n\nاضافه وزن و چاقی مفرط می‌تواند از جهات مختلف بر بدن تأثیر بگذارد و خطر ابتلا به بیماری‌های قلبی عروقی، دیابت نوع ۲ و فشار خون بالا را افزایش دهد.'
        },
        {
          id: 9,
          q: 'اگر وزن خود را سریع کاهش دهید چه اتفاقی می‌افتد؟',
          a: 'اگر تصمیم به کاهش وزن گرفته‌اید، طبیعی است که بخواهید نتایج سریعی را ببینید. با این حال، سلامتی چیزی بیش از اعداد روی ترازو است. مهم‌ترین چیز ایجاد عادات پایدار و تعادل است.\n\nاگر وزن خود را خیلی سریع کاهش دهید، بدن ممکن است وارد «حالت بقا یا ذخیره انرژی» شود که در آن متابولیسم کاهش می‌یابد. این کار کاهش وزن مداوم را سخت‌تر و افزایش مجدد وزن را آسان‌تر می‌کند.\n\nیک هدف خوب، کاهش حدود ۰.۵ تا ۱ کیلوگرم در هفته است. این معمولاً مربوط به ایجاد کسری کالری متوسط در حدود ۵۰۰ تا ۱۰۰۰ کالری در روز است. این ممکن است کند به نظر برسد، اما سرعتی است که بدن می‌تواند بدون استرس آن را تحمل کند.'
        }
      ],
      buddyFinderTitle: 'یافتن هم‌تمرینی',
      buddyFinderDesc: 'در اینجا می‌توانید با افراد دیگری که به دنبال هم‌تمرینی هستند در ارتباط باشید. نام خود را در لیست ثبت کنید تا دیده شوید یا در میان هم‌تمرینی‌های موجود جستجو کنید!',
      buddyFormTitle: 'ایجاد پروفایل شما',
      buddyFormFullName: 'نام کامل',
      buddyFormAge: 'سن (سال)',
      buddyFormCity: 'شهر',
      buddyFormGym: 'در کدام باشگاه تمرین می‌کنید؟',
      buddyFormContact: 'اطلاعات تماس (مانند ایمیل، اینستاگرام، اسنپ‌چت یا تلفن)',
      buddyFormMessage: 'پیام (کمی درباره خودتان و نحوه تمرینتان بگویید)',
      buddyFormSubmit: 'ثبت اطلاعات هم‌تمرینی',
      buddyFormSuccess: 'پروفایل شما با موفقیت ثبت شد! با آرزوی موفقیت در یافتن هم‌تمرینی خود.',
      buddyListTitle: 'هم‌تمرینی‌های نزدیک شما',
      buddyListEmpty: 'هنوز هم‌تمرینی ثبت نام نکرده است. اولین نفر باشید!',
      buddySearchPlaceholder: 'جستجو بر اساس شهر یا باشگاه...',
      buddyContactBtn: 'راه‌های تماس',
      buddyAgeLabel: 'ساله',
      buddyGymLabel: 'باشگاه',

      // 404 Not Found
      notFoundTitle: 'صفحه یافت نشد',
      notFoundText: 'صفحه‌ای که به دنبال آن هستید وجود ندارد. ممکن است جابجا یا حذف شده باشد.',
      notFoundBtn: 'بازگشت به صفحه اصلی'
    }
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
