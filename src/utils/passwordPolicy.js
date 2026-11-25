// Gemensam lösenordspolicy: minst 12 tecken, minst en versal, en gemen och ett specialtecken.
// OBS: Detta är endast klientvalidering för bättre UX – backend MÅSTE upprätthålla samma regler.

export const PASSWORD_MIN_LENGTH = 12

export function checkPassword(password = '') {
  return {
    length: password.length >= PASSWORD_MIN_LENGTH,
    upper: /\p{Lu}/u.test(password),
    lower: /\p{Ll}/u.test(password),
    special: /[^\p{L}\p{N}\s]/u.test(password),
  }
}

export function isPasswordValid(password) {
  return Object.values(checkPassword(password)).every(Boolean)
}

const MESSAGES = {
  sv: `Lösenordet måste vara minst ${PASSWORD_MIN_LENGTH} tecken och innehålla minst en versal, en gemen och ett specialtecken (t.ex. ! ? # %).`,
  en: `Password must be at least ${PASSWORD_MIN_LENGTH} characters and contain at least one uppercase letter, one lowercase letter and one special character (e.g. ! ? # %).`,
  fa: `رمز عبور باید حداقل ${PASSWORD_MIN_LENGTH} کاراکتر باشد و حداقل یک حرف بزرگ، یک حرف کوچک و یک کاراکتر ویژه (مانند ! ? # %) داشته باشد.`,
}

/** Returnerar ett felmeddelande på valt språk, eller null om lösenordet uppfyller policyn. */
export function getPasswordError(password, language = 'sv') {
  if (isPasswordValid(password)) return null
  return MESSAGES[language] || MESSAGES.sv
}

/** Styrkepoäng 1–4 för lösenordsmätaren, baserad på policyn. */
export function getPasswordStrength(password) {
  if (!password) return 0
  const c = checkPassword(password)
  let score = [c.upper && c.lower, c.special, /\p{N}/u.test(password)].filter(Boolean).length
  if (!c.length) return Math.max(1, Math.min(2, score))
  if (password.length >= 16) score += 1
  return Math.min(4, Math.max(2, score))
}
