import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
import SlowGif from '../components/SlowGif';
  EXERCISES,
  EQUIPMENT_MAPPING,
  DIFFICULTY_MAPPING,
  PROGRAM_STRUCTURE,
  SPLIT_MUSCLES,
  DAY_NAMES_SV,
  SPLIT_EMOJIS,
} from '../data/exercises'

// ─── Program builder (same logic as WorkoutProgram.jsx) ─────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildProgram({ trainingDays, equipment, experienceLevel }) {
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
        { id: 'pectorals/barbell-bench-press', name_en: 'Bench Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/barbell-bench-press.gif' },
        { id: 'pectorals/lever-seated-fly', name_en: 'Lever Seated Fly', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/lever-seated-fly.gif' },
        { id: 'pectorals/barbell-incline-bench-press', name_en: 'Incline Bench Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/barbell-incline-bench-press.gif' },
        { id: 'pectorals/dumbbell-incline-bench-press', name_en: 'Dumbbell Incline Bench Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/dumbbell-incline-bench-press.gif' },
        { id: 'pectorals/dumbbell-bench-press', name_en: 'Dumbbell Bench Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/dumbbell-bench-press.gif' },
        { id: 'pectorals/cable-standing-fly', name_en: 'Cable Standing Fly', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/cable-standing-fly.gif' },
        { id: 'pectorals/push-up', name_en: 'Push-up', sets: 3, reps: '8-12', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/push-up.gif' },
        { id: 'pectorals/smith-incline-bench-press', name_en: 'Smith Incline Bench Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/smith-incline-bench-press.gif' },
        { id: 'pectorals/lever-incline-fly', name_en: 'Lever Incline Fly (male)', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/lever-seated-fly.gif' },
        { id: 'pectorals/lever-chest-press', name_en: 'Lever Chest Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/lever-chest-press.gif' },
        { id: 'pectorals/incline-push-up', name_en: 'Elevated Push-up', sets: 3, reps: '8-12', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/incline-push-up.gif' },
        { id: 'pectorals/lever-decline-chest-press', name_en: 'Lever Lying Chest Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/pectorals/lever-decline-chest-press.gif' },
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
          name: ex.name_en,
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
        { id: 'delts/cable-seated-rear-lateral-raise', name_en: 'Cable Seated Rear Lateral Raise', sets: 3, reps: '12-15', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/cable-seated-rear-lateral-raise.gif' },
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
          isKettlebellLateralRaise: ex.isKettlebellLateralRaise
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
        id: 'triceps/cable-one-arm-extension',
        name_en: 'Cable One Arm Triceps Extension',
        name_es: 'Extensión de Tríceps a Una Mano con Polea',
        name_fa: 'پشت بازو سیم‌کش تک دست',
        name: 'Cable One Arm Triceps Extension',
        equipment: 'cable',
        body_part: 'arms',
        primary_muscles: ['triceps'],
        images: {
          classic: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-extension.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-extension.gif' },
          flat: { start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-extension.gif', peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/triceps/cable-one-arm-extension.gif' }
        },
        instructions_en: [
          'Stå med sidan mot kabelmaskinen med det övre fästet monterat.',
          'Greppa handtaget med en hand och håll armbågen tätt intill sidan.',
          'Pressa ner handtaget tills armen är helt utsträckt.',
          'Släpp långsamt upp vikten till startpositionen under kontroll.'
        ],
        instructions: [
          'Stå med sidan mot kabelmaskinen med det övre fästet monterat.',
          'Greppa handtaget med en hand och håll armbågen tätt intill sidan.',
          'Pressa ner handtaget tills armen är helt utsträckt.',
          'Släpp långsamt upp vikten till startpositionen under kontroll.'
        ],
        youtubeUrl: 'https://youtu.be/GgCX9ccl3EE?si=7o9u5b3t_eR0r6wG',
        isOneArmExtension: true,
        rest: tRest,
        targetWeight: tWeight,
        note: 'Enarmad övning för att jämna ut styrka och isolera triceps helt.'
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
      name_en: 'Cable Reverse-grip Pushdown',
      name_es: 'Pushdown de Tríceps con Agarre Invertido',
      name_fa: 'پشت بازو سیم‌کش مچ برعکس',
      name: 'Cable Reverse-grip Pushdown',
      equipment: 'kabel',
      body_part: 'arms',
      primary_muscles: ['triceps'],
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
      instructions_en: [
        'Stå framför kabelmaskinen och greppa stången med ett underhandsgrepp (handflatorna uppåt).',
        'Håll armbågarna nära sidorna och överarmarna helt stilla.',
        'Pressa stången nedåt genom att sträcka ut armarna helt.',
        'Släpp kontrollerat tillbaka till startpositionen under motstånd.'
      ],
      instructions: [
        'Stå framför kabelmaskinen och greppa stången med ett underhandsgrepp (handflatorna uppåt).',
        'Håll armbågarna nära sidorna och överarmarna helt stilla.',
        'Pressa stången nedåt genom att sträcka ut armarna helt.',
        'Släpp kontrollerat tillbaka till startpositionen under motstånd.'
      ],
      youtubeUrl: 'https://youtube.com/shorts/_EuYEt1lNYw?si=gCkPdGnE02H8bOsx',
      isReverseGripPushdown: true,
      rest: tRest,
      targetWeight: tWeight,
      note: 'Lås handlederna! Var noga med att inte låta handlederna böjas bakåt av vikten; håll dem raka och starka genom hela rörelsen.'
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
      name_en: 'Cable Triceps Pushdown',
      name_es: 'Pushdown de Tríceps con Barra',
      name_fa: 'پشت بازو سیم‌کش با میله',
      name: 'Cable Triceps Pushdown',
      equipment: 'kabel',
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
        'Stå framför kabelmaskinen och greppa stången med ett överhandsgrepp.',
        'Håll överarmarna fixerade vid sidorna.',
        'Tryck stången kontrollerat hela vägen ner tills armarna är helt utsträckta.',
        'Släpp långsamt tillbaka stången till startläge under konstant spänning.'
      ],
      instructions: [
        'Stå framför kabelmaskinen och greppa stången med ett överhandsgrepp.',
        'Håll överarmarna fixerade vid sidorna.',
        'Tryck stången kontrollerat hela vägen ner tills armarna är helt utsträckta.',
        'Släpp långsamt tillbaka stången till startläge under konstant spänning.'
      ],
      youtubeUrl: 'https://youtu.be/WJD82PDO4XI?si=Iy4yWLMz2-ufpYrK',
      isStandardPushdown: true,
      rest: tRest,
      targetWeight: tWeight,
      note: 'Möjliggör tyngre belastning för mekanisk spänning. Låt överkroppen vara stabil och tryck vikten kontrollerat hela vägen ner.'
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

// ─── Meal plan generator ─────────────────────────────────────────────────────
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
      breakfast: { name: 'Gröt med ägg vid sidan & kanelbanan', protein: 22, carbs: 48, fat: 8 },
      lunch:     { name: 'Strimlad nötkött med wok-grönsaker & ris', protein: 40, carbs: 45, fat: 14 },
      dinner:    { name: 'Torskfilé med ångad broccoli & sötpotatis', protein: 36, carbs: 32, fat: 10 },
      snack:     { name: 'Risskiva med keso & gurka', protein: 14, carbs: 18, fat: 3 },
    },
    {
      breakfast: { name: 'Smoothie: spenat, banan, proteinpulver & mandelmjölk', protein: 32, carbs: 35, fat: 8 },
      lunch:     { name: 'Keso-bowl med tomater, gurka & fullkornsbröd', protein: 28, carbs: 30, fat: 6 },
      dinner:    { name: 'Kycklinglårfilé med ugnsbakad paprika & kikärtor', protein: 44, carbs: 38, fat: 16 },
      snack:     { name: 'Mandlar (25g) + proteinbar', protein: 18, carbs: 20, fat: 14 },
    },
    {
      breakfast: { name: 'Omelett med lök, svamp & fetaost', protein: 26, carbs: 8, fat: 18 },
      lunch:     { name: 'Linssoppa med fullkornsknäckebröd', protein: 24, carbs: 42, fat: 6 },
      dinner:    { name: 'Nötkötts-bollar med ångade grönsaker & potatismos (lite smör)', protein: 40, carbs: 38, fat: 20 },
      snack:     { name: 'Grek. yoghurt 0% med granatäppelkärnor', protein: 18, carbs: 16, fat: 2 },
    },
    {
      breakfast: { name: 'Overnight oats med chiafrön, bär & honung', protein: 18, carbs: 50, fat: 10 },
      lunch:     { name: 'Rättika-wrap med rökt lax, keso & rucola', protein: 32, carbs: 18, fat: 10 },
      dinner:    { name: 'Räkor med vitlöksriset & tomatsallad', protein: 38, carbs: 40, fat: 12 },
      snack:     { name: 'Kokt ägg + en näve cashewnötter', protein: 16, carbs: 10, fat: 16 },
    },
    {
      breakfast: { name: 'Skyr med granola & färska jordgubbar', protein: 22, carbs: 40, fat: 6 },
      lunch:     { name: 'Asiatisk biffwok med broccoli, soja & jasminris', protein: 42, carbs: 48, fat: 14 },
      dinner:    { name: 'Ugnsbakad kyckling med vitlöksquinoa & spenat', protein: 46, carbs: 36, fat: 14 },
      snack:     { name: 'Proteindrink + en banan', protein: 25, carbs: 30, fat: 4 },
    },
  ],
  Viktuppgång: [
    {
      breakfast: { name: 'Havregrynsgröt med banan, jordnötssmör & honung', protein: 20, carbs: 70, fat: 18 },
      lunch:     { name: 'Nötkötts-burgare (500g) med avokado & sötpotatisfritter', protein: 55, carbs: 65, fat: 30 },
      dinner:    { name: 'Kycklingfilé med pasta carbonara & grönsakerna', protein: 50, carbs: 70, fat: 24 },
      snack:     { name: 'Mass-shake: mjölk, banan, havre, proteinpulver (2 skopor)', protein: 40, carbs: 80, fat: 12 },
    },
    {
      breakfast: { name: '4-äggs omelett med ost, skinka & 2 skivor fullkornsbröd', protein: 38, carbs: 34, fat: 22 },
      lunch:     { name: 'Lax teriyaki med jasminris (300g) & bönor', protein: 48, carbs: 72, fat: 20 },
      dinner:    { name: 'Köttfärssås med tagliatelle & parmesanost', protein: 52, carbs: 74, fat: 28 },
      snack:     { name: 'Kvarg med granola, nötter & bananbitar', protein: 28, carbs: 50, fat: 18 },
    },
    {
      breakfast: { name: 'Pannkakor (4 st) med banan, honung & nötsmör', protein: 24, carbs: 80, fat: 16 },
      lunch:     { name: 'Kyckling-bowl: ris, avokado, mango, edamamebönor', protein: 44, carbs: 68, fat: 20 },
      dinner:    { name: 'Hel kycklingben i ugnen med rosmarin & potatisgratäng', protein: 50, carbs: 60, fat: 28 },
      snack:     { name: 'Jordnötssmörssmörgås (2 skivor) + proteindryck', protein: 30, carbs: 52, fat: 20 },
    },
    {
      breakfast: { name: 'Bagel med löjromskeso, rödlök & kapris + havre', protein: 30, carbs: 68, fat: 14 },
      lunch:     { name: 'Mexikansk burrittobowl med nötkött, ris, bönor & gräddfil', protein: 54, carbs: 72, fat: 26 },
      dinner:    { name: 'Hel lax med smörfräst potatis, gröna bönor & citronsås', protein: 52, carbs: 58, fat: 32 },
      snack:     { name: 'Mass-gainer-smoothie: mjölk, havre, mörk choklad, PB, banan', protein: 36, carbs: 85, fat: 22 },
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
      snack:     { name: 'Banan + 1 msk mandelmandel smör + proteinshake', protein: 22, carbs: 34, fat: 10 },
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

// ─── Countdown ───────────────────────────────────────────────────────────────
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
    }}>
      {/* Progress ring */}
      <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
        <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="40" cy="40" r="32" fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 32}`}
            strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          fontWeight: 'bold', fontSize: '1.2rem', color,
        }}>
          {daysLeft}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
          Gratis testperiod
        </div>
        <div style={{ fontSize: '1.3rem', color: 'var(--text-white)', fontWeight: 'bold' }}>
          {daysLeft === 0 ? 'Testperioden är avslutad' : `${daysLeft} dagar kvar`}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Dag {Math.min(daysUsed + 1, 14)} av 14 · Avslutas {end.toLocaleDateString('sv-SE')}
        </div>
        {daysLeft <= 3 && daysLeft > 0 && (
          <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#f59e0b', fontWeight: 'bold' }}>
            ⚡ Välj ett paket innan testperioden slutar!
          </div>
        )}
      </div>

      {daysLeft <= 7 && (
        <Link
          to="/ansok"
          style={{
            marginLeft: 'auto',
            background: 'linear-gradient(135deg, #b89547, #a07830)',
            color: '#000', fontWeight: 'bold', fontSize: '0.85rem',
            padding: '10px 20px', borderRadius: '100px',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}
        >
          Uppgradera nu →
        </Link>
      )}
    </div>
  )
}

// ─── ExerciseCard (compact) ───────────────────────────────────────────────────
function ExerciseCard({ ex, idx }) {
  const [expanded, setExpanded] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const [showPeak, setShowPeak] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const imgSrc = imgErr ? null : showPeak ? ex.images.classic.peak : ex.images.classic.start

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
          <SlowGif src={imgSrc} alt={ex.name_en} speed={0.45} style={{ height: '110px', objectFit: 'contain', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.6))' }} />
        ) : (
          <span style={{ fontSize: '2.5rem' }}>💪</span>
        )}
        <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'var(--accent-gold)', color: '#000', fontWeight: 'bold', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '100px' }}>
          #{idx + 1}
        </div>
        <div style={{ position: 'absolute', bottom: '4px', right: '6px', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>
          {imgSrc?.includes('.gif') ? '🎬 6s Video' : (showPeak ? 'PEAK' : 'START')}
        </div>
        {ex.isBandBicepsCurl && (
          <div style={{
            position: 'absolute', top: '6px', right: '6px',
            background: '#f97316',
            color: '#fff', fontSize: '0.6rem', fontWeight: 'bold',
            padding: '3px 7px', borderRadius: '100px',
            boxShadow: '0 2px 4px rgba(249,115,22,0.4)'
          }}>
            UPPVÄRMNING
          </div>
        )}
      </div>

      <div style={{ padding: '12px' }}>
        <h5 style={{ color: 'var(--text-white)', margin: '0 0 6px 0', fontSize: '0.82rem', fontWeight: 'bold', lineHeight: 1.3 }}>{ex.name_en}</h5>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span style={{ background: 'rgba(184,149,71,0.15)', color: 'var(--accent-gold)', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 7px', borderRadius: '100px', border: '1px solid rgba(184,149,71,0.3)' }}>{ex.sets} set</span>
          <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 7px', borderRadius: '100px', border: '1px solid rgba(16,185,129,0.25)' }}>{ex.reps} reps</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {ex.youtubeUrl && (
            <a
              href={ex.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
                color: '#ffffff',
                fontSize: '0.68rem',
                padding: '5px 8px',
                borderRadius: '6px',
                textDecoration: 'none',
                width: '100%',
                fontWeight: 'bold',
                display: 'block',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(255,0,0,0.3)',
                transition: 'all 0.2s'
              }}
            >
              ▶️ Se på YouTube Shorts
            </a>
          )}
          <button
            onClick={() => setExpanded(p => !p)}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
          >
            {expanded ? '▲ Stäng' : '▼ Instruktioner'}
          </button>
          
          {(ex.isOneArmShoulderPress || ex.isArnoldPress || ex.isSmithSeatedShoulderPress || ex.isJackknifeSitUp || ex.isOtisUp || ex.isAbdominalCrunch || ex.isLyingLegRaise || ex.isAlternateHeelTouchers || ex.isFrontPlank || ex.isDumbbellStandingOneArmCurl || ex.isCrossBodyHammerCurl || ex.isBarbellReverseGripRow || ex.isWideGripPullUp || ex.isCableLowSeatedRow || ex.isCableNeutralGripLatPulldown || ex.isReverseGripPushdown || ex.isTricepsPushdown || ex.isPreacherCurl || ex.isStandardCableCurl || ex.note) && (
            <button
              onClick={() => setShowDetails(p => !p)}
              style={{
                background: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid rgba(0, 242, 254, 0.2)',
                color: '#00f2fe',
                fontSize: '0.65rem',
                padding: '4px 8px',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                display: 'block',
                textAlign: 'center'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0, 242, 254, 0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0, 242, 254, 0.08)' }}
            >
              {showDetails ? '📖 Stäng detaljer' : '👉 Läs mer: Anatomi & Syfte'}
            </button>
          )}
        </div>

        {expanded && (
          <ol style={{ margin: '8px 0 0 0', paddingLeft: '16px', fontSize: '0.72rem', color: 'var(--text-silver)', lineHeight: 1.5 }}>
            {ex.instructions_en?.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        )}

        {showDetails && (ex.isFrontPlank || ex.isDumbbellStandingOneArmCurl || ex.isCrossBodyHammerCurl) && (
          <div style={{
            marginTop: '8px',
            background: 'rgba(0,0,0,0.25)',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(0, 242, 254, 0.15)',
            maxHeight: '220px',
            overflowY: 'auto',
            textAlign: 'left',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
            fontSize: '0.72rem',
            lineHeight: 1.45,
            color: 'var(--text-silver)'
          }} className="custom-scrollbar">
            
            
            
            
            
            
            
            
            {ex.isOneArmShoulderPress && (
              <>
                <p style={{ margin: '0 0 10px 0', lineHeight: 1.45 }}>
                  Dumbbell Seated One Arm Shoulder Press (Sittande enarmad hantelpress) är en unilateral variant av axelpress som ger extra fokus på stabilitet och muskelbalans.
                </p>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Främre och mellersta axeln (Deltoideus):</strong> Huvudmålet för att bygga styrka och bredd i axelpartiet.</li>
                    <li><strong>Triceps Brachii:</strong> Hjälper till att sträcka ut armen i toppläget.</li>
                    <li><strong>Core (Bål):</strong> Mycket viktigt! Eftersom du bara håller en vikt på ena sidan måste dina magmuskler (särskilt obliques) jobba hårt för att hålla överkroppen rak och motverka att du tippar åt sidan.</li>
                    <li><strong>Övre bröst & Serratus Anterior:</strong> Stabiliserar lyftet och bröstkorgen.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Axelleden:</strong> Genom pressrörelsen uppåt.</li>
                    <li><strong>Armbågsleden:</strong> Genom uträtning (extension).</li>
                    <li><strong>Skulderbladet:</strong> Roterar och stabiliserar rörelsen.</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Sitt spikrakt:</strong> Undvik att luta dig åt sidan för att "hjälpa" vikten upp. Om du inte kan sitta rakt är vikten för tung.</li>
                    <li><strong>Lås bålen:</strong> Tänk att du ska "dra in naveln" och sitta stadigt mot ryggstödet.</li>
                    <li><strong>Andra handen:</strong> Håll den lediga handen på låret eller ta tag i sätets kant för extra stabilitet.</li>
                  </ul>
                </div>
              </>
            )}
            {ex.isArnoldPress && (
              <>
                <p style={{ margin: '0 0 10px 0', lineHeight: 1.45 }}>
                  Dumbbell Arnold Press är en variant av axelpress som skapades av Arnold Schwarzenegger. Det som gör den unik är den roterande rörelsen, vilket gör det till en mer komplett övning för hela axelpartiet.
                </p>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Deltoideus (Axlarna) – Alla tre huvudena:</strong>
                      <ul style={{ paddingLeft: '14px', marginTop: '2px' }}>
                        <li><strong>Främre (Anterior):</strong> Jobbar mest under själva pressen.</li>
                        <li><strong>Mellersta (Lateral):</strong> Ger bredd åt axlarna och aktiveras under rotationen.</li>
                        <li><strong>Bakre (Posterior):</strong> Jobbar statiskt för att stabilisera vikten i bottenläget.</li>
                      </ul>
                    </li>
                    <li><strong>Triceps Brachii:</strong> Sträcker ut armen i toppläget.</li>
                    <li><strong>Övre Trapezius & Serratus Anterior:</strong> Assisterar och stabiliserar skulderbladen.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Axelleden:</strong> Flexion, abduktion och extern rotation.</li>
                    <li><strong>Armbågsleden:</strong> Extension (uträtning).</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Startposition:</strong> Håll hantlarna framför axlarna med handflatorna vända mot dig.</li>
                    <li><strong>Rotationen:</strong> Rotera händerna mjukt så att handflatorna pekar framåt i toppläget.</li>
                    <li><strong>Kontroll:</strong> Utför rörelsen i en mjuk, flytande bana.</li>
                    <li><strong>Sitt eller stå:</strong> Ryggstöd ger mer isolering, stående utmanar bålen mer.</li>
                  </ul>
                </div>
              </>
            )}
            {ex.isSmithSeatedShoulderPress && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Främre axeln (Anterior Deltoid):</strong> Huvudmålet. Den främre delen av axeln får jobba extremt hårt för att pressa stången uppåt.</li>
                    <li><strong>Mellersta axeln (Lateral Deltoid):</strong> Assisterar i rörelsen och hjälper till att ge axlarna bredd.</li>
                    <li><strong>Triceps Brachii:</strong> Musklerna på baksidan av överarmen jobbar för att sträcka ut armbågsleden i slutet av rörelsen.</li>
                    <li><strong>Övre bröstmuskulaturen (Pectoralis Major):</strong> Den översta delen av bröstet hjälper till i början av pressen.</li>
                    <li><strong>Trapezius & Serratus Anterior:</strong> Stabiliserar skulderbladen under hela rörelsen.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Axelleden:</strong> Genom abduktion och flexion (armarna rör sig uppåt och utåt).</li>
                    <li><strong>Armbågsleden:</strong> Genom extension (armarna rätas ut).</li>
                    <li><strong>Skulderbladen:</strong> Roterar uppåt för att tillåta armarna att nå högsta punkten.</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Sitt rakt:</strong> Tryck ryggen ordentligt mot sätet och håll bröstet högt.</li>
                    <li><strong>Armbågarnas vinkel:</strong> Låt inte armbågarna peka rakt ut åt sidorna; ha dem aningen framför dig för att skona axelleden.</li>
                    <li><strong>Stoppa i tid:</strong> Sänk stången till ungefär hakhöjd eller strax under. Går du för djupt kan det skapa onödig stress på axelns framsida.</li>
                  </ul>
                </div>
              </>
            )}
            {ex.isJackknifeSitUp && (
              <>
                <p style={{ margin: '0 0 10px 0', lineHeight: 1.45 }}>
                  Jackknife Sit-Up (ofta kallad V-up) är en avancerad och intensiv magövning där du lyfter både överkropp och ben samtidigt för att mötas i en "V-position".
                </p>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Primary Muscles:</strong> Rectus Abdominis (övre och nedre magen samtidigt) & Iliopsoas (Höftböjarna).</li>
                    <li><strong>Secondary Muscles:</strong> Obliques (balans), Quadriceps (raka ben) & Hip Adductors (insida lår).</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Ryggraden:</strong> Kraftig flexion (böjning) när du rullar upp.</li>
                    <li><strong>Höftleden:</strong> Flexion när benen lyfts uppåt.</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Mötas på mitten:</strong> Händer och fötter ska mötas precis ovanför mitten av kroppen.</li>
                    <li><strong>Kontrollerad retur:</strong> Bromsa på vägen ner utan att släppa anspänningen.</li>
                    <li><strong>Andning:</strong> Andas ut kraftfullt i V-positionen.</li>
                  </ul>
                </div>
              </>
            )}
            {ex.isOtisUp && (
              <>
                <p style={{ margin: '0 0 10px 0', lineHeight: 1.45 }}>
                  Otis Up är en avancerad, viktad variant av en sit-up där du håller en viktplatta med raka armar mot taket under hela rörelsen. Kombinerar rå styrka i magen med kontroll och stabilitet.
                </p>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Primary Muscles:</strong> Rectus Abdominis (raka magmusklerna) & Iliopsoas (Höftböjarna - mycket aktiva vid full sit-up).</li>
                    <li><strong>Secondary Muscles:</strong> Obliques (sneda magmusklerna), Sartorius (lår), Främre Axlar (Anterior Deltoid - håller vikten pressad uppåt).</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Ryggraden:</strong> Flexion när du rullar upp från golvet.</li>
                    <li><strong>Höftleden:</strong> Kraftig flexion för att dra upp överkroppen.</li>
                    <li><strong>Axelleden:</strong> Isometrisk anspänning som stabiliserar vikten mot taket.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Varför ska man göra Otis Up?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Progressiv belastning:</strong> Enkelt att öka vikten på plattan för maximal muskeluppbyggnad.</li>
                    <li><strong>Explosivitet & Kraft:</strong> Används ofta inom kampsport och tyngdlyftning.</li>
                    <li><strong>Bättre hållning & Stabilitet:</strong> Tränar ryggradens stabilitet under tryck.</li>
                    <li><strong>Helkroppskontroll:</strong> Kräver synkade över- och underkroppsrörelser.</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Pressa mot taket:</strong> Pressa vikten spikrakt uppåt mot taket hela tiden.</li>
                    <li><strong>Fötterna i golvet:</strong> Håll fötterna stadigt placerade i golvet.</li>
                    <li><strong>Rulla ner långsamt:</strong> Släpp inte ner ryggen, bromsa rörelsen på vägen ner.</li>
                  </ul>
                </div>
              </>
            )}
            {ex.isAbdominalCrunch && (
              <>
                <p style={{ margin: '0 0 10px 0', lineHeight: 1.45 }}>
                  Abdominal Crunch (Crunches) är den mest klassiska övningen för att isolera den raka magmuskeln. Till skillnad från en sit-up, där man lyfter hela ryggen, lyfter man här bara den översta delen.
                </p>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Rectus Abdominis (Huvudmuskel):</strong> Fokus ligger främst på den övre delen av "sexpacket".</li>
                    <li><strong>Obliques (Sekundära):</strong> De sneda magmusklerna hjälper till att stabilisera rörelsen.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Ryggraden:</strong> Kontrollerad flexion (böjning) i den övre delen av ryggraden (bröstryggen).</li>
                    <li><strong>Viktigt:</strong> Höftleden är helt stilla, vilket isolerar magen mer.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Varför ska man göra Abdominal Crunches?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Isolerar magen optimalt:</strong> Tvingar magmusklerna att göra allt jobb utan att höftböjarna tar över.</li>
                    <li><strong>Skonsam för ländryggen:</strong> Ländryggen stannar kvar i golvet hela tiden.</li>
                    <li><strong>Bygger definition:</strong> Kraftig sammandragning för tydligare "rutor".</li>
                    <li><strong>Enkel att utföra:</strong> Kräver ingen utrustning.</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Dra inte i nacken:</strong> Kraften ska komma från magen, inte armarna.</li>
                    <li><strong>Rulla ihop:</strong> Rulla ihop bröstkorgen mot naveln.</li>
                    <li><strong>Kvalitet före kvantitet:</strong> Kläm åt maximalt i toppläget.</li>
                  </ul>
                </div>
              </>
            )}
            {ex.isLyingLegRaise && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka muskler och leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Huvudmuskel:</strong> Nedre delen av magen (Rectus abdominis). En av de bästa övningarna för nedre regionen.</li>
                    <li><strong>Sekundära muskler:</strong> Höftböjarna (Iliopsoas) och framsida lår (Quadriceps). Även sätet stabiliserar.</li>
                    <li><strong>Leder:</strong> Höftleden (rörelse) & Ländryggen (statisk anspänning).</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Varför ska man göra den här övningen?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Fokus på nedre magen:</strong> Stärker den del av magen som ofta är svårast att komma åt.</li>
                    <li><strong>Bålstabilitet:</strong> Kontrollerar bäckenet och ländryggen, vilket skyddar ryggen vid lyft.</li>
                    <li><strong>Hållning & Korsett:</strong> Stärker samspelet mellan mage och höft utan utrustning.</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Viktigt tips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Pressa ner ländryggen:</strong> Pressa ner ländryggen i golvet under hela rörelsen. Om ryggen börjar svanka, stanna och vänd rörelsen uppåt igen.</li>
                  </ul>
                </div>
              </>
            )}
            {ex.isAlternateHeelTouchers && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Primary Muscles (Huvudmuskler):</strong> Obliques (de sneda magmusklerna). Sitter på sidorna av midjan och ansvarar för att böja kroppen i sidled.</li>
                    <li><strong>Secondary Muscles:</strong> Rectus Abdominis ("sexpacket", hålla axlarna lyfta) & Transversus Abdominis (djupa bålstabiliserande muskler).</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Ryggraden (Intervertebral-lederna):</strong> Rörelsen sker genom lateral flexion (sidoböjning) av ryggraden.</li>
                    <li><strong>Nacken:</strong> Musklerna i nacken jobbar statiskt för att hålla huvudet uppe.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Varför ska man göra Alternate Heel Touchers?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Isolering av midjan:</strong> Enkel och effektiv övning för sneda magmusklerna utan vikter.</li>
                    <li><strong>Muskeldefinition & Uthållighet:</strong> Toner musklerna på sidan av magen.</li>
                    <li><strong>Skonsam för ländryggen:</strong> Liggande position som är säker för ryggen.</li>
                    <li><strong>Stärker bålstabiliteten:</strong> Tränar kontroll i sidled.</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Lyft axlarna:</strong> Håll skulderbladen ovanför golvet under hela övningen.</li>
                    <li><strong>Tänk "Pingvin":</strong> Kontrollerad sidoböjning mot hälen för maximal obliques-kontakt.</li>
                    <li><strong>Blicken mot taket:</strong> Avstånd mellan haka och bröst för att skona nacken.</li>
                  </ul>
                </div>
              </>
            )}
            {ex.isFrontPlank && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Rectus Abdominis:</strong> De raka magmusklerna ("sexpacket").</li>
                    <li><strong>Transversus Abdominis:</strong> Djupa magmusklerna (korsetten).</li>
                    <li><strong>Obliques:</strong> De sneda magmusklerna (stabilisering).</li>
                    <li><strong>Erector Spinae:</strong> Ryggsträckarna (håller ryggraden rak).</li>
                    <li><strong>Serratus Anterior & Axlar:</strong> Håller dig uppe statiskt.</li>
                    <li><strong>Säte & Framsida lår:</strong> Håller kroppen i en rak linje.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Ryggraden:</strong> Neutral position (motverkar rörelse/anti-extension).</li>
                    <li><strong>Axelleden:</strong> Stabiliserar kroppsvikten.</li>
                    <li><strong>Höftleden:</strong> Hålls stabil av höftböjare och säte.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Varför göra Front Plank?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Bålstabilitet:</strong> Grunden för all annan styrka i knäböj/marklyft.</li>
                    <li><strong>Hållning:</strong> Hjälper dig stå och sitta rakare.</li>
                    <li><strong>Mindre ryggont:</strong> Avlastar ländryggen och minskar besvär.</li>
                    <li><strong>Funktionell styrka:</strong> Skapar helkroppsanspänning.</li>
                    <li><strong>Säkerhet:</strong> Statisk utan tunga vikter, minimal skaderisk.</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Ingen "hängbro":</strong> Spänn sätet och magen så höften inte sjunker.</li>
                    <li><strong>Tryck ifrån:</strong> Sjunk inte mellan axlarna, pressa underarmarna mot golvet.</li>
                    <li><strong>Andas:</strong> Håll inte andan under anspänningen.</li>
                  </ul>
                </div>
              </>
            )}
            {ex.isDumbbellStandingOneArmCurl && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Biceps Brachii:</strong> Huvudmålet (långa och korta huvudet).</li>
                    <li><strong>Brachialis:</strong> Djup muskel som ger överarmen fyllighet.</li>
                    <li><strong>Brachioradialis:</strong> Muskeln på ovansidan av underarmen.</li>
                    <li><strong>Core (Bål):</strong> Sneda magmusklerna motverkar sidotippning.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Armbågsleden:</strong> Primär rörelse (flexion).</li>
                    <li><strong>Handleden:</strong> Stabiliserar hanteln och tillåter supination.</li>
                    <li><strong>Axelleden:</strong> Fungerar som stabilisator.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Varför göra övningen?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Rätta till obalanser:</strong> Upptäck och korrigera styrkeskillnader mellan armarna.</li>
                    <li><strong>Mind-Muscle Connection:</strong> Unilateralt fokus ger maximal kontakt.</li>
                    <li><strong>Bättre rörlighet:</strong> Tillåter fri handledsrotation under rörelsen.</li>
                    <li><strong>Tränar bålen:</strong> Motverkar asymmetrisk belastning.</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Stå stadigt:</strong> Håll höftbredd och spänn sätet.</li>
                    <li><strong>Ingen rotation:</strong> Låt inte kroppen luta sig eller hjälpa hanteln upp.</li>
                    <li><strong>Vrid lillfingret uppåt:</strong> Rotera handleden i toppläget för maximal biceps-kontraktion.</li>
                  </ul>
                </div>
              </>
            )}
            
            {ex.isBarbellReverseGripRow && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>Vilka muskler tränas?</strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Latissimus Dorsi (Lats):</strong> Huvudfokus för ryggbredd.</li>
                    <li><strong>Biceps Brachii:</strong> Underhandsgreppet ger hög aktivering.</li>
                    <li><strong>Trapezius & Rhomboids:</strong> Klämmer ihop skulderbladen i toppläget.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>Varför göra Yates Row?</strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Bygger ryggtjocklek:</strong> Basövning för massiv överkropp.</li>
                    <li><strong>Bättre bålstabilitet:</strong> Stärker ländryggen statiskt.</li>
                  </ul>
                </div>
              </>
            )}
            {ex.isWideGripPullUp && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>Vilka muskler tränas?</strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Latissimus Dorsi:</strong> Kungen av ryggövningar för V-taper form.</li>
                    <li><strong>Teres Major & Rhomboids:</strong> Övre ryggens detaljer.</li>
                  </ul>
                </div>
              </>
            )}
            {ex.note && !ex.isFrontPlank && !ex.isDumbbellStandingOneArmCurl && !ex.isCrossBodyHammerCurl && (
              <div>
                <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>💡 Tränarens notering</strong>
                <p style={{ margin: 0 }}>{ex.note}</p>
              </div>
            )}
            {ex.isCrossBodyHammerCurl && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Brachialis:</strong> Den djupa muskeln under biceps som ökar armens tjocklek.</li>
                    <li><strong>Brachioradialis:</strong> Underarmens ovansida som ger kraftfullt grepp.</li>
                    <li><strong>Biceps Brachii (Långa huvudet):</strong> Yttre biceps för en bättre bicepstopp.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Armbågsleden:</strong> Flexion i ett neutralt grepp.</li>
                    <li><strong>Axelleden:</strong> Stabiliserar vikten under rörelsen.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Varför göra övningen?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Bygger bredare armar:</strong> Brachialis trycker upp biceps utifrån.</li>
                    <li><strong>Stärker greppet:</strong> Hög aktivering av underarmsmusklerna.</li>
                    <li><strong>Mindre fusk:</strong> Att korsa över kroppen minskar risken för att svinga.</li>
                    <li><strong>Skonsam:</strong> Det neutrala greppet är snällt mot handleder och armbågor.</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    Tekniktips till klienten
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Neutralt grepp:</strong> Håll hanteln som en hammare hela vägen.</li>
                    <li><strong>Korsa bröstet:</strong> För hanteln mot motsatta axeln men stanna strax innan bröstet.</li>
                    <li><strong>Stilla överarm:</strong> Håll armbågen fixerad mot kroppen.</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MealDayCard ─────────────────────────────────────────────────────────────
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

// ─── Main MyProgram Page ──────────────────────────────────────────────────────
export default function MyProgram() {
  const navigate = useNavigate()
  const [programData, setProgramData] = useState(null)
  const [program, setProgram] = useState(null)
  const [mealPlan, setMealPlan] = useState([])
  const [activeTab, setActiveTab] = useState('workout') // 'workout' | 'meals'
  const [activeWeek, setActiveWeek] = useState(1)
  const [activeDay, setActiveDay] = useState(0)
  const [clientName, setClientName] = useState('')

  useEffect(() => {
    // Auth check
    const token = localStorage.getItem('client_token')
    if (!token) {
      navigate('/login')
      return
    }

    const name = localStorage.getItem('client_name') || localStorage.getItem('client_user') || 'Klient'
    setClientName(name)

    // Load program data from localStorage
    const stored = localStorage.getItem('client_program_data')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        data.trainingDays = '6-7' // Override to 7-day program split
        setProgramData(data)

        // Generate program from answers
        const p = buildProgram({
          trainingDays: '6-7',
          equipment: data.equipmentAvailable || 'Fria vikter & maskiner',
          experienceLevel: data.experienceLevel || 'Nybörjare',
        })
        setProgram(p)

        // Generate meal plan
        const cal = data.calories?.targetCalories || 2000
        const meals = generateMealPlan(data.weightGoal || 'Bibehålla', cal)
        setMealPlan(meals)
      } catch (e) {
        console.error('Failed to parse program data', e)
      }
    } else {
      // No onboarding data — generate default program
      const p = buildProgram({ trainingDays: '6-7', equipment: 'Fria vikter & maskiner', experienceLevel: 'Nybörjare' })
      setProgram(p)
      const meals = generateMealPlan('Bibehålla', 2000)
      setMealPlan(meals)
    }
  }, [navigate])

  // Which day of the trial is today?
  const trialStart = programData?.trialStartDate || new Date().toISOString()
  const dayOfTrial = Math.min(14, Math.max(1, Math.ceil((Date.now() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24)) + 1))

  const currentWeekData = program ? (activeWeek === 1 ? program.week1 : program.week2) : []
  const currentDay = currentWeekData[activeDay] || null

  const handleLogout = () => {
    localStorage.removeItem('client_token')
    localStorage.removeItem('client_user')
    localStorage.removeItem('client_name')
    navigate('/')
    window.location.reload()
  }

  if (!program) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--accent-gold)', fontSize: '1.1rem' }}>🏋️ Laddar ditt program...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(184,149,71,0.12) 0%, rgba(99,102,241,0.08) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 24px 24px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                🏋️ Mitt Program — Muscle & Focus
              </div>
              <h1 style={{ color: 'var(--text-white)', margin: 0, fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 'bold' }}>
                Välkommen, <span style={{ background: 'linear-gradient(135deg, #b89547, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{clientName.split(' ')[0]}</span> 👋
              </h1>
              <p style={{ color: 'var(--text-muted)', margin: '6px 0 0 0', fontSize: '0.88rem' }}>
                Ditt personliga 14-dagars träningsprogram och kostschema är redo!
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              Logga ut
            </button>
          </div>

          {/* Trial Countdown */}
          <TrialCountdown trialStart={trialStart} />

          {/* Stats summary row */}
          {programData?.calories && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginTop: '16px' }}>
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
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: '8px', margin: '24px 0 20px' }}>
          {[
            { id: 'workout', label: '🏋️ Träningsprogram', desc: '14 dagar' },
            { id: 'meals', label: '🍽️ Kostschema', desc: '14 dagars matplan' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '14px 16px',
                borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                border: activeTab === tab.id ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, rgba(184,149,71,0.15), rgba(184,149,71,0.05))'
                  : 'rgba(255,255,255,0.02)',
                color: activeTab === tab.id ? 'var(--text-white)' : 'var(--text-muted)',
                fontWeight: 'bold', fontSize: '0.9rem',
                textAlign: 'left',
              }}
            >
              <div>{tab.label}</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 'normal', color: 'var(--text-muted)', marginTop: '2px' }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* ══════════════════ WORKOUT TAB ══════════════════ */}
        {activeTab === 'workout' && (
          <div>
            {/* Program info chips */}
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

            {/* Week Tabs */}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', marginBottom: '20px' }}>
              {currentWeekData.map((day, idx) => {
                const isActive = activeDay === idx
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveDay(idx)}
                    style={{
                      padding: '12px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
                      border: isActive ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.07)',
                      background: isActive ? 'rgba(184,149,71,0.12)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Dag {day.day}</span>
                    <span style={{ fontSize: '1rem' }}>{SPLIT_EMOJIS[day.splitType]}</span>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isActive ? 'var(--text-white)' : 'var(--text-silver)', lineHeight: 1.2, marginTop: '2px' }}>
                      {DAY_NAMES_SV[day.splitType]}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '4px' }}>{day.exercises.length} övningar</div>
                  </div>
                )
              })}
            </div>

            {/* Exercise grid */}
            {currentDay && currentDay.splitType === 'rest' ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.08))',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '16px',
                padding: '40px 24px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
              }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🛋️</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-white)', marginBottom: '12px' }}>
                  VILODAG & ÅTERHÄMTNING
                </h3>
                <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.9rem', color: 'var(--text-silver)', lineHeight: 1.6 }}>
                  Bra jobbat med din träning! Återhämtning är en av de absolut viktigaste delarna i ditt träningsprogram. Det är under vilan som din kropp reparerar mikroskadorna i musklerna, bygger upp ny styrka och fyller på dina energidepåer.
                </p>
                <div style={{
                  marginTop: '24px',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  gap: '8px',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '16px 24px',
                  borderRadius: '10px',
                  textAlign: 'left'
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 'bold', textTransform: 'uppercase' }}>💡 Dagens tips för återhämtning:</span>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.82rem', color: 'var(--text-silver)', lineHeight: 1.5 }}>
                    <li>Fokusera på god sömn (7-9 timmar).</li>
                    <li>Drick rikligt med water under dagen.</li>
                    <li>Håll proteinintaget jämnt för att stödja muskelreparation.</li>
                    <li>Gör gärna en lätt promenad för aktiv återhämtning och ökad blodcirkulation.</li>
                  </ul>
                </div>
              </div>
            ) : currentDay && (
              <div>
                <h3 style={{ color: 'var(--text-white)', margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {SPLIT_EMOJIS[currentDay.splitType]} {DAY_NAMES_SV[currentDay.splitType]}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal', marginLeft: '10px' }}>
                    Vecka {activeWeek} · {currentDay.exercises.length} övningar
                  </span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                  {currentDay.exercises.map((ex, idx) => (
                    <ExerciseCard key={ex.id + idx} ex={ex} idx={idx} />
                  ))}
                </div>

                {/* RepDB attribution */}
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center' }}>
                  Övningsdata & illustrationer: <a href="https://repdb.co" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>RepDB</a> · CC BY-NC 4.0
                </p>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════ MEAL PLAN TAB ══════════════════ */}
        {activeTab === 'meals' && (
          <div>
            {/* Calorie summary header */}
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
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981' }}>{programData.calories.carbs}g</div>
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

        {/* ── CTA ── */}
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
    </div>
  )
}
