// RepDB Exercise Dataset — Free 21-exercise sample
// License: CC BY-NC 4.0 — Exercise data & images: RepDB, https://repdb.co
// Full 400+ commercial dataset at https://repdb.co

const BASE_IMAGE_URL = 'https://raw.githubusercontent.com/sergei-argutin/exercise-dataset/main'

export const EXERCISES = [
  {
    id: 'arnold-press',
    name_en: 'Arnold Press',
    name_es: 'Press Arnold',
    description_en: 'An overhead press variation rotating the palms from facing the body to facing forward, working the front and side deltoids.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'dumbbell',
    body_part: 'shoulders',
    primary_muscles: ['anterior_deltoid', 'lateral_deltoid'],
    secondary_muscles: ['serratus_anterior', 'trapezius', 'triceps_brachii'],
    goals: ['hypertrophy', 'strength'],
    tags: ['knee_safe', 'lower_back_safe', 'no_axial_load'],
    is_bodyweight: false,
    met: 6.0,
    sets: 3, reps: '10-12',
    instructions_en: [
      'Hold a pair of dumbbells at shoulder height with palms facing you.',
      'Press the dumbbells overhead while rotating your palms to face forward.',
      'Fully extend your arms at the top without locking the elbows.',
      'Reverse the motion and rotate back to the start.',
    ],
    tips_en: [
      'Time the palm rotation evenly throughout the press.',
      'Avoid arching your lower back as the weight goes overhead.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/arnold-press-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/arnold-press-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/arnold-press-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/arnold-press-peak.webp` },
    },
  },
  {
    id: 'banded-lateral-walk',
    name_en: 'Banded Lateral Walk',
    name_es: 'Caminata Lateral con Banda',
    description_en: 'A side-stepping movement with a loop band targeting the gluteus medius — a staple warm-up and rehab drill for hip stability.',
    category: 'strength',
    force_type: 'dynamic',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'loop_band',
    body_part: 'glutes',
    primary_muscles: ['gluteus_medius'],
    secondary_muscles: ['gluteus_maximus', 'quadriceps'],
    goals: ['rehabilitation', 'endurance', 'hypertrophy'],
    tags: ['leg_day', 'warmup', 'knee_safe'],
    is_bodyweight: false,
    met: 6.0,
    sets: 3, reps: '15 steps each side',
    instructions_en: [
      'Place a loop band above the knees.',
      'Stand in a quarter-squat: feet shoulder-width, hips back, chest up.',
      'Step one foot out to the side against the band tension.',
      'Bring the trailing foot in — keep tension on the band throughout.',
      'Continue side-stepping for the prescribed reps, then reverse.',
    ],
    tips_en: [
      'Keep toes pointing straight forward.',
      'Hips stay level — do not rock side-to-side.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/banded-lateral-walk-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/banded-lateral-walk-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/banded-lateral-walk-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/banded-lateral-walk-peak.webp` },
    },
  },
  {
    id: 'barbell-glute-bridge',
    name_en: 'Barbell Glute Bridge',
    name_es: 'Puente de Glúteos con Barra',
    description_en: 'A weighted glute bridge using a barbell for increased resistance on the glutes and hamstrings.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'barbell',
    body_part: 'glutes',
    primary_muscles: ['gluteus_maximus'],
    secondary_muscles: ['hamstrings'],
    goals: ['hypertrophy', 'strength'],
    tags: ['leg_day', 'lower_back_safe', 'knee_safe', 'no_axial_load'],
    is_bodyweight: false,
    met: 6.0,
    sets: 4, reps: '10-15',
    instructions_en: [
      'Lie on the floor with a barbell across your hips and knees bent.',
      'Drive your hips up by squeezing your glutes.',
      'Hold at the top with hips fully extended.',
      'Lower with control and repeat.',
    ],
    tips_en: [
      'Drive through your heels rather than your toes.',
      'Finish with your ribs down to avoid arching the lower back.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/barbell-glute-bridge-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/barbell-glute-bridge-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/barbell-glute-bridge-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/barbell-glute-bridge-peak.webp` },
    },
  },
  {
    id: 'behind-the-back-barbell-shrug',
    name_en: 'Barbell Shrug (Behind Back)',
    name_es: 'Encogimiento de Hombros con Barra',
    description_en: 'A shrug variation with the barbell held behind the body, targeting the trapezius.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'isolation',
    difficulty: 'intermediate',
    equipment: 'barbell',
    body_part: 'back',
    primary_muscles: ['trapezius'],
    secondary_muscles: ['forearm_flexors', 'rhomboids'],
    goals: ['hypertrophy'],
    tags: ['knee_safe', 'lower_back_safe', 'shoulder_safe'],
    is_bodyweight: false,
    met: 5.0,
    sets: 3, reps: '12-15',
    instructions_en: [
      'Stand holding a barbell behind your back with an overhand grip.',
      'Keep arms straight and chest up.',
      'Shrug your shoulders straight up toward your ears.',
      'Pause and squeeze at the top, then lower under control.',
    ],
    tips_en: [
      'Lift straight up and down without rolling the shoulders.',
      'Avoid bending elbows to heave the weight higher.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/behind-the-back-barbell-shrug-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/behind-the-back-barbell-shrug-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/behind-the-back-barbell-shrug-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/behind-the-back-barbell-shrug-peak.webp` },
    },
  },
  {
    id: 'behind-the-neck-press',
    name_en: 'Behind the Neck Press',
    name_es: 'Press Detrás del Cuello',
    description_en: 'An overhead press performed with the barbell starting behind the neck, emphasizing the front and side deltoids.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'barbell',
    body_part: 'shoulders',
    primary_muscles: ['anterior_deltoid', 'lateral_deltoid'],
    secondary_muscles: ['trapezius', 'triceps_brachii'],
    goals: ['hypertrophy', 'strength'],
    tags: ['knee_safe'],
    is_bodyweight: false,
    met: 6.0,
    sets: 3, reps: '8-12',
    instructions_en: [
      'Sit or stand with a barbell resting on upper traps behind neck.',
      'Grip the bar wider than shoulder-width.',
      'Press the bar straight overhead until arms are extended.',
      'Lower back under control and repeat.',
    ],
    tips_en: [
      'Lower only as far as your shoulders allow comfortably.',
      'Keep forearms vertical under the bar throughout.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/behind-the-neck-press-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/behind-the-neck-press-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/behind-the-neck-press-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/behind-the-neck-press-peak.webp` },
    },
  },
  {
    id: 'bodyweight-squat',
    name_en: 'Bodyweight Squat',
    name_es: 'Sentadilla con Peso Corporal',
    description_en: 'A fundamental lower-body movement using only bodyweight, targeting quadriceps, glutes and core.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'none',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['hamstrings', 'core'],
    goals: ['endurance', 'hypertrophy'],
    tags: ['leg_day', 'warmup', 'knee_safe', 'no_axial_load'],
    is_bodyweight: true,
    met: 5.0,
    sets: 3, reps: '15-20',
    instructions_en: [
      'Stand with feet shoulder-width apart, toes slightly out.',
      'Lower your hips until thighs are parallel to the floor.',
      'Keep your chest up and knees tracking over toes.',
      'Drive through your heels to stand back up.',
    ],
    tips_en: [
      'Keep weight in your heels throughout the movement.',
      'Brace your core before each rep.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/bodyweight-squat-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/bodyweight-squat-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/bodyweight-squat-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/bodyweight-squat-peak.webp` },
    },
  },
  {
    id: 'cable-crossover',
    name_en: 'Cable Crossover',
    name_es: 'Cruce de Poleas',
    description_en: 'A cable fly movement that keeps constant tension on the chest across the full range of motion.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'cable',
    body_part: 'chest',
    primary_muscles: ['pectoralis_major'],
    secondary_muscles: ['anterior_deltoid'],
    goals: ['hypertrophy'],
    tags: ['knee_safe', 'lower_back_safe', 'no_axial_load'],
    is_bodyweight: false,
    met: 5.0,
    sets: 3, reps: '12-15',
    instructions_en: [
      'Set the cables to the high pulley position.',
      'Grab both handles, step forward and hinge slightly forward.',
      'Bring your hands together in a wide arc in front of you.',
      'Squeeze the chest at the center, then slowly return.',
    ],
    tips_en: [
      'Maintain a slight bend in your elbows throughout.',
      'Focus on squeezing the chest rather than pulling with arms.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/cable-crossover-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/cable-crossover-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/cable-crossover-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/cable-crossover-peak.webp` },
    },
  },
  {
    id: 'dumbbell-bench-press',
    name_en: 'Dumbbell Bench Press',
    name_es: 'Press de Banca con Mancuernas',
    description_en: 'A classic chest press using dumbbells for a greater range of motion and independent arm activation.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    body_part: 'chest',
    primary_muscles: ['pectoralis_major'],
    secondary_muscles: ['anterior_deltoid', 'triceps_brachii'],
    goals: ['hypertrophy', 'strength'],
    tags: ['no_axial_load'],
    is_bodyweight: false,
    met: 6.0,
    sets: 4, reps: '8-12',
    instructions_en: [
      'Lie on a flat bench holding a dumbbell in each hand at chest level.',
      'Press the dumbbells up until your arms are fully extended.',
      'Lower under control until dumbbells are level with your chest.',
      'Repeat for the desired reps.',
    ],
    tips_en: [
      'Keep your feet flat on the floor for stability.',
      'Retract shoulder blades and keep them pressed into the bench.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/dumbbell-bench-press-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/dumbbell-bench-press-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/dumbbell-bench-press-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/dumbbell-bench-press-peak.webp` },
    },
  },
  {
    id: 'goblet-squat',
    name_en: 'Goblet Squat',
    name_es: 'Sentadilla Goblet',
    description_en: 'A squat variation holding a dumbbell or kettlebell at the chest — great for beginners and teaching proper squat mechanics.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['hamstrings', 'core', 'erector_spinae'],
    goals: ['hypertrophy', 'endurance'],
    tags: ['leg_day', 'lower_back_safe'],
    is_bodyweight: false,
    met: 5.5,
    sets: 3, reps: '12-15',
    instructions_en: [
      'Hold a dumbbell vertically at chest height, cupping the top.',
      'Feet shoulder-width apart, toes slightly out.',
      'Squat down keeping the dumbbell close to your chest and elbows between knees.',
      'Drive through heels to return to standing.',
    ],
    tips_en: [
      'Use the weight as a counterbalance to sit deeper into the squat.',
      'Keep chest tall throughout the movement.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/goblet-squat-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/goblet-squat-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/goblet-squat-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/goblet-squat-peak.webp` },
    },
  },
  {
    id: 'incline-dumbbell-curl',
    name_en: 'Incline Dumbbell Curl',
    name_es: 'Curl con Mancuernas en Banco Inclinado',
    description_en: 'A biceps curl performed on an incline bench for increased stretch and peak contraction of the long head.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    body_part: 'arms',
    primary_muscles: ['biceps_brachii'],
    secondary_muscles: ['brachialis', 'brachioradialis'],
    goals: ['hypertrophy'],
    tags: ['knee_safe', 'lower_back_safe', 'shoulder_safe', 'no_axial_load'],
    is_bodyweight: false,
    met: 4.5,
    sets: 3, reps: '10-12',
    instructions_en: [
      'Sit back on an incline bench set to 45–60 degrees.',
      'Let your arms hang down with a dumbbell in each hand.',
      'Curl both dumbbells by bending your elbows.',
      'Squeeze at the top, then lower slowly.',
    ],
    tips_en: [
      'Keep your upper arms still — only the forearms should move.',
      'The stretch at the bottom is key — do not rush it.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/incline-dumbbell-curl-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/incline-dumbbell-curl-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/incline-dumbbell-curl-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/incline-dumbbell-curl-peak.webp` },
    },
  },
  {
    id: 'lat-pulldown',
    name_en: 'Lat Pulldown',
    name_es: 'Jalón al Pecho',
    description_en: 'A cable machine exercise pulling the bar down to the chest, targeting the latissimus dorsi and building a wider back.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'cable',
    body_part: 'back',
    primary_muscles: ['latissimus_dorsi'],
    secondary_muscles: ['biceps_brachii', 'rhomboids', 'teres_major'],
    goals: ['hypertrophy', 'strength'],
    tags: ['knee_safe', 'lower_back_safe'],
    is_bodyweight: false,
    met: 5.5,
    sets: 4, reps: '10-12',
    instructions_en: [
      'Sit at a lat pulldown machine and grip the bar wider than shoulder-width.',
      'Lean back slightly and pull the bar down to your upper chest.',
      'Squeeze your lats at the bottom, then slowly return.',
    ],
    tips_en: [
      'Initiate the pull with your elbows, not your hands.',
      'Keep chest up and avoid rounding the back.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/lat-pulldown-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/lat-pulldown-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/lat-pulldown-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/lat-pulldown-peak.webp` },
    },
  },
  {
    id: 'leg-press',
    name_en: 'Leg Press',
    name_es: 'Prensa de Piernas',
    description_en: 'A machine-based lower body exercise allowing heavy quadriceps and glute loading with spinal support.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'machine',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['hamstrings'],
    goals: ['hypertrophy', 'strength'],
    tags: ['leg_day', 'lower_back_safe'],
    is_bodyweight: false,
    met: 6.0,
    sets: 4, reps: '10-15',
    instructions_en: [
      'Sit in the leg press machine with feet hip-width on the platform.',
      'Lower the platform by bending your knees toward your chest.',
      'Press through your heels to extend your legs (do not lock out).',
      'Repeat for the desired reps.',
    ],
    tips_en: [
      'Keep your lower back pressed against the pad.',
      'Adjust foot placement higher for more glutes, lower for more quads.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/leg-press-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/leg-press-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/leg-press-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/leg-press-peak.webp` },
    },
  },
  {
    id: 'plank',
    name_en: 'Plank',
    name_es: 'Plancha',
    description_en: 'An isometric core exercise holding a push-up position, building core endurance, stability and posture.',
    category: 'strength',
    force_type: 'static',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'none',
    body_part: 'core',
    primary_muscles: ['rectus_abdominis', 'transversus_abdominis'],
    secondary_muscles: ['erector_spinae', 'gluteus_maximus', 'shoulder_stabilizers'],
    goals: ['endurance', 'rehabilitation'],
    tags: ['knee_safe', 'warmup', 'no_axial_load'],
    is_bodyweight: true,
    met: 4.0,
    sets: 3, reps: '30-60 sec',
    instructions_en: [
      'Place forearms on the floor, elbows under shoulders.',
      'Extend legs behind you, resting on your toes.',
      'Form a straight line from head to heels.',
      'Hold for the prescribed time without sagging hips.',
    ],
    tips_en: [
      'Breathe steadily and brace the abs as if taking a punch.',
      'Squeeze your glutes to avoid hip drop.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/plank-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/plank-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/plank-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/plank-peak.webp` },
    },
  },
  {
    id: 'push-up',
    name_en: 'Push-Up',
    name_es: 'Flexiones de Brazos',
    description_en: 'A foundational bodyweight exercise targeting the chest, triceps and front deltoids with zero equipment.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'none',
    body_part: 'chest',
    primary_muscles: ['pectoralis_major'],
    secondary_muscles: ['anterior_deltoid', 'triceps_brachii', 'core'],
    goals: ['endurance', 'hypertrophy'],
    tags: ['knee_safe', 'lower_back_safe', 'no_axial_load'],
    is_bodyweight: true,
    met: 5.0,
    sets: 3, reps: '10-20',
    instructions_en: [
      'Start in a high plank with hands slightly wider than shoulder-width.',
      'Lower your chest toward the floor, keeping elbows at ~45°.',
      'Press back up until arms are fully extended.',
      'Keep a straight line from head to heels throughout.',
    ],
    tips_en: [
      'Squeeze your glutes and core to prevent sagging hips.',
      'Look at the floor — not forward — to keep a neutral neck.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/push-up-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/push-up-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/push-up-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/push-up-peak.webp` },
    },
  },
  {
    id: 'romanian-deadlift',
    name_en: 'Romanian Deadlift',
    name_es: 'Peso Muerto Rumano',
    description_en: 'A hinge movement emphasizing the hamstrings and glutes through a controlled hip-hinge pattern.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'barbell',
    body_part: 'legs',
    primary_muscles: ['hamstrings', 'gluteus_maximus'],
    secondary_muscles: ['erector_spinae', 'forearm_flexors'],
    goals: ['hypertrophy', 'strength'],
    tags: ['leg_day'],
    is_bodyweight: false,
    met: 6.0,
    sets: 4, reps: '8-12',
    instructions_en: [
      'Stand with a barbell at hip height, feet hip-width apart.',
      'Hinge at your hips, pushing them back while lowering the bar.',
      'Lower until you feel a strong hamstring stretch.',
      'Drive hips forward to return to standing.',
    ],
    tips_en: [
      'Keep the bar close to your legs throughout the movement.',
      'Maintain a neutral spine — do not round the lower back.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/romanian-deadlift-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/romanian-deadlift-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/romanian-deadlift-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/romanian-deadlift-peak.webp` },
    },
  },
  {
    id: 'seated-cable-row',
    name_en: 'Seated Cable Row',
    name_es: 'Remo en Polea Sentado',
    description_en: 'A horizontal pulling exercise targeting the mid-back, rhomboids and biceps with constant cable tension.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'cable',
    body_part: 'back',
    primary_muscles: ['rhomboids', 'middle_trapezius'],
    secondary_muscles: ['latissimus_dorsi', 'biceps_brachii', 'rear_deltoid'],
    goals: ['hypertrophy', 'strength'],
    tags: ['knee_safe'],
    is_bodyweight: false,
    met: 5.0,
    sets: 3, reps: '10-12',
    instructions_en: [
      'Sit at a cable row machine with feet on the platform.',
      'Grab the handle with both hands, back straight, slight lean forward.',
      'Pull the handle toward your lower chest, squeezing shoulder blades.',
      'Slowly return to start with control.',
    ],
    tips_en: [
      'Squeeze shoulder blades together at the peak of the pull.',
      'Avoid using momentum by swinging the torso.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/seated-cable-row-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/seated-cable-row-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/seated-cable-row-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/seated-cable-row-peak.webp` },
    },
  },
  {
    id: 'split-squat',
    name_en: 'Split Squat',
    name_es: 'Sentadilla Dividida',
    description_en: 'A unilateral lower-body exercise targeting the quadriceps and glutes while improving balance and stability.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'none',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['hamstrings', 'core'],
    goals: ['hypertrophy', 'endurance'],
    tags: ['leg_day', 'no_axial_load'],
    is_bodyweight: true,
    met: 5.5,
    sets: 3, reps: '10-12 each leg',
    instructions_en: [
      'Stand in a staggered stance, one foot ~2 feet in front of the other.',
      'Lower your back knee toward the floor.',
      'Keep your front knee over your toes and chest upright.',
      'Drive through the front heel to return to standing.',
    ],
    tips_en: [
      'Keep most of the weight on your front foot.',
      'Engage the core to maintain balance and upright posture.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/split-squat-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/split-squat-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/split-squat-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/split-squat-peak.webp` },
    },
  },
  {
    id: 'standing-calf-raise',
    name_en: 'Standing Calf Raise',
    name_es: 'Elevación de Talones de Pie',
    description_en: 'An isolation exercise targeting the gastrocnemius and soleus by plantarflexing the ankle under load.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'none',
    body_part: 'legs',
    primary_muscles: ['gastrocnemius', 'soleus'],
    secondary_muscles: [],
    goals: ['hypertrophy', 'endurance'],
    tags: ['knee_safe', 'lower_back_safe'],
    is_bodyweight: true,
    met: 4.0,
    sets: 4, reps: '15-20',
    instructions_en: [
      'Stand on the edge of a step or flat ground with feet hip-width.',
      'Rise onto your toes as high as possible.',
      'Hold briefly at the top.',
      'Lower your heels below the step level for a full stretch.',
    ],
    tips_en: [
      'Perform the movement slowly — 2 sec up, 1 sec hold, 2 sec down.',
      'Stand on a step edge to maximize the range of motion.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/standing-calf-raise-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/standing-calf-raise-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/standing-calf-raise-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/standing-calf-raise-peak.webp` },
    },
  },
  {
    id: 'triceps-pushdown',
    name_en: 'Triceps Pushdown',
    name_es: 'Extensión de Tríceps en Polea',
    description_en: 'A cable isolation exercise for the triceps using a pushdown motion for constant tension.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'cable',
    body_part: 'arms',
    primary_muscles: ['triceps_brachii'],
    secondary_muscles: ['forearm_extensors'],
    goals: ['hypertrophy'],
    tags: ['knee_safe', 'lower_back_safe', 'shoulder_safe'],
    is_bodyweight: false,
    met: 4.5,
    sets: 3, reps: '12-15',
    instructions_en: [
      'Stand at a cable machine with a rope or bar attachment set high.',
      'Grip the attachment and tuck your elbows into your sides.',
      'Push the weight down until arms are fully extended.',
      'Slowly return to starting position.',
    ],
    tips_en: [
      'Keep elbows pinned to your sides — they should not flare out.',
      'Focus on squeezing the triceps at full extension.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/triceps-pushdown-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/triceps-pushdown-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/triceps-pushdown-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/triceps-pushdown-peak.webp` },
    },
  },
  {
    id: 'walking-lunge',
    name_en: 'Walking Lunge',
    name_es: 'Zancada Caminando',
    description_en: 'A dynamic unilateral leg exercise combining balance, stability and strength by stepping forward into repeated lunges.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'none',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['hamstrings', 'core', 'hip_flexors'],
    goals: ['endurance', 'hypertrophy'],
    tags: ['leg_day', 'no_axial_load'],
    is_bodyweight: true,
    met: 5.5,
    sets: 3, reps: '12-16 steps',
    instructions_en: [
      'Stand upright with feet together.',
      'Step forward with one foot into a lunge position.',
      'Lower your back knee toward the ground.',
      'Drive through your front heel and step forward with the other leg.',
    ],
    tips_en: [
      'Take long enough steps that your knee tracks over your toes.',
      'Keep your torso upright — do not lean forward excessively.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/walking-lunge-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/walking-lunge-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/walking-lunge-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/walking-lunge-peak.webp` },
    },
  },
  {
    id: 'wide-grip-pull-up',
    name_en: 'Wide-Grip Pull-Up',
    name_es: 'Dominada con Agarre Ancho',
    description_en: 'A bodyweight vertical pulling exercise using a wide overhand grip to emphasize the latissimus dorsi.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'pull_up_bar',
    body_part: 'back',
    primary_muscles: ['latissimus_dorsi'],
    secondary_muscles: ['biceps_brachii', 'teres_major', 'rhomboids'],
    goals: ['hypertrophy', 'strength'],
    tags: ['no_axial_load'],
    is_bodyweight: true,
    met: 8.0,
    sets: 3, reps: '6-10',
    instructions_en: [
      'Hang from a bar with an overhand grip wider than shoulder-width.',
      'Pull yourself up until your chin clears the bar.',
      'Squeeze your lats at the top.',
      'Lower yourself fully under control.',
    ],
    images: {
      classic: { start: `${BASE_IMAGE_URL}/images/classic/wide-grip-pull-up-start.webp`, peak: `${BASE_IMAGE_URL}/images/classic/wide-grip-pull-up-peak.webp` },
      flat: { start: `${BASE_IMAGE_URL}/images/flat/wide-grip-pull-up-start.webp`, peak: `${BASE_IMAGE_URL}/images/flat/wide-grip-pull-up-peak.webp` },
    },
  },
  {
    id: 'barbell-bicep-curl',
    name_en: 'Barbell Bicep Curl',
    name_es: 'Curl de Bíceps con Barra',
    description_en: 'A classic barbell exercise targeting the biceps brachii for building arm size and strength.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'barbell',
    body_part: 'arms',
    primary_muscles: ['biceps_brachii'],
    secondary_muscles: ['brachialis', 'forearm_flexors'],
    goals: ['hypertrophy', 'strength'],
    tags: ['knee_safe', 'lower_back_safe', 'no_axial_load'],
    is_bodyweight: false,
    met: 4.0,
    sets: 3, reps: '10-12',
    instructions_en: [
      'Stand straight with feet shoulder-width apart, holding a barbell with an underhand grip.',
      'Keep your elbows pinned close to your torso.',
      'Curl the bar upward by flexing your biceps, keeping your upper arms still.',
      'Squeeze your biceps at the top, then slowly lower the bar back to the start.'
    ],
    tips_en: [
      'Do not swing your body or use momentum to lift the weight.',
      'Keep your wrists straight throughout the curl.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'dumbbell-hammer-curl',
    name_en: 'Dumbbell Hammer Curl',
    name_es: 'Curl Martillo',
    description_en: 'A bicep curl performed with a neutral grip (palms facing each other) to target the brachialis and brachioradialis.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    body_part: 'arms',
    primary_muscles: ['biceps_brachii'],
    secondary_muscles: ['brachialis', 'brachioradialis'],
    goals: ['hypertrophy'],
    tags: ['knee_safe', 'lower_back_safe', 'no_axial_load'],
    is_bodyweight: false,
    met: 4.0,
    sets: 3, reps: '12-15',
    instructions_en: [
      'Stand tall holding a dumbbell in each hand with your palms facing each other.',
      'Keep your elbows close to your sides.',
      'Curl the weights up while keeping your palms facing each other.',
      'Lower the dumbbells slowly back to the starting position.'
    ],
    tips_en: [
      'Control the lowering phase to maximize muscle activation.',
      'Avoid swinging or using shoulder movement.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'skull-crusher',
    name_en: 'Lying Triceps Extension (Skull Crusher)',
    name_es: 'Rompe-cráneos (Tríceps)',
    description_en: 'An isolation exercise performed lying on a bench, lowering a barbell or EZ bar to the forehead to build triceps mass.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'isolation',
    difficulty: 'intermediate',
    equipment: 'barbell',
    body_part: 'arms',
    primary_muscles: ['triceps_brachii'],
    secondary_muscles: ['forearm_extensors'],
    goals: ['hypertrophy', 'strength'],
    tags: ['knee_safe', 'lower_back_safe', 'no_axial_load'],
    is_bodyweight: false,
    met: 4.5,
    sets: 3, reps: '10-12',
    instructions_en: [
      'Lie flat on a bench holding an EZ bar or barbell overhead with straight arms.',
      'Hinge at the elbows to lower the bar slowly towards your forehead or slightly behind it.',
      'Keep your upper arms vertical and still throughout the movement.',
      'Extend your elbows to return the bar to the start.'
    ],
    tips_en: [
      'Keep your elbows tucked in — do not let them flare outwards.',
      'Use a controlled pace to avoid bumping your forehead.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'overhead-db-tricep-ext',
    name_en: 'Overhead Dumbbell Triceps Extension',
    name_es: 'Extensión de Tríceps con Mancuerna',
    description_en: 'An overhead extension exercise performed seated or standing, stretch targeting the long head of the triceps.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    body_part: 'arms',
    primary_muscles: ['triceps_brachii'],
    secondary_muscles: [],
    goals: ['hypertrophy'],
    tags: ['knee_safe', 'lower_back_safe'],
    is_bodyweight: false,
    met: 4.0,
    sets: 3, reps: '12-15',
    instructions_en: [
      'Sit or stand holding a single dumbbell with both hands directly overhead.',
      'Lower the dumbbell behind your head by bending your elbows.',
      'Keep your upper arms close to your head and pointing straight up.',
      'Extend your elbows to raise the dumbbell back overhead.'
    ],
    tips_en: [
      'Do not arch your lower back as you lower the weight.',
      'Keep your head neutral, looking straight ahead.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'bench-dips',
    name_en: 'Bench Dips',
    name_es: 'Fondos de Tríceps en Banco',
    description_en: 'A bodyweight exercise using two parallel benches or a single bench to build triceps and chest strength.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'none',
    body_part: 'arms',
    primary_muscles: ['triceps_brachii'],
    secondary_muscles: ['pectoralis_major', 'anterior_deltoid'],
    goals: ['hypertrophy', 'endurance'],
    tags: ['knee_safe', 'lower_back_safe', 'no_axial_load'],
    is_bodyweight: true,
    met: 4.5,
    sets: 3, reps: '12-15',
    instructions_en: [
      'Sit on the edge of a bench and place your hands next to your hips.',
      'Slide your butt off the bench, extending your legs forward.',
      'Lower your hips by bending your elbows until your upper arms are parallel to the floor.',
      'Push through your palms to return to the starting position.'
    ],
    tips_en: [
      'Keep your back close to the bench throughout the movement.',
      'Do not go too deep if you feel shoulder discomfort.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'barbell-bench-press',
    name_en: 'Barbell Bench Press',
    name_es: 'Press de Banca con Barra',
    description_en: 'The king of chest exercises, targeting the pectorals, shoulders, and triceps with a heavy barbell compound lift.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'barbell',
    body_part: 'chest',
    primary_muscles: ['pectoralis_major'],
    secondary_muscles: ['anterior_deltoid', 'triceps_brachii'],
    goals: ['hypertrophy', 'strength'],
    tags: [],
    is_bodyweight: false,
    met: 6.0,
    sets: 4, reps: '8-10',
    instructions_en: [
      'Lie flat on a bench, grip the barbell slightly wider than shoulder-width.',
      'Unrack the bar and lower it with control to your mid-chest.',
      'Push the bar straight back up to full arm extension.',
      'Ensure your shoulder blades remain retracted throughout.'
    ],
    tips_en: [
      'Keep your feet flat on the floor to stabilize your hips.',
      'Do not bounce the bar off your chest.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'incline-db-bench-press',
    name_en: 'Incline Dumbbell Bench Press',
    name_es: 'Press Inclinado con Mancuernas',
    description_en: 'A chest press performed on an incline bench to target the upper pectoralis major and anterior deltoids.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    body_part: 'chest',
    primary_muscles: ['pectoralis_major'],
    secondary_muscles: ['anterior_deltoid', 'triceps_brachii'],
    goals: ['hypertrophy', 'strength'],
    tags: ['no_axial_load'],
    is_bodyweight: false,
    met: 6.0,
    sets: 3, reps: '10-12',
    instructions_en: [
      'Lie on a bench set to a 30-45 degree incline, holding dumbbells at chest height.',
      'Press the dumbbells straight up over your upper chest.',
      'Lower the dumbbells slowly until they reach chest level.',
      'Repeat for the desired reps.'
    ],
    tips_en: [
      'Ensure you do not flare your elbows excessively; keep them at a 45-degree angle.',
      'Maintain a neutral spine and arch slightly but comfortably.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'dumbbell-chest-fly',
    name_en: 'Dumbbell Chest Fly',
    name_es: 'Aperturas de Pecho con Mancuernas',
    description_en: 'Lying on a flat bench and opening your arms in an arc to target the chest muscles with a deep stretch.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    body_part: 'chest',
    primary_muscles: ['pectoralis_major'],
    secondary_muscles: ['anterior_deltoid'],
    goals: ['hypertrophy'],
    tags: ['knee_safe', 'lower_back_safe', 'no_axial_load'],
    is_bodyweight: false,
    met: 5.0,
    sets: 3, reps: '12-15',
    instructions_en: [
      'Lie on a flat bench holding dumbbells overhead, palms facing each other.',
      'With a slight bend in your elbows, lower your arms out to the sides in a wide arc.',
      'Stop when you feel a stretch in your chest, then reverse the movement back to the top.'
    ],
    tips_en: [
      'Keep the bend in your elbows constant throughout the lift.',
      'Do not lower the dumbbells below shoulder level.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'dumbbell-lateral-raise',
    name_en: 'Dumbbell Lateral Raise',
    name_es: 'Elevaciones Laterales',
    description_en: 'An isolation movement raising dumbbells to the side to build the lateral deltoids for wider shoulders.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    body_part: 'shoulders',
    primary_muscles: ['lateral_deltoid'],
    secondary_muscles: ['anterior_deltoid', 'trapezius'],
    goals: ['hypertrophy'],
    tags: ['knee_safe', 'lower_back_safe', 'no_axial_load'],
    is_bodyweight: false,
    met: 4.0,
    sets: 4, reps: '12-15',
    instructions_en: [
      'Stand holding dumbbells at your sides, palms facing inward.',
      'Raise the dumbbells out to the sides until your arms are parallel to the floor.',
      'Keep a very slight bend in your elbows and lead with your elbows.',
      'Lower the dumbbells slowly back to your sides.'
    ],
    tips_en: [
      'Do not swing or use body momentum — keep the movement strict.',
      'Pour out the water at the top: tilt your thumbs slightly down.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'military-press',
    name_en: 'Barbell Military Press',
    name_es: 'Press Militar',
    description_en: 'A standing overhead press using a barbell to build shoulders, upper back, and core stability.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'barbell',
    body_part: 'shoulders',
    primary_muscles: ['anterior_deltoid', 'lateral_deltoid'],
    secondary_muscles: ['triceps_brachii', 'trapezius', 'core'],
    goals: ['hypertrophy', 'strength'],
    tags: ['knee_safe'],
    is_bodyweight: false,
    met: 6.0,
    sets: 3, reps: '8-10',
    instructions_en: [
      'Stand with feet shoulder-width, rack the barbell at collarbone height.',
      'Squeeze your glutes and core, then press the bar straight overhead.',
      'Push your head forward slightly at the top to lock out the bar overhead.',
      'Lower the bar slowly back to your chest.'
    ],
    tips_en: [
      'Do not bend your knees to push the weight — that is a push press.',
      'Avoid arching your lower back excessively.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'barbell-squat',
    name_en: 'Barbell Back Squat',
    name_es: 'Sentadilla con Barra Trasera',
    description_en: 'The king of lower body exercises, loading a barbell on your back to target the quads, glutes, hamstrings, and core.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'barbell',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['hamstrings', 'erector_spinae', 'core'],
    goals: ['hypertrophy', 'strength'],
    tags: ['leg_day'],
    is_bodyweight: false,
    met: 6.5,
    sets: 4, reps: '8-12',
    instructions_en: [
      'Rest the barbell across your upper traps, feet shoulder-width, toes out.',
      'Lower your hips back and down as if sitting in a chair.',
      'Descend until your thighs are parallel to the floor or lower.',
      'Push through your mid-foot to stand back up, squeezing glutes.'
    ],
    tips_en: [
      'Keep your chest up and core tight throughout the lift.',
      'Ensure your knees track in line with your toes, not caving in.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'bulgarian-split-squat',
    name_en: 'Bulgarian Split Squat',
    name_es: 'Sentadilla Búlgara',
    description_en: 'A single-leg squat with the rear foot elevated on a bench, providing high quad and glute loading with minimal spinal compression.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'dumbbell',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['hamstrings', 'core'],
    goals: ['hypertrophy', 'strength'],
    tags: ['leg_day', 'no_axial_load'],
    is_bodyweight: false,
    met: 6.0,
    sets: 3, reps: '10-12 each leg',
    instructions_en: [
      'Stand about 2 feet in front of a bench, holding dumbbells.',
      'Place the top of your back foot on the bench behind you.',
      'Lower your hips until your back knee is just above the floor.',
      'Drive through your front heel to return to the standing position.'
    ],
    tips_en: [
      'Keep your front knee aligned over your front ankle.',
      'Focus on balance and go slow on the descent.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'leg-extension-mach',
    name_en: 'Leg Extension (Machine)',
    name_es: 'Extensión de Piernas en Máquina',
    description_en: 'A seated machine exercise isolating the quadriceps muscles with constant tension.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'machine',
    body_part: 'legs',
    primary_muscles: ['quadriceps'],
    secondary_muscles: [],
    goals: ['hypertrophy'],
    tags: ['leg_day', 'lower_back_safe'],
    is_bodyweight: false,
    met: 4.5,
    sets: 3, reps: '12-15',
    instructions_en: [
      'Sit in the machine, placing the pad on your lower shins above your ankles.',
      'Grip the handles at the sides and extend your knees fully.',
      'Squeeze your quadriceps at the top of the lift.',
      'Lower the weight slowly under control.'
    ],
    tips_en: [
      'Keep your butt flat on the seat throughout the set.',
      'Avoid swinging or using body momentum.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'lying-leg-curl-mach',
    name_en: 'Seated or Lying Leg Curl (Machine)',
    name_es: 'Curl de Pierna en Máquina',
    description_en: 'A machine exercise isolating the hamstring muscles on the back of the thighs.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'machine',
    body_part: 'legs',
    primary_muscles: ['hamstrings'],
    secondary_muscles: ['gastrocnemius'],
    goals: ['hypertrophy'],
    tags: ['leg_day', 'lower_back_safe'],
    is_bodyweight: false,
    met: 4.5,
    sets: 3, reps: '12-15',
    instructions_en: [
      'Lie or sit in the leg curl machine, aligning your knees with the pivot point.',
      'Place the pad behind your ankles.',
      'Pull your heels towards your glutes as far as possible.',
      'Return the weight with control back to the start.'
    ],
    tips_en: [
      'Do not lift your hips off the pad (if lying).',
      'Keep the movement slow and controlled.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'ab-crunch',
    name_en: 'Abdominal Crunch',
    name_es: 'Abdominales / Crunches',
    description_en: 'A standard core movement targeting the rectus abdominis (upper abs) to build core strength.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'none',
    body_part: 'core',
    primary_muscles: ['rectus_abdominis'],
    secondary_muscles: [],
    goals: ['endurance'],
    tags: ['knee_safe', 'no_axial_load'],
    is_bodyweight: true,
    met: 3.5,
    sets: 3, reps: '15-20',
    instructions_en: [
      'Lie on your back with knees bent, feet flat on the floor.',
      'Place your hands lightly behind your head or crossed over your chest.',
      'Contract your abs to lift your shoulder blades off the floor.',
      'Lower back down under control.'
    ],
    tips_en: [
      'Do not pull on your neck with your hands.',
      'Exhale as you crunch up, squeeze for a split second.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'russian-twist',
    name_en: 'Russian Twist',
    name_es: 'Giro Ruso',
    description_en: 'A seated rotational core exercise targeting the obliques for lateral midsection strength.',
    category: 'strength',
    force_type: 'dynamic',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'none',
    body_part: 'core',
    primary_muscles: ['obliques'],
    secondary_muscles: ['rectus_abdominis', 'transversus_abdominis'],
    goals: ['endurance'],
    tags: ['knee_safe', 'no_axial_load'],
    is_bodyweight: true,
    met: 4.0,
    sets: 3, reps: '20 total twists',
    instructions_en: [
      'Sit on the floor, knees bent, leaning your torso back at a 45-degree angle.',
      'Hold your hands together in front of you (or hold a dumbbell/plate).',
      'Rotate your torso to the left, touching the floor, then rotate to the right.',
      'Keep your core tight and back straight.'
    ],
    tips_en: [
      'To make it harder, lift your feet off the floor.',
      'Follow your hands with your eyes to ensure full torso rotation.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'hanging-leg-raise',
    name_en: 'Hanging Leg Raise',
    name_es: 'Elevación de Piernas Colgado',
    description_en: 'Hanging from a pull-up bar and lifting your legs to target the lower abdominal muscles.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'isolation',
    difficulty: 'intermediate',
    equipment: 'pull_up_bar',
    body_part: 'core',
    primary_muscles: ['rectus_abdominis'],
    secondary_muscles: ['hip_flexors', 'forearm_flexors'],
    goals: ['hypertrophy', 'strength'],
    tags: ['knee_safe', 'lower_back_safe'],
    is_bodyweight: true,
    met: 5.0,
    sets: 3, reps: '10-12',
    instructions_en: [
      'Hang from a pull-up bar with straight arms and a shoulder-width grip.',
      'Keep your legs straight and raise them until they are parallel to the floor.',
      'Lower your legs slowly back to the vertical hang.'
    ],
    tips_en: [
      'Avoid swinging your body to lift your legs.',
      'If too difficult, bend your knees and perform hanging knee raises.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'barbell-row',
    name_en: 'Barbell Bent Over Row',
    name_es: 'Remo con Barra Inclinado',
    description_en: 'A compound barbell exercise pulling the weight to the waist to build back thickness and strength.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'barbell',
    body_part: 'back',
    primary_muscles: ['latissimus_dorsi', 'rhomboids'],
    secondary_muscles: ['trapezius', 'biceps_brachii', 'erector_spinae'],
    goals: ['hypertrophy', 'strength'],
    tags: ['knee_safe'],
    is_bodyweight: false,
    met: 6.0,
    sets: 4, reps: '8-12',
    instructions_en: [
      'Hold a barbell with an overhand grip, hinge forward at the hips at a 45-degree angle.',
      'Keep your back straight and knees slightly bent.',
      'Pull the barbell to your lower chest/navel, squeezing your shoulder blades.',
      'Lower the bar with control.'
    ],
    tips_en: [
      'Do not round your lower back under load.',
      'Pull with your elbows, not your hands.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'dumbbell-row',
    name_en: 'One-Arm Dumbbell Row',
    name_es: 'Remo con Mancuerna a Una Mano',
    description_en: 'Hinging over a bench and pulling a dumbbell with one arm to isolate and build the latissimus dorsi.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    body_part: 'back',
    primary_muscles: ['latissimus_dorsi', 'rhomboids'],
    secondary_muscles: ['biceps_brachii', 'rear_deltoid', 'core'],
    goals: ['hypertrophy', 'strength'],
    tags: ['knee_safe', 'no_axial_load'],
    is_bodyweight: false,
    met: 5.5,
    sets: 3, reps: '10-12 each arm',
    instructions_en: [
      'Place one knee and one hand on a flat bench for support.',
      'Hold a dumbbell in your free hand, letting it hang down.',
      'Pull the dumbbell up to your hip, keeping your elbow close to your side.',
      'Lower the dumbbell slowly to the starting position.'
    ],
    tips_en: [
      'Keep your chest and hips square to the bench — do not rotate your torso.',
      'Pull through the elbow, squeezing the lat at the peak.'
    ],
    images: { classic: { start: null, peak: null }, flat: { start: null, peak: null } }
  },
  {
    id: 'full-squat',
    name_en: 'Full Squat',
    name_es: 'Sentadilla Completa',
    description_en: 'A deep squat exercise going to maximum range of motion, targeting the quadriceps and glutes.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'none',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['hamstrings', 'calves', 'core'],
    goals: ['hypertrophy', 'strength'],
    tags: ['leg_day'],
    is_bodyweight: true,
    met: 5.0,
    sets: 3, reps: '8-10',
    instructions_en: [
      'Stand with feet shoulder-width apart, toes pointing slightly outward.',
      'Lower your hips back and down with control until your thighs are below parallel.',
      'Keep your chest high and core engaged.',
      'Drive back up through your heels to return to standing.'
    ],
    tips_en: [
      'Keep your knees tracking in line with your toes.',
      'Maintain a neutral spine throughout the squat.'
    ],
    images: {
      classic: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/weighted-squat.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/weighted-squat.gif'
      },
      flat: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/weighted-squat.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/weighted-squat.gif'
      }
    }
  },
  {
    id: 'lunge',
    name_en: 'Lunge',
    name_es: 'Zancada',
    description_en: 'A bodyweight forward lunge targeting the legs and glutes, focusing on balance and unilateral strength.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'none',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['hamstrings', 'calves', 'core'],
    goals: ['hypertrophy', 'balance'],
    tags: ['leg_day'],
    is_bodyweight: true,
    met: 4.5,
    sets: 3, reps: '8-10',
    instructions_en: [
      'Stand tall, take a large step forward with one leg.',
      'Lower your hips until your back knee is nearly touching the floor and front thigh is parallel.',
      'Push off your front foot to return to the starting position.',
      'Alternate legs for each rep.'
    ],
    tips_en: [
      'Do not let your front knee cave inward.',
      'Keep your torso upright.'
    ],
    images: {
      classic: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/forward-lunge-male.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/forward-lunge-male.gif'
      },
      flat: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/forward-lunge-male.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/forward-lunge-male.gif'
      }
    }
  },
  {
    id: 'barbell-full-squat',
    name_en: 'Barbell Full Squat',
    name_es: 'Sentadilla Completa con Barra',
    description_en: 'A barbell-loaded deep squat to maximize quadriceps, glutes and hamstrings development.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'barbell',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['hamstrings', 'calves', 'core'],
    goals: ['hypertrophy', 'strength'],
    tags: ['leg_day'],
    is_bodyweight: false,
    met: 6.0,
    sets: 3, reps: '8-10',
    instructions_en: [
      'Place a barbell across your upper back, stand feet shoulder-width.',
      'Brace your core, hinge your hips, and squat down as deep as possible.',
      'Ensure your spine remains neutral and chest is upright.',
      'Drive straight back up to stand, locking out hips at the top.'
    ],
    tips_en: [
      'Descend under control rather than dropping quickly.',
      'Push your knees outward on the way up.'
    ],
    images: {
      classic: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-full-squat.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-full-squat.gif'
      },
      flat: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-full-squat.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-full-squat.gif'
      }
    }
  },
  {
    id: 'side-split-squat',
    name_en: 'Side Split Squat',
    name_es: 'Sentadilla Lateral Cruzada',
    description_en: 'A lateral squat variation with a barbell, working the inner thighs, quadriceps, and glutes.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'barbell',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['adductors', 'hamstrings', 'core'],
    goals: ['hypertrophy', 'mobility'],
    tags: ['leg_day'],
    is_bodyweight: false,
    met: 5.5,
    sets: 3, reps: '8-10',
    instructions_en: [
      'Stand with a barbell across your shoulders in a very wide stance.',
      'Shift your weight to one side, bending that knee while keeping the other leg straight.',
      'Go down until your thigh is parallel to the floor.',
      'Push through that foot to return to center, then alternate.'
    ],
    tips_en: [
      'Keep the heel of your bending leg flat on the floor.',
      'Avoid leaning forward excessively.'
    ],
    images: {
      classic: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-side-split-squat.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-side-split-squat.gif'
      },
      flat: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-side-split-squat.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-side-split-squat.gif'
      }
    }
  },
  {
    id: 'step-up',
    name_en: 'Step-up',
    name_es: 'Subidas al Cajón',
    description_en: 'Stepping onto a bench or box with dumbbells to isolate each leg individually, focusing on quads and glutes.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['hamstrings', 'calves', 'core'],
    goals: ['hypertrophy', 'strength'],
    tags: ['leg_day'],
    is_bodyweight: false,
    met: 5.0,
    sets: 3, reps: '8-12',
    instructions_en: [
      'Place one foot flat on a secure bench or box.',
      'Drive through your heel to lift your entire body onto the box.',
      'Step down slowly and with control with the trailing foot.',
      'Repeat all reps on one leg, then switch.'
    ],
    tips_en: [
      'Focus on using the elevated leg to lift, not pushing off the floor.',
      'Stand all the way up at the top.'
    ],
    images: {
      classic: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/dumbbell-step-up.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/dumbbell-step-up.gif'
      },
      flat: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/dumbbell-step-up.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/dumbbell-step-up.gif'
      }
    }
  },
  {
    id: 'barbell-lunge',
    name_en: 'Barbell Lunge',
    name_es: 'Zancada con Barra',
    description_en: 'A forward lunge performed with a barbell on your back for added load and core stability challenge.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'barbell',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['hamstrings', 'calves', 'core'],
    goals: ['hypertrophy', 'strength'],
    tags: ['leg_day'],
    is_bodyweight: false,
    met: 6.0,
    sets: 3, reps: '8-12',
    instructions_en: [
      'Rack a barbell across your back and stand straight.',
      'Step forward and lower your hips until your back knee is just off the floor.',
      'Ensure your front thigh is parallel and chest is upright.',
      'Push back up strongly to the start and switch sides.'
    ],
    tips_en: [
      'Control your balance before stepping.',
      'Keep your core braced to stabilize the bar.'
    ],
    images: {
      classic: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-lunge.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-lunge.gif'
      },
      flat: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-lunge.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-lunge.gif'
      }
    }
  },
  {
    id: 'marklyft',
    name_en: 'Marklyft',
    name_es: 'Peso Muerto',
    description_en: 'A barbell deadlift pulling the bar from the floor to hip height, the ultimate test of posterior chain strength.',
    category: 'strength',
    force_type: 'pull',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'barbell',
    body_part: 'legs',
    primary_muscles: ['gluteus_maximus', 'hamstrings'],
    secondary_muscles: ['erector_spinae', 'trapezius', 'quadriceps', 'core'],
    goals: ['strength', 'hypertrophy'],
    tags: ['leg_day'],
    is_bodyweight: false,
    met: 6.5,
    sets: 5, reps: '5',
    instructions_en: [
      'Approach the barbell, feet hip-width apart, shins close to the bar.',
      'Hinge at your hips and grip the bar outside your shins.',
      'Flatten your back, brace your core, and stand up with the weight.',
      'Keep the bar close to your body as you pull and lock out at hips.',
      'Lower the bar back to the floor under control.'
    ],
    tips_en: [
      'Never round your spine under load.',
      'Pull the slack out of the bar before pushing off the floor.'
    ],
    images: {
      classic: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-deadlift.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-deadlift.gif'
      },
      flat: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-deadlift.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/barbell-deadlift.gif'
      }
    }
  },
  {
    id: 'lever-one-leg-extension',
    name_en: 'Lever One Leg Extension',
    name_es: 'Extensión de una Pierna en Máquina',
    description_en: 'A machine exercise isolating one leg at a time to develop the quadriceps, helping to fix strength imbalances.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'machine',
    body_part: 'legs',
    primary_muscles: ['quadriceps'],
    secondary_muscles: ['hamstrings'],
    goals: ['hypertrophy', 'balance'],
    tags: ['leg_day', 'machine'],
    is_bodyweight: false,
    met: 4.0,
    sets: 3, reps: '10-12',
    instructions_en: [
      'Sit on the leg extension machine and position the pad against your lower shin of one leg.',
      'Hold the handles at the sides for support.',
      'Extend your leg fully under control, squeezing your quadriceps at the peak.',
      'Lower the weight back down slowly and repeat for all reps before switching legs.'
    ],
    tips_en: [
      'Avoid swinging the weight; use slow, controlled motions.',
      'Keep your back flat against the backrest.'
    ],
    images: {
      classic: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif'
      },
      flat: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif'
      }
    }
  },
  {
    id: 'sled-wide-hack-squat',
    name_en: 'Sled Wide Hack Squat',
    name_es: 'Sentadilla Hack con Postura Ancha',
    description_en: 'A hack squat on a sled machine with a wide foot stance, focusing on the glutes and quadriceps.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'machine',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['soleus', 'tensor_fasciae_femoris'],
    goals: ['hypertrophy', 'strength'],
    tags: ['leg_day', 'machine'],
    is_bodyweight: false,
    met: 5.5,
    sets: 3, reps: '8-10',
    instructions_en: [
      'Position your back against the pad of the sled machine, shoulders under the pads.',
      'Place your feet high and wide on the platform.',
      'Release the safety locks and lower your hips until your thighs form a 90-degree angle.',
      'Push through your heels to return to the starting position.'
    ],
    tips_en: [
      'Keep your knees aligned with your toes; do not let them cave in.',
      'Keep your lower back firmly pressed against the pad.'
    ],
    images: {
      classic: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/sled-hack-squat.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/sled-hack-squat.gif'
      },
      flat: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/sled-hack-squat.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/sled-hack-squat.gif'
      }
    }
  },
  {
    id: 'sled-45-leg-press',
    name_en: 'Sled 45° Leg Press',
    name_es: 'Prensa de Piernas a 45 Grados',
    description_en: 'A 45-degree angled leg press on a sled machine, allowing for heavy loading of the quadriceps and glutes.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'machine',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['soleus', 'hamstrings'],
    goals: ['hypertrophy', 'strength'],
    tags: ['leg_day', 'machine'],
    is_bodyweight: false,
    met: 5.0,
    sets: 3, reps: '8-10',
    instructions_en: [
      'Sit on the machine, placing your feet flat on the platform at shoulder-width.',
      'Lower the safety locks and descend the platform slowly towards your chest.',
      'Push the platform away by extending your legs, making sure not to lock out your knees at the top.'
    ],
    tips_en: [
      'Do not lift your hips off the seat at the bottom of the movement.',
      'Maintain control of the weight during the entire movement.'
    ],
    images: {
      classic: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/sled-45-leg-press.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/sled-45-leg-press.gif'
      },
      flat: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/sled-45-leg-press.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/sled-45-leg-press.gif'
      }
    }
  },
  {
    id: 'lever-leg-extension',
    name_en: 'Lever Leg Extension',
    name_es: 'Extensión de Piernas en Máquina',
    description_en: 'A classic isolation exercise for the quadriceps, executed on a leg extension machine.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'isolation',
    difficulty: 'beginner',
    equipment: 'machine',
    body_part: 'legs',
    primary_muscles: ['quadriceps'],
    secondary_muscles: ['hamstrings'],
    goals: ['hypertrophy', 'definition'],
    tags: ['leg_day', 'machine'],
    is_bodyweight: false,
    met: 4.0,
    sets: 3, reps: '10-12',
    instructions_en: [
      'Sit on the leg extension machine, adjusting the roller pad to rest just above your ankles.',
      'Grip the handles at the side to stabilize your body.',
      'Extend your knees fully to raise the weight, squeezing your quads at the top.',
      'Lower the weight back down slowly to the start position.'
    ],
    tips_en: [
      'Keep your upper body stable; do not lean forward or back.',
      'Squeeze for a second at the peak of the contraction.'
    ],
    images: {
      classic: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif'
      },
      flat: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif'
      }
    }
  },
  {
    id: 'lever-horizontal-one-leg-press',
    name_en: 'Lever Horizontal One Leg Press',
    name_es: 'Prensa Horizontal de una Pierna',
    description_en: 'A unilateral horizontal leg press on a lever machine, allowing you to focus on the quadriceps and glutes of one leg at a time.',
    category: 'strength',
    force_type: 'push',
    mechanic: 'compound',
    difficulty: 'beginner',
    equipment: 'machine',
    body_part: 'legs',
    primary_muscles: ['quadriceps', 'gluteus_maximus'],
    secondary_muscles: ['tensor_fasciae_femoris', 'hamstrings'],
    goals: ['hypertrophy', 'balance'],
    tags: ['leg_day', 'machine'],
    is_bodyweight: false,
    met: 4.5,
    sets: 3, reps: '8-10',
    instructions_en: [
      'Sit on the horizontal leg press and place one foot flat on the platform.',
      'Push the platform away by extending your leg, leaving the other foot resting.',
      'Slowly return the platform towards your chest by bending your knee.',
      'Perform all reps on one leg before switching to the other.'
    ],
    tips_en: [
      'Keep your foot flat on the platform; do not lift your heel.',
      'Keep your hips square and pressed into the seat.'
    ],
    images: {
      classic: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/lever-horizontal-one-leg-press.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/lever-horizontal-one-leg-press.gif'
      },
      flat: {
        start: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/lever-horizontal-one-leg-press.gif',
        peak: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/glutes/lever-horizontal-one-leg-press.gif'
      }
    }
  },
]

