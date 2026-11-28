// Gemensam beräkning av BMR, TDEE, kalorimål och makron.
// Används i ansökan, i kundens profil och i "Min drömkropp" så att alla visar samma siffror.
//
// Regler (etablerade riktlinjer för styrketränande vuxna):
// - BMR: Mifflin-St Jeor. "Annat" kön = medelvärdet av mans- och kvinnoformeln.
// - TDEE: BMR × aktivitetsfaktor (PAL) som kunden valt.
// - Viktnedgång: −20 % av TDEE (minst 300, högst 750 kcal). Viktuppgång: +10 % (200–400 kcal).
// - Kalorimålet går aldrig under BMR och aldrig under 1 200 kcal.
// - Protein: 2,0 g/kg vid viktnedgång, 1,8 vid uppgång, 1,6 vid balans – räknat på
//   referensvikt (vikten vid BMI 25 om BMI > 27, annars nuvarande vikt).
// - Fett: 25 % av kalorierna (30 % vid viktuppgång), men inom 0,8–1,2 g per kg referensvikt
//   (upp till 1,5 g/kg vid viktuppgång så att kolhydraterna inte blir orimligt höga).
// - Kolhydrater: resterande kalorier.
// - Förväntad viktförändring: (kalorimål − TDEE) × 7 / 7 700 kg per vecka.

export const PAL = {
  Stillasittande: 1.2,
  'Lätt aktiv': 1.375,
  'Måttligt aktiv': 1.55,
  'Mycket aktiv': 1.725,
  'Extremt aktiv': 1.9,
}

const KCAL_PER_KG = 7700
const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export function computeNutrition({ weight, height, age, gender, activityLevel, weightGoal }) {
  const w = num(weight)
  const h = num(height)
  const a = parseInt(age, 10)
  if (!w || !h || !a) return null

  const base = 10 * w + 6.25 * h - 5 * a
  const sexConst = gender === 'Man' ? 5 : gender === 'Kvinna' ? -161 : -78
  const bmr = base + sexConst

  const factor = PAL[activityLevel] || 1.375
  const tdee = Math.round(bmr * factor)

  let goalAdjustment = 0
  if (weightGoal === 'Viktnedgång') goalAdjustment = -Math.round(clamp(tdee * 0.2, 300, 750))
  else if (weightGoal === 'Viktuppgång') goalAdjustment = Math.round(clamp(tdee * 0.1, 200, 400))

  const floor = Math.max(Math.round(bmr), 1200)
  const targetCalories = Math.max(floor, tdee + goalAdjustment)
  const effectiveAdjustment = targetCalories - tdee

  const bmi = w / (h / 100) ** 2
  const refWeight = bmi > 27 ? Math.round(25 * (h / 100) ** 2) : w

  const proteinPerKg = weightGoal === 'Viktnedgång' ? 2.0 : weightGoal === 'Viktuppgång' ? 1.8 : 1.6
  const protein = Math.round(proteinPerKg * refWeight)
  const gaining = weightGoal === 'Viktuppgång'
  const fat = Math.round(clamp((targetCalories * (gaining ? 0.3 : 0.25)) / 9, 0.8 * refWeight, (gaining ? 1.5 : 1.2) * refWeight))
  const carbs = Math.max(0, Math.round((targetCalories - protein * 4 - fat * 9) / 4))

  return {
    bmr: Math.round(bmr),
    factor,
    tdee,
    goalAdjustment: effectiveAdjustment,
    targetCalories,
    protein,
    fat,
    carbs,
    refWeight,
    proteinPerKg,
    weeklyChangeKg: Math.round(((effectiveAdjustment * 7) / KCAL_PER_KG) * 100) / 100,
  }
}

/** Antal veckor till målvikten utifrån faktiskt kalorimål (minst 2). null om ingen förändring. */
export function weeksToGoal(currentKg, targetKg, nutrition) {
  const diff = num(targetKg) - num(currentKg)
  if (!Number.isFinite(diff) || Math.abs(diff) < 0.5) return null
  const rate = nutrition?.weeklyChangeKg
  // Om kalorimålet går åt fel håll (eller saknas) används försiktiga standardtakter
  const perWeek = rate && Math.sign(rate) === Math.sign(diff) ? Math.abs(rate) : diff < 0 ? 0.5 : 0.25
  return Math.max(2, Math.ceil(Math.abs(diff) / perWeek))
}
