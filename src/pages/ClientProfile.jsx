import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { fetchClientProfile, fetchClientHistory } from '../services/api'
import {
  User, Mail, Phone, Calendar, Dumbbell, AlertCircle, LogOut,
  Send, CreditCard, ArrowRight, ArrowLeft, Star, Heart, Clock, UserCheck
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  EXERCISES,
  EQUIPMENT_MAPPING,
  DIFFICULTY_MAPPING,
  PROGRAM_STRUCTURE,
  SPLIT_MUSCLES,
  DAY_NAMES_SV,
  SPLIT_EMOJIS,
} from '../data/exercises'
import './ClientProfile.css'

// ─── Helpers for Program Builder ─────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildProgram({ trainingDays, equipment, experienceLevel, email = 'user' }) {
  const seedString = email || 'user';
  let h = 1779033703 ^ seedString.length;
  for (let i = 0; i < seedString.length; i++) {
    h = Math.imul(h ^ seedString.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  let seed = (h ^ 500) >>> 0;
  const rng = function() {
    let z = (seed += 0x6D2B79F5);
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };

  const shuffle = function(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const equipKey = EQUIPMENT_MAPPING[equipment] || EQUIPMENT_MAPPING['Fria vikter & maskiner']
  const diffLevels = DIFFICULTY_MAPPING[experienceLevel] || ['beginner', 'intermediate']
  const structure = PROGRAM_STRUCTURE[trainingDays] || PROGRAM_STRUCTURE['3']
  const { split } = structure

  const filtered = EXERCISES.filter(ex =>
    equipKey.includes(ex.equipment) && diffLevels.includes(ex.difficulty)
  )

  const weeks = [[], []]
  split.forEach((splitType, dayIdx) => {
    if (splitType === 'chest') {
      const chestExercises = [
        {
          id: 'pectorals/barbell-bench-press',
          name_en: 'Bench Press',
          name_es: 'Press de Banca con Barra',
          name_fa: 'پرس سینه با هالتر',
          name: 'Bench Press (Bänkpress)',
          equipment: 'barbell',
          body_part: 'chest',
          primary_muscles: ['pectoralis_major'],
          secondary_muscles: ['anterior_deltoid', 'triceps_brachii', 'serratus_anterior', 'latissimus_dorsi', 'rectus_abdominis'],
          sets: 3,
          reps: '8-10',
          rest: '50 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/barbell-bench-press.gif',
          isBenchPress: true,
          youtubeUrl: 'https://youtube.com/shorts/_FkbD0FhgVE?si=jGwqbrcEDRDnayYC',
          instructions_en: [
            'Ligg på rygg på bänken med fem kontaktpunkter: huvud, övre rygg och säte på bänken, samt båda fötterna stadigt i golvet.',
            'Greppa skivstången något bredare än axelbrett och dra ihop skulderbladen ("stoppa dem i bakfickorna").',
            'Sänk stången kontrollerat ner till bröstet utan att studsa, medan underarmarna hålls vertikala.',
            'Pressa stången kraftfullt uppåt till nästan helt utsträckta armar och håll spänningen i bröstmusklerna.'
          ],
          instructions: [
            'Ligg på rygg på bänken med fem kontaktpunkter: huvud, övre rygg och säte på bänken, samt båda fötterna stadigt i golvet.',
            'Greppa skivstången något bredare än axelbrett och dra ihop skulderbladen ("stoppa dem i bakfickorna").',
            'Sänk stången kontrollerat ner till bröstet utan att studsa, medan underarmarna hålls vertikala.',
            'Pressa stången kraftfullt uppåt till nästan helt utsträckta armar och håll spänningen i bröstmusklerna.'
          ],
          tips_en: [
            'Fem kontaktpunkter: Huvud, övre rygg och säte ska alltid vara i bänken, och båda fötterna ska vara stadigt i golvet ("foot drive").',
            'Dra ihop skulderbladen: Tänk att du ska "stoppa skulderbladen i bakfickorna". Det skapar en stabil bas och skyddar axlarna.',
            'Sänk kontrollerat: Låt inte stången studsa mot bröstet. Håll emot på vägen ner för att maximera muskeluppbyggnaden.',
            'Grepp: Håll stången så att underarmarna är vertikala (raka ner mot golvet) när stången nuddar bröstet.'
          ],
          note: 'Bench Press (Bänkpress) anses ofta vara "kungen" av överkroppsövningar. Det är en tung basövning (flerledsövning) som är den ultimata mätstocken för styrka i överkroppens pressmuskulatur.'
        },
        {
          id: 'pectorals/lever-seated-fly',
          name_en: 'Lever Seated Fly',
          name_es: 'Aperturas en Máquina Sentado',
          name_fa: 'قفسه سینه دستگاه',
          name: 'Lever Seated Fly (Pec Deck / Bröstflyes i maskin)',
          equipment: 'lever / maskin',
          body_part: 'chest',
          primary_muscles: ['pectoralis_major'],
          secondary_muscles: ['anterior_deltoid', 'serratus_anterior'],
          sets: 3,
          reps: '8-10',
          rest: '50 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/lever-seated-fly.gif',
          isLeverSeatedFly: true,
          youtubeUrl: 'https://youtube.com/shorts/a9vQ_hwIksU?si=EpSIPH4kTKREowSw',
          instructions_en: [
            'Sätt dig tillrätta i maskinen med rygg och huvud stadigt mot ryggstödet.',
            'Greppa handtagen med lätt böjda armar i brösthöjd.',
            'För handtagen samman framför kroppen genom att krama ihop bröstmusklerna.',
            'Pressa ihop i toppläget 1 sekund och återgå kontrollerat till startläget under motstånd.'
          ],
          instructions: [
            'Sätt dig tillrätta i maskinen med rygg och huvud stadigt mot ryggstödet.',
            'Greppa handtagen med lätt böjda armar i brösthöjd.',
            'För handtagen samman framför kroppen genom att krama ihop bröstmusklerna.',
            'Pressa ihop i toppläget 1 sekund och återgå kontrollerat till startläget under motstånd.'
          ],
          tips_en: [
            '"Krama ett träd": Föreställ dig att du ska krama ett stort träd. Håll armarna lätt böjda men stela.',
            'Pressa ihop: När händerna möts i mitten, tänk att du ska pressa ihop dina bröstmuskler så hårt du kan i en sekund.',
            'Sitt stadigt: Håll ryggen och huvudet mot ryggstödet. Undvik att skjuta fram axlarna när du pressar ihop.'
          ],
          note: 'Lever Seated Fly (ofta kallad "Pec Deck" eller bröstflyes i maskin) är en ren isolationsövning för bröstet. Här är en kort genomgång av varför den är ett utmärkt komplement till pressövningar.'
        },
        {
          id: 'pectorals/barbell-incline-bench-press',
          name_en: 'Incline Bench Press',
          name_es: 'Press Inclinado con Barra',
          name_fa: 'پرس بالا سینه با هالتر',
          name: 'Incline Bench Press (Lutande bänkpress)',
          equipment: 'barbell',
          body_part: 'chest',
          primary_muscles: ['pectoralis_major'],
          secondary_muscles: ['anterior_deltoid', 'triceps_brachii', 'serratus_anterior'],
          sets: 3,
          reps: '8-10',
          rest: '50 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/barbell-incline-bench-press.gif',
          isInclineBenchPress: true,
          youtubeUrl: 'https://youtube.com/shorts/98HWfiRonkE?si=XQXYyPGAWMhbFRd0',
          instructions_en: [
            'Ställ in bänken på ca 30 graders lutning och ligg med ryggen och huvudet stadigt mot ryggstödet.',
            'Greppa skivstången något bredare än axelbrett och lås skulderbladen genom att dra dem ihop och nedåt.',
            'Sänk stången kontrollerat mot den övre delen av bröstet, nära nyckelbenen.',
            'Pressa stången kraftfullt uppåt till nästan helt utsträckta armar utan att släppa anspänningen i övre bröstet.'
          ],
          instructions: [
            'Ställ in bänken på ca 30 graders lutning och ligg med ryggen och huvudet stadigt mot ryggstödet.',
            'Greppa skivstången något bredare än axelbrett och lås skulderbladen genom att dra dem ihop och nedåt.',
            'Sänk stången kontrollerat mot den övre delen av bröstet, nära nyckelbenen.',
            'Pressa stången kraftfullt uppåt till nästan helt utsträckta armar utan att släppa anspänningen i övre bröstet.'
          ],
          tips_en: [
            'Sänk stången högt: Vid vanlig bänkpress sänks stången mot mitten av bröstet; här sänks den mot den övre delen av bröstet, nära nyckelbenen.',
            'Lås skulderbladen: Precis som i vanlig bänkpress ska skulderbladen dras ihop och nedåt för att skapa en stabil bas och skydda axlarna.',
            'Vinkel på bänken: Överstiger lutningen 45 grader blir det mer av en ren axelövning. Håll dig runt 30 grader för att maximera kontakten med övre bröstet.'
          ],
          note: 'Incline Bench Press (Lutande bänkpress) är en tung basövning som flyttar belastningen högre upp på bröstkorgen jämfört med vanlig bänkpress. Den utförs på en bänk med ca 30–45 graders lutning.'
        },
        {
          id: 'pectorals/dumbbell-incline-bench-press',
          name_en: 'Dumbbell Incline Bench Press',
          name_es: 'Press Inclinado con Mancuernas',
          name_fa: 'پرس بالا سینه با دمبل',
          name: 'Dumbbell Incline Bench Press (Lutande hantelpress)',
          equipment: 'dumbbell',
          body_part: 'chest',
          primary_muscles: ['pectoralis_major'],
          secondary_muscles: ['anterior_deltoid', 'triceps_brachii'],
          sets: 3,
          reps: '8-10',
          rest: '50 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/dumbbell-incline-bench-press.gif',
          isDbInclineBenchPress: true,
          youtubeUrl: 'https://youtube.com/shorts/8fXfwG4ftaQ?si=2IzJxPUiwDYv7wu9',
          instructions_en: [
            'Sätt dig på en bänk med 30–45 graders lutning och håll en hantel i varje hand vilande mot låren.',
            'Sparka upp hantlarna en i taget och ligg bakåt med fötterna stadigt i golvet.',
            'Sänk hantlarna kontrollerat djupt så att du känner stretchen i övre bröstet.',
            'Pressa hantlarna uppåt i en båge tills de möts ovanför bröstet utan att slå ihop.'
          ],
          instructions: [
            'Sätt dig på en bänk med 30–45 graders lutning och håll en hantel i varje hand vilande mot låren.',
            'Sparka upp hantlarna en i taget och ligg bakåt med fötterna stadigt i golvet.',
            'Sänk hantlarna kontrollerat djupt så att du känner stretchen i övre bröstet.',
            'Pressa hantlarna uppåt i en båge tills de möts ovanför bröstet utan att slå ihop.'
          ],
          tips_en: [
            'Bänkvinkel: 30–45 grader är lagom. Mer än så och det blir nästan bara en axelövning.',
            'Sänk kontrollerat: Gå djupt så att du känner stretchen i bröstet, men utan att tappa kontrollen.',
            'Pressa ihop: Tänk att hantlarna ska mötas i en båge ovanför bröstet (utan att de slår ihop) för att få maximal kontakt.'
          ],
          note: 'Dumbbell Incline Bench Press (Lutande hantelpress) är en av de mest effektiva övningarna för att bygga en komplett och välutvecklad bröstmuskulatur. Genom att använda hantlar istället för skivstång får du både större rörelseomfång och bättre muskelbalans.'
        },
        {
          id: 'pectorals/dumbbell-bench-press',
          name_en: 'Dumbbell Bench Press',
          name_es: 'Press de Banca con Mancuernas',
          name_fa: 'پرس سینه با دمبل',
          name: 'Dumbbell Bench Press (Hantelbänkpress)',
          equipment: 'dumbbell',
          body_part: 'chest',
          primary_muscles: ['pectoralis_major'],
          secondary_muscles: ['anterior_deltoid', 'triceps_brachii'],
          sets: 3,
          reps: '8-10',
          rest: '50 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/dumbbell-bench-press.gif',
          isDbBenchPress: true,
          youtubeUrl: 'https://youtube.com/shorts/mTaiQemkEpU?si=pl6igO7GmeGDe2Xr',
          instructions_en: [
            'Sätt dig på en plan bänk och håll en hantel i varje hand vilande mot låren.',
            'Ligg bakåt med fötterna stadigt i golvet och dra ihop skulderbladen mot bänken.',
            'Sänk hantlarna kontrollerat mot brösthöjd tills du känner en fin stretch i bröstet.',
            'Pressa hantlarna uppåt i en lätt båge mot varandra utan att slå ihop dem i toppläget.'
          ],
          instructions: [
            'Sätt dig på en plan bänk och håll en hantel i varje hand vilande mot låren.',
            'Ligg bakåt med fötterna stadigt i golvet och dra ihop skulderbladen mot bänken.',
            'Sänk hantlarna kontrollerat mot brösthöjd tills du känner en fin stretch i bröstet.',
            'Pressa hantlarna uppåt i en lätt båge mot varandra utan att slå ihop dem i toppläget.'
          ],
          tips_en: [
            'Håll ihop skulderbladen: Skapa en stabil bas mot bänken.',
            'Kontrollerad sänkning: Gå djupt nog för att känna en stretch i bröstet, men utan att tappa kontrollen.',
            'Pressa ihop: Tänk att hantlarna ska röra sig mot varandra i toppläget (utan att slå ihop dem) för att verkligen spänna bröstet.'
          ],
          note: 'Dumbbell Bench Press (Hantelbänkpress) är ett av de mest effektiva alternativen till skivstångsbänkpress. Den ger en fantastisk kombination av muskeluppbyggnad, balans och rörlighet.'
        },
        {
          id: 'pectorals/cable-standing-fly',
          name_en: 'Cable Standing Fly',
          name_es: 'Aperturas de Pecho en Polea de Pie',
          name_fa: 'قفسه سینه سیم‌کش ایستاده',
          name: 'Cable Standing Fly (Cable Cross-over)',
          equipment: 'cable',
          body_part: 'chest',
          primary_muscles: ['pectoralis_major'],
          secondary_muscles: ['anterior_deltoid', 'serratus_anterior', 'rectus_abdominis'],
          sets: 3,
          reps: '8-10',
          rest: '50 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/cable-standing-fly.gif',
          isCableStandingFly: true,
          youtubeUrl: 'https://youtube.com/shorts/y4RJDSOBEl8?si=e61YTgFTsx8HVX_y',
          instructions_en: [
            'Stå i mitten av kabelmaskinen med kablarna fästa högt upp och ta ett kliv framåt i en split-stance position.',
            'Håll armarna i en fast, lätt böjd position (som om du kramar ett stort träd) och spänn bålen.',
            'Dra kablarna i en kontrollerad båge uppifrån och ned tills händerna möts framför nedre delen av bröstet.',
            'Kläm ihop bröstmusklerna kraftfullt i 1 sekund och släpp kontrollerat tillbaka till en stretch i bröstet.'
          ],
          instructions: [
            'Stå i mitten av kabelmaskinen med kablarna fästa högt upp och ta ett kliv framåt i en split-stance position.',
            'Håll armarna i en fast, lätt böjd position (som om du kramar ett stort träd) och spänn bålen.',
            'Dra kablarna i en kontrollerad båge uppifrån och ned tills händerna möts framför nedre delen av bröstet.',
            'Kläm ihop bröstmusklerna kraftfullt i 1 sekund och släpp kontrollerat tillbaka till en stretch i bröstet.'
          ],
          tips_en: [
            '"Krama ett träd": Håll armarna i en fast, lätt böjd position (som om du kramar ett stort träd).',
            'Stabilitet: Stå med en fot framför den andra (split stance) för att stå stadigt och undvika att gunga med överkroppen.',
            'Kläm ihop: Fokusera på att verkligen pressa ihop bröstmusklerna när händerna möts.'
          ],
          note: 'Cable Standing Fly (ofta kallat Cable Cross-over) är en av de absolut bästa isolationsövningarna för bröstet tack vare kabelmaskinens jämna motstånd.'
        },
        {
          id: 'pectorals/push-up',
          name_en: 'Push-up',
          name_es: 'Flexiones de Pecho',
          name_fa: 'شنا سوئدی',
          name: 'Push-up (Armhävning)',
          equipment: 'kroppsvikt',
          body_part: 'chest',
          primary_muscles: ['pectoralis_major'],
          secondary_muscles: ['anterior_deltoid', 'triceps_brachii', 'rectus_abdominis', 'serratus_anterior'],
          sets: 3,
          reps: '8-10',
          rest: '40 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/push-up.gif',
          isPushUp: true,
          youtubeUrl: 'https://youtube.com/shorts/GHJgsTIW_bQ?si=1QAZVoENKTMIAYJe',
          instructions_en: [
            'Starta i en hög plankposition med händerna placerade något bredare än axelbrett och kroppen spikrak.',
            'Spänn sätet och bålen för att hålla en stabil planka utan att höften hänger ner eller rumpan pekar upp.',
            'Sänk kroppen kontrollerat tills bröstet nästan nudder golvet, hålla armbågarna i ca 45 graders vinkel från kroppen.',
            'Pressa dig kraftfullt uppåt till helt utsträckta armar i toppläget.'
          ],
          instructions: [
            'Starta i en hög plankposition med händerna placerade något bredare än axelbrett och kroppen spikrak.',
            'Spänn sätet och bålen för att hålla en stabil planka utan att höften hänger ner eller rumpan pekar upp.',
            'Sänk kroppen kontrollerat tills bröstet nästan nudder golvet, hålla armbågarna i ca 45 graders vinkel från kroppen.',
            'Pressa dig kraftfullt uppåt till helt utsträckta armar i toppläget.'
          ],
          tips_en: [
            'Kroppen som en planka: Spänn sätet och magen. Höften får inte hänga ner mot golvet och rumpan ska inte peka upp i vädret.',
            'Armbågarnas vinkel: Låt inte armbågarna peka rakt ut åt sidorna (T-form). Håll dem i ca 45 graders vinkel från kroppen (pil-form) för att skona axlarna.',
            'Hela vägen: Bröstet ska nästan nudda golvet och armarna ska sträckas ut helt i toppläget.'
          ],
          note: 'Push-up (Armhävning) är den ultimata kroppsviktsövningen för överkroppen. Det är en basövning som tränar hela framsidan av kroppen samtidigt.'
        },
        {
          id: 'pectorals/smith-incline-bench-press',
          name_en: 'Smith Incline Bench Press',
          name_es: 'Press Inclinado i Smith Machine',
          name_fa: 'پرس بالا سینه اسمیت',
          name: 'Smith Incline Bench Press (Lutande bänkpress i Smith-maskin)',
          equipment: 'smith',
          body_part: 'chest',
          primary_muscles: ['pectoralis_major'],
          secondary_muscles: ['anterior_deltoid', 'triceps_brachii', 'serratus_anterior'],
          sets: 3,
          reps: '8-10',
          rest: '40 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/smith-incline-bench-press.gif',
          isSmithInclineBenchPress: true,
          youtubeUrl: 'https://youtube.com/shorts/VXaBbUYMfIs?si=AhwpUGUt0k7eqsKY',
          instructions_en: [
            'Placera den lutande bänken precis mitt under stången i Smith-maskinen.',
            'Greppa stången något bredare än axelbrett och tryck ner skulderbladen i bänken.',
            'Lossa stången och sänk den kontrollerat mot den övre delen av bröstet, strax under nyckelbenen.',
            'Pressa stången kraftfullt uppåt till nästan helt utsträckta armar och lås fast stången efter avslutade rep.'
          ],
          instructions: [
            'Placera den lutande bänken precis mitt under stången i Smith-maskinen.',
            'Greppa stången något bredare än axelbrett och tryck ner skulderbladen i bänken.',
            'Lossa stången och sänk den kontrollerat mot den övre delen av bröstet, strax under nyckelbenen.',
            'Pressa stången kraftfullt uppåt till nästan helt utsträckta armar och lås fast stången efter avslutade rep.'
          ],
          tips_en: [
            'Positionering: Se till att bänken står precis mitt under stången. Stången ska sänkas mot den övre delen av bröstet, strax under nyckelbenen.',
            'Skulderbladen: Dra ihop skulderbladen och tryck ner dem i bänken för att skydda axlarna och skapa en stabil plattform.',
            'Grepp: Håll ett grepp som är något bredare än axelbrett så att underarmarna är vertikala i bottenläget.'
          ],
          note: 'Smith Incline Bench Press (Lutande bänkpress i Smith-maskin) är en suverän övning för att bygga den övre delen av bröstmuskulaturen med maximal stabilitet och säkerhet.'
        },
        { id: 'pectorals/lever-incline-fly', name_en: 'Lever Incline Fly (male)', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/lever-seated-fly.gif' },
        {
          id: 'pectorals/lever-chest-press',
          name_en: 'Lever Chest Press',
          name_es: 'Press de Pecho en Máquina Sentado',
          name_fa: 'پرس سینه دستگاه نشسته',
          name: 'Lever Chest Press (Sittande bröstpress i maskin)',
          equipment: 'lever / maskin',
          body_part: 'chest',
          primary_muscles: ['pectoralis_major'],
          secondary_muscles: ['anterior_deltoid', 'triceps_brachii', 'serratus_anterior'],
          sets: 3,
          reps: '8-10',
          rest: '40 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/lever-chest-press.gif',
          isLeverChestPress: true,
          youtubeUrl: 'https://youtube.com/shorts/hkU6fSHcslw?si=8coxD_1yKwA1k8St',
          instructions_en: [
            'Justera sitsen så att handtagen hamnar i höjd med mitten eller nedre delen av bröstet.',
            'Sätt dig stadigt, dra ihop skulderbladen och tryck ner dem mot ryggstödet.',
            'Pressa handtagen kraftfullt framåt tills armarna är nästan helt utsträckta.',
            'Håll emot kontrollerat på vägen tillbaka i den excentriska fasen utan att tappa anspänningen.'
          ],
          instructions: [
            'Justera sitsen så att handtagen hamnar i höjd med mitten eller nedre delen av bröstet.',
            'Sätt dig stadigt, dra ihop skulderbladen och tryck ner dem mot ryggstödet.',
            'Pressa handtagen kraftfullt framåt tills armarna är nästan helt utsträckta.',
            'Håll emot kontrollerat på vägen tillbaka i den excentriska fasen utan att tappa anspänningen.'
          ],
          tips_en: [
            'Dra bak axlarna: Innan du börjar, dra ihop skulderbladen och tryck ner dem. Håll kvar dem mot ryggstödet under hela setet för att skydda axlarna och låta bröstet göra jobbet.',
            'Inställning av sitsen: Justera sitsen så att handtagen är i höjd med mitten eller nedre delen av ditt bröst.',
            'Håll emot: Var noga med att hålla emot vikten på vägen tillbaka (excentrisk fas). Det är där mycket av muskeluppbyggnaden sker!'
          ],
          note: 'Lever Chest Press (Sittande bröstpress i maskin) är en kraftfull basövning för överkroppen som låter dig träna bröstmuskulaturen med hög belastning och maximal säkerhet.'
        },
        {
          id: 'pectorals/incline-push-up',
          name_en: 'Elevated Push-up',
          name_es: 'Flexiones Inclinadas en Banco',
          name_fa: 'شنا سوئدی شیب‌دار (دست بالا)',
          name: 'Elevated Push-up (Incline Push-up)',
          equipment: 'kroppsvikt / bänk',
          body_part: 'chest',
          primary_muscles: ['pectoralis_major'],
          secondary_muscles: ['triceps_brachii', 'anterior_deltoid', 'rectus_abdominis'],
          sets: 3,
          reps: '8-10',
          rest: '40 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/incline-push-up.gif',
          isElevatedPushUp: true,
          youtubeUrl: 'https://youtube.com/shorts/7f8JOu0i1cQ?si=are7DprNqnKHRX36',
          instructions_en: [
            'Placera händerna på en stabil bänk eller steplåda något bredare än axelbrett.',
            'Sträck ut benen bakåt och spänn sätet och magen så att kroppen bildar en rak planka.',
            'Sänk bröstet kontrollerat tills det nästan nuddar kanten på bänken, hålla armbågarna i ca 45 graders vinkel.',
            'Pressa dig kraftfullt uppåt till helt utsträckta armar utan att låta höften svanka.'
          ],
          instructions: [
            'Placera händerna på en stabil bänk eller steplåda något bredare än axelbrett.',
            'Sträck ut benen bakåt och spänn sätet och magen så att kroppen bildar en rak planka.',
            'Sänk bröstet kontrollerat tills det nästan nuddar kanten på bänken, hålla armbågarna i ca 45 graders vinkel.',
            'Pressa dig kraftfullt uppåt till helt utsträckta armar utan att låta höften svanka.'
          ],
          tips_en: [
            'Kroppskontroll: Precis som i en vanlig armhävning ska kroppen vara spikrak från huvud till häl. Låt inte höften svanka eller peka uppåt.',
            'Sänk bröstet mot kanten: Sänk dig kontrollerat tills bröstet nästan nuddar kanten på steplådan/bänken.',
            'Armbågsvinkel: Håll armbågarna i ca 45 graders vinkel från kroppen (inte rakt ut åt sidorna) för att skydda axlarna.'
          ],
          note: 'Elevated Push-up (ibland kallad Incline Push-up) är en variant av armhävningar där du placerar händerna på en upphöjd yta, som en bänk eller en steplåda. Detta är en utmärkt övning för att anpassa svårighetsgraden och ändra vinkeln på bröstträningen.'
        },
        {
          id: 'pectorals/lever-decline-chest-press',
          name_en: 'Lever Lying Chest Press',
          name_es: 'Press de Pecho en Máquina Inclinada',
          name_fa: 'پرس سینه شیب‌دار دستگاه',
          name: 'Lever Lying Chest Press (Incline Lever Press)',
          equipment: 'lever / maskin',
          body_part: 'chest',
          primary_muscles: ['pectoralis_major'],
          secondary_muscles: ['anterior_deltoid', 'triceps_brachii', 'serratus_anterior'],
          sets: 3,
          reps: '8-10',
          rest: '40 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/lever-decline-chest-press.gif',
          isInclineLeverPress: true,
          youtubeUrl: 'https://youtube.com/shorts/T0huVIujERo?si=Km-defgSxGdPUe78',
          instructions_en: [
            'Sätt dig djupt i sätet, tryck bak axlarna mot ryggstödet och greppa maskinens handtag.',
            'Håll bröstet högt och spänn bålen för maximal stabilitet.',
            'Pressa handtagen snett uppåt/framåt i en kontrollerad rörelse utan att smälla fast armbågarna i toppläget.',
            'Bromsa rörelsen sakta på vägen tillbaka (excentrisk fas) för att maximera muskeltillväxten.'
          ],
          instructions: [
            'Sätt dig djupt i sätet, tryck bak axlarna mot ryggstödet och greppa maskinens handtag.',
            'Håll bröstet högt och spänn bålen för maximal stabilitet.',
            'Pressa handtagen snett uppåt/framåt i en kontrollerad rörelse utan att smälla fast armbågarna i toppläget.',
            'Bromsa rörelsen sakta på vägen tillbaka (excentrisk fas) för att maximera muskeltillväxten.'
          ],
          tips_en: [
            'Sitt djupt i sätet: Tryck bak axlarna och håll bröstet högt under hela rörelsen.',
            'Håll emot: Var noga med att inte låta vikten "falla" tillbaka. Bromsa rörelsen på vägen ner för att maximera muskeltillväxten.',
            'Lås inte ut helt: Undvik att "smälla" fast armbågarna i rakt läge; håll en liten mikroböj i toppen för att behålla spänningen i muskeln.'
          ],
          note: 'Lever Lying Chest Press (här i en lutande variant, ofta kallad Incline Lever Press) är en maskinövning som fokuserar på överkroppens pressmuskulatur med hög stabilitet.'
        },
        { id: 'pectorals/cable-middle-fly', name_en: 'Cable Middle Fly', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/cable-middle-fly.gif' },
        { id: 'pectorals/dumbbell-fly', name_en: 'Dumbbell Fly', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/dumbbell-fly.gif' },
        { id: 'pectorals/cable-low-fly', name_en: 'Cable Low Fly', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/cable-low-fly.gif' },
        { id: 'pectorals/dumbbell-around-pullover', name_en: 'Dumbbell Flat Around the World', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/dumbbell-around-pullover.gif' }
      ];

      const mapped = chestExercises.map(ex => {
        const original = EXERCISES.find(e => e.id === ex.id) || {};
        return {
          ...original,
          id: ex.id,
          name_en: ex.name_en,
          name_es: original.name_es || ex.name_en,
          name_fa: original.name_fa || ex.name_en,
          name_es: ex.name_es || original.name_es || ex.name_en,
          name_fa: original.name_fa || ex.name_en,
          name: ex.name || ex.name_en,
          rest: ex.rest || '50 sek',
          note: ex.note || original.note || '',
          gifUrl: ex.gifUrl,
          instructions: ex.instructions || original.instructions || [],
          tips_en: ex.tips_en || original.tips_en || [],
          youtubeUrl: ex.youtubeUrl || original.youtubeUrl || '',
          isBenchPress: ex.isBenchPress,
          isLeverSeatedFly: ex.isLeverSeatedFly,
          isInclineBenchPress: ex.isInclineBenchPress,
          isDbInclineBenchPress: ex.isDbInclineBenchPress,
          isDbBenchPress: ex.isDbBenchPress,
          isCableStandingFly: ex.isCableStandingFly,
          isPushUp: ex.isPushUp,
          isSmithInclineBenchPress: ex.isSmithInclineBenchPress,
          isLeverChestPress: ex.isLeverChestPress,
          isElevatedPushUp: ex.isElevatedPushUp,
          isInclineLeverPress: ex.isInclineLeverPress,
          equipment: original.equipment || (ex.id.includes('barbell') ? 'barbell' : ex.id.includes('dumbbell') ? 'dumbbell' : ex.id.includes('cable') ? 'cable' : 'none'),
          sets: ex.sets,
          reps: ex.reps,
          images: {
            classic: { start: ex.gifUrl, peak: ex.gifUrl },
            flat: { start: ex.gifUrl, peak: ex.gifUrl }
          },
          instructions_en: original.instructions_en || [
            `Setup with proper posture for ${ex.name_en}.`,
            `Perform the eccentric phase with control.`,
            `Squeeze the target chest muscles at the peak contraction.`,
            `Return to starting position.`
          ]
        };
      });

      weeks[0].push({
        day: dayIdx + 1,
        splitType,
        exercises: mapped.map(ex => ({ ...ex, week: 1 }))
      });

      weeks[1].push({
        day: dayIdx + 1,
        splitType,
        exercises: mapped.map(ex => {
          let sets = ex.sets;
          let reps = ex.reps;
          if (ex.id !== 'pectorals/push-up') {
            sets = ex.sets + 1;
          }
          return { ...ex, sets, reps, week: 2 };
        })
      });
      return;
    }

    if (splitType === 'back') {
      const wideGripPullUpEx = {
        id: 'back/wide-grip-pull-up',
        name_en: 'Wide-Grip Pull-Up',
        name_es: 'Dominada con Agarre Ancho',
        name: 'Wide-Grip Pull-Up',
        equipment: 'pull_up_bar',
        body_part: 'back',
        primary_muscles: ['latissimus_dorsi'],
        secondary_muscles: ['biceps_brachii', 'teres_major', 'rhomboids', 'posterior_deltoid'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/pullup.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/pullup.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/pullup.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/pullup.gif' }
        },
        instructions_en: [
          'Häng från en stång med ett överhandsgrepp bredare än axelbredd.',
          'Dra dig uppåt tills hakan är över stången.',
          'Kläm åt ryggmusklerna (latsen) i toppläget.',
          'Sänk dig långsamt och kontrollerat tillbaka till startläget.'
        ],
        instructions: [
          'Häng från en stång med ett överhandsgrepp bredare än axelbredd.',
          'Dra dig uppåt tills hakan är över stången.',
          'Kläm åt ryggmusklerna (latsen) i toppläget.',
          'Sänk dig långsamt och kontrollerat tillbaka till startläget.'
        ],
        youtubeUrl: 'https://youtube.com/shorts/ym1V5H35IpA?si=X5u-0nuuOI5Oji7M',
        rest: '1.5-2 min',
        targetWeight: 'Kroppsvikt',
        note: 'Fokus på full rörlighet. Använd gummiband eller maskin om det är för tungt.'
      };

      const barbellReverseGripRowEx = {
        id: 'back/barbell-reverse-grip-row',
        name_en: 'Barbell Reverse Grip Bent over Row',
        name_es: 'Remo con Barra Invertido',
        name: 'Barbell Reverse Grip Bent over Row',
        equipment: 'barbell',
        body_part: 'back',
        primary_muscles: ['latissimus_dorsi'],
        secondary_muscles: ['biceps_brachii', 'trapezius', 'rhomboids', 'erector_spinae'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/barbell-bent-over-row.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/barbell-bent-over-row.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/barbell-bent-over-row.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/barbell-bent-over-row.gif' }
        },
        instructions_en: [
          'Greppa skivstången med ett underhandsgrepp (handflatorna framåt/uppåt), axelbrett grepp.',
          'Luta dig framåt i ca 45-70 graders vinkel med rak rygg och spänd bål.',
          'Dra stången uppåt mot nedre delen av magen genom att dra armbågarna bakom ryggen.',
          'Sänk stången kontrollerat tillbaka till startläget.'
        ],
        instructions: [
          'Greppa skivstången med ett underhandsgrepp (handflatorna framåt/uppåt), axelbrett grepp.',
          'Luta dig framåt i ca 45-70 graders vinkel med rak rygg och spänd bål.',
          'Dra stången uppåt mot nedre delen av magen genom att dra armbågarna bakom ryggen.',
          'Sänk stången kontrollerat tillbaka till startläget.'
        ],
        youtubeUrl: 'https://youtu.be/bm0_q9bR_HA?si=UX_xbmush3HqSbCs',
        rest: '1.5-2 min',
        targetWeight: 'Skivstång',
        sets: 3,
        reps: '8-10',
        isBarbellReverseGripRow: true,
        note: 'Skivstångs omvänd grepp böjd rodd (Yates Row) är en underbar basövning för ryggens tjocklek och nedre lats.'
      };

      const cablePulldownEx = {
        id: 'back/cable-pulldown',
        name_en: 'Cable Pulldown',
        name_es: 'Jalón al Pecho',
        name: 'Cable Pulldown',
        equipment: 'cable',
        body_part: 'back',
        primary_muscles: ['latissimus_dorsi'],
        secondary_muscles: ['biceps_brachii', 'trapezius', 'rhomboids', 'posterior_deltoid'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/lat-pulldown.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/lat-pulldown.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/lat-pulldown.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/lat-pulldown.gif' }
        },
        instructions_en: [
          'Greppa stången med ett brett överhandsgrepp och sätt dig stadigt med benen under kuddarna.',
          'Håll en stolt bröstkorg och luta dig aningen bakåt.',
          'Starta rörelsen genom att dra ner skulderbladen, tryck sedan armbågarna rakt ner mot golvet tills stången nuddar övre bröstet.',
          'Släpp långsamt och kontrollerat upp stången till startläget för full stretch i latsen.'
        ],
        instructions: [
          'Greppa stången med ett brett överhandsgrepp och sätt dig stadigt med benen under kuddarna.',
          'Håll en stolt bröstkorg och luta dig aningen bakåt.',
          'Starta rörelsen genom att dra ner skulderbladen, tryck sedan armbågarna rakt ner mot golvet tills stången nuddar övre bröstet.',
          'Släpp långsamt och kontrollerat upp stången till startläget för full stretch i latsen.'
        ],
        youtubeUrl: 'https://youtube.com/shorts/bNmvKpJSWKM?si=Yctan_lbVbv1kpdd',
        rest: '1.5 min',
        targetWeight: 'Kabel',
        sets: 3,
        reps: '8-10',
        isCablePulldown: true,
        note: 'Kabelneddragning (latsdrag) är en av de mest fundamentala övningarna för att bygga en bred och stark rygg.'
      };

      const cableReverseGripPulldownEx = {
        id: 'back/cable-reverse-grip-pulldown',
        name_en: 'Cable Reverse Grip Pulldown',
        name_es: 'Jalón Invertido al Pecho',
        name: 'Cable Reverse Grip Pulldown',
        equipment: 'cable',
        body_part: 'back',
        primary_muscles: ['latissimus_dorsi'],
        secondary_muscles: ['biceps_brachii', 'trapezius', 'rhomboids', 'pectoralis_major'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/underhand-pulldown.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/underhand-pulldown.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/underhand-pulldown.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/underhand-pulldown.gif' }
        },
        instructions_en: [
          'Greppa stången med ett axelbrett underhandsgrepp (handflatorna mot dig) och sätt dig till rätta.',
          'Håll armbågarna nära kroppen och dra stången kontrollerat till övre bröstet/hakan.',
          'Kläm ihop ryggmusklerna i toppläget, undvik att rulla fram axlarna.',
          'Släpp upp stången kontrollerat hela vägen för en full stretch i latsen.'
        ],
        instructions: [
          'Greppa stången med ett axelbrett underhandsgrepp (handflatorna mot dig) och sätt dig till rätta.',
          'Håll armbågarna nära kroppen och dra stången kontrollerat till övre bröstet/hakan.',
          'Kläm ihop ryggmusklerna i toppläget, undvik att rulla fram axlarna.',
          'Släpp upp stången kontrollerat hela vägen för en full stretch i latsen.'
        ],
        youtubeUrl: 'https://youtube.com/shorts/E3Ub7nQu6zc?si=7mpekwkzHOqC3Rxm',
        rest: '1.5 min',
        targetWeight: 'Kabel',
        sets: 3,
        reps: '8-10',
        isCableReverseGripPulldown: true,
        note: 'Kabel omvänd greppdragning är en underbar basövning för ryggens tjocklek och nedre lats.'
      };

                                    const cableLowSeatedRowEx = {
        id: 'back/cable-low-seated-row',
        name_en: 'Cable Low Seated Row',
        name_es: 'Remo Bajo Sentado',
        name: 'Cable Low Seated Row',
        equipment: 'cable',
        body_part: 'back',
        primary_muscles: ['trapezius', 'rhomboids', 'latissimus_dorsi'],
        secondary_muscles: ['posterior_deltoid', 'biceps_brachii', 'erector_spinae'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/upper-back/cable-low-seated-row.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/upper-back/cable-low-seated-row.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/upper-back/cable-low-seated-row.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/upper-back/cable-low-seated-row.gif' }
        },
        instructions_en: [
          'Sitt med fötterna på stöden, böj lätt på knäna och greppa handtaget med neutralt grepp.',
          'Håll ryggen stabil och rak, luta dig inte framåt eller bakåt under rörelsen.',
          'Dra handtaget kontrollerat mot midjan genom att dra armbågarna tätt intill kroppen och bakåt.',
          'Kläm ihop skulderbladen i toppläget, återgå sedan kontrollerat till startläget.'
        ],
        instructions: [
          'Sitt med fötterna på stöden, böj lätt på knäna och greppa handtaget med neutralt grepp.',
          'Håll ryggen stabil och rak, luta dig inte framåt eller bakåt under rörelsen.',
          'Dra handtaget kontrollerat mot midjan genom att dra armbågarna tätt intill kroppen och bakåt.',
          'Kläm ihop skulderbladen i toppläget, återgå sedan kontrollerat till startläget.'
        ],
        youtubeUrl: 'https://youtu.be/sjJ0z4R3w0M?si=7nQkFOtDHUFZBhYJ',
        rest: '1.5 min',
        targetWeight: 'Kabel',
        sets: 3,
        reps: '8-10',
        isCableLowSeatedRow: true,
        note: 'Låg sittande rad fokuserar på ryggens tjocklek, djup och detaljer.'
      };

      const cableNeutralGripLatPulldownEx = {
        id: 'back/cable-neutral-grip-lat-pulldown',
        name_en: 'Cable Neutral Grip Lat Pulldown',
        name_es: 'Jalón con Agarre Neutral',
        name: 'Cable Neutral Grip Lat Pulldown',
        equipment: 'cable',
        body_part: 'back',
        primary_muscles: ['latissimus_dorsi', 'biceps_brachii'],
        secondary_muscles: ['trapezius', 'rhomboids', 'posterior_deltoid', 'teres_major', 'brachialis'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pulldown-pro-lat-bar.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pulldown-pro-lat-bar.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pulldown-pro-lat-bar.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pulldown-pro-lat-bar.gif' }
        },
        instructions_en: [
          'Sitt upprätt i maskinen och greppa de parallella handtagen med handflatorna mot varandra.',
          'Luta dig aningen bakåt för att ge plats åt handtaget och maximera ryggaktiveringen.',
          'Dra stången/handtaget kontrollerat nedåt genom att dra armbågarna nära kroppen och rakt bakåt.',
          'Låt armarna sträckas ut helt i toppläget för en kontrollerad stretch i latsen.'
        ],
        instructions: [
          'Sitt upprätt i maskinen och greppa de parallella handtagen med handflatorna mot varandra.',
          'Luta dig aningen bakåt för att ge plats åt handtaget och maximera ryggaktiveringen.',
          'Dra stången/handtaget kontrollerat nedåt genom att dra armbågarna nära kroppen och rakt bakåt.',
          'Låt armarna sträckas ut helt i toppläget för en kontrollerad stretch i latsen.'
        ],
        youtubeUrl: 'https://youtube.com/shorts/Zzuxkjv0HJo?si=qEAbdIIJ_cmPA1eD',
        rest: '1.5 min',
        targetWeight: 'Kabel',
        sets: 3,
        reps: '8-10',
        isCableNeutralGripLatPulldown: true,
        note: 'Latsdrag med neutralt grepp/handflatorna mot varandra är skonsamt för axlarna och fokuserar på latsens djup.'
      };

      const leverAlternatingNarrowGripSeatedRowEx = {
        id: 'back/lever-alternating-narrow-grip-seated-row',
        name_en: 'Lever Alternating Narrow Grip Seated Row',
        name_es: 'Remo Alterno en Hävarm',
        name: 'Lever Alternating Narrow Grip Seated Row',
        equipment: 'lever',
        body_part: 'back',
        primary_muscles: ['latissimus_dorsi', 'rhomboids', 'trapezius'],
        secondary_muscles: ['posterior_deltoid', 'biceps_brachii', 'obliques'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/upper-back/lever-alternating-narrow-grip-seated-row.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/upper-back/lever-alternating-narrow-grip-seated-row.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/upper-back/lever-alternating-narrow-grip-seated-row.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/upper-back/lever-alternating-narrow-grip-seated-row.gif' }
        },
        instructions_en: [
          'Sitt upprätt i maskinen med bröstet mot dynan och ta ett neutralt grepp om handtagen.',
          'Dra kontrollerat ena handtaget bakåt mot magen genom att föra armbogen bakom kroppen, håll den andra armen sträckt.',
          'Kläm åt ryggmusklerna i toppläget, håll överkroppen helt stilla utan rotation.',
          'Återgå långsamt till startläget och växla (alternera) arm på nästa repetition.'
        ],
        instructions: [
          'Sitt upprätt i maskinen med bröstet mot dynan och ta ett neutralt grepp om handtagen.',
          'Dra kontrollerat ena handtaget bakåt mot magen genom att föra armbogen bakom kroppen, håll den andra armen sträckt.',
          'Kläm åt ryggmusklerna i toppläget, håll överkroppen helt stilla utan rotation.',
          'Återgå långsamt till startläget och växla (alternera) arm på nästa repetition.'
        ],
        youtubeUrl: 'https://youtube.com/shorts/-q4OkPSL2AA?si=VJZtB2fp20hSeQR4',
        rest: '1.5 min',
        targetWeight: 'Maskin',
        sets: 3,
        reps: '8-10',
        isLeverAlternatingNarrowGripSeatedRow: true,
        note: 'Alternerande maskinrodd med smalt grepp jämnar ut styrkeobalanser och tränar bålstabilitet.'
      };

      const leverBentOverRowVbarEx = {
        id: 'back/lever-bent-over-row-vbar',
        name_en: 'Lever Bent-over Row with V-bar',
        name_es: 'Remo en T con Agarre en V',
        name: 'Lever Bent-over Row with V-bar',
        equipment: 'lever',
        body_part: 'back',
        primary_muscles: ['latissimus_dorsi', 'trapezius', 'rhomboids'],
        secondary_muscles: ['teres_major', 'posterior_deltoid', 'biceps_brachii', 'erector_spinae'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/upper-back/lever-bent-over-row-with-v-bar.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/upper-back/lever-bent-over-row-with-v-bar.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/upper-back/lever-bent-over-row-with-v-bar.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/upper-back/lever-bent-over-row-with-v-bar.gif' }
        },
        instructions_en: [
          'Ställ dig över stången med ett neutralt grepp om V-handtaget (handflatorna mot varandra).',
          'Håll bröstet uppe och ryggen helt rak, luta dig framåt i ca 45 grader vinkel.',
          'Starta rörelsen genom att dra ihop skulderbladen och dra stången kontrollerat uppåt mot magen genom att dra armbågarna bakom ryggen.',
          'Sänk stången kontrollerat hela vägen tillbaka till startläget för full stretch i ryggen.'
        ],
        instructions: [
          'Ställ dig över stången med ett neutralt grepp om V-handtaget (handflatorna mot varandra).',
          'Håll bröstet uppe och ryggen helt rak, luta dig framåt i ca 45 grader vinkel.',
          'Starta rörelsen genom att dra ihop skulderbladen och dra stången kontrollerat uppåt mot magen genom att dra armbågarna bakom ryggen.',
          'Sänk stången kontrollerat hela vägen tillbaka till startläget för full stretch i ryggen.'
        ],
        youtubeUrl: 'https://youtube.com/shorts/Sr2q7i-i8X0?si=ClUKyV1Jo9hj0QYt',
        rest: '1.5-2 min',
        targetWeight: 'Skivstång/Maskin',
        sets: 3,
        reps: '8-10',
        isLeverBentOverRowVbar: true,
        note: 'T-Bar Row (T-stångsrodd med V-handtag) är en av de absolut bästa övningarna för att bygga en tät och bred rygg.'
      };

      const cableLateralPulldownVbarEx = {
        id: 'back/cable-lateral-pulldown-vbar',
        name_en: 'Cable Lateral Pulldown with V-bar',
        name_es: 'Jalón con Agarre en V',
        name: 'Cable Lateral Pulldown with V-bar',
        equipment: 'cable',
        body_part: 'back',
        primary_muscles: ['latissimus_dorsi'],
        secondary_muscles: ['biceps_brachii', 'rhomboids', 'trapezius', 'posterior_deltoid'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lateral-pulldown-with-v-bar.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lateral-pulldown-with-v-bar.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lateral-pulldown-with-v-bar.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lateral-pulldown-with-v-bar.gif' }
        },
        instructions_en: [
          'Sätt dig till rätta i latsdragmaskinen och greppa V-handtaget med ett neutralt grepp.',
          'Luta dig aningen bakåt för att ge plats åt handtaget att nå övre bröstet.',
          'Dra kontrollerat ner handtaget till övre delen av bröstkorgen och kläm ihop skulderbladen.',
          'Låt vikten kontrollerat dra upp armarna i toppläget för en djup stretch i latsen.'
        ],
        instructions: [
          'Sätt dig till rätta i latsdragmaskinen och greppa V-handtaget med ett neutralt grepp.',
          'Luta dig aningen bakåt för att ge plats åt handtaget att nå övre bröstet.',
          'Dra kontrollerat ner handtaget till övre delen av bröstkorgen och kläm ihop skulderbladen.',
          'Låt vikten kontrollerat dra upp armarna i toppläget för en djup stretch i latsen.'
        ],
        youtubeUrl: 'https://youtube.com/shorts/uyQHzP02ZAw?si=fJ2nQXFxx5_0EIOG',
        rest: '1.5 min',
        targetWeight: 'Kabel',
        sets: 3,
        reps: '8-10',
        isCableLateralPulldownVbar: true,
        note: 'Kabel lateral neddragning med V-stång fokuserar extra mycket på mellersta och nedre lats samt ryggens tjocklek.'
      };

      const straightBackSeatedRowEx = {
        id: 'back/straight-back-seated-row',
        name_en: 'Straight Back Seated Row',
        name_es: 'Remo Sentado con Espalda Recta',
        name: 'Straight Back Seated Row',
        equipment: 'cable',
        body_part: 'back',
        primary_muscles: ['rhomboids', 'trapezius'],
        secondary_muscles: ['latissimus_dorsi', 'posterior_deltoid', 'biceps_brachii', 'erector_spinae'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/seated-cable-row.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/seated-cable-row.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/seated-cable-row.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/seated-cable-row.gif' }
        },
        instructions_en: [
          'Sitt upprätt med fötterna som stöd. Undvik att gunga fram och tillbaka med överkroppen.',
          'Starta rörelsen genom att dra ihop skulderbladen, följ sedan efter med armarna.',
          'Dra handtaget mot den nedre delen av magen/naveln snarare än upp mot bröstet för att hålla nere axlarna.',
          'Släpp långsamt och kontrollerat tillbaka handtaget till startläget.'
        ],
        instructions: [
          'Sitt upprätt med fötterna som stöd. Undvik att gunga fram och tillbaka med överkroppen.',
          'Starta rörelsen genom att dra ihop skulderbladen, följ sedan efter med armarna.',
          'Dra handtaget mot den nedre delen av magen/naveln snarare än upp mot bröstet för att hålla nere axlarna.',
          'Släpp långsamt och kontrollerat tillbaka handtaget till startläget.'
        ],
        youtubeUrl: 'https://youtube.com/shorts/UT2DVnU9VzM?si=g1n8coAU6sTaGybU',
        rest: '1.5 min',
        targetWeight: 'Kabel',
        sets: 3,
        reps: '8-10',
        isStraightBackSeatedRow: true,
        note: 'Rakryggad sittande rodd bygger en tät och stark rygg med fokus på kontroll och hållning.'
      };

      const remainingExercises = [
        { id: 'lat-pulldown', name_en: 'Lat Pulldown', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/lat-pulldown.gif' },
        { id: 'seated-cable-row', name_en: 'Seated Cable Row', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/seated-cable-row.gif' },
        { id: 'dumbbell-row', name_en: 'One-Arm Dumbbell Row', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/one-arm-dumbbell-row.gif' }
      ];

      const mappedRemaining = remainingExercises.map(ex => {
        const original = EXERCISES.find(e => e.id === ex.id) || {};
        return {
          ...original,
          id: ex.id,
          name_en: ex.name_en,
          name_es: original.name_es || ex.name_en,
          name_fa: original.name_fa || ex.name_en,
          name: ex.name_en,
          equipment: original.equipment || (ex.id.includes('cable') ? 'cable' : 'dumbbell'),
          sets: ex.sets,
          reps: ex.reps,
          images: original.images || {
            classic: { start: ex.gifUrl, peak: ex.gifUrl },
            flat: { start: ex.gifUrl, peak: ex.gifUrl }
          },
          instructions_en: original.instructions_en || [
            `Setup with proper posture for ${ex.name_en}.`,
            `Perform the movement with control.`,
            `Squeeze the target back muscles at the peak contraction.`,
            `Return to starting position with control.`
          ]
        };
      });

      const mapped = [wideGripPullUpEx, barbellReverseGripRowEx, cableReverseGripPulldownEx, straightBackSeatedRowEx, cableLateralPulldownVbarEx, leverBentOverRowVbarEx, leverAlternatingNarrowGripSeatedRowEx, cableNeutralGripLatPulldownEx, cableLowSeatedRowEx];

      weeks[0].push({
        day: dayIdx + 1,
        splitType,
        exercises: mapped.map(ex => ({ ...ex, week: 1 }))
      });

      weeks[1].push({
        day: dayIdx + 1,
        splitType,
        exercises: mapped.map(ex => {
          let sets = ex.sets;
          let reps = ex.reps;
          sets = ex.sets + 1; // Progressive overload: add 1 set
          return { ...ex, sets, reps, week: 2 };
        })
      });
      return;
    }

    if (splitType === 'lower' || splitType === 'legs') {
      const legExercises = [
        { id: 'full-squat', name_en: 'Full Squat', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/weighted-squat.gif' },
        { id: 'lunge', name_en: 'Lunge', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/forward-lunge-male.gif' },
        { id: 'barbell-full-squat', name_en: 'Barbell Full Squat', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-full-squat.gif' },
        { id: 'side-split-squat', name_en: 'Side Split Squat', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-side-split-squat.gif' },
        { id: 'step-up', name_en: 'Step-up', sets: 3, reps: '8-12', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/dumbbell-step-up.gif' },
        { id: 'barbell-lunge', name_en: 'Barbell Lunge', sets: 3, reps: '8-12', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-lunge.gif' },
        { id: 'marklyft', name_en: 'Marklyft', sets: 5, reps: '5', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-deadlift.gif' }
      ];

      const mapped = legExercises.map(ex => {
        const original = EXERCISES.find(e => e.id === ex.id) || {};
        return {
          ...original,
          id: ex.id,
          name_en: ex.name_en,
          name_es: original.name_es || ex.name_en,
          name_fa: original.name_fa || ex.name_en,
          name: ex.name_en,
          equipment: original.equipment || (ex.id.includes('barbell') ? 'barbell' : ex.id.includes('dumbbell') || ex.id === 'step-up' ? 'dumbbell' : 'none'),
          sets: ex.sets,
          reps: ex.reps,
          images: {
            classic: { start: ex.gifUrl, peak: ex.gifUrl },
            flat: { start: ex.gifUrl, peak: ex.gifUrl }
          },
          instructions_en: original.instructions_en || [
            `Setup with proper posture for ${ex.name_en}.`,
            `Perform the eccentric phase with control.`,
            `Squeeze the target muscles at the peak contraction.`,
            `Return to starting position.`
          ]
        };
      });

      weeks[0].push({
        day: dayIdx + 1,
        splitType,
        exercises: mapped.map(ex => ({ ...ex, week: 1 }))
      });

      weeks[1].push({
        day: dayIdx + 1,
        splitType,
        exercises: mapped.map(ex => {
          let sets = ex.sets;
          let reps = ex.reps;
          if (ex.id !== 'marklyft') {
            sets = ex.sets + 1;
          }
          return { ...ex, sets, reps, week: 2 };
        })
      });
      return;
    }

    if (splitType === 'shoulders') {
      const shoulderExercises = [
        {
          id: 'delts/dumbbell-arnold-press',
          name_en: 'Dumbbell Arnold Press',
          name_es: 'Press Arnold con Mancuernas',
          name: 'Dumbbell Arnold Press (Arnoldpress)',
          equipment: 'dumbbell',
          body_part: 'shoulders',
          primary_muscles: ['anterior_deltoid', 'lateral_deltoid'],
          secondary_muscles: ['posterior_deltoid', 'triceps_brachii', 'trapezius', 'serratus_anterior'],
          sets: 3,
          reps: '8-10',
          rest: '50 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/dumbbell-arnold-press.gif',
          isArnoldPress: true,
          youtubeUrl: 'https://youtube.com/shorts/AjB-UXErljM?si=KX20B_qo7ZAugELA',
          instructions_en: [
            'Sätt dig på en träningsbänk med ryggstöd och håll en hantel i varje hand i brösthöjd med handflatorna vända mot dig.',
            'Börja pressa hantlarna uppåt medan du roterar handlederna så att handflatorna pekar framåt i toppläget.',
            'Pressa upp till nästan raka armar utan att låsa armbågarna.',
            'Sänk hantlarna kontrollerat tillbaka till startläget under omvänd rotation.'
          ],
          instructions: [
            'Sätt dig på en träningsbänk med ryggstöd och håll en hantel i varje hand i brösthöjd med handflatorna vända mot dig.',
            'Börja pressa hantlarna uppåt medan du roterar handlederna så att handflatorna pekar framåt i toppläget.',
            'Pressa upp till nästan raka armar utan att låsa armbågarna.',
            'Sänk hantlarna kontrollerat tillbaka till startläget under omvänd rotation.'
          ],
          tips_en: [
            'Startposition: Håll hantlarna framför axlarna med handflatorna vända mot dig.',
            'Rotationen: Börja pressa uppåt samtidigt som du roterar händerna så att handflatorna pekar bort från dig i toppläget.',
            'Kontroll: Utför rörelsen i en mjuk, flytande bana. Det ska inte vara två separata rörelser, utan en enda roterande press.',
            'Sitt eller stå: Sittande med ryggstöd ger mer isolering för axlarna, medan stående utmanar din bålstabilitet mer.'
          ],
          note: 'Dumbbell Arnold Press är en variant av axelpress som skapades av Arnold Schwarzenegger. Det som gör den unik är den roterande rörelsen, vilket gör det till en mer komplett övning för hela axelpartiet.'
        },
        {
          id: 'delts/dumbbell-one-arm-shoulder-press',
          name_en: 'Dumbbell Seated One Arm Shoulder Press',
          name_es: 'Press de Hombros Sentado a Una Mano con Mancuerna',
          name: 'Dumbbell Seated One Arm Shoulder Press (Sittande enarmad hantelpress)',
          equipment: 'dumbbell',
          body_part: 'shoulders',
          primary_muscles: ['anterior_deltoid', 'lateral_deltoid'],
          secondary_muscles: ['triceps_brachii', 'obliques', 'rectus_abdominis', 'pectoralis_major', 'serratus_anterior'],
          sets: 3,
          reps: '8-10',
          rest: '50 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/dumbbell-one-arm-shoulder-press.gif',
          isOneArmShoulderPress: true,
          youtubeUrl: 'https://youtu.be/_KZcLQlkTyU?si=Ef62bz06GlUO9rBi',
          instructions_en: [
            'Sätt dig på en bänk med ryggstöd och håll en hantel i ena handen i axelhöjd med handflatan vänd framåt.',
            'Håll den lediga handen på låret eller ta tag i kanten på sätets sida för extra stabilitet.',
            'Spänn bålen kraftfullt så att du sitter helt rak utan att luta dig åt sidan.',
            'Pressa hanteln rakt uppåt tills armen är nästan helt utsträckt, sänk sedan kontrollerat tillbaka till axelhöjd.'
          ],
          instructions: [
            'Sätt dig på en bänk med ryggstöd och håll en hantel i ena handen i axelhöjd med handflatan vänd framåt.',
            'Håll den lediga handen på låret eller ta tag i kanten på sätets sida för extra stabilitet.',
            'Spänn bålen kraftfullt så att du sitter helt rak utan att luta dig åt sidan.',
            'Pressa hanteln rakt uppåt tills armen är nästan helt utsträckt, sänk sedan kontrollerat tillbaka till axelhöjd.'
          ],
          tips_en: [
            'Sitt spikrakt: Undvik att luta dig åt sidan för att "hjälpa" vikten upp. Om du inte kan sitta rakt är vikten för tung.',
            'Lås bålen: Tänk att du ska "dra in naveln" och sitta stadigt mot ryggstödet.',
            'Andra handen: Håll den lediga handen på låret eller ta tag i sätets kant för extra stabilitet.'
          ],
          note: 'Dumbbell Seated One Arm Shoulder Press (Sittande enarmad hantelpress) är en unilateral variant av axelpress som ger extra fokus på stabilitet och muskelbalans.'
        },
        {
          id: 'delts/dumbbell-lateral-raise',
          name_en: 'Dumbbell Poliquin Lateral Raise',
          name_es: 'Elevaciones Laterales Poliquin',
          name: 'Dumbbell Poliquin Lateral Raise (Poliquin sidolyft med hantlar)',
          equipment: 'dumbbell',
          body_part: 'shoulders',
          primary_muscles: ['lateral_deltoid'],
          secondary_muscles: ['anterior_deltoid', 'posterior_deltoid', 'trapezius', 'supraspinatus'],
          sets: 3,
          reps: '10-12',
          rest: '50 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/dumbbell-lateral-raise.gif',
          isPoliquinLateralRaise: true,
          youtubeUrl: 'https://youtube.com/shorts/Kl3LEzQ5Zqs?si=dxylNsoR_2xrDHI0',
          instructions_en: [
            'Stå rakt med en hantel i varje hand och böj armbågarna i 90 graders vinkel.',
            'Lyft armbågarna utåt sidorna tills överarmarna är parallella med golvet.',
            'Rätta ut armarna i toppläget för att maximera spänningen i utsida axel.',
            'Sänk hantlarna långsamt och kontrollerat tillbaka till startpositionen.'
          ],
          instructions: [
            'Stå rakt med en hantel i varje hand och böj armbågarna i 90 graders vinkel.',
            'Lyft armbågarna utåt sidorna tills överarmarna är parallella med golvet.',
            'Rätta ut armarna i toppläget för att maximera spänningen i utsida axel.',
            'Sänk hantlarna långsamt och kontrollerat tillbaka till startpositionen.'
          ],
          tips_en: [
            'Böj armbågarna: Starta med armbågarna böjda i 90 grader för att lyfta tyngre vikt med mindre hävarm.',
            'Sträck ut i toppläget: Rätta ut armarna i toppläget och sänk hantlarna långsamt och kontrollerat på vägen ner.',
            'Kontrollera vikten: Undvik att gunga upp vikten med höften.'
          ],
          note: 'Dumbbell Poliquin Lateral Raise är en effektiv variant av sidolyft som utvecklades av tränaren Charles Poliquin för att bygga bredare axlar med mer vikt.'
        },
        {
          id: 'delts/dumbbell-seated-shoulder-press',
          name_en: 'Dumbbell Seated Shoulder Press',
          name_es: 'Press de Hombros Sentado con Mancuernas',
          name: 'Dumbbell Seated Shoulder Press (Sittande hantelpress)',
          equipment: 'dumbbell',
          body_part: 'shoulders',
          primary_muscles: ['anterior_deltoid', 'lateral_deltoid'],
          secondary_muscles: ['triceps_brachii', 'pectoralis_major', 'trapezius', 'serratus_anterior'],
          sets: 3,
          reps: '8-10',
          rest: '55 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/dumbbell-seated-shoulder-press.gif',
          isDumbbellSeatedShoulderPress: true,
          youtubeUrl: 'https://youtube.com/shorts/qEwKCR5JCog',
          instructions_en: [
            'Sätt dig på en bänk med ryggstöd uppfällt i 90 grader och håll en hantel i varje hand i axelhöjd.',
            'Vinkla armbågarna cirka 30 grader framåt från kroppen och spänn bålen.',
            'Pressa hantlarna kontrollerat uppåt i en mjuk båge tills armarna är nästan raka ovanför huvudet utan att slå ihop hantlarna.',
            'Sänk hantlarna långsamt och kontrollerat tillbaka till startläget i axelhöjd.'
          ],
          instructions: [
            'Sätt dig på en bänk med ryggstöd uppfällt i 90 grader och håll en hantel i varje hand i axelhöjd.',
            'Vinkla armbågarna cirka 30 grader framåt från kroppen och spänn bålen.',
            'Pressa hantlarna kontrollerat uppåt i en mjuk båge tills armarna är nästan raka ovanför huvudet utan att slå ihop hantlarna.',
            'Sänk hantlarna långsamt och kontrollerat tillbaka till startläget i axelhöjd.'
          ],
          tips_en: [
            'Sänk axlarna: Undvik att dra upp axlarna mot öronen. Håll dem nere och "stolta" under hela pressen.',
            'Vinkla in armbågarna: Ha inte armbågarna peka rakt ut åt sidorna (i 180 grader). Vinkla dem ca 30 grader framåt för att skona axelleden och få bättre kraft.',
            'Pressa ihop: Tänk att hantlarna ska mötas i en båge ovanför huvudet, men utan att de slår ihop.'
          ],
          note: 'Dumbbell Seated Shoulder Press (Sittande hantelpress) är en av de mest grundläggande och effektiva övningarna för att bygga styrka och volym i axlarna. Att sitta ner ger mer stabilitet, vilket gör att du kan fokusera helt på att pressa med musklerna.'
        },
        {
          id: 'delts/lever-military-press',
          name_en: 'Lever Military Press',
          name_es: 'Press Militar en Máquina con Palanca',
          name: 'Lever Military Press (sittande axelpress i maskin)',
          equipment: 'leverage machine',
          body_part: 'shoulders',
          primary_muscles: ['anterior_deltoid'],
          secondary_muscles: ['lateral_deltoid', 'triceps_brachii', 'pectoralis_major', 'serratus_anterior'],
          sets: 3,
          reps: '8-10',
          rest: '45 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/lever-military-press.gif',
          isLeverMilitaryPress: true,
          youtubeUrl: 'https://youtube.com/shorts/e1scliIVDQo?si=B9xv9mJyrkac3eJT',
          instructions_en: [
            'Ställ in sitshöjden så att handtagen hamnar i axelhöjd i startläget.',
            'Sätt dig ner, tryck ner sätet och ryggen ordentligt mot ryggstödet och greppa handtagen med handflatorna framåt.',
            'Håll armbågarna något framför kroppen och pressa handtagen kontrollerat uppåt tills armarna är nästan helt utsträckta.',
            'Sänk handtagen långsamt och bromsande tillbaka till axelhöjd utan att släppa anspänningen.'
          ],
          instructions: [
            'Ställ in sitshöjden så att handtagen hamnar i axelhöjd i startläget.',
            'Sätt dig ner, tryck ner sätet och ryggen ordentligt mot ryggstödet och greppa handtagen med handflatorna framåt.',
            'Håll armbågarna något framför kroppen och pressa handtagen kontrollerat uppåt tills armarna är nästan helt utsträckta.',
            'Sänk handtagen långsamt och bromsande tillbaka till axelhöjd utan att släppa anspänningen.'
          ],
          tips_en: [
            'Sitt djupt: Tryck ner sätet och ryggen ordentligt i dynan.',
            'Armbågarnas position: Håll armbågarna något framför kroppen (istället för rakt ut åt sidorna) för att skona axelleden.',
            'Full kontroll: Håll emot vikten på vägen ner så att du inte bara "släpper" den. Det är i den bromsande fasen axlarna växer som mest.'
          ],
          note: 'Lever Military Press (sittande axelpress i maskin) är en mycket effektiv övning för att bygga styrka och massa i axlarna med maximal kontroll.'
        },
        {
          id: 'delts/band-standing-rear-delt-row',
          name_en: 'Band Standing Rear Delt Row',
          name_es: 'Remo de Deltoides Posteriores De Pie con Banda',
          name: 'Band Standing Rear Delt Row (Stående rodd för baksida axlar med gummiband)',
          equipment: 'band',
          body_part: 'shoulders',
          primary_muscles: ['posterior_deltoid'],
          secondary_muscles: ['rhomboids', 'trapezius', 'infraspinatus', 'teres_minor', 'biceps_brachii'],
          sets: 3,
          reps: '8-10',
          rest: '45 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/band-standing-rear-delt-row.gif',
          isBandRearDeltRow: true,
          youtubeUrl: 'https://youtube.com/shorts/WcXfHh28KGU?si=EMEykLiNENhraBLa',
          instructions_en: [
            'Fäst gummibandet i stolphöjd eller håll det sträckt framför dig i brösthöjd.',
            'Stå stadigt med fötterna axelbrett isär, spänn bålen och håll armarna sträckta framåt med höga armbågar.',
            'Dra bandet mot ansiktet eller övre bröstet genom att föra armbågarna rakt utåt sidorna och klämma ihop skulderbladen i toppläget.',
            'Sänk/sträck ut armarna kontrollerat tillbaka till startläget utan att gunga med överkroppen.'
          ],
          instructions: [
            'Fäst gummibandet i stolphöjd eller håll det sträckt framför dig i brösthöjd.',
            'Stå stadigt med fötterna axelbrett isär, spänn bålen och håll armarna sträckta framåt med höga armbågar.',
            'Dra bandet mot ansiktet eller övre bröstet genom att föra armbågarna rakt utåt sidorna och klämma ihop skulderbladen i toppläget.',
            'Sänk/sträck ut armarna kontrollerat tillbaka till startläget utan att gunga med överkroppen.'
          ],
          tips_en: [
            'Höga armbågar: Dra bandet mot ansiktet eller övre delen av bröstet. Armbågarna ska peka rakt ut åt sidorna, inte neråt.',
            'Kläm ihop: Tänk att du ska klämma ihop en penna mellan skulderbladen i det bakersta läget.',
            'Stilla kropp: Undvik att gunga med överkroppen för att få fart. Rörelsen ska vara kontrollerad och strikt.'
          ],
          note: 'Band Standing Rear Delt Row (Stående rodd för baksida axlar med gummiband) är en av de bästa övningarna för att förbättra hållningen och stärka den ofta glömda baksidan av axeln.'
        },
        {
          id: 'delts/kettlebell-lateral-raise',
          name_en: 'Kettlebell Lateral Raise',
          name_es: 'Elevaciones Laterales con Pesa Rusa',
          name: 'Kettlebell Lateral Raise (Sidolyft med kettlebell)',
          equipment: 'kettlebell',
          body_part: 'shoulders',
          primary_muscles: ['lateral_deltoid'],
          secondary_muscles: ['anterior_deltoid', 'trapezius', 'supraspinatus'],
          sets: 3,
          reps: '8-10',
          rest: '45 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/dumbbell-lateral-raise.gif',
          isKettlebellLateralRaise: true,
          youtubeUrl: 'https://youtube.com/shorts/77bxysmjs7Y?si=M9Hvs-CrIRwfWDGM',
          instructions_en: [
            'Stå rakt med en kettlebell i varje hand hängande längs sidorna.',
            'Håll armbågarna lätt böjda och spänn bålen.',
            'Lyft armarna utåt sidorna tills handtaget når ungefär axelhöjd, låt lillfingret komma aningen högre än tummen i toppläget.',
            'Sänk kettlebells långsamt och kontrollerat tillbaka till startläget utan att gunga.'
          ],
          instructions: [
            'Stå rakt med en kettlebell i varje hand hängande längs sidorna.',
            'Håll armbågarna lätt böjda och spänn bålen.',
            'Lyft armarna utåt sidorna tills handtaget når ungefär axelhöjd, låt lillfingret komma aningen högre än tummen i toppläget.',
            'Sänk kettlebells långsamt och kontrollerat tillbaka till startläget utan att gunga.'
          ],
          tips_en: [
            'Lätt böjda armar: Håll inte armarna helt spikraka; en liten böj i armbågen skyddar leden.',
            'Häll ut vattnet: I toppläget kan du tänka att du ska hälla ut vatten ur en tillbringare (låt lillfingret komma aningen högre än tummen) för att verkligen pricka mellersta axeln.',
            'Stoppa vid axelhöjd: Du behöver inte gå högre än axlarna. Går du högre tar nacken (traps) över jobbet.'
          ],
          note: 'Kettlebell Lateral Raise (Sidolyft med kettlebell) är en av de absolut bästa övningarna för att isolera den mellersta delen av axeln och skapa bredd.'
        },
        {
          id: 'delts/cable-seated-rear-lateral-raise',
          name_en: 'Cable Seated Rear Lateral Raise',
          name_es: 'Elevaciones Laterales Posteriores Sentado en Polea',
          name: 'Cable Seated Rear Lateral Raise (Sittande kabellyft för baksida axlar)',
          equipment: 'cable',
          body_part: 'shoulders',
          primary_muscles: ['posterior_deltoid'],
          secondary_muscles: ['rhomboids', 'trapezius', 'infraspinatus', 'teres_minor'],
          sets: 3,
          reps: '8-10',
          rest: '45 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/cable-seated-rear-lateral-raise.gif',
          isCableSeatedRearLateral: true,
          youtubeUrl: 'https://youtu.be/6WgNq17iN58?si=8MQoBGA9zKvhNts2',
          instructions_en: [
            'Sätt dig på en träningsbänk placerad mitt emellan två låga kabeltrissor.',
            'Korsa armarna och ta tag i vänster kabel med höger hand och höger kabel med vänster hand.',
            'Håll armarna nästan helt raka med en liten fast böjning i armbågarna och spänn bålen.',
            'Dra kablarna bakåt och utåt åt sidorna genom att leda med armbågarna tills armarna är i linje med kroppen, sänk sedan kontrollerat tillbaka.'
          ],
          instructions: [
            'Sätt dig på en träningsbänk placerad mitt emellan två låga kabeltrissor.',
            'Korsa armarna och ta tag i vänster kabel med höger hand och höger kabel med vänster hand.',
            'Håll armarna nästan helt raka med en liten fast böjning i armbågarna och spänn bålen.',
            'Dra kablarna bakåt och utåt åt sidorna genom att leda med armbågarna tills armarna är i linje med kroppen, sänk sedan kontrollerat tillbaka.'
          ],
          tips_en: [
            'Korsa kablarna: Ta tag i vänster kabel med höger hand och höger kabel med vänster hand för att få rätt dragvinkel.',
            'Lätta armbågar: Håll armarna nästan helt raka, men med en liten, fast böjning i armbågen under hela setet.',
            'Led med armbågarna: Tänk att du ska dra armbågarna så långt ut åt sidorna som möjligt, snarare än att bara dra med händerna.',
            'Stoppa i tid: Gå inte längre bak än att armarna är i linje med kroppen. Går du längre bak tar de stora ryggmusklerna över jobbet från axlarna.'
          ],
          note: 'Cable Seated Rear Lateral Raise (Sittande kabellyft för baksida axlar) är en av de mest effektiva isolationsövningarna för att träna den bakre delen av axelpartiet. Att utföra den sittande med kablar ger en unik muskelkontakt.'
        },
        {
          id: 'delts/smith-seated-shoulder-press',
          name_en: 'Smith Seated Shoulder Press',
          name_es: 'Press de Hombros Sentado en Máquina Smith',
          name: 'Smith Seated Shoulder Press (Sittande axelpress i Smith-maskin)',
          equipment: 'smith',
          body_part: 'shoulders',
          primary_muscles: ['anterior_deltoid'],
          secondary_muscles: ['lateral_deltoid', 'triceps_brachii', 'pectoralis_major', 'trapezius', 'serratus_anterior'],
          sets: 3,
          reps: '10-12',
          rest: '40 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/smith-seated-shoulder-press.gif',
          isSmithSeatedShoulderPress: true,
          youtubeUrl: 'https://youtube.com/shorts/E7ngsffMPR0?si=pvQRittYV6Wzc9Y4',
          instructions_en: [
            'Ställ in en bänk med ryggstöd helt upprätt eller i en mycket brant lutning inuti Smith-maskinen.',
            'Sätt dig ner, tryck ryggen ordentligt mot sätet, håll bröstet högt och greppa stången något bredare än axelbrett.',
            'Vrid upp stången för att frigöra spärrarna och sänk den kontrollerat ner till ungefär hakhöjd.',
            'Pressa stången kraftfullt spikrakt uppåt tills armarna nästan är helt utsträckta utan att låsa armbågarna.'
          ],
          instructions: [
            'Ställ in en bänk med ryggstöd helt upprätt eller i en mycket brant lutning inuti Smith-maskinen.',
            'Sätt dig ner, tryck ryggen ordentligt mot sätet, håll bröstet högt och greppa stången något bredare än axelbrett.',
            'Vrid upp stången för att frigöra spärrarna och sänk den kontrollerat ner till ungefär hakhöjd.',
            'Pressa stången kraftfullt spikrakt uppåt tills armarna nästan är helt utsträckta utan att låsa armbågarna.'
          ],
          tips_en: [
            'Sitt rakt: Tryck ryggen ordentligt mot sätet och håll bröstet högt.',
            'Armbågarnas vinkel: Låt inte armbågarna peka rakt ut åt sidorna; ha dem aningen framför dig för att skona axelleden.',
            'Stoppa i tid: Sänk stången till ungefär hakhöjd eller strax under. Går du för djupt kan det skapa onödig stress på axelns framsida.'
          ],
          note: 'Sittande axelpress i Smith-maskin (3 set, 10-12 reps, 40 sek setvila).'
        }
      ];

            const mapped = shoulderExercises.map(ex => {
        const original = EXERCISES.find(e => e.id === ex.id) || {};
        return {
          ...original,
          id: ex.id,
          name_en: ex.name_en,
          name_es: ex.name_es || original.name_es || ex.name_en,
          name_fa: original.name_fa || ex.name_en,
          name: ex.name || ex.name_en,
          equipment: ex.equipment || original.equipment || (ex.id.includes('lever') ? 'leverage machine' : 'dumbbell'),
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest || '40 sek',
          images: {
            classic: { start: ex.gifUrl, peak: ex.gifUrl },
            flat: { start: ex.gifUrl, peak: ex.gifUrl }
          },
          instructions_en: ex.instructions_en || original.instructions_en || [
            `Setup with proper posture for ${ex.name_en}.`,
            `Perform the movement with control.`,
            `Squeeze the target shoulder muscles at the peak contraction.`,
            `Return to starting position with control.`
          ],
          instructions: ex.instructions || original.instructions || [],
          tips_en: ex.tips_en || original.tips_en || [],
          youtubeUrl: ex.youtubeUrl || original.youtubeUrl || '',
          rest: ex.rest || original.rest || '1.5 min',
          note: ex.note || original.note || '',
          isSmithSeatedShoulderPress: ex.isSmithSeatedShoulderPress,
          isArnoldPress: ex.isArnoldPress,
          isOneArmShoulderPress: ex.isOneArmShoulderPress,
          isPoliquinLateralRaise: ex.isPoliquinLateralRaise,
          isDumbbellSeatedShoulderPress: ex.isDumbbellSeatedShoulderPress,
          isLeverMilitaryPress: ex.isLeverMilitaryPress,
          isBandRearDeltRow: ex.isBandRearDeltRow,
          isKettlebellLateralRaise: ex.isKettlebellLateralRaise,
          isCableSeatedRearLateral: ex.isCableSeatedRearLateral
        };
      });

      weeks[0].push({
        day: dayIdx + 1,
        splitType,
        exercises: mapped.map(ex => ({ ...ex, week: 1 }))
      });

      weeks[1].push({
        day: dayIdx + 1,
        splitType,
        exercises: mapped.map(ex => {
          let sets = ex.sets;
          let reps = ex.reps;
          sets = ex.sets + 1; // progressive overload: add 1 set
          return { ...ex, sets, reps, week: 2 };
        })
      });
      return;
    }

    if (splitType === 'triceps') {
      let tSets1 = 3;
      let tReps1 = '10-12';
      let tRest = '1.5 min';
      let tWeight = 'Medeltung vikt';
      let tSets2 = 4;
      let tReps2 = '10-12';

      if (experienceLevel === 'Nybörjare') {
        tSets1 = 3; tReps1 = '8-10'; tRest = '1-2 min'; tWeight = 'Lättare vikt'; tSets2 = 3; tReps2 = '10-12';
      } else if (experienceLevel === 'Medel') {
        tSets1 = 3; tReps1 = '10-12'; tRest = '1-1:30 min'; tWeight = 'Medeltung vikt'; tSets2 = 4; tReps2 = '10-12';
      } else if (experienceLevel === 'Avancerad') {
        tSets1 = 4; tReps1 = '10-14'; tRest = '1-1:15 min'; tWeight = 'Tung vikt'; tSets2 = 4; tReps2 = '12-14';
      }

      const ropeTricepsPushdownEx = {
        id: 'triceps/rope-pushdown',
        name_en: 'Rope Triceps Pushdown',
        name_es: 'Tríceps Polea Alta con Soga',
        name_fa: 'پشت بازو سیم‌کش طناب',
        name: 'Rope Triceps Pushdown',
        equipment: 'cable',
        body_part: 'arms',
        primary_muscles: ['triceps'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/rope-pushdown.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/rope-pushdown.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/rope-pushdown.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/rope-pushdown.gif' }
        },
        instructions_en: [
          'Fäst ett rep i det övre fästet på en kabelmaskin.',
          'Greppa handtaget och håll armbågarna tätt intill kroppen, böjda i ca 90 grader.',
          'Pressa ner handtaget genom att sträcka ut armarna helt tills de är raka.',
          'Dra ändarna något utåt i bottenläget för extra spänning och håll emot på vägen upp.'
        ],
        instructions: [
          'Fäst ett rep i det övre fästet på en kabelmaskin.',
          'Greppa handtaget och håll armbågarna tätt intill kroppen, böjda i ca 90 grader.',
          'Pressa ner handtaget genom att sträcka ut armarna helt tills de är raka.',
          'Dra ändarna något utåt i bottenläget för extra spänning och håll emot på vägen upp.'
        ],
        youtubeUrl: 'https://youtu.be/mr5Jgz67SX8?si=N-z04s9p2w1X46g_',
        isOneArmExtension: false,
        rest: tRest,
        targetWeight: tWeight,
        note: 'Fokus på kontakt och pressa ändarna utåt i botten för maximal triceps-spänning.'
      };

    const oneArmTricepsExtensionEx = {
      id: 'triceps/cable-one-arm-tricep-pushdown',
      name_en: 'Cable One Arm Tricep Pushdown',
      name_es: 'Extensión de Tríceps a un Brazo en Polea',
      name_fa: 'پشت بازو سیم‌کش تک دست',
      name: 'Cable One Arm Tricep Pushdown (Enarmad tricepspress i kabel)',
      equipment: 'kabel',
      body_part: 'arms',
      primary_muscles: ['triceps'],
      secondary_muscles: ['anconeus', 'rectus_abdominis'],
      sets: 3,
      reps: '8-10',
      rest: '45 sek',
      gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-tricep-pushdown.gif',
      images: {
        classic: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-tricep-pushdown.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-tricep-pushdown.gif'
        },
        flat: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-tricep-pushdown.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-tricep-pushdown.gif'
        }
      },
      isCableOneArmTricepPushdown: true,
      youtubeUrl: 'https://youtube.com/shorts/GgCX9ccl3EE?si=FGHix8jPtdjjMzC1',
      instructions_en: [
        'Stå framför kabelmaskinen och greppa enkelhandtaget med en hand, håll armbågen intill sidan.',
        'Spänn bålen kraftfullt för att hålla överkroppen helt rak och stilla.',
        'Pressa handtaget nedåt tills armen är helt utsträckt i bottenläget.',
        'Släpp kontrollerat tillbaka upp till brösthöjd utan att överarmen rör sig framåt.'
      ],
      instructions: [
        'Stå framför kabelmaskinen och greppa enkelhandtaget med en hand, håll armbågen intill sidan.',
        'Spänn bålen kraftfullt för att hålla överkroppen helt rak och stilla.',
        'Pressa handtaget nedåt tills armen är helt utsträckt i bottenläget.',
        'Släpp kontrollerat tillbaka upp till brösthöjd utan att överarmen rör sig framåt.'
      ],
      tips_en: [
        'Håll överarmen stilla: Tänk att din överarm är fastlimmad mot sidan av din kropp. Det är bara underarmen som ska röra sig.',
        'Ingen rotation: Spänn magen ordentligt så att din överkropp inte vrider sig mot maskinen när det blir tungt.',
        'Fullt utslag: Sträck ut armen helt i bottenläget och håll emot kontrollerat på vägen upp.'
      ],
      note: 'Här är en genomgång av Cable One Arm Tricep Pushdown (Enarmad tricepspress i kabel), baserat på din bild.'
    };

const tricepsPushdownEx = {
        id: 'triceps/reverse-grip-pushdown',
        name_en: 'Cable Reverse-grip Pushdown',
        name_es: 'Tríceps Polea Alta con Agarre Invertido',
        name_fa: 'پشت بازو سیم‌کش دست عکس',
        name: 'Cable Reverse-grip Pushdown',
        equipment: 'cable',
        body_part: 'arms',
        primary_muscles: ['triceps'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/reverse-grip-pushdown.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/reverse-grip-pushdown.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/reverse-grip-pushdown.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/reverse-grip-pushdown.gif' }
        },
        instructions_en: [
          'Stå vänd mot kabelmaskinen. Fäst en stång i det övre fästet.',
          'Greppa stången med ett underhandsgrepp (handflatorna uppåt).',
          'Pressa ner stången genom att sträcka ut armarna helt tills de är raka.',
          'Håll armbågarna fixerade intill sidan under hela rörelsen.'
        ],
        instructions: [
          'Stå vänd mot kabelmaskinen. Fäst en stång i det övre fästet.',
          'Greppa stången med ett underhandsgrepp (handflatorna uppåt).',
          'Pressa ner stången genom att sträcka ut armarna helt tills de är raka.',
          'Håll armbågarna fixerade intill sidan under hela rörelsen.'
        ],
        youtubeUrl: 'https://youtu.be/_EuYEt1lNYw?si=Uv7o5w4t_eR0r6wG',
        isReverseGripPushdown: true,
        rest: tRest,
        targetWeight: tWeight,
        note: 'Underhandsgreppet skiftar fokus något till det mediala huvudet på triceps.'
      };

      const classicTricepsPushdownEx = {
        id: 'triceps/cable-pushdown',
        name_en: 'Cable Triceps Pushdown',
        name_es: 'Tríceps Polea Alta con Barra',
        name_fa: 'پشت بازو سیم‌کش با میله',
        name: 'Cable Triceps Pushdown',
        equipment: 'cable',
        body_part: 'arms',
        primary_muscles: ['triceps'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif' }
        },
        instructions_en: [
          'Stå vänd mot kabelmaskinen. Fäst en rak stång eller V-stång i det övre fästet.',
          'Greppa stången med ett överhandsgrepp (handflatorna nedåt) axelbrett.',
          'Pressa ner stången tills armarna är helt raka och låsta i botten.',
          'Släpp kontrollerat tillbaka till startpositionen.'
        ],
        instructions: [
          'Stå vänd mot kabelmaskinen. Fäst en rak stång eller V-stång i det övre fästet.',
          'Greppa stången med ett överhandsgrepp (handflatorna nedåt) axelbrett.',
          'Pressa ner stången tills armarna är helt raka och låsta i botten.',
          'Släpp kontrollerat tillbaka till startpositionen.'
        ],
        youtubeUrl: 'https://youtu.be/WJD82PDO4XI?si=2o9u5b3t_eR0r6wG',
        isStandardPushdown: true,
        rest: tRest,
        targetWeight: tWeight,
        note: 'Klassisk basövning för triceps. Fokus på bra låsning i bottenläget.'
      };

      const techSummaryTricepsPushdownEx = {
        id: 'triceps/triceps-pushdown',
        name_en: 'Triceps Pushdown',
        name_es: 'Tríceps en Máquina',
        name_fa: 'پشت بازو سیم‌کش ایستاده',
        name: 'Triceps Pushdown',
        equipment: 'cable',
        body_part: 'arms',
        primary_muscles: ['triceps'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/triceps-pushdown.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/triceps-pushdown.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/triceps-pushdown.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/triceps-pushdown.gif' }
        },
        instructions_en: [
          'Stå vänd mot kabelmaskinen med fästet övre. Greppa stången axelbrett.',
          'Håll armbågarna fixerade i 90 grader mot kroppen.',
          'Pressa ner till full sträckning och kläm triceps hårt.',
          'Håll emot vikten under den excentriska fasen på vägen upp.'
        ],
        instructions: [
          'Stå vänd mot kabelmaskinen med fästet övre. Greppa stången axelbrett.',
          'Håll armbågarna fixerade i 90 grader mot kroppen.',
          'Pressa ner till full sträckning och kläm triceps hårt.',
          'Håll emot vikten under den excentriska fasen på vägen upp.'
        ],
        youtubeUrl: 'https://youtu.be/oA3yF4lMuKw?si=Io7u5b3t_eR0r6wG',
        isTechSummaryPushdown: true,
        rest: tRest,
        targetWeight: tWeight,
        note: 'Fokus på utförande: Stå vänd mot maskinen, håll överarmarna fixerade, spänn hårt i botten och håll emot upp.'
      };

      const highPulleyOverheadExtensionEx = {
        id: 'triceps/high-pulley-overhead-extension',
        name_en: 'Tricepsförlängning med hög remskiva',
        name_es: 'Extensión de Tríceps de Cabeza con Polea Alta',
        name_fa: 'پشت بازو سیم‌کش از پشت سر با طناب',
        name: 'Tricepsförlängning med hög remskiva',
        equipment: 'cable',
        body_part: 'arms',
        primary_muscles: ['triceps'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/high-pulley-overhead-extension.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/high-pulley-overhead-extension.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/high-pulley-overhead-extension.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/high-pulley-overhead-extension.gif' }
        },
        instructions_en: [
          'Fäst ett rep i övre kabeln, stå vänd från kabelmaskinen.',
          'Luta överkroppen framåt och håll armarna böjda över huvudet med armbågarna pekande framåt.',
          'Pressa repet framåt genom att sträcka ut armarna helt.',
          'Gå långsamt tillbaka till startpositionen för att bibehålla konstant spänning.'
        ],
        instructions: [
          'Fäst ett rep i övre kabeln, stå vänd från kabelmaskinen.',
          'Luta överkroppen framåt och håll armarna böjda över huvudet med armbågarna pekande framåt.',
          'Pressa repet framåt genom att sträcka ut armarna helt.',
          'Gå långsamt tillbaka till startpositionen för att bibehålla konstant spänning.'
        ],
        youtubeUrl: 'https://youtu.be/9Ark9S11uXw?si=K-z04s9p2w1X46g_',
        isHighPulleyOverheadExtension: true,
        rest: tRest,
        targetWeight: tWeight,
        note: 'Tricepsförlängning med hög remskiva (maskin overhead) sätter det långa huvudet i maximal stretch för optimal tillväxt.'
      };

      const cableHighCrossExtensionEx = {
        id: 'triceps/cable-high-cross-extension',
        name_en: 'Kabelstående högt kors tricepsförlängning',
        name_es: 'Extensión de Tríceps Cruzados con Polea Alta',
        name_fa: 'پشت بازو سیم‌کش ضربدری بالای سر',
        name: 'Kabelstående högt kors tricepsförlängning',
        equipment: 'cable',
        body_part: 'arms',
        primary_muscles: ['triceps'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-high-cross-extension.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-high-cross-extension.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-high-cross-extension.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-high-cross-extension.gif' }
        },
        instructions_en: [
          'Stå mitt i en kabelmaskin med båda övre kablarna fixerade.',
          'Greppa vänster kabel med höger hand och höger kabel med vänster hand (korsa kablarna framför kroppen).',
          'Håll armbågarna fixerade i axelhöjd och pressa armarna utåt tills de är helt raka.',
          'Släpp kontrollerat tillbaka till det korsade startläget.'
        ],
        instructions: [
          'Stå mitt i en kabelmaskin med båda övre kablarna fixerade.',
          'Greppa vänster kabel med höger hand och höger kabel med vänster hand (korsa kablarna framför kroppen).',
          'Håll armbågarna fixerade i axelhöjd och pressa armarna utåt tills de är helt raka.',
          'Släpp kontrollerat tillbaka till det korsade startläget.'
        ],
        youtubeUrl: 'https://youtu.be/uID8NFK1p5Y?si=Ho7u5b3t_eR0r6wG',
        isCableHighCrossExtension: true,
        rest: tRest,
        targetWeight: tWeight,
        note: 'Kabelstående högt kors tricepsförlängning (X-extensions) är en mycket anatomiskt riktig övning som linjerar perfekt med triceps muskelfibrer. Fokus på det laterala huvudet.'
      };

      const cableKickbackEx = {
        id: 'triceps/cable-kickback',
        name_en: 'Cable kickback',
        name_es: 'Patada de Tríceps con Polea',
        name_fa: 'پشت بازو کیک‌بک سیم‌کش',
        name: 'Cable kickback',
        equipment: 'cable',
        body_part: 'arms',
        primary_muscles: ['triceps'],
        images: {
          classic: {
            start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-kickback.gif',
            peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-kickback.gif'
          },
          flat: {
            start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-kickback.gif',
            peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-kickback.gif'
          }
        },
        instructions_en: [
          'Ställ in kabeln i axelhöjd eller något lägre. Luta dig framåt med rak rygg.',
          'Håll överarmen fixerad längs sidan av kroppen (parallellt med golvet).',
          'Sträck ut underarmen bakåt tills armen är helt rak.',
          'Håll kvar en sekund i det raka läget för maximal effekt.'
        ],
        instructions: [
          'Ställ in kabeln i axelhöjd eller något lägre. Luta dig framåt med rak rygg.',
          'Håll överarmen fixerad längs sidan av kroppen (parallellt med golvet).',
          'Sträck ut underarmen bakåt tills armen är helt rak.',
          'Håll kvar en sekund i det raka läget för maximal effekt.'
        ],
        youtubeUrl: 'https://youtu.be/DYsQWSbj7UM?si=8BxxOIWodtcZ58dc',
        isCableKickback: true,
        rest: tRest,
        targetWeight: tWeight,
        note: 'Kabelkast (Cable Kickback) är en isolationsövning för triceps i kabelmaskin. Fokus på maximal kontakt och \"klämmet\" (maximal kontraktion) i muskeln.'
      };

      const dumbbellKickbackEx = {
        id: 'triceps/dumbbell-kickback',
        name_en: 'Hantelkickback',
        name_es: 'Patada de Tríceps con Mancuerna',
        name_fa: 'پشت بازو کیک‌بک دمبل',
        name: 'Hantelkickback',
        equipment: 'dumbbell',
        body_part: 'arms',
        primary_muscles: ['triceps'],
        images: {
          classic: {
            start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/dumbbell-kickback.gif',
            peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/dumbbell-kickback.gif'
          },
          flat: {
            start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/dumbbell-kickback.gif',
            peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/dumbbell-kickback.gif'
          }
        },
        instructions_en: [
          'Luta dig framåt över en träningsbänk med rak rygg och ena knät/handen som stöd.',
          'Håll överarmen fixerad längs sidan av kroppen (parallellt med golvet).',
          'Sträck ut underarmen bakåt tills armen är helt rak.',
          'Håll kvar en sekund i det raka läget med maximal kontraktion.'
        ],
        instructions: [
          'Luta dig framåt över en träningsbänk med rak rygg och ena knät/handen som stöd.',
          'Håll överarmen fixerad längs sidan av kroppen (parallellt med golvet).',
          'Sträck ut underarmen bakåt tills armen är helt rak.',
          'Håll kvar en sekund i det raka läget med maximal kontraktion.'
        ],
        youtubeUrl: 'https://youtube.com/shorts/ZGjHc9NnJ-4?si=9Pk9bJhS5OS59dzk',
        isDumbbellKickback: true,
        rest: tRest,
        targetWeight: tWeight,
        note: 'Hantelkickback är en klassisk tricepsövning med hantel. Fokus på maximal kontraktion och kontakt i muskelns helt förkortade läge.'
      };

      const exList1 = [
        { ...ropeTricepsPushdownEx, sets: tSets1, reps: tReps1 },
        { ...oneArmTricepsExtensionEx, sets: tSets1, reps: tReps1 },
        { ...tricepsPushdownEx, sets: tSets1, reps: tReps1 },
        { ...classicTricepsPushdownEx, sets: tSets1, reps: tReps1 },
        { ...techSummaryTricepsPushdownEx, sets: tSets1, reps: tReps1 },
        { ...highPulleyOverheadExtensionEx, sets: tSets1, reps: tReps1 },
        { ...cableHighCrossExtensionEx, sets: tSets1, reps: tReps1 },
        { ...cableKickbackEx, sets: tSets1, reps: tReps1 },
        { ...dumbbellKickbackEx, sets: tSets1, reps: tReps1 }
      ];

      const exList2 = [
        { ...ropeTricepsPushdownEx, sets: tSets2, reps: tReps2 },
        { ...oneArmTricepsExtensionEx, sets: tSets2, reps: tReps2 },
        { ...tricepsPushdownEx, sets: tSets2, reps: tReps2 },
        { ...classicTricepsPushdownEx, sets: tSets2, reps: tReps2 },
        { ...techSummaryTricepsPushdownEx, sets: tSets2, reps: tReps2 },
        { ...highPulleyOverheadExtensionEx, sets: tSets2, reps: tReps2 },
        { ...cableHighCrossExtensionEx, sets: tSets2, reps: tReps2 },
        { ...cableKickbackEx, sets: tSets2, reps: tReps2 },
        { ...dumbbellKickbackEx, sets: tSets2, reps: tReps2 }
      ];

      weeks[0].push({
        day: dayIdx + 1,
        splitType,
        exercises: exList1.map(ex => ({ ...ex, week: 1 }))
      });

      weeks[1].push({
        day: dayIdx + 1,
        splitType,
        exercises: exList2.map(ex => ({ ...ex, week: 2 }))
      });
      return;
    }

    if (splitType === 'biceps_abs') {
      const bicepsAbsExercises = [
        {
          id: 'biceps/band-biceps-curl',
          name_en: 'Band Biceps Curl',
          name_es: 'Curl de Bíceps con Banda',
          name: 'Band Biceps Curl',
          equipment: 'band',
          body_part: 'arms',
          primary_muscles: ['biceps_brachii'],
          secondary_muscles: ['brachialis', 'brachioradialis'],
          sets: 2,
          reps: '15-25',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/biceps/band-alternating-biceps-curl.gif',
          isBandBicepsCurl: true,
          instructions_en: [
            'Stå på gummibandet med fötterna axelbrett isär och greppa handtagen med handflatorna vända uppåt.',
            'Håll armbågarna fixerade längs sidorna, spänn bålen och stå stolt med sänkta axlar.',
            'Curl (böj) båda armarna samtidigt uppåt mot axlarna genom att spänna dina biceps.',
            'Sänk armarna kontrollerat tillbaka till startläget med full stretch.'
          ],
          instructions: [
            'Stå på gummibandet med fötterna axelbrett isär och greppa handtagen med handflatorna vända uppåt.',
            'Håll armbågarna fixerade längs sidorna, spänn bålen och stå stolt med sänkta axlar.',
            'Curl (böj) båda armarna samtidigt uppåt mot axlarna genom att spänna dina biceps.',
            'Sänk armarna kontrollerat tillbaka till startläget med full stretch.'
          ],
          tips_en: [
            'Tempo: Håll ett jämnt och kontrollerat tempo. Tänk "1 sekund upp, 1 sekund ner".',
            'Repetitioner: Sikta på 15–25 repetitioner för att verkligen få igång cirkulationen.',
            'Hållning: Stå stolt med sänkta axlar. Låt inte axlarna rulla framåt när du curlar.'
          ],
          youtubeUrl: 'https://youtube.com/shorts/-Wqy_GfKQEQ?si=0-2VR43_7xqwlkhj'
        },
        {
          id: 'biceps/barbell-curl',
          name_en: 'Barbell Bicep Curl',
          name_es: 'Curl de Bíceps con Barra',
          name: 'Barbell Bicep Curl',
          equipment: 'barbell',
          body_part: 'arms',
          primary_muscles: ['biceps_brachii'],
          secondary_muscles: ['brachialis', 'brachioradialis'],
          sets: 3,
          reps: '8-10',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/biceps/barbell-curl.gif',
          isBarbellBicepCurl: true,
          instructions_en: [
            'Stå rakt med fötterna axelbrett isär och greppa skivstången med ett underhandsgrepp (handflatorna framåt).',
            'Håll armbågarna fixerade tätt intill kroppen och spänn bål och stuss.',
            'Curla (böj) stången uppåt mot bröstet genom att spänna dina biceps kraftfullt.',
            'Kläm åt i toppläget och sänk stången kontrollerat hela vägen ner till raka armar.'
          ],
          instructions: [
            'Stå rakt med fötterna axelbrett isär och greppa skivstången med ett underhandsgrepp (handflatorna framåt).',
            'Håll armbågarna fixerade tätt intill kroppen och spänn bål och stuss.',
            'Curla (böj) stången uppåt mot bröstet genom att spänna dina biceps kraftfullt.',
            'Kläm åt i toppläget och sänk stången kontrollerat hela vägen ner till raka armar.'
          ],
          tips_en: [
            'Ingen "Ego-lyftning": Gunga inte med ryggen för att få upp stången. Stå helt stilla och låt biceps göra jobbet.',
            'Fullständigt rörelseomfång: Sänk stången ända ner tills armarna är raka för maximal muskelutveckling.',
            'Armbågar på sidan: Håll armbågarna fixerade. Om de åker framåt flyttas belastningen till axlarna.'
          ],
          youtubeUrl: 'https://youtube.com/shorts/54x2WF1_Suc?si=cIOaNOs0nou4lEOz'
        },
        {
          id: 'biceps/dumbbell-curl',
          name_en: 'Dumbbell Biceps Curl',
          name_es: 'Curl de Bíceps con Mancuernas',
          name: 'Dumbbell Biceps Curl',
          equipment: 'dumbbell',
          body_part: 'arms',
          primary_muscles: ['biceps_brachii'],
          secondary_muscles: ['brachialis', 'brachioradialis'],
          sets: 3,
          reps: '10-12',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/biceps/dumbbell-biceps-curl.gif',
          isDumbbellBicepsCurl: true,
          instructions_en: [
            'Starta med hantlarna hängande längs sidorna, handflatorna vända mot låren (neutralt grepp).',
            'Håll armbågarna fixerade vid sidorna, spänn bålen och stå stolt.',
            'Curla (böj) upp hantlarna samtidigt som du vrider handlederna (supination) så att handflatorna pekar uppåt i toppläget.',
            'Sänk hantlarna kontrollerat tillbaka till startläget under full stretch.'
          ],
          instructions: [
            'Starta med hantlarna hängande längs sidorna, handflatorna vända mot låren (neutralt grepp).',
            'Håll armbågarna fixerade vid sidorna, spänn bålen och stå stolt.',
            'Curla (böj) upp hantlarna samtidigt som du vrider handlederna (supination) så att handflatorna pekar uppåt i toppläget.',
            'Sänk hantlarna kontrollerat tillbaka till startläget under full stretch.'
          ],
          tips_en: [
            'Lås armbågarna: Armbågarna ska vara fixerade vid sidorna så att inte axlarna tar över.',
            'Vrid handlederna: Starta med handflatorna mot låren och vrid dem uppåt mot taket allt eftersom du lyfter.',
            'Fullt rörelseomfång: Gå hela vägen ner till raka armar och hela vägen upp till axeln.'
          ],
          youtubeUrl: 'https://youtube.com/shorts/oLyP6sORFOc?si=UlMzWoXaxmFEoK5Y'
        },
        {
          id: 'biceps/cable-hammer-curl',
          name_en: 'Cable Hammer Curl',
          name_es: 'Curl de Martillo con Cable',
          name: 'Cable Hammer Curl',
          equipment: 'cable',
          body_part: 'arms',
          primary_muscles: ['biceps_brachii'],
          secondary_muscles: ['brachialis', 'brachioradialis'],
          sets: 3,
          reps: '10-12',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/biceps/cable-hammer-curl.gif',
          isCableHammerCurl: true,
          instructions_en: [
            'Fäst ett rep i den nedre trissan på kabelmaskinen.',
            'Greppa repets ändar med ett neutralt grepp (handflatorna mot varandra) och ta ett steg bakåt.',
            'Håll armbågarna fixerade vid sidorna, spänn bålen och stå stabilt.',
            'Curla upp repet mot axlarna och dra isär repets ändar i toppläget för maximal kontraktion.',
            'Sänk kontrollerat tillbaka till startläget med full sträckning.'
          ],
          instructions: [
            'Fäst ett rep i den nedre trissan på kabelmaskinen.',
            'Greppa repets ändar med ett neutralt grepp (handflatorna mot varandra) och ta ett steg bakåt.',
            'Håll armbågarna fixerade vid sidorna, spänn bålen och stå stabilt.',
            'Curla upp repet mot axlarna och dra isär repets ändar i toppläget för maximal kontraktion.',
            'Sänk kontrollerat tillbaka till startläget med full sträckning.'
          ],
          tips_en: [
            'Dra isär i toppen: Tänk att du ska försöka dra isär repets ändar när du når axelhöjd för maximal sammandragning.',
            'Håll armbågarna stilla: Armbågarna ska vara fixade vid sidorna så axlarna inte tar över.',
            'Full sträckning: Släpp ner händerna helt så att armarna blir raka i bottenläget innan nästa repetition.'
          ],
          youtubeUrl: 'https://youtube.com/shorts/TCeIYlq00P8?si=glVfHuW2nLduZJ6m'
        },
        {
          id: 'biceps/dumbbell-incline-curl',
          name_en: 'Dumbbell Incline Curl',
          name_es: 'Curl de Bíceps en Banco Inclinado',
          name: 'Dumbbell Incline Curl',
          equipment: 'dumbbell',
          body_part: 'arms',
          primary_muscles: ['biceps_brachii'],
          secondary_muscles: ['brachialis', 'brachioradialis'],
          sets: 3,
          reps: '10-12',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/biceps/dumbbell-incline-curl.gif',
          isDumbbellInclineCurl: true,
          instructions_en: [
            'Sätt dig på en träningsbänk inställd i ca 45–60 graders lutning med ryggen stadigt mot stödet.',
            'Håll en hantel i varje hand så att armarna hänger rakt ner bakom axlarna med ett neutralt grepp.',
            'Curla upp hantlarna samtidigt som du vrider handlederna (supination) så att handflatorna pekar uppåt i toppläget.',
            'Sänk hantlarna kontrollerat hela vägen ner till det utsträckta bottenläget för maximal stretch.'
          ],
          instructions: [
            'Sätt dig på en träningsbänk inställd i ca 45–60 graders lutning med ryggen stadigt mot stödet.',
            'Håll en hantel i varje hand så att armarna hänger rakt ner bakom axlarna med ett neutralt grepp.',
            'Curla upp hantlarna samtidigt som du vrider handlederna (supination) så att handflatorna pekar uppåt i toppläget.',
            'Sänk hantlarna kontrollerat hela vägen ner till det utsträckta bottenläget för maximal stretch.'
          ],
          tips_en: [
            'Håll armarna bakåt: Låt inte armbågarna vandra framåt när du lyfter hanteln. De ska peka mot golvet under hela rörelsen.',
            'Vrid handlederna: Starta med neutralt grepp och vrid handflatorna uppåt mot taket (supination).',
            'Luta inte huvudet framåt: Håll huvudet mot bänken för att undvika nackspänningar.'
          ],
          youtubeUrl: 'https://youtube.com/shorts/fXFN8_1Bh6k?si=Fx_b9vHioe9Aka5Y'
        },
        {
          id: 'biceps/cable-one-arm-biceps-curl',
          name_en: 'Cable One Arm Biceps Curl',
          name_es: 'Curl de Bíceps a Una Mano con Cable',
          name: 'Cable One Arm Biceps Curl',
          equipment: 'cable',
          body_part: 'arms',
          primary_muscles: ['biceps_brachii'],
          secondary_muscles: ['brachialis', 'brachioradialis'],
          sets: 3,
          reps: '10-12',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/biceps/cable-one-arm-bicep-curl.gif',
          isCableOneArmBicepCurl: true,
          instructions_en: [
            'Stå intill kabelmaskinen med trissan fäst i det nedre läget och greppa ett enkelhandtag med ena handflatan uppåt.',
            'Håll axeln sänkt och överarmen helt stilla intill sidan, spänn bålen och håll ryggen rak.',
            'Curla handtaget uppåt mot axeln genom att böja i armbågsleden och spänna biceps kraftfullt.',
            'Sänk handtaget långsamt och kontrollerat hela vägen ner till full sträckning innan nästa repetition.'
          ],
          instructions: [
            'Stå intill kabelmaskinen med trissan fäst i det nedre läget och greppa ett enkelhandtag med ena handflatan uppåt.',
            'Håll axeln sänkt och överarmen helt stilla intill sidan, spänn bålen och håll ryggen rak.',
            'Curla handtaget uppåt mot axeln genom att böja i armbågsleden och spänna biceps kraftfullt.',
            'Sänk handtaget långsamt och kontrollerat hela vägen ner till full sträckning innan nästa repetition.'
          ],
          tips_en: [
            'Lås axeln: Håll axeln sänkt och överarmen helt stilla. Det är bara underarmen som ska röra sig.',
            'Använd den lediga handen: Du kan hålla i maskinen med din lediga hand för att stå mer stabilt och kunna lyfta tyngre med kontroll.',
            'Full kontroll: Släpp ner vikten långsamt. Det är i den bromsande fasen (excentriska) som mycket av muskeltillväxten sker.'
          ],
          youtubeUrl: 'https://youtube.com/shorts/EhC6ejgDGF0?si=Voih-YYBSPfe15-e'
        },
        {
          id: 'biceps/preacher-curl',
          name_en: 'Preacher Curl',
          name_es: 'Curl Predicador',
          name: 'Preacher Curl',
          equipment: 'barbell',
          body_part: 'arms',
          primary_muscles: ['biceps_brachii'],
          secondary_muscles: ['brachialis', 'brachioradialis'],
          sets: 3,
          reps: '10-12',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/biceps/preacher-curl.gif',
          isPreacherCurl: true,
          instructions_en: [
            'Sätt dig tillrätta vid preacher-bänken och vila överarmarna stadigt mot den lutande dynan.',
            'Greppa stången (gärna EZ-stång) med ett underarmsgrepp (handflatorna uppåt) i axelbredd.',
            'Curla stången uppåt mot axlarna genom att böja i armbågsleden medan överarmarna förblir fastlåsta mot dynan.',
            'Sänk stången kontrollerat tillbaka ner till ett läge precis innan armbågarna är helt utsträckta.'
          ],
          instructions: [
            'Sätt dig tillrätta vid preacher-bänken och vila överarmarna stadigt mot den lutande dynan.',
            'Greppa stången (gärna EZ-stång) med ett underarmsgrepp (handflatorna uppåt) i axelbredd.',
            'Curla stången uppåt mot axlarna genom att böja i armbågsleden medan överarmarna förblir fastlåsta mot dynan.',
            'Sänk stången kontrollerat tillbaka ner till ett läge precis innan armbågarna är helt utsträckta.'
          ],
          tips_en: [
            'Sträck inte ut helt (försiktighet): Var försiktig i det nedersta läget. Undvik att översträcka armbågen, stanna precis innan armen är helt spikrak.',
            'Sitt stadigt: Tryck in bröstet mot dynan och håll axlarna nere.',
            'Använd EZ-stång: Det är ofta mer skonsamt för handlederna än en rak stång i just den här vinkeln.'
          ],
          youtubeUrl: 'https://youtube.com/shorts/S4dDLfp3e8w?si=nkEnk2lGJYbyt5ve'
        },
        {
          id: 'biceps/cable-curl',
          name_en: 'Cable Curl',
          name_es: 'Curl con Cable',
          name: 'Cable Curl',
          equipment: 'cable',
          body_part: 'arms',
          primary_muscles: ['biceps_brachii'],
          secondary_muscles: ['brachialis', 'brachioradialis'],
          sets: 3,
          reps: '10-12',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/biceps/cable-curl.gif',
          isStandardCableCurl: true,
          instructions_en: [
            'Stå vänd mot kabelmaskinen med trissan fäst i bottenläget och greppa stången med handflatorna peknande uppåt i axelbredd.',
            'Stå stadigt med rak rygg, aningen böjda knän och spänd bål med armbågarna fixerade intill midjan.',
            'Curla stången uppåt mot axlarna genom att böja i armbågsleden och spänna biceps maximalt i toppläget.',
            'Sänk stången långsamt och kontrollerat tillbaka ner till full sträckning i bottenläget.'
          ],
          instructions: [
            'Stå vänd mot kabelmaskinen med trissan fäst i bottenläget och greppa stången med handflatorna peknande uppåt i axelbredd.',
            'Stå stadigt med rak rygg, aningen böjda knän och spänd bål med armbågarna fixerade intill midjan.',
            'Curla stången uppåt mot axlarna genom att böja i armbågsleden och spänna biceps maximalt i toppläget.',
            'Sänk stången långsamt och kontrollerat tillbaka ner till full sträckning i bottenläget.'
          ],
          tips_en: [
            'Armbågarna i sidan: Låt dem inte åka framåt eller utåt. De ska vara som fastlimmade vid din midja.',
            'Stå stadigt: Ha en lätt böjning i knäna och spänn sätet och magen för att undvika att svanka när det blir tungt.',
            'Kontrollerad retur: Håll emot på vägen ner! Den excentriska fasen är där kabeln verkligen gör nytta.'
          ],
          youtubeUrl: 'https://youtube.com/shorts/CrbTqNOlFgE?si=Xx3uGnZWet26Jw7V'
        },
        {
          id: 'biceps/cross-body-hammer-curl',
          name_en: 'Cross Body Hammer Curl',
          name_es: 'Curl Martillo Cruzado',
          name: 'Cross Body Hammer Curl',
          equipment: 'dumbbell',
          body_part: 'arms',
          primary_muscles: ['brachioradialis'],
          secondary_muscles: ['biceps_brachii', 'brachialis'],
          sets: 3,
          reps: '10-12',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/biceps/dumbbell-cross-body-hammer-curl.gif',
          isCrossBodyHammerCurl: true,
          instructions_en: [
            'Stå stadigt med en hantel i varje hand i ett neutralt grepp (handflatorna pekar mot varandra).',
            'Utan att vrida på handleden, curla den ena hanteln diagonalt över bröstet upp mot den motsatta axeln.',
            'Spänn brachialis och underarmen i toppläget utan att hanteln nuddar bröstet.',
            'Sänk hanteln kontrollerat tillbaka till utgångsläget och upprepa på andra sidan.'
          ],
          instructions: [
            'Stå stadigt med en hantel i varje hand i ett neutralt grepp (handflatorna pekar mot varandra).',
            'Utan att vrida på handleden, curla den ena hanteln diagonalt över bröstet upp mot den motsatta axeln.',
            'Spänn brachialis och underarmen i toppläget utan att hanteln nuddar bröstet.',
            'Sänk hanteln kontrollerat tillbaka till utgångsläget och upprepa på andra sidan.'
          ],
          tips_en: [
            'Neutralt grepp: Håll hanteln som en hammare under hela rörelsen. Vrid inte på handleden.',
            'Korsa bröstet: För hanteln mot den motsatta axeln, men stanna precis innan hanteln nuddar bröstet för att behålla spänningen.',
            'Stilla överarm: Håll armbågen fixerad. Den ska inte vandra framåt eller utåt under lyftet.'
          ],
          youtubeUrl: 'https://youtube.com/shorts/qmQkt1Y-FX8?si=zteaU_HKNiV5hXNz'
        },
        {
          id: 'biceps/dumbbell-standing-one-arm-curl',
          name_en: 'Dumbbell Standing One Arm Curl',
          name_es: 'Curl de Biceps a Una Mano De Pie con Mancuerna',
          name: 'Dumbbell Standing One Arm Curl',
          equipment: 'dumbbell',
          body_part: 'arms',
          primary_muscles: ['biceps_brachii'],
          secondary_muscles: ['brachialis', 'brachioradialis'],
          sets: 3,
          reps: '10-12',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/biceps/dumbbell-one-arm-biceps-curl.gif',
          isDumbbellStandingOneArmCurl: true,
          instructions_en: [
            'Stå stadigt med fötterna i höftbredd och håll en hantel i den ena handen utmed sidan.',
            'Spänn magen och sätet för att hålla kroppen helt rak utan att tippa eller vrida dig.',
            'Curla hanteln uppåt mot axeln genom att böja i armbågsleden och vrid lillfingret svagt uppåt i toppläget.',
            'Sänk hanteln långsamt och kontrollerat tillbaka ner till full utsträckning innan du byter arm.'
          ],
          instructions: [
            'Stå stadigt med fötterna i höftbredd och håll en hantel i den ena handen utmed sidan.',
            'Spänn magen och sätet för att hålla kroppen helt rak utan att tippa eller vrida dig.',
            'Curla hanteln uppåt mot axeln genom att böja i armbågsleden och vrid lillfingret svagt uppåt i toppläget.',
            'Sänk hanteln långsamt och kontrollerat tillbaka ner till full utsträckning innan du byter arm.'
          ],
          tips_en: [
            'Stå stadigt: Ha fötterna i höftbredd och spänn sätet.',
            'Ingen rotation: Låt inte överkroppen vrida sig eller luta sig för att hjälpa hanteln upp. Om du börjar luta dig är vikten för tung.',
            'Vrid lillfingret uppåt: För maximal bicep-kontakt, försök att vrida handleden så att lillfingret pekar mot taket i toppläget.'
          ],
          youtubeUrl: 'https://youtube.com/shorts/Mg0NnlF5NZQ?si=3Gvmk8aF_SZV2FJg'
        },
                {
          id: 'core/alternate-heel-touchers',
          name_en: 'Alternate Heel Touchers',
          name_es: 'Toque de Talones Alterno',
          name: 'Alternate Heel Touchers (Heel Taps / Pingvinen)',
          equipment: 'bodyweight',
          body_part: 'abs',
          primary_muscles: ['obliques'],
          secondary_muscles: ['rectus_abdominis', 'transversus_abdominis'],
          sets: 3, reps: '10-12 per sida', rest: '0 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abs/alternate-heel-touchers.gif',
          isAlternateHeelTouchers: true,
          youtubeUrl: 'https://youtube.com/shorts/YYTXkcVhkog?si=VUEmDJTr2yDh9ulw',
          instructions_en: [
            'Ligg på rygg med böjda knän och fötterna i golvet i höftbredd.',
            'Lyft axlarna och skulderbladen en bit ovanför golvet så att magmusklerna aktiveras.',
            'Böj kroppen i sidled ("pingvin-rörelse") och för ena handen mot samma sidas häl.',
            'Återgå kontrollerat till mitten och upprepa rörelsen på motsatt sida.'
          ],
          instructions: [
            'Ligg på rygg med böjda knän och fötterna i golvet i höftbredd.',
            'Lyft axlarna och skulderbladen en bit ovanför golvet så att magmusklerna aktiveras.',
            'Böj kroppen i sidled ("pingvin-rörelse") och för ena handen mot samma sidas häl.',
            'Återgå kontrollerat till mitten och upprepa rörelsen på motsatt sida.'
          ],
          tips_en: [
            'Lyft axlarna: Nyckeln är att hålla skulderbladen en bit ovanför golvet under hela övningen. Det är då magen är aktiverad.',
            'Tänk "Pingvin": Gör en kontrollerad rörelse från sida till sida. Försök att verkligen nudda hälen eller gå förbi den för maximal kontakt i obliques.',
            'Blicken mot taket: För att undvika ont i nacken, håll ett litet avstånd mellan hakan och bröstet (som om du höll en apelsin där) och titta snett uppåt.'
          ],
          note: 'Isolerar de sneda magmusklerna (obliques) genom sidoböjning mot hälen i en pingvin-rörelse.'
        },
                {
          id: 'core/lying-leg-raise',
          name_en: 'Lying Leg Raise',
          name_es: 'Elevación de Piernas Acostado',
          name: 'Lying Leg Raise (Liggande benlyft)',
          equipment: 'bodyweight',
          body_part: 'abs',
          primary_muscles: ['rectus_abdominis'],
          secondary_muscles: ['iliopsoas', 'quadriceps'],
          sets: 3,
          reps: '12',
          rest: '0 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abs/lying-leg-hip-raise.gif',
          isLyingLegRaise: true,
          youtubeUrl: 'https://youtube.com/shorts/2wUpI98Ix-k?si=eM_h0dy2eo9ry5eL',
          instructions_en: [
            'Ligg på rygg på en matta med benen raka och armarna längs sidorna (eller händerna under sätet för stöd).',
            'Pressa ner ländryggen i golvet så att det inte finns något mellanrum under ryggen.',
            'Lyft benen långsamt mot taket genom att spänna nedre delen av magen tills benen pekar rakt upp.',
            'Sänk benen kontrollerat tillbaka ner mot golvet utan att ländryggen svankar.'
          ],
          instructions: [
            'Ligg på rygg på en matta med benen raka och armarna längs sidorna (eller händerna under sätet för stöd).',
            'Pressa ner ländryggen i golvet så att det inte finns något mellanrum under ryggen.',
            'Lyft benen långsamt mot taket genom att spänna nedre delen av magen tills benen pekar rakt upp.',
            'Sänk benen kontrollerat tillbaka ner mot golvet utan att ländryggen svankar.'
          ],
          tips_en: [
            'Pressa ner ländryggen: Viktigaste regeln! Håll ländryggen pressad mot golvet under hela rörelsen.',
            'Avbryt om det svankar: Om du känner att ländryggen släpper från golvet, stanna och vänd rörelsen uppåt igen.',
            'Händerna under sätet: Placera händerna under stussen om du behöver extra stöd för ryggen.'
          ],
          note: 'Liggande benlyft tränar nedre delen av magen (rectus abdominis). Pressa ner ländryggen i golvet under hela rörelsen.'
        },
        {
          id: 'core/crunch',
          name_en: 'Abdominal Crunch',
          name_es: 'Encogimientos Abdominales',
          name: 'Abdominal Crunch (Crunches)',
          equipment: 'bodyweight',
          body_part: 'abs',
          primary_muscles: ['rectus_abdominis'],
          secondary_muscles: ['obliques'],
          sets: 3,
          reps: '12',
          rest: '2 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abs/crunch-floor.gif',
          isAbdominalCrunch: true,
          youtubeUrl: 'https://youtu.be/RUNrHkbP4Pc?si=sR99uPiSHbWr1Zra',
          instructions_en: [
            'Ligg på rygg på en matta med böjda knän och fötterna stadigt i golvet.',
            'Placera händerna lätt bakom huvudet (eller korsa dem över bröstet) utan att dra i nacken.',
            'Spänn magen och rulla ihop bröstkorgen mot naveln så att skulderbladen lyfts från golvet.',
            'Kläm åt magmusklerna i toppläget och sänk dig kontrollerat tillbaka ner utan att slappna av helt.'
          ],
          instructions: [
            'Ligg på rygg på en matta med böjda knän och fötterna stadigt i golvet.',
            'Placera händerna lätt bakom huvudet (eller korsa dem över bröstet) utan att dra i nacken.',
            'Spänn magen och rulla ihop bröstkorgen mot naveln så att skulderbladen lyfts från golvet.',
            'Kläm åt magmusklerna i toppläget och sänk dig kontrollerat tillbaka ner utan att slappna av helt.'
          ],
          tips_en: [
            'Dra inte i nacken: Händerna ska bara vila lätt bakom huvudet eller hållas över bröstet. Kraften ska komma från magen, inte armarna.',
            'Rulla ihop: Tänk att du ska rulla ihop bröstkorgen mot naveln snarare än att du ska lyfta dig rakt upp.',
            'Kvalitet före kvantitet: Det handlar inte om hur högt du kommer, utan hur hårt du kan spänna magen i toppläget.'
          ],
          note: 'Abdominal Crunch (Crunches) är den mest klassiska övningen för att isolera den raka magmuskeln. Till skillnad från en sit-up lyfter man bara den översta delen.'
        },
                {
          id: 'core/otis-up',
          name_en: 'Otis Up',
          name_es: 'Otis Up (Sit-up con Peso)',
          name: 'Otis Up',
          equipment: 'weighted',
          body_part: 'abs',
          primary_muscles: ['rectus_abdominis', 'iliopsoas'],
          secondary_muscles: ['obliques', 'sartorius', 'anterior_deltoid'],
          sets: 3,
          reps: '12',
          rest: '2 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abs/otis-up.gif',
          isOtisUp: true,
          youtubeUrl: 'https://youtu.be/hxndkKZWYo0?si=yO7I_XLzuIxT2m3D',
          instructions_en: [
            'Ligg på rygg med böjda knän och fötterna stadigt i golvet. Håll en viktplatta med raka armar peknande mot taket.',
            'Spänn magen och rulla upp överkroppen till en hel sit-up medan du konstant pressar viktplattan spikrakt mot taket.',
            'Nå toppläget med överkroppen nära knäna och vikten rakt ovanför huvudet.',
            'Sänk överkroppen långsamt och kontrollerat tillbaka ner till golvet utan att släppa anspänningen.'
          ],
          instructions: [
            'Ligg på rygg med böjda knän och fötterna stadigt i golvet. Håll en viktplatta med raka armar peknande mot taket.',
            'Spänn magen och rulla upp överkroppen till en hel sit-up medan du konstant pressar viktplattan spikrakt mot taket.',
            'Nå toppläget med överkroppen nära knäna och vikten rakt ovanför huvudet.',
            'Sänk överkroppen långsamt och kontrollerat tillbaka ner till golvet utan att släppa anspänningen.'
          ],
          tips_en: [
            'Pressa mot taket: Tänk att vikten ska röra sig spikrakt uppåt mot taket hela tiden, inte framåt mot knäna. Det gör övningen mycket jobbigare för magen.',
            'Fötterna i golvet: Försök att hålla fötterna i golvet under hela rörelsen. Om de lyfter beror det ofta på att höftböjarna tar över för mycket eller att vikten är för tung.',
            'Rulla ner långsamt: Släpp inte ner ryggen i golvet. Håll emot på vägen ner för att maximera tiden under spänning.'
          ],
          note: 'Otis Up är en avancerad, viktad variant av en sit-up där du håller en viktplatta med raka armar mot taket under hela rörelsen.'
        },
                {
          id: 'core/jackknife-sit-up',
          name_en: 'Jackknife Sit-Up',
          name_es: 'Navaja Abdominal (V-up)',
          name: 'Jackknife Sit-Up (V-up)',
          equipment: 'bodyweight',
          body_part: 'abs',
          primary_muscles: ['rectus_abdominis', 'iliopsoas'],
          secondary_muscles: ['obliques', 'quadriceps', 'hip_adductors'],
          sets: 3,
          reps: '12',
          rest: '2 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abs/jackknife-sit-up.gif',
          isJackknifeSitUp: true,
          youtubeUrl: 'https://youtube.com/shorts/YI3eRweg8rM?si=DFeL6cK8Hxx1UEAR',
          instructions_en: [
            'Ligg raklång på rygg med armarna sträckta ovanför huvudet och benen ihop.',
            'Spänn magen och lyft överkroppen och benen samtidigt så att du bildar en V-position.',
            'Sträck händerna mot fötterna i toppläget och kläm ihop magen maximalt.',
            'Sänk armar och ben kontrollerat tillbaka ner utan att låta dem vila helt på golvet innan nästa rep.'
          ],
          instructions: [
            'Ligg raklång på rygg med armarna sträckta ovanför huvudet och benen ihop.',
            'Spänn magen och lyft överkroppen och benen samtidigt så att du bildar en V-position.',
            'Sträck händerna mot fötterna i toppläget och kläm ihop magen maximalt.',
            'Sänk armar och ben kontrollerat tillbaka ner utan att låta dem vila helt på golvet innan nästa rep.'
          ],
          tips_en: [
            'Mötas på mitten: Tänk att händer och fötter ska mötas precis ovanför mitten av kroppen.',
            'Kontrollerad retur: Slappna inte av på vägen ner. Håll emot med magen så att fötterna och armarna precis nuddar eller svävar ovanför golvet.',
            'Andning: Andas ut kraftfullt när du går upp i V-positionen – det hjälper dig att spänna magen maximalt.'
          ],
          note: 'Jackknife Sit-Up (ofta kallad V-up) är en avancerad och intensiv magövning där du lyfter både överkropp och ben samtidigt för att mötas i en "V-position".'
        },
        { id: 'core/hanging-leg-raise', name_en: 'Hanging Leg Raise', name: 'Hanging Leg Raise (Hängande benlyft)', sets: 3, reps: '10-12', rest: '0 sek', note: 'Hängande benlyft utvecklar stark bålstabilitet och fokuserar intensivt på den nedre magmuskulaturen.', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abs/hanging-leg-raise.gif' },
        {
          id: 'core/front-plank',
          name_en: 'Front Plank',
          name_es: 'Plancha Frontal',
          name: 'Front Plank (Plankan)',
          equipment: 'bodyweight',
          body_part: 'abs',
          primary_muscles: ['rectus_abdominis'],
          secondary_muscles: ['transversus_abdominis', 'obliques', 'erector_spinae'],
          sets: 3,
          reps: '30-60 sek', rest: '0 sek', note: 'Plankan tränar hela bålen (rectus abdominis, transversus & obliques) statiskt med rak ryggrad utan "hängbro".', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abs/front-plank.gif',
          isFrontPlank: true,
          instructions_en: [
            'Placera underarmarna på golvet med armbågarna direkt under axlarna.',
            'Sträck ut benen bakåt och stöd dig på tårna. Håll kroppen i en rak linje från huvud till hälar.',
            'Spänn magen, sätet och låren aktivt för att förhindra att höften sjunker.',
            'Tryck ifrån golvet med underarmarna så att du inte sjunker ner mellan axlarna. Håll positionen och andas lugnt.'
          ],
          instructions: [
            'Placera underarmarna på golvet med armbågarna direkt under axlarna.',
            'Sträck ut benen bakåt och stöd dig på tårna. Håll kroppen i en rak linje från huvud till hälar.',
            'Spänn magen, sätet och låren aktivt för att förhindra att höften sjunker.',
            'Tryck ifrån golvet med underarmarna så att du inte sjunker ner mellan axlarna. Håll positionen och andas lugnt.'
          ],
          tips_en: [
            'Ingen "hängbro": Det vanligaste felet är att höften sjunker ner mot golvet. Spänn sätet och magen för att hålla kroppen spikrak.',
            'Tryck ifrån: Sjunk inte ner mellan axlarna. Tryck aktivt ifrån golvet med underarmarna så att du fyller ut utrymmet mellan skulderbladen.',
            'Andas: Håll inte andan trots att du spänner musklerna hårt.'
          ],
          youtubeUrl: 'https://youtube.com/shorts/xe2MXatLTUw?si=Jla8N4ITSMAurMBP'
        }
      ];

      const mapped = bicepsAbsExercises.map(ex => {
        const original = EXERCISES.find(e => e.id === ex.id) || {};
        return {
          ...original,
          id: ex.id,
          name_en: ex.name_en,
          name_es: ex.name_es || original.name_es || ex.name_en,
          name_fa: original.name_fa || ex.name_en,
          name: ex.name,
          equipment: ex.equipment || original.equipment || (ex.id.includes('cable') ? 'cable' : ex.id.includes('dumbbell') ? 'dumbbell' : 'none'),
          sets: ex.sets,
          reps: ex.reps,
          images: ex.images || original.images || {
            classic: { start: ex.gifUrl, peak: ex.gifUrl },
            flat: { start: ex.gifUrl, peak: ex.gifUrl }
          },
          instructions_en: ex.instructions_en || original.instructions_en || [
            `Setup properly for ${ex.name_en}.`,
            `Perform the movement under control.`,
            `Focus on a strong contraction of the target biceps/core muscles.`,
            `Return to start position with control.`
          ],
          tips_en: ex.tips_en || original.tips_en || [],
          youtubeUrl: ex.youtubeUrl || original.youtubeUrl || '',
          isBandBicepsCurl: ex.isBandBicepsCurl,
          isDumbbellBicepsCurl: ex.isDumbbellBicepsCurl,
          isDumbbellInclineCurl: ex.isDumbbellInclineCurl,
          isCableOneArmBicepCurl: ex.isCableOneArmBicepCurl,
          isPreacherCurl: ex.isPreacherCurl,
          isStandardCableCurl: ex.isStandardCableCurl,
          isCrossBodyHammerCurl: ex.isCrossBodyHammerCurl,
          isDumbbellStandingOneArmCurl: ex.isDumbbellStandingOneArmCurl,
          isCableHammerCurl: ex.isCableHammerCurl,
          isBarbellBicepCurl: ex.isBarbellBicepCurl,
          isFrontPlank: ex.isFrontPlank,
          isAlternateHeelTouchers: ex.isAlternateHeelTouchers,
          isLyingLegRaise: ex.isLyingLegRaise,
          isAbdominalCrunch: ex.isAbdominalCrunch,
          isOtisUp: ex.isOtisUp,
          isJackknifeSitUp: ex.isJackknifeSitUp,
          rest: ex.rest || original.rest || '0 sek',
          note: ex.note || original.note || '',
          isSmithSeatedShoulderPress: ex.isSmithSeatedShoulderPress
        };
      });

      weeks[0].push({
        day: dayIdx + 1,
        splitType,
        exercises: mapped.map(ex => ({ ...ex, week: 1 }))
      });

      weeks[1].push({
        day: dayIdx + 1,
        splitType,
        exercises: mapped.map(ex => {
          let sets = ex.sets;
          let reps = ex.reps;
          sets = ex.isBandBicepsCurl ? ex.sets : ex.sets + 1; // progressive overload (skip warm-up)
          return { ...ex, sets, reps, week: 2 };
        })
      });
      return;
    }

    if (splitType === 'rest') {
      weeks[0].push({
        day: dayIdx + 1,
        splitType,
        exercises: []
      });
      weeks[1].push({
        day: dayIdx + 1,
        splitType,
        exercises: []
      });
      return;
    }

    const muscles = SPLIT_MUSCLES[splitType] || ['back'];
    let pool = filtered.filter(ex => muscles.includes(ex.body_part))
    if (pool.length < 3) pool = filtered
    const shuffled = shuffle(pool)
    const count = splitType === 'full_body' ? 5 : 4
    const selected = shuffled.slice(0, Math.min(count, shuffled.length))

    let tSets1 = 3;
    let tReps1 = '10-12';
    let tRest = '1.5 min';
    let tWeight = 'Medeltung vikt';

    let tSets2 = 4;
    let tReps2 = '10-12';

    if (experienceLevel === 'Nybörjare') {
      tSets1 = 3;
      tReps1 = '8-10';
      tRest = '1-2 min';
      tWeight = 'Lättare vikt';

      tSets2 = 3;
      tReps2 = '10-12';
    } else if (experienceLevel === 'Medel') {
      tSets1 = 3;
      tReps1 = '10-12';
      tRest = '1-1:30 min';
      tWeight = 'Medeltung vikt';

      tSets2 = 4;
      tReps2 = '10-12';
    } else if (experienceLevel === 'Avancerad') {
      tSets1 = 4;
      tReps1 = '10-14';
      tRest = '1-1:15 min';
      tWeight = 'Tung vikt';

      tSets2 = 4;
      tReps2 = '12-14';
    }

    const ropeTricepsPushdownEx = {
      id: 'triceps/cable-pushdown-with-rope-attachment',
      name_en: 'Cable Pushdown / Resistance Band Triceps Pushdown',
      name_es: 'Pushdown de Tríceps',
      name_fa: 'پشت بازو سیم‌کش',
      name: 'Cable Pushdown / Resistance Band Triceps Pushdown',
      equipment: 'kabel / band',
      body_part: 'arms',
      primary_muscles: ['triceps'],
      images: {
        classic: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown-with-rope-attachment.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown-with-rope-attachment.gif'
        },
        flat: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown-with-rope-attachment.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown-with-rope-attachment.gif'
        }
      },
      instructions_en: [
        'Fäst gummibandet eller kabelhandtaget högt och håll i ändarna med böjda armar i brösthöjd.',
        'Pressa ner bandet/kabeln genom att sträcka ut armarna helt, håll armbågarna intill kroppen.',
        'Knip till i triceps i bottenläget under 1 sekund.',
        'Släpp kontrollerat tillbaka till startpositionen.'
      ],
      instructions: [
        'Fäst gummibandet eller kabelhandtaget högt och håll i ändarna med böjda armar i brösthöjd.',
        'Pressa ner bandet/kabeln genom att sträcka ut armarna helt, håll armbågarna intill kroppen.',
        'Knip till i triceps i bottenläget under 1 sekund.',
        'Släpp kontrollerat tillbaka till startpositionen.'
      ],
      youtubeUrl: 'https://youtube.com/shorts/mr5Jgz67SX8?si=OMdBPKhsEhVXUWbk',
      hasExtendedAnatomy: true,
      rest: tRest,
      targetWeight: tWeight,
      note: 'Håll armbågarna fixerade längs sidorna av kroppen. Om armbågarna rör sig fram och tillbaka blir det mer av en axelövning och effekt på triceps minskar.'
    };

    const tricepsPushdownEx = {
      id: 'triceps/cable-reverse-grip-pushdown',
      name_en: 'Reverse Grip Triceps Pushdown',
      name_es: 'Pushdown de Tríceps con Agarre Invertido',
      name_fa: 'پشت بازو سیم‌کش مچ برعکس',
      name: 'Reverse Grip Triceps Pushdown (Tricepspress med underhandsgrepp)',
      equipment: 'kabel',
      body_part: 'arms',
      primary_muscles: ['triceps'],
      secondary_muscles: ['forearms', 'rectus_abdominis'],
      sets: 3,
      reps: '8-10',
      rest: '45 sek',
      gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-reverse-grip-pushdown.gif',
      images: {
        classic: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-reverse-grip-pushdown.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-reverse-grip-pushdown.gif'
        },
        flat: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-reverse-grip-pushdown.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-reverse-grip-pushdown.gif'
        }
      },
      isReverseGripPushdown: true,
      youtubeUrl: 'https://youtube.com/shorts/_EuYEt1lNYw?si=gCkPdGnE02H8bOsx',
      instructions_en: [
        'Stå framför kabelmaskinen och greppa stången med ett underhandsgrepp (handflatorna uppåt).',
        'Håll armbågarna nära sidorna, peka dem rakt ner mot golvet och spänn bålen.',
        'Pressa stången nedåt genom att sträcka ut armarna helt tills triceps är maximalt kontraherad.',
        'Släpp kontrollerat tillbaka till startpositionen under motstånd utan att böja handlederna.'
      ],
      instructions: [
        'Stå framför kabelmaskinen och greppa stången med ett underhandsgrepp (handflatorna uppåt).',
        'Håll armbågarna nära sidorna, peka dem rakt ner mot golvet och spänn bålen.',
        'Pressa stången nedåt genom att sträcka ut armarna helt tills triceps är maximalt kontraherad.',
        'Släpp kontrollerat tillbaka till startpositionen under motstånd utan att böja handlederna.'
      ],
      tips_en: [
        'Lås handlederna: Var noga med att handlederna är raka och inte böjs bakåt av vikten.',
        'Håll armbågarna nära: Armbågarna ska peka rakt ner mot golvet och vara fixerade vid sidorna under hela rörelsen.',
        'Lättare vikt: Man orkar oftast inte lika mycket vikt som vid vanligt grepp, så fokusera på teknik och kontakt snarare än tunga kilon.'
      ],
      note: 'Här är en genomgång av Reverse Grip Triceps Pushdown (Tricepspress med underhandsgrepp) baserat på din bild.'
    };

    const oneArmTricepsExtensionEx = {
      id: 'triceps/cable-one-arm-tricep-pushdown',
      name_en: 'Cable Standing One Arm Triceps Extension',
      name_es: 'Extensión de Tríceps a un Brazo',
      name_fa: 'پشت بازو سیم‌کش تک بازو',
      name: 'Cable Standing One Arm Triceps Extension',
      equipment: 'kabel',
      body_part: 'arms',
      primary_muscles: ['triceps'],
      images: {
        classic: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-tricep-pushdown.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-tricep-pushdown.gif'
        },
        flat: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-tricep-pushdown.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-tricep-pushdown.gif'
        }
      },
      instructions_en: [
        'Stå med sidan eller ansiktet mot kabelmaskinen och håll handtaget med en hand.',
        'Håll överarmen fixerad mot sidan av kroppen och armbågen böjd.',
        'Pressa eller dra kabeln nedåt tills armen är helt utsträckt.',
        'Släpp kontrollerat tillbaka under motstånd.'
      ],
      instructions: [
        'Stå med sidan eller ansiktet mot kabelmaskinen och håll handtaget med en hand.',
        'Håll överarmen fixerad mot sidan av kroppen och armbågen böjd.',
        'Pressa eller dra kabeln nedåt tills armen är helt utsträckt.',
        'Släpp kontrollerat tillbaka under motstånd.'
      ],
      youtubeUrl: 'https://youtube.com/shorts/GgCX9ccl3EE?si=FGHix8jPtdjjMzC1',
      isOneArmExtension: true,
      rest: tRest,
      targetWeight: tWeight,
      note: 'Överarmen ska vara som fastgjuten i sidan. Det är bara underarmen som ska röra sig. Undvik att axeln åker upp mot örat.'
    };

    const classicTricepsPushdownEx = {
      id: 'triceps/cable-pushdown',
      name_en: 'Classic Cable Triceps Pushdown',
      name_es: 'Pushdown de Tríceps con Barra/V-Bar',
      name_fa: 'پشت بازو سیم‌کش کلاسیک',
      name: 'Cable Triceps Pushdown (den klassiska varianten med stång eller V-stång)',
      equipment: 'kabel / stång',
      body_part: 'arms',
      primary_muscles: ['triceps'],
      secondary_muscles: ['anconeus', 'rectus_abdominis'],
      sets: 3,
      reps: '8-10',
      rest: '50 sek',
      gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif',
      images: {
        classic: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif'
        },
        flat: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif'
        }
      },
      isStandardPushdown: true,
      youtubeUrl: 'https://youtube.com/shorts/u6sqENBsXjg?si=vteGyrv1W9NkzQ-b',
      instructions_en: [
        'Stå framför kabelmaskinen och greppa stången eller V-stången med ett överhandsgrepp i brösthöjd.',
        'Fixera armbågarna tätt intill sidorna av kroppen som om de vore fastlimmade och spänn bålen.',
        'Tryck stången kontrollerat hela vägen ner tills armarna är helt utsträckta i bottenläget.',
        'Släpp långsamt tillbaka stången till startläge under konstant spänning utan att armbågarna rör sig framåt.'
      ],
      instructions: [
        'Stå framför kabelmaskinen och greppa stången eller V-stången med ett överhandsgrepp i brösthöjd.',
        'Fixera armbågarna tätt intill sidorna av kroppen som om de vore fastlimmade och spänn bålen.',
        'Tryck stången kontrollerat hela vägen ner tills armarna är helt utsträckta i bottenläget.',
        'Släpp långsamt tillbaka stången till startläge under konstant spänning utan att armbågarna rör sig framåt.'
      ],
      tips_en: [
        'Fixerade armbågar: Håll armbågarna fixerade vid sidorna som om de vore fastlimmade. Det är bara underarmarna som ska röra sig för att garantera att det är triceps som gör jobbet!'
      ],
      note: 'Här är en kort sammanfattning av Cable Triceps Pushdown (den klassiska varianten med stång eller V-stång).'
    };

    const techSummaryTricepsPushdownEx = {
      id: 'triceps/cable-pushdown-tech-summary',
      name_en: 'Triceps Pushdown',
      name_es: 'Pushdown de Tríceps',
      name_fa: 'پشت بازو سیم‌کش (خلاصه فنی)',
      name: 'Triceps Pushdown',
      equipment: 'Kabel',
      body_part: 'arms',
      primary_muscles: ['triceps'],
      images: {
        classic: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif'
        },
        flat: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-pushdown.gif'
        }
      },
      instructions_en: [
        'Startposition: Stå vänd mot kabelmaskinen. Greppa handtaget och håll armbågarna tätt intill kroppen, böjda i ca 90 grader.',
        'Rörelsen: Pressa ner handtaget genom att sträcka ut armarna helt tills de är raka.',
        'Slutläge: Spänn triceps hårt i bottenläget (dra isär repändarna något).',
        'Retur: Håll emot vikten kontrollerat på vägen upp till startpositionen.'
      ],
      instructions: [
        'Startposition: Stå vänd mot kabelmaskinen. Greppa handtaget och håll armbågarna tätt intill kroppen, böjda i ca 90 grader.',
        'Rörelsen: Pressa ner handtaget genom att sträcka ut armarna helt tills de är raka.',
        'Slutläge: Spänn triceps hårt i bottenläget (dra isär repändarna något).',
        'Retur: Håll emot vikten kontrollerat på vägen upp till startpositionen.'
      ],
      youtubeUrl: 'https://youtube.com/shorts/oA3yF4lMuKw?si=4tjFJOIhbuJbA73K',
      isTechSummaryPushdown: true,
      rest: tRest,
      targetWeight: tWeight,
      note: 'Övningsfakta: Triceps Pushdown | Kroppsdel: Överarmar (baksida) | Utrustning: Kabelmaskin (Kabel) | Primära muskler: Triceps brachii'
    };

    const highPulleyOverheadExtensionEx = {
      id: 'triceps/cable-overhead-tricep-extension',
      name_en: 'Tricepsförlängning med hög remskiva',
      name_es: 'Extensión de Tríceps por Encima de la Cabeza',
      name_fa: 'پشت بازو سیم‌کش بالای ser',
      name: 'Tricepsförlängning med hög remskiva',
      equipment: 'kabel',
      body_part: 'arms',
      primary_muscles: ['triceps'],
      images: {
        classic: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-overhead-tricep-extension.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-overhead-tricep-extension.gif'
        },
        flat: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-overhead-tricep-extension.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-overhead-tricep-extension.gif'
        }
      },
      instructions_en: [
        'Fäst ett rep i en hög trissa. Stå vänd bort från maskinen i ett utfallssteg.',
        'Håll överarmarna fixerade nära huvudet och böj i armbågarna för att sänka repet bakom huvudet.',
        'Pressa repet framåt/uppåt genom att sträcka ut armarna helt under kontroll.',
        'Släpp långsamt tillbaka vikten till det stretchade startläget.'
      ],
      instructions: [
        'Fäst ett rep i en hög trissa. Stå vänd bort från maskinen i ett utfallssteg.',
        'Håll överarmarna fixerade nära huvudet och böj i armbågarna för att sänka repet bakom huvudet.',
        'Pressa repet framåt/uppåt genom att sträcka ut armarna helt under kontroll.',
        'Släpp långsamt tillbaka vikten till det stretchade startläget.'
      ],
      youtubeUrl: 'https://youtube.com/shorts/9Ark9S11uXw?si=OEtnXaXD2PWb93-J',
      isHighPulleyOverheadExtension: true,
      rest: tRest,
      targetWeight: tWeight,
      note: 'Tricepsförlängning med hög remskiva (Tricepspress över i maskin) är en av de absolut viktigaste övningarna om du vill bygga riktigt stora överarmar. Fokus på det långa huvudet.'
    };

    const cableHighCrossExtensionEx = {
      id: 'triceps/cable-standing-high-cross-triceps-extension',
      name_en: 'Kabelstående högt kors tricepsförlängning',
      name_es: 'Extensión de Tríceps Cruzado desde Polea Alta',
      name_fa: 'پشت بازo سیم‌کش ضربدری از طرفین',
      name: 'Kabelstående högt kors tricepsförlängning',
      equipment: 'kabel',
      body_part: 'arms',
      primary_muscles: ['triceps'],
      images: {
        classic: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-standing-high-cross-triceps-extension.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-standing-high-cross-triceps-extension.gif'
        },
        flat: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-standing-high-cross-triceps-extension.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-standing-high-cross-triceps-extension.gif'
        }
      },
      instructions_en: [
        'Stå i mitten av kabelmaskinen. Ta höger kabel med vänster hand och vänster kabel med höger hand (korsade kablar).',
        'Håll överarmarna fixerade i ca 45 graders vinkel ut från kroppen.',
        'Sträck ut armarna snett nedåt/bakåt genom att spänna triceps.',
        'Släpp kontrollerat tillbaka händerna till startläget framför kroppen.'
      ],
      instructions: [
        'Stå i mitten av kabelmaskinen. Ta höger kabel med vänster hand och vänster kabel med höger hand (korsade kablar).',
        'Håll överarmarna fixerade in ca 45 graders vinkel ut från kroppen.',
        'Sträck ut armarna snett nedåt/bakåt genom att spänna triceps.',
        'Släpp kontrollerat tillbaka händerna till startläget framför kroppen.'
      ],
      youtubeUrl: 'https://youtube.com/shorts/uID8NFK1p5Y?si=bZP8873obKXXRhfp',
      isCableHighCrossExtension: true,
      rest: tRest,
      targetWeight: tWeight,
      note: 'Kabelstående högt kors tricepsförlängning (X-extensions) är en mycket anatomiskt riktig övning som linjerar perfekt med triceps muskelfibrer. Fokus på det laterala huvudet.'
    };

    const cableKickbackEx = {
      id: 'triceps/cable-kickback',
      name_en: 'Cable kickback',
      name_es: 'Patada de Tríceps con Polea',
      name_fa: 'پشت بازو کیک‌بک سیم‌کش',
      name: 'Cable kickback',
      equipment: 'kabel',
      body_part: 'arms',
      primary_muscles: ['triceps'],
      images: {
        classic: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-kickback.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-kickback.gif'
        },
        flat: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-kickback.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-kickback.gif'
        }
      },
      instructions_en: [
        'Ställ in kabeln i axelhöjd eller något lägre. Luta dig framåt med rak rygg.',
        'Håll överarmen fixerad längs sidan av kroppen (parallellt med golvet).',
        'Sträck ut underarmen bakåt tills armen är helt rak.',
        'Håll kvar en sekund i det raka läget för maximal effekt.'
      ],
      instructions: [
        'Ställ in kabeln i axelhöjd eller något lägre. Luta dig framåt med rak rygg.',
        'Håll överarmen fixerad längs sidan av kroppen (parallellt med golvet).',
        'Sträck ut underarmen bakåt tills armen är helt rak.',
        'Håll kvar en sekund i det raka läget för maximal effekt.'
      ],
      youtubeUrl: 'https://youtu.be/DYsQWSbj7UM?si=8BxxOIWodtcZ58dc',
      isCableKickback: true,
      rest: tRest,
      targetWeight: tWeight,
      note: 'Kabelkast (Cable Kickback) är en isolationsövning för triceps i kabelmaskin. Fokus på maximal kontakt och \"klämmet\" (maximal kontraktion) i muskeln.'
    };

    const dumbbellKickbackEx = {
      id: 'triceps/dumbbell-kickback',
      name_en: 'Hantelkickback',
      name_es: 'Patada de Tríceps con Mancuerna',
      name_fa: 'پشت بازو کیک‌بک دمبل',
      name: 'Hantelkickback',
      equipment: 'dumbbell',
      body_part: 'arms',
      primary_muscles: ['triceps'],
      images: {
        classic: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/dumbbell-kickback.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/dumbbell-kickback.gif'
        },
        flat: {
          start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/dumbbell-kickback.gif',
          peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/dumbbell-kickback.gif'
        }
      },
      instructions_en: [
        'Luta dig framåt över en träningsbänk med rak rygg och ena knät/handen som stöd.',
        'Håll överarmen fixerad längs sidan av kroppen (parallellt med golvet).',
        'Sträck ut underarmen bakåt tills armen är helt rak.',
        'Håll kvar en sekund i det raka läget med maximal kontraktion.'
      ],
      instructions: [
        'Luta dig framåt över en träningsbänk med rak rygg och ena knät/handen som stöd.',
        'Håll överarmen fixerad längs sidan av kroppen (parallellt med golvet).',
        'Sträck ut underarmen bakåt tills armen är helt rak.',
        'Håll kvar en sekund i det raka läget med maximal kontraktion.'
      ],
      youtubeUrl: 'https://youtube.com/shorts/ZGjHc9NnJ-4?si=9Pk9bJhS5OS59dzk',
      isDumbbellKickback: true,
      rest: tRest,
      targetWeight: tWeight,
      note: 'Hantelkickback är en klassisk tricepsövning med hantel. Fokus på maximal kontraktion och kontakt i muskelns helt förkortade läge.'
    };

    let week1Exs = (splitType === 'triceps' || dayIdx === 3) ? [] : selected.map(ex => ({ ...ex, sets: ex.sets || 3, reps: ex.reps || '10-12', week: 1 }));
    let week2Exs = (splitType === 'triceps' || dayIdx === 3) ? [] : selected.map(ex => {
      let sets = ex.sets || 3
      let reps = ex.reps || '10-12'
      if (ex.mechanic === 'compound') sets += 1
      else {
        const m = String(reps).match(/(\d+)-(\d+)/)
        if (m) reps = `${+m[1] + 2}-${+m[2] + 2}`
        else {
          const [num, unit] = String(reps).split(' ')
          reps = `${parseInt(num) + 2}${unit ? ' ' + unit : ''}`
        }
      }
      return { ...ex, sets, reps, week: 2 }
    });

    if (splitType === 'triceps' || dayIdx === 3) {
      week1Exs.push({ ...ropeTricepsPushdownEx, sets: tSets1, reps: tReps1, week: 1 });
      week1Exs.push({ ...oneArmTricepsExtensionEx, sets: tSets1, reps: tReps1, week: 1 });
      week1Exs.push({ ...tricepsPushdownEx, sets: tSets1, reps: tReps1, week: 1 });
      week1Exs.push({ ...classicTricepsPushdownEx, sets: tSets1, reps: tReps1, week: 1 });
      week1Exs.push({ ...techSummaryTricepsPushdownEx, sets: tSets1, reps: tReps1, week: 1 });
      week1Exs.push({ ...highPulleyOverheadExtensionEx, sets: tSets1, reps: tReps1, week: 1 });
      week1Exs.push({ ...cableHighCrossExtensionEx, sets: tSets1, reps: tReps1, week: 1 });
      week1Exs.push({ ...cableKickbackEx, sets: tSets1, reps: tReps1, week: 1 });
      week1Exs.push({ ...dumbbellKickbackEx, sets: tSets1, reps: tReps1, week: 1 });

      week2Exs.push({ ...ropeTricepsPushdownEx, sets: tSets2, reps: tReps2, week: 2 });
      week2Exs.push({ ...oneArmTricepsExtensionEx, sets: tSets2, reps: tReps2, week: 2 });
      week2Exs.push({ ...tricepsPushdownEx, sets: tSets2, reps: tReps2, week: 2 });
      week2Exs.push({ ...classicTricepsPushdownEx, sets: tSets2, reps: tReps2, week: 2 });
      week2Exs.push({ ...techSummaryTricepsPushdownEx, sets: tSets2, reps: tReps2, week: 2 });
      week2Exs.push({ ...highPulleyOverheadExtensionEx, sets: tSets2, reps: tReps2, week: 2 });
      week2Exs.push({ ...cableHighCrossExtensionEx, sets: tSets2, reps: tReps2, week: 2 });
      week2Exs.push({ ...cableKickbackEx, sets: tSets2, reps: tReps2, week: 2 });
      week2Exs.push({ ...dumbbellKickbackEx, sets: tSets2, reps: tReps2, week: 2 });
    }

    weeks[0].push({
      day: dayIdx + 1,
      splitType,
      exercises: week1Exs,
    })
    weeks[1].push({
      day: dayIdx + 1,
      splitType,
      exercises: week2Exs,
    })
  })
  return { week1: weeks[0], week2: weeks[1], split }
}