// Equipment mapping for filtering
export const EQUIPMENT_MAPPING = {
  'Ingen utrustning alls': ['none'],
  'Gummiband & kroppsvikt': ['none', 'loop_band'],
  'Endast fria vikter': ['none', 'loop_band', 'dumbbell'],
  'Fria vikter & maskiner': ['none', 'loop_band', 'dumbbell', 'barbell', 'cable', 'machine', 'pull_up_bar'],
  'Gym': ['none', 'loop_band', 'dumbbell', 'barbell', 'cable', 'machine', 'pull_up_bar'],
  'Båda': ['none', 'loop_band', 'dumbbell', 'barbell', 'cable', 'machine', 'pull_up_bar'],
}

// Difficulty filter based on experience level
export const DIFFICULTY_MAPPING = {
  'Nybörjare': ['beginner'],
  'Medel': ['beginner', 'intermediate'],
  'Avancerad': ['beginner', 'intermediate', 'advanced'],
}

export const PROGRAM_STRUCTURE = {
  '1-2': { daysPerWeek: 2, split: ['full_body', 'full_body'] },
  '3':   { daysPerWeek: 3, split: ['upper', 'lower', 'full_body'] },
  '4':   { daysPerWeek: 4, split: ['upper', 'back', 'upper', 'upper'] },
  '5':   { daysPerWeek: 5, split: ['push', 'pull', 'legs', 'upper', 'full_body'] },
  '6-7': { daysPerWeek: 7, split: ['chest', 'back', 'legs', 'triceps', 'shoulders', 'biceps_abs', 'rest'] },
}

