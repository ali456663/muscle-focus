import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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

// ─── helpers ────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Build a personalised 2-week workout program from the RepDB exercise list.
 * Week 1 uses the base rep/set counts.
 * Week 2 applies +1 set or +2 reps progressive overload.
 */
function buildProgram({ trainingDays, equipment, experienceLevel, weightGoal, gender }) {
  const equipmentKey = EQUIPMENT_MAPPING[equipment] || EQUIPMENT_MAPPING['Fria vikter & maskiner']
  const difficultyLevels = DIFFICULTY_MAPPING[experienceLevel] || ['beginner', 'intermediate']

  // Days per week & split
  const structure = PROGRAM_STRUCTURE[trainingDays] || PROGRAM_STRUCTURE['3']
  const { split } = structure

  const filteredByEquip = EXERCISES.filter(ex =>
    equipmentKey.includes(ex.equipment) && difficultyLevels.includes(ex.difficulty)
  )

  // Build each day's exercise list
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
        { id: 'marklyft', name_en: 'Marklyft', sets: 5, reps: '5', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-deadlift.gif' },
        { id: 'sled-45-leg-press', name_en: 'Sled 45° Leg Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/sled-45-leg-press.gif' },
        { id: 'lever-leg-extension', name_en: 'Lever Leg Extension', sets: 3, reps: '10-12', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif' },
        { id: 'sled-wide-hack-squat', name_en: 'Sled Wide Hack Squat', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/sled-hack-squat.gif' },
        { id: 'lever-horizontal-one-leg-press', name_en: 'Lever Horizontal One Leg Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/lever-horizontal-one-leg-press.gif' },
        { id: 'lever-one-leg-extension', name_en: 'Lever One Leg Extension', sets: 3, reps: '10-12', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif' }
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
            sets = ex.sets + 1; // progressive overload: add 1 set
          }
          return { ...ex, sets, reps, week: 2 };
        })
      });
      return;
    }

    if (splitType === 'shoulders') {
      const shoulderExercises = [
        { id: 'delts/dumbbell-arnold-press', name_en: 'Dumbbell Arnold Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/dumbbell-arnold-press.gif' },
        { id: 'delts/dumbbell-one-arm-shoulder-press', name_en: 'Dumbbell Seated One Arm Shoulder Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/dumbbell-one-arm-shoulder-press.gif' },
        { id: 'delts/dumbbell-lateral-raise', name_en: 'Dumbbell Poliquin Lateral Raise', sets: 3, reps: '10-12', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/dumbbell-lateral-raise.gif' },
        { id: 'delts/dumbbell-seated-shoulder-press', name_en: 'Dumbbell Seated Shoulder Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/dumbbell-seated-shoulder-press.gif' },
        { id: 'delts/lever-military-press', name_en: 'Lever Military Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/lever-military-press.gif' },
        { id: 'delts/band-standing-rear-delt-row', name_en: 'Band Standing Rear Delt Row', sets: 3, reps: '12-15', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/band-standing-rear-delt-row.gif' },
        { id: 'delts/kettlebell-lateral-raise', name_en: 'Kettlebell Lateral Raise', sets: 3, reps: '10-12', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/dumbbell-lateral-raise.gif' },
        { id: 'delts/cable-seated-rear-lateral-raise', name_en: 'Cable Seated Rear Lateral Raise', sets: 3, reps: '12-15', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/cable-seated-rear-lateral-raise.gif' },
        { id: 'delts/smith-seated-shoulder-press', name_en: 'Smith Seated Shoulder Press', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/delts/smith-seated-shoulder-press.gif' }
      ];

      const mapped = shoulderExercises.map(ex => {
        const original = EXERCISES.find(e => e.id === ex.id) || {};
        return {
          ...original,
          id: ex.id,
          name_en: ex.name_en,
          name_es: original.name_es || ex.name_en,
          name_fa: original.name_fa || ex.name_en,
          name: ex.name_en,
          equipment: original.equipment || (ex.id.includes('lever') ? 'leverage machine' : 'dumbbell'),
          sets: ex.sets,
          reps: ex.reps,
          images: {
            classic: { start: ex.gifUrl, peak: ex.gifUrl },
            flat: { start: ex.gifUrl, peak: ex.gifUrl }
          },
          instructions_en: original.instructions_en || [
            `Setup with proper posture for ${ex.name_en}.`,
            `Perform the movement with control.`,
            `Squeeze the target shoulder muscles at the peak contraction.`,
            `Return to starting position with control.`
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
        name_fa: 'پشت بازو سیم‌کش från پشت سر با طناب',
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
          youtubeUrl: 'https://youtube.com/shorts/jvhfQeTZZho?si=c5hR3qdn7crvs1Ct'
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
        { id: 'core/crunch', name_en: 'Abdominal Crunch', sets: 3, reps: '15-20', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abs/abdominal-crunch.gif' },
        { id: 'core/hanging-leg-raise', name_en: 'Hanging Leg Raise', sets: 3, reps: '12-15', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abs/hanging-leg-raise.gif' },
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
          reps: '30-60 sek',
          gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abs/front-plank.gif',
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
          isFrontPlank: ex.isFrontPlank
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
      name_fa: 'پشت بازو سیم‌کش بالای سر',
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
      name_fa: 'پشت بازو سیم‌کش ضربدری از طرفین',
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

// Muscle group display name map
const MUSCLE_LABELS = {
  anterior_deltoid: 'Anterior deltoid', lateral_deltoid: 'Lateral deltoid',
  pectoralis_major: 'Bröst', gluteus_maximus: 'Gluteus maximus',
  gluteus_medius: 'Gluteus medius', hamstrings: 'Hamstrings',
  quadriceps: 'Quadriceps', latissimus_dorsi: 'Latissimus dorsi',
  biceps_brachii: 'Biceps', triceps_brachii: 'Triceps',
  rhomboids: 'Rhomboids', trapezius: 'Trapezius',
  rectus_abdominis: 'Mage (rectus)', core: 'Core',
  erector_spinae: 'Ryggresare', gastrocnemius: 'Calf (gastrocnemius)',
  soleus: 'Soleus', forearm_flexors: 'Underarm',
}

const EQUIPMENT_ICONS = {
  none: '🏃', dumbbell: '🏋️', barbell: '🥇', cable: '🔗',
  machine: '⚙️', loop_band: '🩹', pull_up_bar: '🏗️',
}

// ─── ExerciseCard ─────────────────────────────────────────────────────────
function ExerciseCard({ ex, week, idx }) {
  const [showPeak, setShowPeak] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const imgSrc = imgErr
    ? null
    : showPeak ? ex.images.classic.peak : ex.images.classic.start

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Image + number badge */}
      <div
        style={{ position: 'relative', background: 'rgba(0,0,0,0.3)', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        onClick={() => setShowPeak(p => !p)}
        title="Klicka för att se start/peak"
      >
        {imgSrc && !imgErr ? (
          <SlowGif
            src={imgSrc}
            alt={ex.name_en}
            speed={0.45}
            style={{ height: '130px', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
          />
        ) : (
          <div style={{ fontSize: '3rem' }}>{EQUIPMENT_ICONS[ex.equipment] || '💪'}</div>
        )}

        {/* Number badge */}
        <div style={{
          position: 'absolute', top: '8px', left: '8px',
          background: 'var(--accent-gold)', color: '#000',
          fontWeight: 'bold', fontSize: '0.72rem',
          padding: '3px 8px', borderRadius: '100px',
        }}>
          #{idx + 1}
        </div>

        {/* Pose toggle hint */}
        <div style={{
          position: 'absolute', bottom: '6px', right: '8px',
          fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)',
          background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px',
        }}>
          {imgSrc?.includes('.gif') ? '🎬 6s Video' : `${showPeak ? 'PEAK' : 'START'} · klicka`}
        </div>

        {/* Week 2 glow badge */}
        {week === 2 && (
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontSize: '0.6rem', fontWeight: 'bold',
            padding: '3px 7px', borderRadius: '100px',
          }}>
            +OVERLOAD
          </div>
        )}

        {/* UPPVÄRMNING badge */}
        {ex.isBandBicepsCurl && (
          <div style={{
            position: 'absolute', top: week === 2 ? '32px' : '8px', right: '8px',
            background: '#f97316',
            color: '#fff', fontSize: '0.6rem', fontWeight: 'bold',
            padding: '3px 7px', borderRadius: '100px',
            boxShadow: '0 2px 4px rgba(249,115,22,0.4)'
          }}>
            UPPVÄRMNING
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px' }}>
        <h5 style={{ color: 'var(--text-white)', margin: '0 0 4px 0', fontSize: '0.88rem', fontWeight: 'bold' }}>
          {ex.name_en}
        </h5>

        {/* Sets & Reps badges */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(184,149,71,0.15)', border: '1px solid rgba(184,149,71,0.3)', color: 'var(--accent-gold)', fontSize: '0.72rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '100px' }}>
            {ex.sets} set
          </span>
          <span style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', fontSize: '0.72rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '100px' }}>
            {ex.reps} reps
          </span>
          <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px' }}>
            {EQUIPMENT_ICONS[ex.equipment]} {ex.equipment}
          </span>
        </div>

        {/* Primary muscles */}
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <strong style={{ color: '#38bdf8' }}>Primärt:</strong>{' '}
          {ex.primary_muscles.map(m => MUSCLE_LABELS[m] || m).join(', ')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Expand for instructions */}
          <button
            onClick={() => setExpanded(p => !p)}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-silver)', fontSize: '0.72rem', padding: '4px 10px',
              borderRadius: '6px', cursor: 'pointer', width: '100%', textAlign: 'center',
            }}
          >
            {expanded ? '▲ Stäng instruktioner' : '▼ Se instruktioner & tips'}
          </button>

          {(ex.isFrontPlank || ex.isDumbbellStandingOneArmCurl || ex.isCrossBodyHammerCurl) && (
            <button
              onClick={() => setShowDetails(p => !p)}
              style={{
                background: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid rgba(0, 242, 254, 0.2)',
                color: '#00f2fe',
                fontSize: '0.72rem',
                padding: '4px 10px',
                borderRadius: '6px',
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
          <div style={{ marginTop: '10px', animation: 'fadeIn 0.2s ease' }}>
            <ol style={{ margin: '0 0 8px 0', paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--text-silver)', lineHeight: '1.5' }}>
              {ex.instructions_en?.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
            {ex.tips_en?.length > 0 && (
              <div style={{ background: 'rgba(184,149,71,0.06)', border: '1px solid rgba(184,149,71,0.15)', borderRadius: '6px', padding: '8px 12px' }}>
                <strong style={{ fontSize: '0.7rem', color: 'var(--accent-gold)' }}>💡 Tips</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {ex.tips_en.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {showDetails && (ex.isFrontPlank || ex.isDumbbellStandingOneArmCurl || ex.isCrossBodyHammerCurl) && (
          <div style={{
            marginTop: '10px',
            background: 'rgba(0,0,0,0.25)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(0, 242, 254, 0.15)',
            maxHeight: '220px',
            overflowY: 'auto',
            textAlign: 'left',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
            fontSize: '0.74rem',
            lineHeight: 1.45,
            color: 'var(--text-silver)',
            animation: 'fadeIn 0.2s ease'
          }} className="custom-scrollbar">
            {ex.isFrontPlank && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
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
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Ryggraden:</strong> Neutral position (motverkar rörelse/anti-extension).</li>
                    <li><strong>Axelleden:</strong> Stabiliserar kroppsvikten.</li>
                    <li><strong>Höftleden:</strong> Hålls stabil av höftböjare och säte.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
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
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
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
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
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
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Armbågsleden:</strong> Primär rörelse (flexion).</li>
                    <li><strong>Handleden:</strong> Stabiliserar hanteln och tillåter supination.</li>
                    <li><strong>Axelleden:</strong> Fungerar som stabilisator.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
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
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
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
            {ex.isCrossBodyHammerCurl && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    Vilka muskler tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Brachialis:</strong> Den djupa muskeln under biceps som ökar armens tjocklek.</li>
                    <li><strong>Brachioradialis:</strong> Underarmens ovansida som ger kraftfullt grepp.</li>
                    <li><strong>Biceps Brachii (Långa huvudet):</strong> Yttre biceps för en bättre bicepstopp.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    Vilka leder tränas?
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '14px' }}>
                    <li><strong>Armbågsleden:</strong> Flexion i ett neutralt grepp.</li>
                    <li><strong>Axelleden:</strong> Stabiliserar vikten under rörelsen.</li>
                  </ul>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
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
                  <strong style={{ textTransform: 'uppercase', color: '#00f2fe', display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
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

// ─── DayCard ─────────────────────────────────────────────────────────────────
function DayCard({ dayData, week, isActive, onClick }) {
  const dayLabel = `Dag ${dayData.day}`
  const splitName = DAY_NAMES_SV[dayData.splitType] || dayData.splitType
  const emoji = SPLIT_EMOJIS[dayData.splitType] || '💪'

  return (
    <div
      onClick={onClick}
      style={{
        padding: '16px',
        borderRadius: '12px',
        border: isActive ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
        background: isActive
          ? 'linear-gradient(135deg, rgba(184,149,71,0.12) 0%, rgba(184,149,71,0.04) 100%)'
          : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>{dayLabel}</span>
          <span style={{ fontSize: '1rem' }}>{emoji}</span>
        </div>
        {isActive && (
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-gold)', flexShrink: 0, marginTop: '4px' }} />
        )}
      </div>
      <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: isActive ? 'var(--text-white)' : 'var(--text-silver)', lineHeight: '1.3' }}>
        {splitName}
      </div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '6px' }}>
        {dayData.exercises.length} övningar
      </div>

      {/* Week 2 overload indicator */}
      {week === 2 && (
        <div style={{ marginTop: '6px', fontSize: '0.6rem', color: '#8b5cf6', fontWeight: 'bold' }}>
          ⬆ Progressive overload
        </div>
      )}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function WorkoutProgram() {
  const navigate = useNavigate()

  // Form state
  const [params, setParams] = useState({
    trainingDays: '3',
    equipment: 'Fria vikter & maskiner',
    experienceLevel: 'Nybörjare',
    weightGoal: 'Viktnedgång',
    gender: 'Man',
  })

  const [program, setProgram] = useState(null)
  const [activeWeek, setActiveWeek] = useState(1)
  const [activeDay, setActiveDay] = useState(0)
  const [generated, setGenerated] = useState(false)

  const generate = useCallback(() => {
    const p = buildProgram(params)
    setProgram(p)
    setActiveWeek(1)
    setActiveDay(0)
    setGenerated(true)
  }, [params])

  // Auto-generate on mount with defaults
  useEffect(() => {
    generate()
  }, []) // eslint-disable-line

  const currentWeekData = program
    ? (activeWeek === 1 ? program.week1 : program.week2)
    : []

  const currentDay = currentWeekData[activeDay] || null

  const handleParam = (key, val) => setParams(p => ({ ...p, [key]: val }))

  // ─ Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(184,149,71,0.15) 0%, rgba(99,102,241,0.1) 50%, rgba(0,0,0,0) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '60px 24px 40px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, rgba(184,149,71,0.2), rgba(99,102,241,0.2))',
          border: '1px solid rgba(184,149,71,0.3)',
          borderRadius: '100px', padding: '6px 16px',
          fontSize: '0.72rem', color: 'var(--accent-gold)',
          fontWeight: 'bold', letterSpacing: '0.1em',
          textTransform: 'uppercase', marginBottom: '16px',
        }}>
          🏋️ 2-Veckors Gratis Testperiod · Live Program
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text-white)', fontWeight: 'bold', margin: '0 0 12px 0' }}>
          Ditt Personliga<br />
          <span style={{ background: 'linear-gradient(135deg, #b8954780, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Träningsprogram
          </span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 24px', lineHeight: '1.6' }}>
          Anpassa ditt program nedan. Baserat på dina svar genereras ett fullständigt 2-veckors schema med
          progressiv belastning — vetenskapligt planerat av Muscle &amp; Focus.
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '100px' }}>✅ Baserad på Mifflin-St Jeor</span>
          <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '100px' }}>✅ RepDB övningsbibliotek</span>
          <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '100px' }}>✅ Vecka 2 progressive overload</span>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>

        {/* ── Customizer Panel ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: '24px',
          marginTop: '32px', marginBottom: '32px',
        }}>
          <h3 style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px 0' }}>
            ⚙️ Anpassa programmet
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>

            {/* Training days */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Träningsdagar / vecka
              </label>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['1-2', '3', '4', '5', '6-7'].map(d => (
                  <button
                    key={d}
                    onClick={() => handleParam('trainingDays', d)}
                    style={{
                      flex: 1, minWidth: '36px', padding: '8px 4px',
                      borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold',
                      cursor: 'pointer',
                      border: params.trainingDays === d ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.12)',
                      background: params.trainingDays === d ? 'rgba(184,149,71,0.15)' : 'rgba(255,255,255,0.02)',
                      color: params.trainingDays === d ? 'var(--text-white)' : 'var(--text-muted)',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Erfarenhetsnivå
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Nybörjare', 'Medel', 'Avancerad'].map(e => (
                  <button
                    key={e}
                    onClick={() => handleParam('experienceLevel', e)}
                    style={{
                      flex: 1, padding: '8px 4px',
                      borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold',
                      cursor: 'pointer',
                      border: params.experienceLevel === e ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.12)',
                      background: params.experienceLevel === e ? 'rgba(184,149,71,0.15)' : 'rgba(255,255,255,0.02)',
                      color: params.experienceLevel === e ? 'var(--text-white)' : 'var(--text-muted)',
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tillgänglig utrustning
              </label>
              <select
                value={params.equipment}
                onChange={e => handleParam('equipment', e.target.value)}
                style={{
                  width: '100%', padding: '10px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px', color: 'var(--text-white)', fontSize: '0.8rem',
                }}
              >
                <option value="Ingen utrustning alls">Ingen utrustning (Kroppsvikt)</option>
                <option value="Gummiband & kroppsvikt">Gummiband + kroppsvikt</option>
                <option value="Endast fria vikter">Fria vikter (Hantlar)</option>
                <option value="Fria vikter & maskiner">Fullt gym (Allt)</option>
              </select>
            </div>

            {/* Goal */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Mål
              </label>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['Viktnedgång', 'Viktuppgång', 'Bibehålla'].map(g => (
                  <button
                    key={g}
                    onClick={() => handleParam('weightGoal', g)}
                    style={{
                      flex: 1, padding: '8px 4px',
                      borderRadius: '6px', fontSize: '0.72rem', fontWeight: 'bold',
                      cursor: 'pointer',
                      border: params.weightGoal === g ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.12)',
                      background: params.weightGoal === g ? 'rgba(184,149,71,0.15)' : 'rgba(255,255,255,0.02)',
                      color: params.weightGoal === g ? 'var(--text-white)' : 'var(--text-muted)',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              onClick={generate}
              style={{
                background: 'linear-gradient(135deg, #b89547, #a07830)',
                color: '#000', fontWeight: 'bold', fontSize: '1rem',
                padding: '14px 40px', borderRadius: '100px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(184,149,71,0.4)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(184,149,71,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(184,149,71,0.4)' }}
            >
              🔄 Generera nytt program
            </button>
          </div>
        </div>

        {/* ── Program Viewer ── */}
        {program && (
          <div>
            {/* Week Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {[1, 2].map(w => (
                <button
                  key={w}
                  onClick={() => { setActiveWeek(w); setActiveDay(0) }}
                  style={{
                    flex: 1, padding: '16px',
                    borderRadius: '12px', fontWeight: 'bold', fontSize: '0.95rem',
                    cursor: 'pointer', transition: 'all 0.2s',
                    border: activeWeek === w ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                    background: activeWeek === w
                      ? 'linear-gradient(135deg, rgba(184,149,71,0.15) 0%, rgba(184,149,71,0.05) 100%)'
                      : 'rgba(255,255,255,0.02)',
                    color: activeWeek === w ? 'var(--text-white)' : 'var(--text-muted)',
                  }}
                >
                  {w === 1 ? '📅 Vecka 1 — Grund' : '📅 Vecka 2 — Progressive Overload'}
                  {w === 2 && (
                    <div style={{ fontSize: '0.68rem', color: '#8b5cf6', fontWeight: 'normal', marginTop: '2px' }}>
                      +1 set compound · +2 reps isolation
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Day Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginBottom: '28px' }}>
              {currentWeekData.map((day, idx) => (
                <DayCard
                  key={idx}
                  dayData={day}
                  week={activeWeek}
                  isActive={activeDay === idx}
                  onClick={() => setActiveDay(idx)}
                />
              ))}
            </div>

            {/* Current Day Exercises */}
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
                    <li>Drick rikligt med vatten under dagen.</li>
                    <li>Håll proteinintaget jämnt för att stödja muskelreparation.</li>
                    <li>Gör gärna en lätt promenad för aktiv återhämtning och ökad blodcirkulation.</li>
                  </ul>
                </div>
              </div>
            ) : currentDay && (
              <div>
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ color: 'var(--text-white)', margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: 'bold' }}>
                      {SPLIT_EMOJIS[currentDay.splitType]} {DAY_NAMES_SV[currentDay.splitType]}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Vecka {activeWeek} · Dag {currentDay.day} · {currentDay.exercises.length} övningar
                    </span>
                  </div>

                  {activeWeek === 2 && (
                    <div style={{
                      marginLeft: 'auto', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
                      border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px',
                      padding: '8px 14px', fontSize: '0.78rem', color: '#8b5cf6', fontWeight: 'bold',
                    }}>
                      ⬆️ Progressive Overload aktiv
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                  {currentDay.exercises.map((ex, idx) => (
                    <ExerciseCard key={ex.id + idx} ex={ex} week={activeWeek} idx={idx} />
                  ))}
                </div>

                {/* RepDB attribution */}
                <div style={{
                  marginTop: '28px',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                }}>
                  Övningsdata &amp; illustrationer: <a href="https://repdb.co" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>RepDB</a> · CC BY-NC 4.0 · Gratis exempelpaket (21 övningar)
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CTA – Start free trial ── */}
        <div style={{
          marginTop: '56px',
          background: 'linear-gradient(135deg, rgba(184,149,71,0.1) 0%, rgba(99,102,241,0.08) 100%)',
          border: '1px solid rgba(184,149,71,0.2)',
          borderRadius: '20px', padding: '40px 24px', textAlign: 'center',
        }}>
          <h3 style={{ color: 'var(--text-white)', fontSize: '1.6rem', fontWeight: 'bold', margin: '0 0 12px 0' }}>
            Vill du ha ett komplett, skräddarsytt program? 🚀
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 24px 0', lineHeight: '1.6' }}>
            Det här är bara ett smakprov. Med Muscle &amp; Focus 2-veckors gratis testperiod får du ett 100% personaliserat tränings- och kostschema — baserat på dina exakta mål och din kropp.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/ansok?trial=true')}
              style={{
                background: 'linear-gradient(135deg, #b89547, #a07830)',
                color: '#000', fontWeight: 'bold', fontSize: '1rem',
                padding: '14px 32px', borderRadius: '100px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(184,149,71,0.4)',
              }}
            >
              Starta 2-veckors gratis testperiod →
            </button>
            <button
              onClick={() => navigate('/paket')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-silver)', fontWeight: '600', fontSize: '1rem',
                padding: '14px 32px', borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
              }}
            >
              Se paket &amp; priser
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