// ─── Meal Plan Generator & Templates ─────────────────────────────────────────
const MEAL_TEMPLATES = {
  Viktnedgång: [
    {
      breakfast: { name: 'Äggröra med spenat & fullkornsrostat bröd', protein: 28, carbs: 32, fat: 14 },
      lunch:     { name: 'Kycklingfilé med quinoa & grönsaker', protein: 45, carbs: 40, fat: 12 },
      dinner:    { name: 'Lax med broccoli & sötpotatis', protein: 38, carbs: 35, fat: 18 },
      snack:     { name: 'Kvarg 2% med bär & valnötter', protein: 20, carbs: 15, fat: 8 },
    },
    {
      breakfast: { name: 'Proteinpannkaka med blåbär', protein: 30, carbs: 28, fat: 10 },
      lunch:     { name: 'Tonfisksallad med avokado & råg-knäckebröd', protein: 35, carbs: 22, fat: 16 },
      dinner:    { name: 'Turkisk-inspirerad kycklinggryta med blomkål-ris', protein: 42, carbs: 30, fat: 14 },
      snack:     { name: 'Äpple med jordnötssmör (2 msk)', protein: 8, carbs: 28, fat: 16 },
    },
    {
      breakfast: { name: 'Smoothiebowl: skyr, spenat, banan & linfrön', protein: 22, carbs: 34, fat: 6 },
      lunch:     { name: 'Kalkonlindad fylld zucchini med sallad', protein: 38, carbs: 18, fat: 12 },
      dinner:    { name: 'Ugnsbakad torskfilé med kokt potatis (150g) & sparris', protein: 34, carbs: 26, fat: 8 },
      snack:     { name: 'Morotsstavar med hummus (3 msk)', protein: 6, carbs: 20, fat: 10 },
    },
    {
      breakfast: { name: 'Havregrynsgröt med chiafrön, sojamjölk & hallon', protein: 14, carbs: 48, fat: 8 },
      lunch:     { name: 'Nötfärsbiffar (5% fett) med ugnsbakade rotfrukter', protein: 40, carbs: 32, fat: 14 },
      dinner:    { name: 'Wok med kycklingstrimlor, pak choi & risnudlar (150g tillagad)', protein: 44, carbs: 38, fat: 10 },
      snack:     { name: 'Keso (150g) med skivad kiwi', protein: 18, carbs: 16, fat: 4 },
    },
    {
      breakfast: { name: '2 kokta ägg + 1 skiva knäckebröd med kalkonskiva', protein: 18, carbs: 14, fat: 12 },
      lunch:     { name: 'Sallad med räkor, edamamebönor & mango-vinaigrette', protein: 32, carbs: 24, fat: 8 },
      dinner:    { name: 'Ugnsstekt fläskfilé med ugnsbakad rotselleri', protein: 38, carbs: 20, fat: 14 },
      snack:     { name: 'Mandel (20g) + clementin', protein: 5, carbs: 12, fat: 11 },
    },
    {
      breakfast: { name: 'Keso-smoothie med jordgubbar & lite havregryn', protein: 22, carbs: 28, fat: 5 },
      lunch:     { name: 'Bönsallad med fetaost (10%), tomat & gurka', protein: 20, carbs: 34, fat: 12 },
      dinner:    { name: 'Kycklingburgare i salladsblad med sötpotatischips', protein: 36, carbs: 30, fat: 10 },
      snack:     { name: 'Proteinshake med water & en näve bär', protein: 26, carbs: 6, fat: 2 },
    },
    {
      breakfast: { name: 'Omelett på 1 helt ägg & 3 äggvitor med sparris', protein: 24, carbs: 8, fat: 7 },
      lunch:     { name: 'Ugnsbakad lax med stuvad spenat', protein: 30, carbs: 12, fat: 22 },
      dinner:    { name: 'Nötköttstrimlor med sparris, svamp & ris (100g tillagad)', protein: 38, carbs: 26, fat: 12 },
      snack:     { name: 'Kvarg med frysta bär', protein: 18, carbs: 12, fat: 2 },
    },
  ],
  Viktuppgång: [
    {
      breakfast: { name: 'Havregrynsgröt med 2 msk jordnötssmör, banan & helmjölk', protein: 26, carbs: 78, fat: 28 },
      lunch:     { name: 'Stekt kyckling med ris (300g tillagad) & avokado (1 st)', protein: 52, carbs: 74, fat: 24 },
      dinner:    { name: 'Laxfilé med ugnsbakad potatis (300g) & gräddfilssås', protein: 48, carbs: 64, fat: 32 },
      snack:     { name: 'Gainer shake (mjölk, banan, havre, proteinpulver)', protein: 44, carbs: 85, fat: 16 },
    },
    {
      breakfast: { name: 'Omelett (3 ägg) med ost, skinka & 2 skivor surdegsbröd', protein: 38, carbs: 44, fat: 24 },
      lunch:     { name: 'Köttfärssås (nötfärs 10%) med spaghetti (350g tillagad)', protein: 46, carbs: 80, fat: 20 },
      dinner:    { name: 'Ugnsbakad kycklingklubba med potatisgratäng', protein: 42, carbs: 54, fat: 26 },
      snack:     { name: 'Kvarg med granola (100g), nötter & honung', protein: 24, carbs: 68, fat: 18 },
    },
    {
      breakfast: { name: 'Grekisk yoghurt med torkad frukt, pumpakärnor & sirap', protein: 20, carbs: 84, fat: 22 },
      lunch:     { name: 'Kebabtallrik med ris, tzatzikisås & sallad', protein: 44, carbs: 76, fat: 28 },
      dinner:    { name: 'Grillad ryggbiff med strips & hemslagen bea', protein: 50, carbs: 62, fat: 38 },
      snack:     { name: 'Cashewnötter (50g) + torkade aprikoser', protein: 10, carbs: 36, fat: 22 },
    },
    {
      breakfast: { name: 'Smörgåsar (3 st) med stekt ägg, ost, skinka & smör', protein: 32, carbs: 58, fat: 26 },
      lunch:     { name: 'Stekt lax med pesto-pasta (350g tillagad)', protein: 48, carbs: 82, fat: 34 },
      dinner:    { name: 'Chili con carne med ris, nachochips & gräddfil', protein: 46, carbs: 88, fat: 28 },
      snack:     { name: 'Jordnötssmörs-macka (2 st) + 1 glas helmjölk', protein: 24, carbs: 62, fat: 32 },
    },
    {
      breakfast: { name: 'Frukost-burrito: ägg, ost, skinka, salsasås i tortilla', protein: 34, carbs: 46, fat: 20 },
      lunch:     { name: 'Strimlad kalkon med couscous & rostade grönsaker (400g)', protein: 46, carbs: 62, fat: 16 },
      dinner:    { name: 'Hemmagjord pizza med kycklingbröst, mozzarella & spenat', protein: 50, carbs: 76, fat: 24 },
      snack:     { name: 'Mjölk 3dl + 2 ägg hardkokta + banan', protein: 28, carbs: 36, fat: 14 },
    },
    {
      breakfast: { name: 'Granola (150g) med grek. yoghurt, nötter & honung', protein: 22, carbs: 72, fat: 20 },
      lunch:     { name: 'Kycklings-ramen med ägg, bambuskott & miso-buljong', protein: 48, carbs: 60, fat: 18 },
      dinner:    { name: 'Biff med bearnaisesås, grillad sparris & bakad potatis', protein: 56, carbs: 54, fat: 34 },
      snack:     { name: '3 risskivor med jordnötssmör + proteindryck', protein: 32, carbs: 58, fat: 18 },
    },
    {
      breakfast: { name: 'Wafflar (4 st) med skyr, sylt & bananbitar', protein: 26, carbs: 78, fat: 14 },
      lunch:     { name: 'Nötkötts-gyros med tzatziki, ris & rostad potatis', protein: 50, carbs: 68, fat: 24 },
      dinner:    { name: 'Pasta med lax, grädde & dill (400g pasta kokt)', protein: 52, carbs: 80, fat: 28 },
      snack:     { name: 'Mass-shake: jordgubbsmjölk, havre, proteinpulver, cashew', protein: 38, carbs: 74, fat: 16 },
    },
  ],
  Bibehålla: [
    {
      breakfast: { name: 'Grek. yoghurt med granola, blåbär & chiafrön', protein: 20, carbs: 42, fat: 10 },
      lunch:     { name: 'Kycklingfilé med bulgur & rostad broccoli', protein: 40, carbs: 46, fat: 12 },
      dinner:    { name: 'Torsk med ångad potatis & smörsaftsås', protein: 36, carbs: 38, fat: 14 },
      snack:     { name: 'Blandade nötter (30g) + äpple', protein: 8, carbs: 24, fat: 16 },
    },
    {
      breakfast: { name: 'Havrefrukost med mandelmjölk, banan & kanel', protein: 14, carbs: 56, fat: 8 },
      lunch:     { name: 'Laxsallad med avokado, ruccola & citrondressing', protein: 36, carbs: 20, fat: 22 },
      dinner:    { name: 'Hel kyckling i ugnen med rotfrukter & örter', protein: 44, carbs: 42, fat: 16 },
      snack:     { name: 'Skyr 200g med hallon', protein: 18, carbs: 18, fat: 2 },
    },
    {
      breakfast: { name: 'Smoothiebowl: açaí, banan, granola & kokosflingor', protein: 12, carbs: 52, fat: 14 },
      lunch:     { name: 'Kycklingwrap med guacamole, paprika & sallad', protein: 38, carbs: 40, fat: 14 },
      dinner:    { name: 'Laxfilé med soja-glasyr, ångat ris & edamamebönor', protein: 40, carbs: 46, fat: 18 },
      snack:     { name: 'Proteinbar + en apelsin', protein: 20, carbs: 30, fat: 8 },
    },
    {
      breakfast: { name: 'Äggröra med 3 ägg, tomater & fullkornsbröd (2 sk)', protein: 24, carbs: 34, fat: 14 },
      lunch:     { name: 'Haloumi-sallad med quinoa, oliv & mintdressing', protein: 28, carbs: 40, fat: 20 },
      dinner:    { name: 'Pasta med tomatsås, basilika & parmesanost', protein: 28, carbs: 62, fat: 14 },
      snack:     { name: 'Kvarg med kakao & jordgubbsjam', protein: 18, carbs: 20, fat: 4 },
    },
    {
      breakfast: { name: 'Knäckebröd (4 st) med keso, avokado & tomat', protein: 18, carbs: 38, fat: 12 },
      lunch:     { name: 'Räkor med vitlöksquinoa & blandad sallad', protein: 32, carbs: 40, fat: 10 },
      dinner:    { name: 'Kycklingsoppa med nudlar, ingefära & pak choi', protein: 40, carbs: 44, fat: 10 },
      snack:     { name: 'Ägg (2 st) + ruccola + olivolja + parmesancracker', protein: 16, carbs: 10, fat: 14 },
    },
    {
      breakfast: { name: 'Pancakes (3 st) med blåbärssylt & skyr', protein: 20, carbs: 48, fat: 8 },
      lunch:     { name: 'Bönröra med pitabröd, riven morot & babyspenat', protein: 24, carbs: 48, fat: 8 },
      dinner:    { name: 'Tilapia med citron-örtbakad zucchini & bulgur', protein: 38, carbs: 42, fat: 10 },
      snack:     { name: 'Banan + 1 msk mandel smör + proteinshake', protein: 22, carbs: 34, fat: 10 },
    },
    {
      breakfast: { name: 'Frukostsmoothie: spenat, ananas, grek. yoghurt, honung', protein: 16, carbs: 46, fat: 4 },
      lunch:     { name: 'Turkisk-kycklingpilav med gröna ärtor & mynta', protein: 38, carbs: 50, fat: 12 },
      dinner:    { name: 'Laxburgare med lättrema coleslaw & potatisklyftor', protein: 42, carbs: 50, fat: 18 },
      snack:     { name: 'Chiafrönspudding med kokosmjölk & mandarinklyftor', protein: 10, carbs: 28, fat: 12 },
    },
  ],
}