// Muscle group -> body_part mapping
export const SPLIT_MUSCLES = {
  full_body: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'glutes'],
  upper:     ['chest', 'back', 'shoulders', 'arms'],
  lower:     ['legs', 'glutes', 'core'],
  push:      ['chest', 'shoulders', 'arms'],
  pull:      ['back', 'arms'],
  legs:      ['legs', 'glutes', 'core'],
  back:      ['back'],
  chest:     ['chest'],
  triceps:   ['arms'],
  shoulders: ['shoulders'],
  biceps_abs:['arms', 'core'],
  rest:      [],
}

export const DAY_NAMES_SV = {
  full_body: 'Helkropp',
  upper:     'Överkropp',
  lower:     'Underkropp',
  push:      'Push (Bröst + Axlar + Triceps)',
  pull:      'Pull (Rygg + Biceps)',
  legs:      'Ben + Rumpa + Core',
  back:      'Rygg',
  chest:     'Bröst',
  triceps:   'Triceps',
  shoulders: 'Axlar',
  biceps_abs:'Biceps & Magen',
  rest:      'Vila',
}

export const SPLIT_EMOJIS = {
  full_body: '💪',
  upper:     '🦾',
  lower:     '🦵',
  push:      '🚀',
  pull:      '⚡',
  legs:      '🦵',
  back:      '🦅',
  chest:     '🔥',
  triceps:   '💪',
  shoulders: '🦾',
  biceps_abs:'⚡',
  rest:      '🛋️',
}
