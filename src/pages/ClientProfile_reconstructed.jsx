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
          images: original.images || {
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
      const backExercises = [
        { id: 'lat-pulldown', name_en: 'Lat Pulldown', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/lat-pulldown.gif' },
        { id: 'seated-cable-row', name_en: 'Seated Cable Row', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/seated-cable-row.gif' },
        { id: 'dumbbell-row', name_en: 'One-Arm Dumbbell Row', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/one-arm-dumbbell-row.gif' },
        { id: 'barbell-row', name_en: 'Barbell Bent Over Row', sets: 3, reps: '8-10', gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/back/barbell-bent-over-row.gif' }
      ];

      const mapped = backExercises.map(ex => {
        const original = EXERCISES.find(e => e.id === ex.id) || {};
        return {
          ...original,
          id: ex.id,
          name_en: ex.name_en,
          name_es: original.name_es || ex.name_en,
          name_fa: original.name_fa || ex.name_en,
          name: ex.name_en,
          equipment: original.equipment || (ex.id.includes('barbell') ? 'barbell' : ex.id.includes('dumbbell') ? 'dumbbell' : 'cable'),
          sets: ex.sets,
          reps: ex.reps,
          images: {
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
            sets = ex.sets + 1;
          }
          return { ...ex, sets, reps, week: 2 };
        })
      });
      return;
    }

    const muscles = SPLIT_MUSCLES[splitType]
    let pool = filtered.filter(ex => muscles.includes(ex.body_part))
    if (pool.length < 3) pool = filtered
    const shuffled = shuffle(pool)
    const count = splitType === 'full_body' ? 5 : 4
    const selected = shuffled.slice(0, Math.min(count, shuffled.length))

    weeks[0].push({
      day: dayIdx + 1,
      splitType,
      exercises: selected.map(ex => ({ ...ex, sets: ex.sets || 3, reps: ex.reps || '10-12', week: 1 })),
    })
    weeks[1].push({
      day: dayIdx + 1,
      splitType,
      exercises: selected.map(ex => {
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
      }),
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
      {selectedEx && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex',
          justifyContent: 'center', alignItems: 'center', padding: '16px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid rgba(184,149,71,0.25)',
            borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '24px',
            position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <button
              onClick={() => setSelectedEx(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px', background: 'none',
                border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer'
              }}
            >
              ✕
            </button>
            <h3 style={{ color: 'var(--accent-gold)', margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
              🎬 Demonstrationsvideo
            </h3>
            <div style={{
              background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <img
                src={selectedEx.gifUrl}
                alt={selectedEx.name}
                style={{ height: '210px', objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))' }}
              />
            </div>
            <h4 style={{ color: 'var(--text-white)', fontSize: '1.05rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              {selectedEx.name}
            </h4>
            {selectedEx.equipment && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', fontSize: '0.72rem' }}>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-silver)' }}>
                  Utrustning: {selectedEx.equipment}
                </span>
                {selectedEx.primary_muscles && (
                  <span style={{ background: 'rgba(184,149,71,0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-gold)' }}>
                    Muskel: {selectedEx.primary_muscles.join(', ')}
                  </span>
                )}
              </div>
            )}
            <strong style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Instruktioner:
            </strong>
            <ol style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-silver)', lineHeight: 1.5 }}>
              {selectedEx.instructions.map((inst, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{inst}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
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

        // Load Onboarding program details from localStorage
        const stored = localStorage.getItem('client_program_data')
        if (stored) {
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
        } else {
          // Default fallbacks
          const p = buildProgram({ trainingDays: '6-7', equipment: 'Fria vikter & maskiner', experienceLevel: 'Nybörjare' })
          setProgram(p)
          const meals = generateMealPlan('Bibehålla', 2000)
          setMealPlan(meals)
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
                            const restVal = isHeavy ? '2-3 min' : '1.5 min'
                            const noteText = ex.id.includes('squat')
                              ? 'Fokus på höftdjup och upprätt överkropp. Knän i tårnas riktning.'
                              : ex.id.includes('deadlift')
                              ? 'Håll ryggen helt rak, stången nära kroppen. Spänn bålen.'
                              : ex.id.includes('row') || ex.id.includes('pull')
                              ? 'Dra med armbågarna, kläm ihop skulderbladen i toppläget.'
                              : 'Kontrollerad rörelsebana, spänn målhäftigt i toppläget.'

                            return (
                              <tr
                                key={ex.id + idx}
                                onClick={() => setSelectedEx({
                                  name: ex.name_en,
                                  gifUrl: ex.images?.classic?.start || ex.gifUrl,
                                  instructions: ex.instructions_en || ['Utför kontrollerat.'],
                                  equipment: ex.equipment,
                                  primary_muscles: ex.primary_muscles
                                })}
                                style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s' }}
                                className="pt-table-row"
                              >
                                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ color: '#f97316' }}>🎬</span>
                                  <span style={{ borderBottom: '1px dashed #f97316' }}>{ex.name_en}</span>
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
    </div>
  )
}

export default ClientProfile