function generateMealPlan(weightGoal, targetCalories) {
  const templates = MEAL_TEMPLATES[weightGoal] || MEAL_TEMPLATES['Bibehålla']
  const plan = []
  for (let day = 1; day <= 14; day++) {
    const template = templates[(day - 1) % 7]
    const totalProtein = template.breakfast.protein + template.lunch.protein + template.dinner.protein + template.snack.protein
    const totalCarbs   = template.breakfast.carbs   + template.lunch.carbs   + template.dinner.carbs   + template.snack.carbs
    const totalFat     = template.breakfast.fat     + template.lunch.fat     + template.dinner.fat     + template.snack.fat
    const totalCal     = totalProtein * 4 + totalCarbs * 4 + totalFat * 9
    plan.push({ day, ...template, totalProtein, totalCarbs, totalFat, totalCal })
  }
  return plan
}

// ─── Trial Countdown Component ───────────────────────────────────────────────
function TrialCountdown({ trialStart }) {
  const start = new Date(trialStart)
  const end = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000)
  const now = new Date()
  const msLeft = end - now
  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))
  const daysUsed = 14 - daysLeft
  const pct = Math.min(100, (daysUsed / 14) * 100)

  const color = daysLeft > 7 ? '#10b981' : daysLeft > 3 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(184,149,71,0.1) 0%, rgba(99,102,241,0.08) 100%)',
      border: '1px solid rgba(184,149,71,0.2)',
      borderRadius: '16px', padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
      marginBottom: '20px'
    }}>
      <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
        <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="40" cy="40" r="32" fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray="201"
            strokeDashoffset={201 - (201 * pct) / 100}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '80px', height: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-white)' }}>{daysLeft}</span>
          <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>dagar kvar</span>
        </div>
      </div>
      <div>
        <h4 style={{ color: 'var(--text-white)', margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 'bold' }}>
          Din 14-dagars testperiod
        </h4>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem', lineHeight: 1.4 }}>
          Du är på dag <strong>{daysUsed + 1}</strong> av din 14-dagars gratis provperiod.
          Ditt provschema avslutas den {end.toLocaleDateString('sv-SE')}.
        </p>
      </div>
    </div>
  )
}

// ─── ExerciseCard Component ──────────────────────────────────────────────────
function ExerciseCard({ ex, idx }) {
  const [expanded, setExpanded] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const [showPeak, setShowPeak] = useState(false)
  const imgSrc = imgErr ? null : (showPeak ? ex.images.classic.peak : ex.images.classic.start)

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <div
        style={{ height: '120px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
        onClick={() => setShowPeak(p => !p)}
      >
        {imgSrc && !imgErr ? (
          <img src={imgSrc} alt={ex.name_en} onError={() => setImgErr(true)} style={{ height: '110px', objectFit: 'contain', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.6))' }} />
        ) : (
          <span style={{ fontSize: '2.5rem' }}>💪</span>
        )}
        <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'var(--accent-gold)', color: '#000', fontWeight: 'bold', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '100px' }}>
          #{idx + 1}
        </div>
        <div style={{ position: 'absolute', bottom: '4px', right: '6px', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>
          {imgSrc?.includes('.gif') ? '🎬 6s Video' : (showPeak ? 'PEAK' : 'START')}
        </div>
      </div>

      <div style={{ padding: '12px' }}>
        <h5 style={{ color: 'var(--text-white)', margin: '0 0 6px 0', fontSize: '0.82rem', fontWeight: 'bold', lineHeight: 1.3 }}>{ex.name_en}</h5>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span style={{ background: 'rgba(184,149,71,0.15)', color: 'var(--accent-gold)', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 7px', borderRadius: '100px', border: '1px solid rgba(184,149,71,0.3)' }}>{ex.sets} set</span>
          <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 7px', borderRadius: '100px', border: '1px solid rgba(16,185,129,0.25)' }}>{ex.reps} reps</span>
        </div>
        <button
          onClick={() => setExpanded(p => !p)}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
        >
          {expanded ? '▲ Stäng' : '▼ Instruktioner'}
        </button>
        {expanded && (
          <ol style={{ margin: '8px 0 0 0', paddingLeft: '16px', fontSize: '0.72rem', color: 'var(--text-silver)', lineHeight: 1.5 }}>
            {ex.instructions_en?.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        )}
      </div>
    </div>
  )
}

// ─── MealDayCard Component ───────────────────────────────────────────────────
function MealDayCard({ meal, isToday }) {
  const [expanded, setExpanded] = useState(isToday)

  return (
    <div style={{
      border: isToday ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      background: isToday
        ? 'linear-gradient(135deg, rgba(184,149,71,0.08) 0%, rgba(184,149,71,0.02) 100%)'
        : 'rgba(255,255,255,0.02)',
      overflow: 'hidden',
    }}>
      <div
        style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={() => setExpanded(p => !p)}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isToday && <span style={{ background: 'var(--accent-gold)', color: '#000', fontSize: '0.6rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '100px' }}>IDAG</span>}
            <span style={{ color: isToday ? 'var(--text-white)' : 'var(--text-silver)', fontWeight: 'bold', fontSize: '0.88rem' }}>Dag {meal.day}</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
            {meal.totalCal} kcal · P: {meal.totalProtein}g · K: {meal.totalCarbs}g · F: {meal.totalFat}g
          </div>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px' }}>
          {[
            { label: '🌅 Frukost', data: meal.breakfast },
            { label: '☀️ Lunch', data: meal.lunch },
            { label: '🍽️ Middag', data: meal.dinner },
            { label: '🥄 Mellanmål', data: meal.snack },
          ].map(({ label, data }) => (
            <div key={label} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 'bold', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-white)', marginBottom: '4px', lineHeight: 1.3 }}>{data.name}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.65rem', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', padding: '1px 7px', borderRadius: '100px', border: '1px solid rgba(56,189,248,0.2)' }}>P: {data.protein}g</span>
                <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '1px 7px', borderRadius: '100px', border: '1px solid rgba(16,185,129,0.2)' }}>K: {data.carbs}g</span>
                <span style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '1px 7px', borderRadius: '100px', border: '1px solid rgba(245,158,11,0.2)' }}>F: {data.fat}g</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}


// ─── Helper to parse lead message from database ─────────────────────────────
function parseLeadMessage(message) {
  if (!message) return null;
  const data = {};
  
  const daysMatch = message.match(/- Träningsdagar per vecka:\s*(\d+)/i);
  if (daysMatch) {
    const days = daysMatch[1];
    if (days === '1' || days === '2') data.trainingDays = '1-2';
    else if (days === '6' || days === '7') data.trainingDays = '6-7';
    else data.trainingDays = days;
  }
  
  const equipMatch = message.match(/- Tillgänglig utrustning:\s*([^\r\n]+)/i);
  if (equipMatch) data.equipmentAvailable = equipMatch[1].trim();
  
  const expMatch = message.match(/- Träningserfarenhet:\s*([^\r\n]+)/i);
  if (expMatch) data.experienceLevel = expMatch[1].trim();
  
  const calMatch = message.match(/Kalorimål \(([^)]+)\):\s*(\d+)\s*kcal/i);
  if (calMatch) {
    data.weightGoal = calMatch[1].trim();
    data.calories = { targetCalories: parseInt(calMatch[2]) };
  }
  
  const proteinMatch = message.match(/- Proteintarget:\s*(\d+)g/i);
  if (proteinMatch) {
    if (!data.calories) data.calories = {};
    data.calories.protein = parseInt(proteinMatch[1]);
  }
  const carbsMatch = message.match(/- Kolhydratstarget:\s*(\d+)g/i);
  if (carbsMatch) {
    if (!data.calories) data.calories = {};
    data.calories.carbs = parseInt(carbsMatch[1]);
  }
  const fatMatch = message.match(/- Fetttarget:\s*(\d+)g/i);
  if (fatMatch) {
    if (!data.calories) data.calories = {};
    data.calories.fat = parseInt(fatMatch[1]);
  }
  
  return data;
}

// ─── Main ClientProfile Component ────────────────────────────────────────────
function ClientProfile() {
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  usePageTitle('client_profile')

  // Main navigation tab
  const [mainTab, setMainTab] = useState('program') // 'program' | 'details'

  // Sub-states for Program & Meal Dashboard
  const [programData, setProgramData] = useState(null)
  const [program, setProgram] = useState(null)
  const [mealPlan, setMealPlan] = useState([])
  const [activeSubTab, setActiveSubTab] = useState('workout') // 'workout' | 'meals'
  const [activeWeek, setActiveWeek] = useState(1)
  const [activeDay, setActiveDay] = useState(0)
  const [selectedEx, setSelectedEx] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('client_token')
    if (!token) {
      navigate('/login')
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        const profileData = await fetchClientProfile(token)
        setProfile(profileData)
        
        const historyData = await fetchClientHistory(token)
        setHistory(historyData)

        // Load Onboarding program details from localStorage or database history
        let data = null;
        const stored = localStorage.getItem('client_program_data');
        if (stored) {
          try { data = JSON.parse(stored); } catch (e) {}
        }
        if (!data && historyData && historyData.length > 0) {
          data = parseLeadMessage(historyData[0].message);
        }

        if (data) {
          setProgramData(data);
          const p = buildProgram({
            trainingDays: data.trainingDays || '6-7',
            equipment: data.equipmentAvailable || 'Fria vikter & maskiner',
            experienceLevel: data.experienceLevel || 'Nybörjare',
            email: profileData?.email || 'user'
          });
          setProgram(p);

          const cal = data.calories?.targetCalories || 2000;
          const meals = generateMealPlan(data.weightGoal || 'Bibehålla', cal);
          setMealPlan(meals);
        }
      } catch (err) {
        if (err.message && (err.message.includes('401') || err.message.includes('token') || err.message.includes('profil') || err.message.includes('verifiera'))) {
          localStorage.removeItem('client_token')
          localStorage.removeItem('client_user')
          localStorage.removeItem('client_name')
          navigate('/login')
        } else if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
          console.warn("Backend offline or network error, displaying client profile with local data.");
          setError('')
        } else {
          setError(err.message || 'Kunde inte hämta din profil. Vänligen logga in igen.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('client_token')
    localStorage.removeItem('client_user')
    localStorage.removeItem('client_name')
    navigate('/')
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="profile-page container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Dumbbell className="animate-spin" />
          <span>{language === 'fa' ? 'در حال بارگذاری...' : language === 'en' ? 'Loading profile...' : 'Laddar profil...'}</span>
        </div>
      </div>
    )
  }

  // Which day of the trial is today?
  const trialStart = programData?.trialStartDate || (profile ? profile.createdAt : new Date().toISOString())
  const dayOfTrial = Math.min(14, Math.max(1, Math.ceil((Date.now() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24)) + 1))

  const currentWeekData = program ? (activeWeek === 1 ? program.week1 : program.week2) : []
  const currentDay = currentWeekData[activeDay] || null

  return (
    <div className={`profile-page container ${language === 'fa' ? 'rtl-align' : ''}`} style={{ paddingBottom: '100px' }}>
      
      {/* ── Tabs Selector at the very top of profile page ── */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '16px'
      }}>
        <button
          onClick={() => setMainTab('program')}
          style={{
            background: mainTab === 'program'
              ? 'linear-gradient(135deg, rgba(184,149,71,0.15), rgba(184,149,71,0.05))'
              : 'rgba(255,255,255,0.02)',
            border: mainTab === 'program' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
            color: mainTab === 'program' ? 'var(--text-white)' : 'var(--text-muted)',
            padding: '12px 28px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Dumbbell size={16} />
          <span>{language === 'fa' ? 'برنامه من' : language === 'en' ? 'My Program' : 'Mitt Program'}</span>
        </button>

        <button
          onClick={() => setMainTab('details')}
          style={{
            background: mainTab === 'details'
              ? 'linear-gradient(135deg, rgba(184,149,71,0.15), rgba(184,149,71,0.05))'
              : 'rgba(255,255,255,0.02)',
            border: mainTab === 'details' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
            color: mainTab === 'details' ? 'var(--text-white)' : 'var(--text-muted)',
            padding: '12px 28px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <User size={16} />
          <span>{language === 'fa' ? 'مشخصات من' : language === 'en' ? 'My Details' : 'Mina uppgifter'}</span>
        </button>
      </div>

      {error && (
        <div className="form-error" style={{ marginBottom: '30px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* ══════════════════ TAB 1: MITT PROGRAM DASHBOARD ══════════════════ */}
      {mainTab === 'program' && profile && (
        <div className="fade-in">
          {/* Welcome banner & Countdown */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                🏋️ {language === 'fa' ? 'برنامه شخصی شما' : language === 'en' ? 'Your Personal Space' : 'Din Personliga Dashboard'}
              </div>
              <h1 style={{ color: 'var(--text-white)', margin: 0, fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 'bold' }}>
                {language === 'fa' ? 'خوش آمدید،' : language === 'en' ? 'Welcome,' : 'Välkommen,'}{' '}
                <span style={{ background: 'linear-gradient(135deg, #b89547, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {profile.fullName.split(' ')[0]}
                </span> 👋
              </h1>
            </div>
            <button
              onClick={handleLogout}
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              {language === 'fa' ? 'خروج' : language === 'en' ? 'Log Out' : 'Logga ut'}
            </button>
          </div>

          <TrialCountdown trialStart={trialStart} />

          {/* Calorie Stats Row */}
          {programData?.calories && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '10px', marginBottom: '32px' }}>
              {[
                { label: 'Dagligt kalorimål', value: `${programData.calories.targetCalories} kcal`, color: 'var(--accent-gold)' },
                { label: 'Protein', value: `${programData.calories.protein}g`, color: '#38bdf8' },
                { label: 'Kolhydrater', value: `${programData.calories.carbs}g`, color: '#10b981' },
                { label: 'Fett', value: `${programData.calories.fat}g`, color: '#f59e0b' },
                { label: 'BMR', value: `${programData.calories.bmr} kcal`, color: 'var(--text-silver)' },
                { label: 'TDEE', value: `${programData.calories.tdee} kcal`, color: 'var(--text-silver)' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Sub tabs: Workout vs Meals */}
          <div style={{ display: 'flex', gap: '8px', margin: '24px 0 20px' }}>
            {[
              { id: 'workout', label: '🏋️ Träningsprogram', desc: '14 dagar' },
              { id: 'meals', label: '🍽️ Kostschema', desc: '14 dagars matplan' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  flex: 1, padding: '14px 16px',
                  borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                  border: activeSubTab === tab.id ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                  background: activeSubTab === tab.id
                    ? 'linear-gradient(135deg, rgba(184,149,71,0.15), rgba(184,149,71,0.05))'
                    : 'rgba(255,255,255,0.02)',
                  color: activeSubTab === tab.id ? 'var(--text-white)' : 'var(--text-muted)',
                  fontWeight: 'bold', fontSize: '0.9rem',
                  textAlign: 'left',
                }}
              >
                <div>{tab.label}</div>
                <div style={{ fontSize: '0.68rem', fontWeight: 'normal', color: 'var(--text-muted)', marginTop: '2px' }}>{tab.desc}</div>
              </button>
            ))}
          </div>

          {/* Subtab 1: Workout Program */}
          {activeSubTab === 'workout' && program && (
            <div>
              {/* Program details badge row */}
              {programData && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', fontSize: '0.75rem' }}>
                  {[
                    { label: `📅 ${programData.trainingDays} dagar/v` },
                    { label: `⏱️ ${programData.trainingDuration || '60 min'}` },
                    { label: `📍 ${programData.trainingLocation || 'Gym'}` },
                    { label: `🏆 ${programData.experienceLevel || 'Nybörjare'}` },
                    { label: `🎯 ${programData.weightGoal || 'Bibehålla'}` },
                  ].map(c => (
                    <span key={c.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 12px', borderRadius: '100px', color: 'var(--text-silver)' }}>
                      {c.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Week selector */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[1, 2].map(w => (
                  <button
                    key={w}
                    onClick={() => { setActiveWeek(w); setActiveDay(0) }}
                    style={{
                      flex: 1, padding: '12px',
                      borderRadius: '10px', fontWeight: 'bold', fontSize: '0.88rem',
                      cursor: 'pointer', transition: 'all 0.2s',
                      border: activeWeek === w ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                      background: activeWeek === w ? 'rgba(184,149,71,0.12)' : 'rgba(255,255,255,0.02)',
                      color: activeWeek === w ? 'var(--text-white)' : 'var(--text-muted)',
                    }}
                  >
                    {w === 1 ? '📅 Vecka 1 — Grund' : '📅 Vecka 2 — Progressive Overload'}
                    {w === 2 && <div style={{ fontSize: '0.65rem', color: '#8b5cf6', fontWeight: 'normal', marginTop: '2px' }}>+1 set compound · +2 reps isolation</div>}
                  </button>
                ))}
              </div>

              {/* Day selector */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {currentWeekData.map((day, idx) => {
                  const isActive = activeDay === idx
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveDay(idx)}
                      style={{
                        flex: 1, minWidth: '120px', padding: '12px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
                        border: isActive ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.07)',
                        background: isActive ? 'rgba(184,149,71,0.12)' : 'rgba(255,255,255,0.02)',
                        color: isActive ? 'var(--text-white)' : 'var(--text-silver)',
                        fontWeight: 'bold', fontSize: '0.82rem'
                      }}
                    >
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Dag {day.day}</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '2px' }}>
                        <span>{SPLIT_EMOJIS[day.splitType]}</span>
                        <span>{DAY_NAMES_SV[day.splitType].split(' (')[0]}</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Exercises list - Simulated Printed PT Template Sheet */}
              {currentDay && (
                <div style={{
                  background: '#fff', color: '#111827', borderRadius: '16px', padding: '40px 32px',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden',
                  marginTop: '24px', fontFamily: '"Outfit", "Inter", sans-serif'
                }}>
                  {/* Orange ribbon */}
                  <div style={{
                    position: 'absolute', top: '35px', left: '-20px', background: '#f97316', color: '#fff',
                    padding: '8px 40px', transform: 'rotate(-4deg)', fontWeight: '900', fontSize: '1.1rem',
                    textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    zIndex: 1
                  }}>
                    Vecka {activeWeek}
                  </div>

                  {/* Header */}
                  <div style={{ textAlign: 'right', marginBottom: '40px', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '900', textTransform: 'uppercase', color: '#111827', margin: 0 }}>
                      DAG {currentDay.day}
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      {DAY_NAMES_SV[currentDay.splitType]} {SPLIT_EMOJIS[currentDay.splitType]}
                    </span>
                  </div>

                  {/* Section 1: UPPVÄRMNING */}
                  <div style={{ marginBottom: '35px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '900', textTransform: 'uppercase', borderLeft: '4px solid #f97316', paddingLeft: '10px', color: '#111827', marginBottom: '14px' }}>
                      Uppvärmning
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Övning</th>
                            <th style={{ padding: '12px 16px', fontWeight: 'bold', width: '70px' }}>Set</th>
                            <th style={{ padding: '12px 16px', fontWeight: 'bold', width: '90px' }}>Reps</th>
                            <th style={{ padding: '12px 16px', fontWeight: 'bold', width: '110px' }}>Setvila</th>
                            <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Notering / Teknik</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#1f2937' }}>Roddmaskin / Lätt kondition</td>
                            <td style={{ padding: '12px 16px' }}>1</td>
                            <td style={{ padding: '12px 16px' }}>5-8 min</td>
                            <td style={{ padding: '12px 16px' }}>-</td>
                            <td style={{ padding: '12px 16px', color: '#4b5563' }}>Värm upp hela kroppen och smörj lederna. Moderat tempo.</td>
                          </tr>
                          {currentDay.exercises.length > 0 && (
                            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#1f2937' }}>{currentDay.exercises[0].name_en} (Ramp-up)</td>
                              <td style={{ padding: '12px 16px' }}>2</td>
                              <td style={{ padding: '12px 16px' }}>5-8 reps</td>
                              <td style={{ padding: '12px 16px' }}>1-2 min</td>
                              <td style={{ padding: '12px 16px', color: '#4b5563' }}>Specifik uppvärmning inför passets tyngsta baslyft. Gradvis tyngre vikter.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 2: TRÄNING */}
                  <div style={{ marginBottom: '35px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '900', textTransform: 'uppercase', borderLeft: '4px solid #f97316', paddingLeft: '10px', color: '#111827', marginBottom: '14px' }}>
                      Träning <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'none', fontWeight: 'normal', marginLeft: '8px' }}>(Klicka på en rad för att spela video/instruktioner)</span>
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Övning</th>
                            <th style={{ padding: '12px 16px', fontWeight: 'bold', width: '70px' }}>Set</th>
                            <th style={{ padding: '12px 16px', fontWeight: 'bold', width: '90px' }}>Reps</th>
                            <th style={{ padding: '12px 16px', fontWeight: 'bold', width: '110px' }}>Setvila</th>
                            <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Notering / Teknik</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentDay.exercises.filter(ex => !ex.isBandBicepsCurl).map((ex, idx) => {
                            const isHeavy = ex.id.includes('squat') || ex.id.includes('deadlift') || ex.id.includes('press') || ex.id.includes('row')
                            const restVal = ex.rest || (isHeavy ? '2-3 min' : '1.5 min')
                            const noteText = ex.note || (ex.id.includes('squat')
                              ? 'Fokus på höftdjup och upprätt överkropp. Knän i tårnas riktning.'
                              : ex.id.includes('deadlift')
                              ? 'Håll ryggen helt rak, stången nära kroppen. Spänn bålen.'
                              : ex.id.includes('row') || ex.id.includes('pull')
                              ? 'Dra med armbågarna, kläm ihop skulderbladen i toppläget.'
                              : 'Kontrollerad rörelsebana, spänn målhäftigt i toppläget.')

                            return (
                              <tr
                                key={ex.id + idx}
                                onClick={() => setSelectedEx({
                                  ...ex,
                                  name: ex.name_en || ex.name,
                                  gifUrl: ex.images?.classic?.start || ex.gifUrl,
                                  instructions: ex.instructions || ex.instructions_en || ['Utför kontrollerat.'],
                                  equipment: ex.equipment,
                                  primary_muscles: ex.primary_muscles,
                                  youtubeUrl: ex.youtubeUrl || ''
                                })}
                                style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s' }}
                                className="pt-table-row"
                              >
                                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ color: '#f97316' }}>🎬</span>
                                  <span style={{ borderBottom: '1px dashed #f97316' }}>{ex.name || ex.name_en}</span>
                                </td>
                                <td style={{ padding: '12px 16px' }}>{ex.sets}</td>
                                <td style={{ padding: '12px 16px' }}>{ex.reps}</td>
                                <td style={{ padding: '12px 16px' }}>{restVal}</td>
                                <td style={{ padding: '12px 16px', color: '#4b5563' }}>{noteText}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 3: KOMMENTAR */}
                  <div style={{
                    background: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '10px',
                    padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '6px'
                  }}>
                    <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#4b5563', letterSpacing: '0.02em' }}>
                      Kommentar / Coach tips:
                    </strong>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#1f2937', lineHeight: 1.5 }}>
                      {currentDay.splitType === 'lower' || currentDay.splitType === 'legs'
                        ? 'Det här är ett underkroppspass. Säkerställ god knäkontroll och att fötterna är stabilt placerade under alla pressrörelser. Håll ryggen rak i marklyft.'
                        : currentDay.splitType === 'upper'
                        ? 'Det här är ett överkroppspass. Fokusera på att pressa fram bröstet och dra ihop skulderbladen i alla rodd- och pressövningar.'
                        : 'Fokusera på en jämn intensitet genom passet. Håll vilotiderna strikta på baslyften för optimal återhämtning.'}
                    </p>

                    {currentDay.day === 4 && (
                      <div style={{
                        marginTop: '15px',
                        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                        border: '1px solid #bfdbfe',
                        borderRadius: '10px',
                        padding: '16px 20px',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.08)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <span style={{ fontSize: '1.2rem' }}>💡</span>
                          <strong style={{ fontSize: '0.85rem', color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                            Hantera klientens förväntningar (Kalorier & Muskelmassa)
                          </strong>
                        </div>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#1e40af', fontWeight: '500', lineHeight: 1.45 }}>
                          Att hantera en klients förväntningar kring kaloriförbrukning och muskelmassa efter ett 60-minuters pass är en viktig del av coachingen. Det korta svaret är: Styrketräning handlar mer om att "bygga en motor" än att bara "bränna bränsle" just under passet.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem', color: '#374151' }}>
                          <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <strong style={{ color: '#1e3a8a', display: 'block', marginBottom: '6px' }}>1. Kaloriförbrukning (Det svåra måttet)</strong>
                            <p style={{ margin: '0 0 6px 0' }}>Många klienter stirrar sig blinda på sin träningsklocka. Förklara följande:</p>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              <li style={{ marginBottom: '4px' }}><strong>Uppskattning:</strong> Under 60 minuter styrketräning bränner man i genomsnitt mellan 200–400 kalorier, beroende på intensitet, vilotid och kroppsvikt. Det är mindre än vid t.ex. löpning.</li>
                              <li style={{ marginBottom: '4px' }}><strong>EPOC (Efterbränning):</strong> Berätta för klienten att styrketräning har en "efterbränningseffekt". Kroppen kräver energi för att reparera musklerna i upp till 24–48 timmar efter passet. Så den totala kaloriförbrukningen är högre än vad klockan visar precis när passet är slut.</li>
                              <li><strong>Hantering (Vad du säger till klienten):</strong> "Vi fokuserar inte på att bränna mer kalorier bara, utan att skicka och signalera till kroppen att behålla och bygga muskler."</li>
                            </ul>
                          </div>

                          <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <strong style={{ color: '#1e3a8a', display: 'block', marginBottom: '6px' }}>2. Muskelmassa (Den långsiktiga investeringen)</strong>
                            <p style={{ margin: '0 0 6px 0' }}>Klienten vill se resultat direkt, men muskeluppbyggnad (hypertrofi) är en kemisk process som sker efter passet.</p>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              <li style={{ marginBottom: '4px' }}><strong>Passet är signalen:</strong> Förklara att under de 60 minuterna har de "brutit ner" musklerna och skapat mikroskador.</li>
                              <li style={{ marginBottom: '4px' }}><strong>Tillväxten sker under vila:</strong> Muskelmassan bygger när klienten sover och äter protein. Man ser inte ökad muskelmassa efter ett pass, det man ser är "pump" (blod som strömmar till muskeln).</li>
                              <li><strong>Hantering (Vad du säger till klienten):</strong> Fokusera på progressiv överbelastning. Säg: "Om du kan lyfta tyngre eller göra fler reps nästa vecka, då vet vi att du har byggt muskelmassa."</li>
                            </ul>
                          </div>

                          <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <strong style={{ color: '#1e3a8a', display: 'block', marginBottom: '6px' }}>3. Hur du hanterar klientens frågor (Praktiska tips)</strong>
                            <p style={{ margin: '0 0 6px 0' }}>Om klienten frågar: "Hur mycket brände jag och hur mycket muskler fick jag?", svara så här:</p>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              <li style={{ marginBottom: '4px' }}><strong>Flytta fokus från kalorier till prestation:</strong> "Idag körde vi ett riktigt bra pass med fokus på triceps och överkropp. Istället för att titta på kalorierna, titta på att du orkade mer än förra gången. Det är det som bygger formen."</li>
                              <li style={{ marginBottom: '4px' }}><strong>Prata om näring:</strong> "För att de här 60 minuterna ska förvandlas till muskelmassa behöver du nu få i dig protein och bra energi."</li>
                              <li><strong>Rätt saker att mäta framsteg genom:</strong> Bilder (månadsvis), styrkeökningar i träningsdagboken, hur kläderna sitter, eventuellt måttband eller InBody-mätning (men inte efter varje pass).</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Info */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Muscle & Focus · CC BY-NC 4.0
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subtab 2: Meal Plan */}
          {activeSubTab === 'meals' && (
            <div>
              {/* Daily target card */}
              {programData?.calories && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(184,149,71,0.08), rgba(16,185,129,0.06))',
                  border: '1px solid rgba(184,149,71,0.2)',
                  borderRadius: '14px', padding: '20px 24px',
                  marginBottom: '20px',
                }}>
                  <h3 style={{ color: 'var(--accent-gold)', margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 'bold' }}>
                    🍽️ Kostschema — Mifflin-St Jeor Beräkning
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>{programData.calories.targetCalories}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dagligt kalorimål (kcal)</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#38bdf8' }}>{programData.calories.protein}g</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Protein (1.8g/kg)</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981' }}>{programData.calories.protein ? programData.calories.carbs : 0}g</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kolhydrater</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f59e0b' }}>{programData.calories.fat}g</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fett (0.9g/kg)</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Mål: <strong style={{ color: 'var(--text-white)' }}>{programData.weightGoal}</strong> · Aktivitetsnivå: <strong style={{ color: 'var(--text-white)' }}>{programData.activityLevel}</strong>
                  </div>
                </div>
              )}

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                Nedan ser du ditt kompletta 14-dagars kostschema med frukost, lunch, middag och mellanmål. Dag {dayOfTrial} är markerat som idag.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mealPlan.map(meal => (
                  <MealDayCard key={meal.day} meal={meal} isToday={meal.day === dayOfTrial} />
                ))}
              </div>
            </div>
          )}

          {/* Premium Upgrade Banner */}
          <div style={{
            marginTop: '48px',
            background: 'linear-gradient(135deg, rgba(184,149,71,0.1), rgba(99,102,241,0.08))',
            border: '1px solid rgba(184,149,71,0.2)',
            borderRadius: '20px', padding: '36px 24px', textAlign: 'center',
          }}>
            <h3 style={{ color: 'var(--text-white)', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 12px 0' }}>
              Vill du ha ett ännu mer skräddarsytt program? 🚀
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 24px 0', lineHeight: 1.6 }}>
              Under testperioden ser du ett urval. Med ett fullständigt paket får du daglig coaching, personlig feedback och ett program uppdaterat varje vecka direkt från Ali.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/ansok"
                style={{
                  background: 'linear-gradient(135deg, #b89547, #a07830)',
                  color: '#000', fontWeight: 'bold', fontSize: '0.95rem',
                  padding: '14px 28px', borderRadius: '100px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(184,149,71,0.4)',
                }}
              >
                Välj ett paket →
              </Link>
              <Link
                to="/paket"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-silver)', fontWeight: '600', fontSize: '0.95rem',
                  padding: '14px 28px', borderRadius: '100px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  textDecoration: 'none',
                }}
              >
                Se priser
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ TAB 2: MINA UPPGIFTER (PROFILE INFO & HISTORY) ══════════════════ */}
      {mainTab === 'details' && profile && (
        <div className="profile-grid fade-in">
          {/* Profile Card */}
          <div className="profile-info-card glass-panel">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {profile.fullName ? profile.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="profile-avatar-glow"></div>
            </div>
            
            <h2>{profile.fullName}</h2>
            <div className="profile-email-badge">{profile.email}</div>

            <div className="profile-details-list">
              <div className="profile-detail-item">
                <span className="profile-detail-label">
                  {language === 'fa' ? 'نام و نام خانوادگی' : language === 'en' ? 'Full Name' : 'Fullständigt namn'}
                </span>
                <span className="profile-detail-value">{profile.fullName}</span>
              </div>
              
              <div className="profile-detail-item">
                <span className="profile-detail-label">
                  {language === 'fa' ? 'شماره تلفن' : language === 'en' ? 'Phone Number' : 'Telefonnummer'}
                </span>
                <span className="profile-detail-value">{profile.phoneNumber}</span>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">
                  {language === 'fa' ? 'پست الکترونیکی' : language === 'en' ? 'Email Address' : 'E-post'}
                </span>
                <span className="profile-detail-value">{profile.email}</span>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">
                  {language === 'fa' ? 'تاریخ ثبت‌نام' : language === 'en' ? 'Register Date' : 'Medlem sedan'}
                </span>
                <span className="profile-detail-value">
                  {new Date(profile.createdAt).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'sv-SE')}
                </span>
              </div>
            </div>

            <button onClick={handleLogout} className="btn-secondary btn-profile-logout" style={{ justifyContent: 'center', width: '100%', marginTop: '10px' }}>
              <LogOut size={14} style={{ marginRight: '8px' }} />
              <span>{t('clientLogout')}</span>
            </button>
          </div>

          {/* History Panel */}
          <div className="history-panel glass-panel">
            <h2>{language === 'fa' ? 'تاریخچه برنامه‌ها و پکیج‌ها' : language === 'en' ? 'Application & Package History' : 'Mina paket & historik'}</h2>
            
            {history.length === 0 ? (
              <div className="history-empty">
                <Calendar size={48} className="history-empty-icon" />
                <p>
                  {language === 'fa' 
                    ? 'شما هنوز هیچ درخواستی ارسال نکرده‌اید.' 
                    : language === 'en' 
                    ? 'You have not submitted any package requests yet.' 
                    : 'Du har inte skickat in några intresseanmälningar ännu.'}
                </p>
                <Link to="/paket" className="btn-primary history-empty-btn">
                  {language === 'fa' ? 'مشاهده پکیج‌های تمرینی' : language === 'en' ? 'Explore Training Packages' : 'Utforska träningspaket'}
                </Link>
              </div>
            ) : (
              <div className="history-list">
                {history.map((lead) => (
                  <div key={lead.id} className="history-item">
                    <div className="history-item-header">
                      <div>
                        <h3 className="history-package-name">{lead.trainingWish}</h3>
                        <span className="history-date">
                          {new Date(lead.createdAt).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'sv-SE')} {new Date(lead.createdAt).toLocaleTimeString(language === 'fa' ? 'fa-IR' : 'sv-SE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="history-badges">
                        <span className={`status-badge ${lead.status.toLowerCase()}`}>
                          {lead.status === 'NEW' ? (language === 'fa' ? 'جدید' : language === 'en' ? 'New' : 'Mottagen') :
                           lead.status === 'CONTACTED' ? (language === 'fa' ? 'در تماس' : language === 'en' ? 'Contacted' : 'Kontaktad') :
                           lead.status === 'COMPLETED' ? (language === 'fa' ? 'کامل شده' : language === 'en' ? 'Completed' : 'Genomförd') : 
                           lead.status}
                        </span>
                        
                        {lead.paymentStatus && lead.paymentStatus !== 'NOT_REQUIRED' && (
                          <span className={`payment-badge ${lead.paymentStatus.toLowerCase()}`}>
                            {lead.paymentStatus === 'PAID' ? (language === 'fa' ? 'پرداخت شده' : language === 'en' ? 'Paid' : 'Betald') :
                             lead.paymentStatus === 'PENDING_PAYMENT' ? (language === 'fa' ? 'در انتظار پرداخت' : language === 'en' ? 'Pending' : 'Väntar på betalning') :
                             lead.paymentStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="history-item-details">
                      <div className="history-detail-field">
                        <strong>{language === 'fa' ? 'شهر:' : language === 'en' ? 'City:' : 'Stad:'} </strong>
                        <span>{lead.city}</span>
                      </div>
                      
                      <div className="history-detail-field">
                        <strong>{language === 'fa' ? 'سن:' : language === 'en' ? 'Age:' : 'Ålder:'} </strong>
                        <span>{lead.age} {language === 'fa' ? 'سال' : language === 'en' ? 'y/o' : 'år'}</span>
                      </div>

                      {lead.amountPaid > 0 && (
                        <div className="history-detail-field">
                          <strong>{language === 'fa' ? 'مبلغ پرداخت شده:' : language === 'en' ? 'Amount Paid:' : 'Betalt belopp:'} </strong>
                          <span>{lead.amountPaid} kr</span>
                        </div>
                      )}
                    </div>

                    {lead.message && (
                      <div className="history-detail-field" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <strong>{language === 'fa' ? 'پیام:' : language === 'en' ? 'Message:' : 'Meddelande / Anteckningar:'}</strong>
                        <div className="history-message-box">
                          {lead.message}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {selectedEx && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex',
          justifyContent: 'center', alignItems: 'center', padding: '16px',
          backdropFilter: 'blur(6px)'
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid rgba(184,149,71,0.3)',
            borderRadius: '16px', maxWidth: '520px', width: '100%', maxHeight: '90vh',
            overflowY: 'auto', padding: '24px', position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }} className="custom-scrollbar">
            <button
              onClick={() => setSelectedEx(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.08)',
                border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%',
                fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </button>

            <h3 style={{ color: 'var(--accent-gold)', margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 'bold' }}>
              🎬 Demonstrationsvideo & Teknikguide
            </h3>

            {/* Video / GIF container */}
            <div style={{
              background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <img
                src={selectedEx.gifUrl}
                alt={selectedEx.name}
                style={{ height: '210px', objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))' }}
              />
            </div>

            <h4 style={{ color: 'var(--text-white)', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              {selectedEx.name}
            </h4>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', fontSize: '0.75rem' }}>
              {selectedEx.equipment && (
                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: 'var(--text-silver)' }}>
                  Utrustning: {selectedEx.equipment}
                </span>
              )}
              {selectedEx.primary_muscles && (
                <span style={{ background: 'rgba(184,149,71,0.12)', padding: '4px 10px', borderRadius: '6px', color: 'var(--accent-gold)' }}>
                  Muskel: {Array.isArray(selectedEx.primary_muscles) ? selectedEx.primary_muscles.join(', ') : selectedEx.primary_muscles}
                </span>
              )}
            </div>

            {/* YouTube Shorts Button */}
            {selectedEx.youtubeUrl && (
              <div style={{ marginBottom: '20px' }}>
                <a
                  href={selectedEx.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)', color: '#ffffff',
                    padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.88rem',
                    textDecoration: 'none', width: '100%', boxShadow: '0 4px 15px rgba(255,0,0,0.35)',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>▶️</span> Se instruktionsvideo på YouTube Shorts
                </a>
              </div>
            )}

            {/* Instructions */}
            <div style={{ marginBottom: '20px' }}>
              <strong style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--accent-gold)', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>
                📌 Instruktioner:
              </strong>
              <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-silver)', lineHeight: 1.6 }}>
                {(selectedEx.instructions || selectedEx.instructions_en || ['Utför kontrollerat.']).map((inst, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>{inst}</li>
                ))}
              </ol>
            </div>

            {/* Tekniktips */}
            {(selectedEx.tips || selectedEx.tips_en) && !selectedEx.isInclineLeverPress && !selectedEx.isElevatedPushUp && !selectedEx.isLeverChestPress && !selectedEx.isSmithInclineBenchPress && !selectedEx.isPushUp && !selectedEx.isCableStandingFly && !selectedEx.isDbBenchPress && !selectedEx.isDbInclineBenchPress && !selectedEx.isInclineBenchPress && !selectedEx.isLeverSeatedFly && !selectedEx.isBenchPress && !selectedEx.isStandardPushdown && !selectedEx.isReverseGripPushdown && !selectedEx.isCableOneArmTricepPushdown && !selectedEx.isRopeTricepsPushdown && !selectedEx.isCableSeatedRearLateral && !selectedEx.isKettlebellLateralRaise && !selectedEx.isBandRearDeltRow && !selectedEx.isLeverMilitaryPress && !selectedEx.isDumbbellSeatedShoulderPress && !selectedEx.isPoliquinLateralRaise && !selectedEx.isOneArmShoulderPress && !selectedEx.isArnoldPress && !selectedEx.isSmithSeatedShoulderPress && !selectedEx.isJackknifeSitUp && !selectedEx.isOtisUp && !selectedEx.isAbdominalCrunch && !selectedEx.isLyingLegRaise && !selectedEx.isAlternateHeelTouchers && !selectedEx.isFrontPlank && (
              <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <strong style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#38bdf8', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  💡 Tekniktips:
                </strong>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-silver)', lineHeight: 1.5 }}>
                  {(selectedEx.tips || selectedEx.tips_en).map((tip, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Anatomisk & Muskel-analys ruta */}
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            {(selectedEx.isInclineLeverPress || selectedEx.name_en === 'Lever Lying Chest Press' || selectedEx.name?.includes('Incline Lever Press')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Lever Lying Chest Press (här i en lutande variant, ofta kallad Incline Lever Press) är en maskinövning som fokuserar på överkroppens pressmuskulatur med hög stabilitet.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Övre bröstmuskulaturen (Pectoralis Major, klavikulära delen):</strong> Tack vare lutningen läggs huvudfokus på den övre delen av bröstet, vilket fyller ut partiet vid nyckelbenen.</li>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Kopplas in kraftigt på grund av vinkeln.</li>
                    <li><strong>Triceps Brachii:</strong> Arbetar för att sträcka ut armarna i slutfasen av pressen.</li>
                    <li><strong>Serratus Anterior:</strong> Musklerna på sidan av bröstkorgen som stabiliserar skulderbladen.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom en pressrörelse (flexion och adduktion).</li>
                    <li><strong>Armbågsleden:</strong> Genom uträtning (extension).</li>
                    <li><strong>Skulderbladen:</strong> Som rör sig statiskt mot ryggstödet för stabilitet.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Sitt djupt i sätet:</strong> Tryck bak axlarna och håll bröstet högt under hela rörelsen.</li>
                    <li><strong>Håll emot:</strong> Var noga med att inte låta vikten "falla" tillbaka. Bromsa rörelsen på vägen ner för att maximera muskeltillväxten.</li>
                    <li><strong>Lås inte ut helt:</strong> Undvik att "smälla" fast armbågarna i rakt läge; håll en liten mikroböj i toppen för att behålla spänningen i muskeln.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isElevatedPushUp || selectedEx.name_en === 'Elevated Push-up' || selectedEx.name?.includes('Incline Push-up')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Elevated Push-up (ibland kallad Incline Push-up) är en variant av armhävningar där du placerar händerna på en upphöjd yta, som en bänk eller en steplåda. Detta är en utmärkt övning för att anpassa svårighetsgraden och ändra vinkeln på bröstträningen.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Stora bröstmuskeln (Pectoralis Major):</strong> Huvudmålet. Tack vare vinkeln läggs ett extra fokus på den nedre och mellersta delen av bröstet.</li>
                    <li><strong>Triceps Brachii:</strong> Musklerna på baksidan av armen som hjälper till att pressa kroppen uppåt.</li>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Assisterar i pressrörelsen.</li>
                    <li><strong>Core (Bål):</strong> Magmusklerna jobbar statiskt för att hålla kroppen rak som en planka.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom horisontell adduktion (armarna förs in mot mitten).</li>
                    <li><strong>Armbågsleden:</strong> Genom uträtning (extension).</li>
                    <li><strong>Handleden:</strong> Belastas mindre än vid vanliga armhävningar eftersom vinkeln ofta blir naturligare.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Kroppskontroll:</strong> Precis som i en vanlig armhävning ska kroppen vara spikrak från huvud till häl. Låt inte höften svanka eller peka uppåt.</li>
                    <li><strong>Sänk bröstet mot kanten:</strong> Sänk dig kontrollerat tills bröstet nästan nuddar kanten på steplådan/bänken.</li>
                    <li><strong>Armbågsvinkel:</strong> Håll armbågarna i ca 45 graders vinkel från kroppen (inte rakt ut åt sidorna) för att skydda axlarna.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isLeverChestPress || selectedEx.name_en === 'Lever Chest Press' || selectedEx.name?.includes('bröstpress i maskin')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Lever Chest Press (Sittande bröstpress i maskin) är en kraftfull basövning för överkroppen som låter dig träna bröstmuskulaturen med hög belastning och maximal säkerhet.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Stora bröstmuskeln (Pectoralis Major):</strong> Huvudmålet. Maskinen är designad för att maximera belastningen på hela bröstpartiet.</li>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Assisterar kraftfullt i pressrörelsen.</li>
                    <li><strong>Triceps Brachii:</strong> Jobbar för att sträcka ut armarna i slutfasen av pressen.</li>
                    <li><strong>Serratus Anterior:</strong> Stabiliserar bröstkorgen och skulderbladen under lyftet.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom horisontell adduktion (armarna pressas framåt och inåt).</li>
                    <li><strong>Armbågsleden:</strong> Genom extension (uträtning).</li>
                    <li><strong>Skulderbladen:</strong> Som ligger fixerade mot ryggstödet för att skapa en stabil bas.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Dra bak axlarna:</strong> Innan du börjar, dra ihop skulderbladen och tryck ner dem. Håll kvar dem mot ryggstödet under hela setet för att skydda axlarna och låta bröstet göra jobbet.</li>
                    <li><strong>Inställning av sitsen:</strong> Justera sitsen så att handtagen är i höjd med mitten eller nedre delen av ditt bröst.</li>
                    <li><strong>Håll emot:</strong> Var noga med att hålla emot vikten på vägen tillbaka (excentrisk fas). Det är där mycket av muskeluppbyggnaden sker!</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isSmithInclineBenchPress || selectedEx.name_en === 'Smith Incline Bench Press' || selectedEx.name?.includes('Smith-maskin')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Smith Incline Bench Press (Lutande bänkpress i Smith-maskin) är en suverän övning för att bygga den övre delen av bröstmuskulaturen med maximal stabilitet och säkerhet.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Övre bröstmuskulaturen (Pectoralis Major, klavikulära delen):</strong> Huvudfokus tack vare bänkens lutning.</li>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Kopplas in kraftigt på grund av vinkeln.</li>
                    <li><strong>Triceps Brachii:</strong> Hjälper till att pressa stången den sista biten och sträcka ut armarna.</li>
                    <li><strong>Serratus Anterior:</strong> Stabiliserar skulderbladen.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom pressrörelsen (flexion och adduktion).</li>
                    <li><strong>Armbågsleden:</strong> Genom uträtning (extension).</li>
                    <li><strong>Skulderbladen:</strong> Som rör sig statiskt mot bänken för att skapa en stabil bas.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Positionering:</strong> Se till att bänken står precis mitt under stången. Stången ska sänkas mot den övre delen av bröstet, strax under nyckelbenen.</li>
                    <li><strong>Skulderbladen:</strong> Dra ihop skulderbladen och tryck ner dem i bänken för att skydda axlarna och skapa en stabil plattform.</li>
                    <li><strong>Grepp:</strong> Håll ett grepp som är något bredare än axelbrett så att underarmarna är vertikala i bottenläget.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isPushUp || selectedEx.name_en === 'Push-up' || selectedEx.name?.includes('Armhävning')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Push-up (Armhävning) är den ultimata kroppsviktsövningen för överkroppen. Det är en basövning som tränar hela framsidan av kroppen samtidigt.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Stora bröstmuskeln (Pectoralis Major):</strong> Huvudmålet för rörelsen.</li>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Jobbar hårt för att hjälpa till i pressen.</li>
                    <li><strong>Triceps Brachii:</strong> Musklerna på baksidan av överarmen som rätar ut armbågarna.</li>
                    <li><strong>Core (Bål):</strong> Magmusklerna och ländryggen jobbar statiskt för att hålla kroppen spikrak.</li>
                    <li><strong>Serratus Anterior:</strong> Musklerna vid revbenen som stabiliserar skulderbladen mot bröstkorgen.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom horisontell adduktion (armarna förs in mot mitten).</li>
                    <li><strong>Armbågsleden:</strong> Genom extension (uträtning).</li>
                    <li><strong>Skulderbladen:</strong> Som rör sig aktivt för att stödja axelns position.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Kroppen som en planka:</strong> Spänn sätet och magen. Höften får inte hänga ner mot golvet och rumpan ska inte peka upp i vädret.</li>
                    <li><strong>Armbågarnas vinkel:</strong> Låt inte armbågarna peka rakt ut åt sidorna (T-form). Håll dem i ca 45 graders vinkel från kroppen (pil-form) för att skona axlarna.</li>
                    <li><strong>Hela vägen:</strong> Bröstet ska nästan nudda golvet och armarna ska sträckas ut helt i toppläget.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isCableStandingFly || selectedEx.name_en === 'Cable Standing Fly' || selectedEx.name?.includes('Cable Cross-over')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Cable Standing Fly (ofta kallat Cable Cross-over) är en av de absolut bästa isolationsövningarna för bröstet tack vare kabelmaskinens jämna motstånd.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Stora bröstmuskeln (Pectoralis Major):</strong> Detta är huvudmålet.
                      <br /><em style={{ fontSize: '0.78rem', color: '#00f2fe' }}>Notera: I bilden dras kablarna uppifrån och ned, vilket lägger extra fokus på den nedre och mellersta delen av bröstet.</em>
                    </li>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Assisterar i rörelsen att föra armarna framåt.</li>
                    <li><strong>Serratus Anterior:</strong> Musklerna på sidan av bröstkorgen som stabiliserar skulderbladen.</li>
                    <li><strong>Core (Bål):</strong> Eftersom du står upp tvingas magmusklerna jobba hårt för att hålla kroppen stabil så att inte kablarna drar dig bakåt.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Detta är en isolationsövning (enledsövning). Rörelsen sker genom horisontell adduktion (armarna förs in mot kroppens mittlinje).</li>
                    <li><strong>Armbågsleden:</strong> Jobbar endast statiskt. Armbågarna ska vara lätt böjda men helt fixerade under hela rörelsen.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>"Krama ett träd":</strong> Håll armarna i en fast, lätt böjd position (som om du kramar ett stort träd).</li>
                    <li><strong>Stabilitet:</strong> Stå med en fot framför den andra (split stance) för att stå stadigt och undvika att gunga med överkroppen.</li>
                    <li><strong>Kläm ihop:</strong> Fokusera på att verkligen pressa ihop bröstmusklerna när händerna möts.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isDbBenchPress || selectedEx.name_en === 'Dumbbell Bench Press' || selectedEx.name?.includes('Hantelbänkpress')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Dumbbell Bench Press (Hantelbänkpress) är ett av de mest effektiva alternativen till skivstångsbänkpress. Den ger en fantastisk kombination av muskeluppbyggnad, balans och rörlighet.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Stora bröstmuskeln (Pectoralis Major):</strong> Huvudmålet. Hantlarna gör att du kan träffa muskeln över ett större område.</li>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Jobbar hårt för att hjälpa till i pressen.</li>
                    <li><strong>Triceps Brachii:</strong> Ansvarar för att räta ut armarna i slutfasen.</li>
                    <li><strong>Stabiliserande muskler:</strong> Små muskler kring axeln och bålen jobbar konstant för att hålla hantlarna på plats.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom pressrörelsen (horisontell adduktion).</li>
                    <li><strong>Armbågsleden:</strong> Genom uträtning (extension).</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Håll ihop skulderbladen:</strong> Skapa en stabil bas mot bänken.</li>
                    <li><strong>Kontrollerad sänkning:</strong> Gå djupt nog för att känna en stretch i bröstet, men utan att tappa kontrollen.</li>
                    <li><strong>Pressa ihop:</strong> Tänk att hantlarna ska röra sig mot varandra i toppläget (utan att slå ihop dem) för att verkligen spänna bröstet.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isDbInclineBenchPress || selectedEx.name_en === 'Dumbbell Incline Bench Press' || selectedEx.name?.includes('Lutande hantelpress')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Dumbbell Incline Bench Press (Lutande hantelpress) är en av de mest effektiva övningarna för att bygga en komplett och välutvecklad bröstmuskulatur. Genom att använda hantlar istället för skivstång får du både större rörelseomfång och bättre muskelbalans.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Övre bröstmuskulaturen (Pectoralis Major, klavikulära delen):</strong> Detta är huvudmålet. Lutningen på bänken tvingar den övre delen av bröstet att ta mer av belastningen.</li>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Kopplas in kraftigt på grund av den uppåtlutade vinkeln.</li>
                    <li><strong>Triceps Brachii:</strong> Arbetar för att pressa upp vikterna och sträcka ut armbågen.</li>
                    <li><strong>Stabiliserande muskler:</strong> Små muskler kring axeln och bålen jobbar hårt för att hålla hantlarna stabila.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom pressrörelsen (horisontell adduktion och flexion).</li>
                    <li><strong>Armbågsleden:</strong> Genom uträtning (extension).</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Bänkvinkel:</strong> 30–45 grader är lagom. Mer än så och det blir nästan bara en axelövning.</li>
                    <li><strong>Sänk kontrollerat:</strong> Gå djupt så att du känner stretchen i bröstet, men utan att tappa kontrollen.</li>
                    <li><strong>Pressa ihop:</strong> Tänk att hantlarna ska mötas i en båge ovanför bröstet (utan att de slår ihop) för att få maximal kontakt.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isInclineBenchPress || selectedEx.name_en === 'Incline Bench Press' || selectedEx.name?.includes('Lutande bänkpress')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Incline Bench Press (Lutande bänkpress) är en tung basövning som flyttar belastningen högre upp på bröstkorgen jämfört med vanlig bänkpress. Den utförs på en bänk med ca 30–45 graders lutning.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Övre bröstmuskulaturen (Pectoralis Major, klavikulära delen):</strong> Detta är huvudmålet. Lutningen gör att de övre fibrerna av bröstmuskeln får jobba betydligt hårdare än vid plan bänkpress.</li>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Eftersom vinkeln är brantare kopplas axlarna in mer, vilket bygger styrka och massa i axelpartiet.</li>
                    <li><strong>Triceps Brachii:</strong> Arbetar för att sträcka ut armarna i den sista delen av pressen.</li>
                    <li><strong>Serratus Anterior:</strong> Stabiliserar skulderbladen.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom en kombination av flexion och adduktion.</li>
                    <li><strong>Armbågsleden:</strong> Genom extension (uträtning).</li>
                    <li><strong>Skulderbladen:</strong> Som stabiliserar rörelsen mot bänken.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Sänk stången högt:</strong> Vid vanlig bänkpress sänks stången mot mitten av bröstet; här sänks den mot den övre delen av bröstet, nära nyckelbenen.</li>
                    <li><strong>Lås skulderbladen:</strong> Precis som i vanlig bänkpress ska skulderbladen dras ihop och nedåt för att skapa en stabil bas och skydda axlarna.</li>
                    <li><strong>Vinkel på bänken:</strong> Överstiger lutningen 45 grader blir det mer av en ren axelövning. Håll dig runt 30 grader för att maximera kontakten med övre bröstet.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isLeverSeatedFly || selectedEx.name_en === 'Lever Seated Fly' || selectedEx.name?.includes('Pec Deck') || selectedEx.name?.includes('bröstflyes i maskin')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Lever Seated Fly (ofta kallad "Pec Deck" eller bröstflyes i maskin) är en ren isolationsövning för bröstet. Här är en kort genomgång av varför den är ett utmärkt komplement till pressövningar.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Stora bröstmuskeln (Pectoralis Major):</strong> Detta är huvudmålet. Övningen är särskilt bra för att träna bröstmuskeln i sitt helt utsträckta läge och i sitt helt sammandragna läge.</li>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Assisterar i rörelsen att föra armarna in mot mitten.</li>
                    <li><strong>Serratus Anterior:</strong> Musklerna på sidan av bröstkorgen som stabiliserar skulderbladen.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Detta är en enledsövning. Rörelsen sker genom horisontell adduktion (armarna förs in mot kroppens mittlinje i axelhöjd).</li>
                    <li><strong>Armbågsleden (Notera):</strong> Ska hållas i en fast, lätt böjd position under hela rörelsen och ska inte röra sig.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>"Krama ett träd":</strong> Föreställ dig att du ska krama ett stort träd. Håll armarna lätt böjda men stela.</li>
                    <li><strong>Pressa ihop:</strong> När händerna möts i mitten, tänk att du ska pressa ihop dina bröstmuskler så hårt du kan i en sekund.</li>
                    <li><strong>Sitt stadigt:</strong> Håll ryggen och huvudet mot ryggstödet. Undvik att skjuta fram axlarna när du pressar ihop.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isBenchPress || selectedEx.name_en === 'Bench Press' || selectedEx.name?.includes('Bänkpress')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Bench Press (Bänkpress) anses ofta vara "kungen" av överkroppsövningar. Det är en tung basövning (flerledsövning) som är den ultimata mätstocken för styrka i överkroppens pressmuskulatur.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Stora bröstmuskeln (Pectoralis Major):</strong> Detta är huvudmålet. Övningen bygger både massa och explosiv kraft i hela bröstpartiet.</li>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Jobbar mycket hårt för att hjälpa till att pressa stången uppåt.</li>
                    <li><strong>Triceps Brachii:</strong> Musklerna på baksidan av överarmen ansvarar för att räta ut armbågarna i den sista delen av lyftet.</li>
                    <li><strong>Serratus Anterior:</strong> Musklerna på sidan av bröstkorgen som stabiliserar skulderbladen.</li>
                    <li><strong>Core & Rygg:</strong> Latissimus dorsi (latsen) och bålen jobbar statiskt för att skapa en stabil plattform på bänken.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom horisontell adduktion (armarna förs in mot kroppens mittlinje).</li>
                    <li><strong>Armbågsleden:</strong> Genom extension (uträtning av armen).</li>
                    <li><strong>Skulderbladen:</strong> Som ska hållas fixerade och tillbakadragna för att skydda axlarna.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Fem kontaktpunkter:</strong> Huvud, övre rygg och säte ska alltid vara i bänken, och båda fötterna ska vara stadigt i golvet ("foot drive").</li>
                    <li><strong>Dra ihop skulderbladen:</strong> Tänk att du ska "stoppa skulderbladen i bakfickorna". Det skapar en stabil bas och skyddar axlarna.</li>
                    <li><strong>Sänk kontrollerat:</strong> Låt inte stången studsa mot bröstet. Håll emot på vägen ner för att maximera muskeluppbyggnaden.</li>
                    <li><strong>Grepp:</strong> Håll stången så att underarmarna är vertikala (raka ner mot golvet) när stången nuddar bröstet.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isStandardPushdown || selectedEx.name_en === 'Classic Cable Triceps Pushdown' || selectedEx.name?.includes('klassiska varianten med stång')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Här är en kort sammanfattning av Cable Triceps Pushdown (den klassiska varianten med stång eller V-stång):
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler och leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Huvudmuskel:</strong> Triceps Brachii (hela baksidan av överarmen). Den fokuserar extra mycket på det laterala huvudet (utsidan), vilket ger armen den klassiska "hästsko-formen".</li>
                    <li><strong>Sekundära muskler:</strong> Anconeus (vid armbågen) och Core (för att hålla kroppen stabil).</li>
                    <li><strong>Leder:</strong> Armbågsleden. Det är en ren isolationsövning (enledsövning) där rörelsen sker genom att du rätar ut armen (extension).</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Fixerade armbågar:</strong> Håll armbågarna fixerade vid sidorna som om de vore fastlimmade. Det är bara underarmarna som ska röra sig för att garantera att det är triceps som gör jobbet!</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isReverseGripPushdown || selectedEx.name_en === 'Reverse Grip Triceps Pushdown' || selectedEx.name?.includes('Tricepspress med underhandsgrepp')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Här är en genomgång av Reverse Grip Triceps Pushdown (Tricepspress med underhandsgrepp) baserat på din bild.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Primary Muscles (Huvudmuskler):</strong> Triceps Brachii. Övningen tränar alla tre huvuden, men underhandsgreppet lägger ett extra stort fokus på det mediala huvudet (det som sitter på insidan av armen, nära armbågen).</li>
                    <li><strong>Secondary Muscles (Sekundära muskler):</strong>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
                        <li><strong>Underarmar:</strong> Du tränar din greppstyrka och musklerna i underarmarna eftersom de måste jobba statiskt för att hålla stången med handflatorna uppåt.</li>
                        <li><strong>Core:</strong> Håller din kropp stabil under rörelsen.</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Armbågsleden:</strong> Rörelsen sker genom extension (uträtning).</li>
                    <li><strong>Handleden:</strong> Jobbar statiskt. Det krävs mer kraft i handlederna för att hålla greppet stabilt jämfört med ett vanligt överhandsgrepp.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Lås handlederna:</strong> Var noga med att handlederna är raka och inte böjs bakåt av vikten.</li>
                    <li><strong>Håll armbågarna nära:</strong> Armbågarna ska peka rakt ner mot golvet och vara fixerade vid sidorna under hela rörelsen.</li>
                    <li><strong>Lättare vikt:</strong> Man orkar oftast inte lika mycket vikt som vid vanligt grepp, så fokusera på teknik och kontakt snarare än tunga kilon.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isCableOneArmTricepPushdown || selectedEx.name_en === 'Cable One Arm Tricep Pushdown' || selectedEx.name?.includes('Enarmad tricepspress i kabel')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Här är en genomgång av Cable One Arm Tricep Pushdown (Enarmad tricepspress i kabel), baserat på din bild.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Primary Muscles (Huvudmuskler):</strong> Triceps Brachii. Denna övning isolerar alla tre huvuden av triceps, men genom att köra en arm i taget är det ofta lättare att få extra kontakt med det laterala (yttre) huvudet.</li>
                    <li><strong>Secondary Muscles (Sekundära muskler):</strong>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
                        <li><strong>Anconeus:</strong> Den lilla muskeln vid armbågen som hjälper till att sträcka ut leden.</li>
                        <li><strong>Core (Bål):</strong> Eftersom belastningen sker på bara en sida av kroppen måste magmusklerna jobba hårt för att hålla överkroppen stabil och rak.</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Armbågsleden:</strong> Detta är huvudleden som arbetar genom extension (uträtning av armen).</li>
                    <li><strong>Axelleden:</strong> Fungerar som en statisk stabilisator. Axeln ska hållas helt stilla för att isolera triceps.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Håll överarmen stilla:</strong> Tänk att din överarm är fastlimmad mot sidan av din kropp. Det är bara underarmen som ska röra sig.</li>
                    <li><strong>Ingen rotation:</strong> Spänn magen ordentligt så att din överkropp inte vrider sig mot maskinen när det blir tungt.</li>
                    <li><strong>Fullt utslag:</strong> Sträck ut armen helt i bottenläget och håll emot kontrollerat på vägen upp.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isRopeTricepsPushdown || selectedEx.name_en === 'Rope Triceps Pushdown' || selectedEx.name?.includes('Tricepspress med rep')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Rope Triceps Pushdown (Tricepspress med rep) är en av de absolut bästa övningarna för att isolera baksidan av överarmen och få en maximal muskelkontakt.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Triceps Brachii (Huvudmål):</strong> Övningen tränar alla tre huvuden av triceps, men repet är särskilt effektivt för att pricka det laterala (yttre) huvudet, vilket ger den klassiska "hästsko-formen" på armen.</li>
                    <li><strong>Anconeus:</strong> Den lilla muskeln vid armbågen som hjälper till vid uträtning.</li>
                    <li><strong>Core:</strong> Magmusklerna jobbar statiskt för att hålla kroppen stabil så att du inte tippar framåt mot kabelmaskinen.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Armbågsleden:</strong> Detta är en ren isolationsövning där rörelsen sker genom extension (uträtning) av armbågen.</li>
                    <li><strong>Axelleden:</strong> Fungerar som stabilisator. Axlarna ska hållas fixerade och nere för att isolera triceps helt.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Lås armbågarna:</strong> De ska vara som fastlimmade vid sidorna. Om de rör sig fram och tillbaka tappar du kontakten med triceps.</li>
                    <li><strong>Dra isär i botten:</strong> Tänk att du ska försöka dra isär repets ändar mot dina fickor i det nedersta läget.</li>
                    <li><strong>Stolt bröstkorg:</strong> Stå stadigt med sänkta axlar för att undvika att nacken tar över.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isCableSeatedRearLateral || selectedEx.name_en === 'Cable Seated Rear Lateral Raise' || selectedEx.name?.includes('kabellyft för baksida axlar')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Cable Seated Rear Lateral Raise (Sittande kabellyft för baksida axlar) är en av de mest effektiva isolationsövningarna för att träna den bakre delen av axelpartiet. Att utföra den sittande med kablar ger en unik muskelkontakt.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Baksida axlar (Posterior Deltoid):</strong> Huvudmålet. Denna muskel ger axeln dess fyllighet bakifrån och är avgörande för en balanserad fysik.</li>
                    <li><strong>Övre rygg (Rombuider & mellersta Trapezius):</strong> Hjälper till att dra ihop skulderbladen.</li>
                    <li><strong>Rotatorkuffen (Infraspinatus & Teres Minor):</strong> Små muskler som stabiliserar axelleden.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Rörelsen sker genom horisontell abduktion (armarna förs utåt/bakåt i sidled).</li>
                    <li><strong>Skulderbladen:</strong> Som rör sig aktivt inåt mot ryggraden i slutet av rörelsen.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Korsa kablarna:</strong> Ta tag i vänster kabel med höger hand och höger kabel med vänster hand för att få rätt dragvinkel.</li>
                    <li><strong>Lätta armbågar:</strong> Håll armarna nästan helt raka, men med en liten, fast böjning i armbågen under hela setet.</li>
                    <li><strong>Led med armbågarna:</strong> Tänk att du ska dra armbågarna så långt ut åt sidorna som möjligt, snarare än att bara dra med händerna.</li>
                    <li><strong>Stoppa i tid:</strong> Gå inte längre bak än att armarna är i linje med kroppen. Går du längre bak tar de stora ryggmusklerna över jobbet från axlarna.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isKettlebellLateralRaise || selectedEx.name_en === 'Kettlebell Lateral Raise' || selectedEx.name?.includes('Sidolyft med kettlebell')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Kettlebell Lateral Raise (Sidolyft med kettlebell) är en av de absolut bästa övningarna för att isolera den mellersta delen av axeln och skapa bredd.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Mellersta axeln (Lateral Deltoid):</strong> Detta är huvudmålet. Det är den muskel som ger axlarna dess runda form och bredd.</li>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Assisterar i rörelsen.</li>
                    <li><strong>Övre Trapezius (Nacken):</strong> Hjälper till att stabilisera och lyfta i slutet av rörelsen.</li>
                    <li><strong>Supraspinatus:</strong> En viktig muskel i rotatorkuffen som hjälper till att påbörja lyftet.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom abduktion (armen lyfts utåt från kroppen).</li>
                    <li><strong>Skulderbladet:</strong> Rör sig för att ge plats och stabilitet åt armen.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Lätt böjda armar:</strong> Håll inte armarna helt spikraka; en liten böj i armbågen skyddar leden.</li>
                    <li><strong>Häll ut vattnet:</strong> I toppläget kan du tänka att du ska hälla ut vatten ur en tillbringare (låt lillfingret komma aningen högre än tummen) för att verkligen pricka mellersta axeln.</li>
                    <li><strong>Stoppa vid axelhöjd:</strong> Du behöver inte gå högre än axlarna. Går du högre tar nacken (traps) över jobbet.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isBandRearDeltRow || selectedEx.name_en === 'Band Standing Rear Delt Row' || selectedEx.name?.includes('baksida axlar med gummiband')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Band Standing Rear Delt Row (Stående rodd för baksida axlar med gummiband) är en av de bästa övningarna för att förbättra hållningen och stärka den ofta glömda baksidan av axeln.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Baksida axlar (Posterior Deltoid):</strong> Detta är huvudmålet. Denna lilla muskel ger axeln ett komplett, välformat utseende från sidan och bakifrån.</li>
                    <li><strong>Övre rygg (Rombuider & Mellersta Trapezius):</strong> Musklerna mellan skulderbladen som hjälper till att dra ihop ryggen.</li>
                    <li><strong>Rotatorkuffen:</strong> Små stabiliserande muskler som är avgörande för axelhälsa.</li>
                    <li><strong>Biceps:</strong> Assisterar något när du böjer armarna.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom en horisontell rörelse bakåt (horisontell abduktion).</li>
                    <li><strong>Skulderbladen:</strong> Som dras ihop mot ryggraden (retraktion).</li>
                    <li><strong>Armbågsleden:</strong> Genom en lätt böjning (flexion).</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Höga armbågar:</strong> Dra bandet mot ansiktet eller övre delen av bröstet. Armbågarna ska peka rakt ut åt sidorna, inte neråt.</li>
                    <li><strong>Kläm ihop:</strong> Tänk att du ska klämma ihop en penna mellan skulderbladen i det bakersta läget.</li>
                    <li><strong>Stilla kropp:</strong> Undvik att gunga med överkroppen för att få fart. Rörelsen ska vara kontrollerad och strikt.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isLeverMilitaryPress || selectedEx.name_en === 'Lever Military Press' || selectedEx.name?.includes('axelpress i maskin')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Lever Military Press (sittande axelpress i maskin) är en mycket effektiv övning för att bygga styrka och massa i axlarna med maximal kontroll.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Den primära muskeln som gör det mesta arbetet.</li>
                    <li><strong>Mellersta axeln (Lateral Deltoid):</strong> Hjälper till att stabilisera och lyfta vikten.</li>
                    <li><strong>Triceps Brachii:</strong> Arbetar för att sträcka ut armen i toppläget.</li>
                    <li><strong>Övre bröstmuskulaturen:</strong> Assisterar i den nedre delen av rörelsen.</li>
                    <li><strong>Serratus Anterior:</strong> Musklerna vid revbenen som stabiliserar skulderbladen.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom pressrörelsen uppåt.</li>
                    <li><strong>Armbågsleden:</strong> Genom uträtning (extension).</li>
                    <li><strong>Skulderbladet:</strong> Roterar naturligt uppåt under lyftet.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Sitt djupt:</strong> Tryck ner sätet och ryggen ordentligt i dynan.</li>
                    <li><strong>Armbågarnas position:</strong> Håll armbågarna något framför kroppen (istället för rakt ut åt sidorna) för att skona axelleden.</li>
                    <li><strong>Full kontroll:</strong> Håll emot vikten på vägen ner så att du inte bara "släpper" den. Det är i den bromsande fasen axlarna växer som mest.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isDumbbellSeatedShoulderPress || selectedEx.name_en === 'Dumbbell Seated Shoulder Press' || (selectedEx.name?.includes('Sittande hantelpress') && !selectedEx.name?.includes('enarmad'))) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Dumbbell Seated Shoulder Press (Sittande hantelpress) är en av de mest grundläggande och effektiva övningarna för att bygga styrka och volym i axlarna. Att sitta ner ger mer stabilitet, vilket gör att du kan fokusera helt på att pressa med musklerna.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Den muskel som gör grovjobbet i pressen.</li>
                    <li><strong>Mellersta axeln (Lateral Deltoid):</strong> Aktiveras för att stabilisera och hjälpa till att lyfta vikten utåt/uppåt.</li>
                    <li><strong>Triceps Brachii:</strong> Musklerna på baksidan av överarmen som sträcker ut armbågen.</li>
                    <li><strong>Övre bröstmuskulaturen:</strong> Hjälper till i den nedre delen av rörelsen.</li>
                    <li><strong>Trapezius & Serratus Anterior:</strong> Stabiliserar skulderbladen så att axelleden kan röra sig säkert.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom pressrörelsen uppåt.</li>
                    <li><strong>Armbågsleden:</strong> Genom uträtning (extension).</li>
                    <li><strong>Skulderbladet:</strong> Roterar uppåt för att ge plats åt armrörelsen.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Sänk axlarna:</strong> Undvik att dra upp axlarna mot öronen. Håll dem nere och "stolta" under hela pressen.</li>
                    <li><strong>Vinkla in armbågarna:</strong> Ha inte armbågarna peka rakt ut åt sidorna (i 180 grader). Vinkla dem ca 30 grader framåt för att skona axelleden och få bättre kraft.</li>
                    <li><strong>Pressa ihop:</strong> Tänk att hantlarna ska mötas i en båge ovanför huvudet, men utan att de slår ihop.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isPoliquinLateralRaise || selectedEx.name_en === 'Dumbbell Poliquin Lateral Raise' || selectedEx.name?.includes('Poliquin Lateral Raise')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Dumbbell Poliquin Lateral Raise är en effektiv variant av sidolyft som utvecklades av tränaren Charles Poliquin för att bygga bredare axlar med mer vikt.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Mellersta axeln (Lateral Deltoideus):</strong> Huvudfokus för att bygga breda och runda axlar.</li>
                    <li><strong>Övre Trapezius & Supraspinatus:</strong> Assisterar vid lyftet och initierar rörelsen.</li>
                    <li><strong>Baksida axel (Posterior Deltoid):</strong> Stabiliserar i toppläget.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Abduktion (lyft utåt sidan).</li>
                    <li><strong>Armbågsleden:</strong> Flexion och extension under rörelsen.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Böj armbågarna:</strong> Starta med armbågarna böjda i 90 grader för att lyfta tyngre vikt med mindre hävarm.</li>
                    <li><strong>Sträck ut i toppläget:</strong> Rätta ut armarna i toppläget och sänk hantlarna långsamt och kontrollerat på vägen ner.</li>
                    <li><strong>Kontrollera vikten:</strong> Undvik att gunga upp vikten med höften.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isOneArmShoulderPress || selectedEx.name_en === 'Dumbbell Seated One Arm Shoulder Press' || selectedEx.name?.includes('One Arm Shoulder Press') || selectedEx.name?.includes('enarmad hantelpress')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Dumbbell Seated One Arm Shoulder Press (Sittande enarmad hantelpress) är en unilateral variant av axelpress som ger extra fokus på stabilitet och muskelbalans.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Främre och mellersta axeln (Deltoideus):</strong> Huvudmålet för att bygga styrka och bredd i axelpartiet.</li>
                    <li><strong>Triceps Brachii:</strong> Hjälper till att sträcka ut armen i toppläget.</li>
                    <li><strong>Core (Bål):</strong> Mycket viktigt! Eftersom du bara håller en vikt på ena sidan måste dina magmuskler (särskilt obliques) jobba hårt för att hålla överkroppen rak och motverka att du tippar åt sidan.</li>
                    <li><strong>Övre bröst & Serratus Anterior:</strong> Stabiliserar lyftet och bröstkorgen.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom pressrörelsen uppåt.</li>
                    <li><strong>Armbågsleden:</strong> Genom uträtning (extension).</li>
                    <li><strong>Skulderbladet:</strong> Roterar och stabiliserar rörelsen.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Sitt spikrakt:</strong> Undvik att luta dig åt sidan för att "hjälpa" vikten upp. Om du inte kan sitta rakt är vikten för tung.</li>
                    <li><strong>Lås bålen:</strong> Tänk att du ska "dra in naveln" och sitta stadigt mot ryggstödet.</li>
                    <li><strong>Andra handen:</strong> Håll den lediga handen på låret eller ta tag i sätets kant för extra stabilitet.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isArnoldPress || selectedEx.name_en === 'Dumbbell Arnold Press' || selectedEx.name?.includes('Arnold Press')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Dumbbell Arnold Press är en variant av axelpress som skapades av Arnold Schwarzenegger. Det som gör den unik är den roterande rörelsen, vilket gör det till en mer komplett övning för hela axelpartiet.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Deltoideus (Axlarna) – Alla tre huvudena:</strong>
                      <ul style={{ paddingLeft: '14px', marginTop: '4px' }}>
                        <li><strong>Främre (Anterior):</strong> Jobbar mest under själva pressen.</li>
                        <li><strong>Mellersta (Lateral):</strong> Ger bredd åt axlarna och aktiveras under rotationen.</li>
                        <li><strong>Bakre (Posterior):</strong> Jobbar statiskt för att stabilisera vikten under rotationen i bottenläget.</li>
                      </ul>
                    </li>
                    <li><strong>Triceps Brachii:</strong> Sträcker ut armen i toppläget.</li>
                    <li><strong>Övre Trapezius:</strong> Assisterar vid lyftet.</li>
                    <li><strong>Serratus Anterior:</strong> Musklerna vid revbenen som stabiliserar skulderbladen.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> En komplex rörelse som kombinerar flexion, abduktion och extern rotation.</li>
                    <li><strong>Armbågsleden:</strong> Genom extension (uträtning).</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Startposition:</strong> Håll hantlarna framför axlarna med handflatorna vända mot dig.</li>
                    <li><strong>Rotationen:</strong> Börja pressa uppåt samtidigt som du roterar händerna så att handflatorna pekar bort från dig i toppläget.</li>
                    <li><strong>Kontroll:</strong> Utför rörelsen i en mjuk, flytande bana. Det ska inte vara två separata rörelser, utan en enda roterande press.</li>
                    <li><strong>Sitt eller stå:</strong> Sittande med ryggstöd ger mer isolering för axlarna, medan stående utmanar din bålstabilitet mer.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isSmithSeatedShoulderPress || selectedEx.name_en === 'Smith Seated Shoulder Press' || selectedEx.name?.includes('Smith Seated Shoulder Press')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Detta är huvudmålet. Den främre delen av axeln får jobba extremt hårt för att pressa stången uppåt.</li>
                    <li><strong>Mellersta axeln (Lateral Deltoid):</strong> Assisterar i rörelsen och hjälper till att ge axlarna bredd.</li>
                    <li><strong>Triceps Brachii:</strong> Musklerna på baksidan av överarmen jobbar för att sträcka ut armbågsleden i slutet av rörelsen.</li>
                    <li><strong>Övre bröstmuskulaturen (Pectoralis Major):</strong> Den översta delen av bröstet hjälper till i början av pressen.</li>
                    <li><strong>Trapezius & Serratus Anterior:</strong> Stabiliserar skulderbladen under hela rörelsen.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Axelleden:</strong> Genom abduktion och flexion (armarna rör sig uppåt och utåt).</li>
                    <li><strong>Armbågsleden:</strong> Genom extension (armarna rätas ut).</li>
                    <li><strong>Skulderbladen:</strong> Roterar uppåt för att tillåta armarna att nå högsta punkten.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Sitt rakt:</strong> Tryck ryggen ordentligt mot sätet och håll bröstet högt.</li>
                    <li><strong>Armbågarnas vinkel:</strong> Låt inte armbågarna peka rakt ut åt sidorna; ha dem aningen framför dig för att skona axelleden.</li>
                    <li><strong>Stoppa i tid:</strong> Sänk stången till ungefär hakhöjd eller strax under. Går du för djupt kan det skapa onödig stress på axelns framsida.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isJackknifeSitUp || selectedEx.name_en === 'Jackknife Sit-Up' || selectedEx.name?.includes('Jackknife Sit-Up')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Jackknife Sit-Up (ofta kallad V-up) är en avancerad och intensiv magövning där du lyfter både överkropp och ben samtidigt för att mötas i en "V-position".
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Primary Muscles (Huvudmuskler):</strong>
                      <ul style={{ paddingLeft: '14px', marginTop: '4px' }}>
                        <li><strong>Rectus Abdominis:</strong> De raka magmusklerna får jobba extremt hårt för att dra ihop överkroppen mot benen. Den tränar både övre och nedre delen av magen samtidigt.</li>
                        <li><strong>Iliopsoas (Höftböjarna):</strong> Dessa är motorerna som lyfter dina ben från golvet.</li>
                      </ul>
                    </li>
                    <li><strong>Secondary Muscles (Sekundära muskler):</strong>
                      <ul style={{ paddingLeft: '14px', marginTop: '4px' }}>
                        <li><strong>Obliques:</strong> De sneda magmusklerna hjälper till med balansen och stabiliteten i rörelsen.</li>
                        <li><strong>Quadriceps (Framsida lår):</strong> Håller benen raka under lyftet.</li>
                        <li><strong>Hip Adductors:</strong> Insida lår som hjälper till att hålla ihop benen.</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Ryggraden:</strong> Sker en kraftig flexion (böjning) när du rullar upp från golvet.</li>
                    <li><strong>Höftleden:</strong> Sker en flexion när benen lyfts uppåt.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Mötas på mitten:</strong> Tänk att händer och fötter ska mötas precis ovanför mitten av kroppen.</li>
                    <li><strong>Kontrollerad retur:</strong> Slappna inte av på vägen ner. Håll emot med magen så att fötterna och armarna precis nuddar (eller svävar ovanför) golvet innan nästa rep.</li>
                    <li><strong>Andning:</strong> Andas ut kraftfullt när du går upp i V-positionen – det hjälper dig att spänna magen maximalt.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isOtisUp || selectedEx.name_en === 'Otis Up' || selectedEx.name?.includes('Otis Up')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Otis Up är en avancerad, viktad variant av en sit-up där du håller en viktplatta med raka armar mot taket under hela rörelsen. Det är en övning som kombinerar rå styrka i magen med kontroll och stabilitet.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Primary Muscles (Huvudmuskler):</strong>
                      <ul style={{ paddingLeft: '14px', marginTop: '4px' }}>
                        <li><strong>Rectus Abdominis:</strong> De raka magmusklerna jobbar extremt hårt för att lyfta överkroppen mot vikten.</li>
                        <li><strong>Iliopsoas (Höftböjarna):</strong> Mycket aktiva eftersom det är en full sit-up-rörelse där överkroppen ska hela vägen upp till knäna.</li>
                      </ul>
                    </li>
                    <li><strong>Secondary Muscles (Sekundära muskler):</strong>
                      <ul style={{ paddingLeft: '14px', marginTop: '4px' }}>
                        <li><strong>Obliques:</strong> De sneda magmusklerna stabiliserar lyftet.</li>
                        <li><strong>Sartorius:</strong> Muskel i låret som hjälper till vid höftböjning.</li>
                        <li><strong>Främre Axlar (Anterior Deltoid):</strong> Arbetar statiskt för att hålla viktplattan pressad rakt upp mot taket.</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Ryggraden:</strong> Genom flexion (böjning) när du rullar upp från golvet.</li>
                    <li><strong>Höftleden:</strong> Här sker en kraftig flexion för att dra upp hela överkroppen.</li>
                    <li><strong>Axelleden:</strong> Jobbar isometriskt (statiskt) för att stabilisera vikten ovanför huvudet.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🎯 Varför ska man göra Otis Up?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Progressiv belastning:</strong> Till skillnad från vanliga situps är det väldigt lätt att göra Otis Up tyngre genom att öka vikten på plattan. Det är nyckeln till att bygga en riktigt stark och välutvecklad magmuskulatur.</li>
                    <li><strong>Explosivitet och kraft:</strong> Den används ofta inom idrotter där man behöver explosiv bålstyrka (t.ex. kampsport eller tyngdlyftning) eftersom den tränar samspelet mellan mage, höft och axlar.</li>
                    <li><strong>Bättre hållning och stabilitet:</strong> Eftersom du tvingas hålla armarna raka och pressa vikten uppåt, tränar du din förmåga att stabilisera ryggraden under tryck.</li>
                    <li><strong>Helkroppskontroll:</strong> Den kräver att du kan kontrollera både över- och underkropp samtidigt. Om du inte spänner benen och magen kommer du inte upp.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Pressa mot taket:</strong> Tänk att vikten ska röra sig spikrakt uppåt mot taket hela tiden, inte framåt mot knäna. Det gör övningen mycket jobbigare för magen.</li>
                    <li><strong>Fötterna i golvet:</strong> Försök att hålla fötterna i golvet under hela rörelsen. Om de lyfter beror det ofta på att höftböjarna tar över för mycket eller att vikten är för tung.</li>
                    <li><strong>Rulla ner långsamt:</strong> Släpp inte ner ryggen i golvet. Håll emot på vägen ner för att maximera tiden under spänning.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isAbdominalCrunch || selectedEx.name_en === 'Abdominal Crunch' || selectedEx.name?.includes('Abdominal Crunch')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-white)' }}>
                  Abdominal Crunch (Crunches) är den mest klassiska övningen för att isolera den raka magmuskeln. Till skillnad från en sit-up, där man lyfter hela ryggen, lyfter man här bara den översta delen.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Rectus Abdominis (Huvudmuskel):</strong> Fokus ligger främst på den övre delen av "sexpacket".</li>
                    <li><strong>Obliques (Sekundära):</strong> De sneda magmusklerna hjälper till att stabilisera rörelsen.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Ryggraden:</strong> Rörelsen sker genom en kontrollerad flexion (böjning) i den övre delen av ryggraden (bröstryggen).</li>
                    <li><strong>Viktigt:</strong> Till skillnad från situps är höftleden helt stilla, vilket isolerar magen mer.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🎯 Varför ska man göra Abdominal Crunches?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Isolerar magen optimalt:</strong> Genom att begränsa rörelsen till att bara lyfta skulderbladen tvingas magmusklerna göra allt jobb utan att höftböjarna tar över (vilket ofta händer i situps).</li>
                    <li><strong>Skonsam för ländryggen:</strong> Eftersom ländryggen stannar kvar i golvet hela tiden, är crunches betydligt snällare mot ryggkotorna än många andra magövningar.</li>
                    <li><strong>Bygger definition:</strong> Det är en utmärkt övning för att bygga muskelmassa och "rutor" på överkroppen genom att skapa en kraftig sammandragning i muskeln.</li>
                    <li><strong>Enkel att utföra:</strong> Kräver ingen utrustning och är perfekt för att lära sig hitta kontakten med magmusklerna.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Dra inte i nacken:</strong> Händerna ska bara vila lätt bakom huvudet eller hållas över bröstet. Kraften ska komma från magen, inte armarna.</li>
                    <li><strong>Rulla ihop:</strong> Tänk att du ska rulla ihop bröstkorgen mot naveln snarare än att du ska lyfta dig rakt upp.</li>
                    <li><strong>Kvalitet före kvantitet:</strong> Det handlar inte om hur högt du kommer, utan hur hårt du kan spänna magen i toppläget.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isLyingLegRaise || selectedEx.name_en === 'Lying Leg Raise' || selectedEx.name?.includes('Lying Leg Raise')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler och leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Huvudmuskel:</strong> Nedre delen av magen (Rectus abdominis). Det är en av de bästa övningarna för att pricka just den nedre regionen.</li>
                    <li><strong>Sekundära muskler:</strong> Höftböjarna (Iliopsoas) och framsida lår (Quadriceps). Även sätet jobbar för att stabilisera.</li>
                    <li><strong>Leder:</strong> Höftleden (här sker själva rörelsen). Ländryggen tränas statiskt genom att du tvingas hålla den pressad mot golvet.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🎯 Varför ska man göra den här övningen?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Fokus på nedre magen:</strong> Perfekt om man vill stärka den del av magen som ofta är svårast att komma åt med vanliga situps.</li>
                    <li><strong>Bålstabilitet:</strong> Den tränar din förmåga att kontrollera bäckenet och ländryggen, vilket skyddar ryggen i vardagen och vid tunga lyft.</li>
                    <li><strong>Hållning:</strong> Genom att stärka samspelet mellan mage och höft förbättrar du din hållning.</li>
                    <li><strong>Enkel men utmanande:</strong> Kräver ingen utrustning men är mycket effektiv för att bygga en stark "korsett".</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Viktigt tips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Pressa ner ländryggen:</strong> Pressa ner ländryggen i golvet under hela rörelsen. Om ryggen börjar svanka, stanna och vänd rörelsen uppåt igen för att undvika skador.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isAlternateHeelTouchers || selectedEx.name_en === 'Alternate Heel Touchers' || selectedEx.name?.includes('Alternate Heel Touchers')) && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Primary Muscles (Huvudmuskler):</strong> Obliques (de sneda magmusklerna). Dessa sitter på sidorna av midjan och ansvarar för att böja kroppen i sidled.</li>
                    <li><strong>Secondary Muscles (Sekundära muskler):</strong>
                      <ul style={{ paddingLeft: '14px', marginTop: '4px' }}>
                        <li><strong>Rectus Abdominis:</strong> Den raka magmuskeln ("sexpacket") jobbar statiskt för att hålla dina axlar lyfta från golvet.</li>
                        <li><strong>Transversus Abdominis:</strong> De djupa magmusklerna som stabiliserar bålen.</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Ryggraden (Intervertebral-lederna):</strong> Rörelsen sker genom lateral flexion (sidoböjning) av ryggraden.</li>
                    <li><strong>Nacken:</strong> Musklerna i nacken jobbar statiskt för att hålla huvudet uppe, vilket kan kännas för nybörjare.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🎯 Varför ska man göra Alternate Heel Touchers?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Isolering av midjan:</strong> Det är en av de enklaste och mest effektiva övningarna för att specifikt pricka de sneda magmusklerna utan att behöva använda vikter.</li>
                    <li><strong>Bättre muskeldefinition:</strong> Hjälper till att bygga uthållighet och tona musklerna på sidan av magen.</li>
                    <li><strong>Enkelhet och tillgänglighet:</strong> Du behöver ingen utrustning alls. Den går att göra var som helst och är lätt att lära sig.</li>
                    <li><strong>Skonsam för ländryggen:</strong> Liggande position med fötterna i golvet som är säker för ländryggen.</li>
                    <li><strong>Stärker bålstabiliteten:</strong> Tränar din förmåga att kontrollera rörelser i sidled.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Lyft axlarna:</strong> Nyckeln är att hålla skulderbladen en bit ovanför golvet under hela övningen. Det är då magen är aktiverad.</li>
                    <li><strong>Tänk "Pingvin":</strong> Gör en kontrollerad rörelse från sida till sida. Försök att verkligen nudda hälen eller gå till och med förbi den för maximal kontakt i obliques.</li>
                    <li><strong>Blicken mot taket:</strong> För att undvika ont i nacken, försök att hålla ett litet avstånd mellan hakan och bröstet (som om du höll en apelsin där) och titta snett uppåt.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isCrossBodyHammerCurl || selectedEx.name_en === 'Cross Body Hammer Curl' || selectedEx.name === 'Cross Body Hammer Curl') && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Brachialis:</strong> Övningens huvudfokus. Muskeln som ligger under biceps. När den växer "lyfter" den upp biceps, vilket gör att hela överarmen ser betydligt bredare och maffigare ut från sidan.</li>
                    <li><strong>Brachioradialis:</strong> Den stora muskeln på ovansidan av underarmen (neutralt grepp / tummen upp).</li>
                    <li><strong>Biceps Brachii (Långa huvudet):</strong> Den yttre delen av biceps som skapar själva "toppen".</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Armbågsleden:</strong> Den primära rörelsen (flexion).</li>
                    <li><strong>Axelleden:</strong> Fungerar som en stabilisator. Den lilla rotationen inåt gör att du får en annorlunda vinkel för muskelaktiveringen i axelpartiet.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🎯 Varför ska man göra Cross Body Hammer Curls?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Bygger bredare armar:</strong> Fokuserar på musklerna kring biceps snarare än bara själva biceps-kulan.</li>
                    <li><strong>Stärker greppet och underarmarna:</strong> Hög aktivering för tunga ryggövningar och marklyft.</li>
                    <li><strong>Mindre fusk:</strong> Svårare att använda momentum (swing) eller att hjälpa till med ryggen.</li>
                    <li><strong>Skonsam för handlederna:</strong> Att hålla hanteln med "tummen upp" är den mest naturliga positionen för handleden.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Neutralt grepp:</strong> Håll hanteln som en hammare under hela rörelsen. Vrid inte på handleden.</li>
                    <li><strong>Korsa bröstet:</strong> För hanteln mot den motsatta axeln, men stanna precis innan hanteln nuddar bröstet för att behålla spänningen.</li>
                    <li><strong>Stilla överarm:</strong> Håll armbågen fixerad. Den ska inte vandra framåt eller utåt under lyftet.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isFrontPlank || selectedEx.name_en === 'Front Plank' || selectedEx.name === 'Front Plank') && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Rectus Abdominis:</strong> De raka magmusklerna ("sexpacket").</li>
                    <li><strong>Transversus Abdominis:</strong> Djupa magmusklerna (korsetten).</li>
                    <li><strong>Obliques:</strong> De sneda magmusklerna (stabilisering).</li>
                    <li><strong>Erector Spinae:</strong> Ryggsträckarna (håller ryggraden rak).</li>
                    <li><strong>Serratus Anterior & Axlar:</strong> Håller dig uppe statiskt.</li>
                    <li><strong>Säte & Framsida lår:</strong> Håller kroppen i en rak linje.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Ryggraden:</strong> Neutral position (anti-extension).</li>
                    <li><strong>Axelleden:</strong> Stabiliserar kroppsvikten.</li>
                    <li><strong>Höftleden:</strong> Hålls stabil av höftböjare och säte.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🎯 Varför göra Front Plank?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Bålstabilitet:</strong> Grunden för all annan styrka i knäböj och marklyft.</li>
                    <li><strong>Hållning:</strong> Hjälper dig stå och sitta rakare.</li>
                    <li><strong>Mindre ryggont:</strong> Avlastar ländryggen och minskar besvär.</li>
                    <li><strong>Funktionell styrka:</strong> Skapar helkroppsanspänning.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Ingen "hängbro":</strong> Spänn sätet och magen så höften inte sjunker.</li>
                    <li><strong>Tryck ifrån:</strong> Sjunk inte mellan axlarna, pressa underarmarna mot golvet.</li>
                    <li><strong>Andas:</strong> Håll inte andan under anspänningen.</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedEx.note && (
              <div style={{
                background: 'rgba(184,149,71,0.08)', padding: '12px 14px', borderRadius: '10px',
                border: '1px solid rgba(184,149,71,0.2)', marginTop: '16px', fontSize: '0.82rem',
                color: 'var(--accent-gold)'
              }}>
                <strong>💡 Tränarens notering:</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-silver)' }}>{selectedEx.note}</p>
              </div>
            )}

            {(selectedEx.isBarbellReverseGripRow || selectedEx.name_en === 'Barbell Reverse Grip Bent over Row') && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>💪 Vilka muskler tränas?</strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Latissimus Dorsi:</strong> Underhandsgreppet ger djup sträckning och aktiverar nedre lats.</li>
                    <li><strong>Biceps Brachii:</strong> Assisterar kraftfullt under roddrörelsen.</li>
                    <li><strong>Trapezius & Rhomboids:</strong> Klämmer ihop ryggplattan i toppläget.</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>🎯 Varför göra övningen?</strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Bygger ryggtjocklek:</strong> En av de absolut bästa basövningarna för en fyllig rygg.</li>
                    <li><strong>Bättre bålstabilitet:</strong> Stärker ryggsträckarna statiskt under belastning.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isWideGripPullUp || selectedEx.name_en === 'Wide-Grip Pull-Up') && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>💪 Vilka muskler tränas?</strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Latissimus Dorsi:</strong> Kungen av kroppsviktsövningar för bred V-taper.</li>
                    <li><strong>Teres Major & Biceps:</strong> Ger styrka och form åt överarm och övre rygg.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedEx.isDumbbellStandingOneArmCurl || selectedEx.name_en === 'Dumbbell Standing One Arm Curl' || selectedEx.name === 'Dumbbell Standing One Arm Curl') && (
              <div style={{
                background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)', marginTop: '16px', fontSize: '0.82rem',
                lineHeight: 1.5, color: 'var(--text-silver)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    💪 Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Biceps Brachii:</strong> Huvudmålet (långa och korta huvudet).</li>
                    <li><strong>Brachialis:</strong> Djup muskel som ger överarmen fyllighet.</li>
                    <li><strong>Brachioradialis:</strong> Muskeln på ovansidan av underarmen.</li>
                    <li><strong>Core (Bål):</strong> Sneda magmusklerna motverkar sidotippning.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🦴 Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Armbågsleden:</strong> Primär rörelse (flexion).</li>
                    <li><strong>Handleden:</strong> Stabiliserar hanteln och tillåter supination.</li>
                    <li><strong>Axelleden:</strong> Fungerar som stabilisator.</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    🎯 Varför göra övningen?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Rätta till obalanser:</strong> Upptäck och korrigera styrkeskillnader mellan armarna.</li>
                    <li><strong>Mind-Muscle Connection:</strong> Unilateralt fokus ger maximal kontakt.</li>
                    <li><strong>Bättre rörlighet:</strong> Tillåter fri handledsrotation under rörelsen.</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '4px', letterSpacing: '0.05em', fontSize: '0.8rem' }}>
                    ✨ Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li><strong>Stå stadigt:</strong> Håll höftbredd och spänn sätet.</li>
                    <li><strong>Ingen rotation:</strong> Låt inte kroppen luta sig eller hjälpa hanteln upp.</li>
                    <li><strong>Vrid lillfingret uppåt:</strong> Rotera handleden i toppläget för maximal biceps-kontraktion.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientProfile
